'use strict';

const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');

let DatabaseSync;

try {
  ({ DatabaseSync } = require('node:sqlite'));
} catch (error) {
  console.error('Kweha precisa de Node.js 24 ou superior (módulo node:sqlite).');
  console.error(`Versão atual: ${process.version}`);
  console.error('Instala a versão indicada em .nvmrc ou em https://nodejs.org');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = process.env.DB_PATH
  ? path.resolve(ROOT, process.env.DB_PATH)
  : path.join(DATA_DIR, 'stop.db');
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '127.0.0.1';
const COOKIE_SECURE = process.env.COOKIE_SECURE === '1';
const SESSION_COOKIE = 'stop_session';
const OAUTH_STATE_COOKIE = 'stop_oauth_state';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 1024 * 1024;

const scryptAsync = promisify(crypto.scrypt);

const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || ''
  }
};

// Relay WebSocket alojado no próprio processo. Funciona atrás de proxies
// (Render, Cloudflare, Caddy, etc.) e não depende de WebRTC/TURN, pelo que a
// entrada nas salas deixa de falhar em redes restritivas.
const RELAY_PATH = '/ws/relay';
const RELAY_MAX_GUESTS = 3;
const RELAY_MAX_MESSAGE_BYTES = 64 * 1024;
const RELAY_HEARTBEAT_MS = 30000;
const relayRooms = new Map();
let relayServer = null;

const GOOGLE_TOKEN_URL =
  process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL =
  process.env.GOOGLE_USERINFO_URL || 'https://www.googleapis.com/oauth2/v3/userinfo';

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = DELETE;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    password_hash TEXT,
    provider TEXT NOT NULL DEFAULT 'local',
    provider_id TEXT,
    picture TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_identity
    ON users(provider, provider_id)
    WHERE provider_id IS NOT NULL;

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_local_email
    ON users(email)
    WHERE provider = 'local' AND email IS NOT NULL;

  CREATE INDEX IF NOT EXISTS idx_sessions_expires
    ON sessions(expires_at);
`);

const userColumns = new Set(
  db.prepare('PRAGMA table_info(users)').all().map((column) => column.name)
);

[
  ['games_played', 'INTEGER NOT NULL DEFAULT 0'],
  ['games_won', 'INTEGER NOT NULL DEFAULT 0'],
  ['best_score', 'INTEGER NOT NULL DEFAULT 0']
].forEach(([column, definition]) => {
  if (!userColumns.has(column)) {
    db.exec(`ALTER TABLE users ADD COLUMN ${column} ${definition}`);
  }
});

db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const BLOCKED_STATIC_PATHS = ['/data', '/server', '/.env', '/.git', '/node_modules'];
const PAGE_ROUTES = new Map([
  ['/', 'html/index.html'],
  ['/login', 'html/login.html'],
  ['/menu', 'html/main-menu.html'],
  ['/options', 'html/game-options.html'],
  ['/setup', 'html/player-setup.html'],
  ['/categories', 'html/category-select.html'],
  ['/game', 'html/game-screen.html'],
  ['/winner', 'html/winner-screen.html']
]);
const loginAttempts = new Map();

const PLACEHOLDER_VALUE = /^(?:\.{3,}|x{3,}|abc123|changeme|change-me|placeholder|example|exemplo|your[-_ ].*)$/i;

function hasCredential(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return false;
  if (trimmed.endsWith('...')) return false;
  return !PLACEHOLDER_VALUE.test(trimmed);
}

function googleSecretLooksLikeClientId() {
  const clientId = config.google.clientId.trim();
  const clientSecret = config.google.clientSecret.trim();
  return Boolean(
    clientId &&
      clientSecret &&
      (clientId === clientSecret || clientSecret.endsWith('.apps.googleusercontent.com'))
  );
}

function providerAvailable(provider) {
  return (
    provider === 'google' &&
    hasCredential(config.google.clientId) &&
    hasCredential(config.google.clientSecret) &&
    !googleSecretLooksLikeClientId()
  );
}

function firstHeaderValue(value) {
  return String(value || '').split(',')[0].trim();
}

function isSecureRequest(req) {
  const forwardedProto = firstHeaderValue(req.headers['x-forwarded-proto']).toLowerCase();
  if (forwardedProto === 'https') return true;
  if (forwardedProto === 'http') return false;
  return Boolean(req.socket && req.socket.encrypted);
}

function cookieSecure(req) {
  return isSecureRequest(req) || COOKIE_SECURE;
}

function getRequestOrigin(req) {
  const forwardedHost = firstHeaderValue(req.headers['x-forwarded-host']);
  const host = forwardedHost || req.headers.host || `localhost:${PORT}`;
  const forwardedProto = firstHeaderValue(req.headers['x-forwarded-proto']);
  const protocol = forwardedProto || (req.socket.encrypted ? 'https' : 'http');
  return `${protocol}://${host}`;
}

function isLoopbackHost(hostname) {
  const host = String(hostname || '')
    .toLowerCase()
    .replace(/^\[|\]$/g, '');
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost');
}

function configuredRedirectUri() {
  const configured = config.google.redirectUri;
  if (!configured) return null;
  try {
    return new URL(configured).toString();
  } catch (error) {
    return null;
  }
}

function getRedirectUri(req) {
  const configured = configuredRedirectUri();
  if (configured) return configured;

  // Render define RENDER_EXTERNAL_URL automaticamente. PUBLIC_URL permite
  // fixar o domínio em qualquer hosting (VPS, Railway, Fly.io, etc.).
  const publicUrl = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '';
  if (publicUrl) {
    try {
      return `${new URL(publicUrl).origin}/api/auth/google/callback`;
    } catch (error) {
      /* valor inválido: usa a origem do pedido abaixo */
    }
  }

  const origin = getRequestOrigin(req);
  let hostname;

  try {
    hostname = new URL(origin).hostname;
  } catch (error) {
    return '';
  }

  if (!isLoopbackHost(hostname)) return '';
  return `${origin}/api/auth/google/callback`;
}

// Em desenvolvimento, o utilizador pode abrir o jogo em localhost ou em
// 127.0.0.1. O cookie de state pertence ao host onde o login começou, por isso
// redirecionamos para a origem canónica registada no Google (loopback).
function canonicalRedirectOrigin(req) {
  const configured = configuredRedirectUri();
  if (!configured) return '';

  try {
    const expected = new URL(configured);
    const current = new URL(getRequestOrigin(req));

    if (expected.origin === current.origin) return '';
    if (!isLoopbackHost(expected.hostname) || !isLoopbackHost(current.hostname)) return '';
    return expected.origin;
  } catch (error) {
    return '';
  }
}

function sendJson(res, status, data, headers = {}) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  res.end(body);
}

function sendError(res, status, message, headers = {}) {
  sendJson(res, status, { error: message }, headers);
}

function redirect(res, location, headers = {}) {
  res.writeHead(302, {
    Location: location,
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end();
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || '/'}`);
  parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge == null ? SESSION_TTL_MS / 1000 : options.maxAge))}`);
  if (options.expires != null) {
    parts.push(`Expires=${new Date(options.expires).toUTCString()}`);
  }
  if (options.httpOnly !== false) parts.push('HttpOnly');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  if (options.secure == null ? COOKIE_SECURE : options.secure) parts.push('Secure');
  return parts.join('; ');
}

function clearCookie(name, cookiePath = '/', req) {
  return serializeCookie(name, '', {
    path: cookiePath,
    maxAge: 0,
    expires: 0,
    secure: req ? cookieSecure(req) : COOKIE_SECURE
  });
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};

  header.split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index === -1) return;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!key) return;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch (error) {
      cookies[key] = value;
    }
  });

  return cookies;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function publicUser(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email || '',
    picture: row.picture || '',
    provider: row.provider,
    gamesPlayed: Number(row.games_played) || 0,
    gamesWon: Number(row.games_won) || 0,
    bestScore: Number(row.best_score) || 0
  };
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('O pedido é demasiado grande.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Os dados enviados não são válidos.'));
      }
    });

    req.on('error', reject);
  });
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
}

async function verifyPassword(password, stored) {
  try {
    const [algorithm, salt, hashHex] = String(stored || '').split('$');
    if (algorithm !== 'scrypt' || !salt || !hashHex) return false;
    const derived = await scryptAsync(password, salt, 64);
    const expected = Buffer.from(hashHex, 'hex');
    const actual = Buffer.from(derived);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch (error) {
    return false;
  }
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  db.prepare(
    'INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
  ).run(hashToken(token), Number(userId), now, now + SESSION_TTL_MS);
  return token;
}

function sessionCookie(token, req) {
  return serializeCookie(SESSION_COOKIE, token, {
    maxAge: SESSION_TTL_MS / 1000,
    secure: req ? cookieSecure(req) : COOKIE_SECURE
  });
}

function getSessionUser(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = hashToken(token);
  const row = db
    .prepare(
      'SELECT u.*, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?'
    )
    .get(tokenHash);

  if (!row) return null;

  if (row.expires_at <= Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    return null;
  }

  return row;
}

function destroySession(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  }
}

function clientAddress(req) {
  const forwarded = firstHeaderValue(req.headers['x-forwarded-for']);
  return forwarded || req.socket.remoteAddress || 'desconhecido';
}

function allowLoginAttempt(req) {
  const ip = clientAddress(req);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  entry.count += 1;
  loginAttempts.set(ip, entry);
  return entry.count <= 30;
}

function upsertOAuthUser(provider, profile) {
  const providerId = String(profile.id || '');
  if (!providerId) throw new Error('O perfil não tem identificador.');

  const name = normalizeName(profile.name || profile.email || 'Jogador').slice(0, 40);
  const email = normalizeEmail(profile.email) || null;
  const picture = String(profile.picture || '').slice(0, 500);
  const existing = db
    .prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?')
    .get(provider, providerId);

  if (existing) {
    db.prepare('UPDATE users SET name = ?, email = ?, picture = ? WHERE id = ?').run(
      name,
      email,
      picture,
      Number(existing.id)
    );
    return db.prepare('SELECT * FROM users WHERE id = ?').get(Number(existing.id));
  }

  const result = db
    .prepare(
      'INSERT INTO users (name, email, password_hash, provider, provider_id, picture, created_at) VALUES (?, ?, NULL, ?, ?, ?, ?)'
    )
    .run(name, email, provider, providerId, picture, Date.now());

  return db.prepare('SELECT * FROM users WHERE id = ?').get(Number(result.lastInsertRowid));
}

async function register(req, res) {
  if (!allowLoginAttempt(req)) {
    sendError(res, 429, 'Demasiadas tentativas. Tenta novamente mais tarde.');
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    sendError(res, 400, error.message);
    return;
  }

  const name = normalizeName(body.name);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (name.length < 2 || name.length > 40) {
    sendError(res, 400, 'O nome deve ter entre 2 e 40 caracteres.');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendError(res, 400, 'Introduz um email válido.');
    return;
  }

  if (password.length < 6 || password.length > 200) {
    sendError(res, 400, 'A palavra-passe deve ter entre 6 e 200 caracteres.');
    return;
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE provider = 'local' AND email = ?")
    .get(email);

  if (existing) {
    sendError(res, 409, 'Já existe uma conta com este email. Entra em vez de criar outra.');
    return;
  }

  const passwordHash = await hashPassword(password);
  let result;

  try {
    result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash, provider, provider_id, picture, created_at) VALUES (?, ?, ?, 'local', NULL, NULL, ?)"
      )
      .run(name, email, passwordHash, Date.now());
  } catch (error) {
    sendError(res, 409, 'Não foi possível criar a conta. Tenta novamente.');
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(result.lastInsertRowid));
  const token = createSession(user.id);

  sendJson(res, 201, { user: publicUser(user) }, { 'Set-Cookie': sessionCookie(token, req) });
}

async function login(req, res) {
  if (!allowLoginAttempt(req)) {
    sendError(res, 429, 'Demasiadas tentativas. Tenta novamente mais tarde.');
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    sendError(res, 400, error.message);
    return;
  }

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!email || !password) {
    sendError(res, 400, 'Preenche o email e a palavra-passe.');
    return;
  }

  const user = db
    .prepare("SELECT * FROM users WHERE provider = 'local' AND email = ?")
    .get(email);

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    sendError(res, 401, 'Email ou palavra-passe inválidos.');
    return;
  }

  const token = createSession(user.id);
  sendJson(res, 200, { user: publicUser(user) }, { 'Set-Cookie': sessionCookie(token, req) });
}

async function updateProfile(req, res) {
  const sessionUser = getSessionUser(req);
  if (!sessionUser) {
    sendError(res, 401, 'Não autenticado.');
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    sendError(res, 400, error.message);
    return;
  }

  const name = normalizeName(body.name);
  if (name.length < 2 || name.length > 40) {
    sendError(res, 400, 'O nome deve ter entre 2 e 40 caracteres.');
    return;
  }

  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, Number(sessionUser.id));
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(sessionUser.id));
  sendJson(res, 200, { user: publicUser(user) });
}

async function recordGame(req, res) {
  const sessionUser = getSessionUser(req);
  if (!sessionUser) {
    sendError(res, 401, 'Não autenticado.');
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    sendError(res, 400, error.message);
    return;
  }

  const score = Math.round(Number(body.score));
  if (!Number.isFinite(score) || Math.abs(score) > 100000) {
    sendError(res, 400, 'Pontuação inválida.');
    return;
  }

  const won = body.won ? 1 : 0;
  const bestScore = Math.max(0, score);

  db.prepare(
    'UPDATE users SET games_played = games_played + 1, games_won = games_won + ?, best_score = MAX(best_score, ?) WHERE id = ?'
  ).run(won, bestScore, Number(sessionUser.id));

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(sessionUser.id));
  sendJson(res, 200, { user: publicUser(user) });
}

function oauthStateCookie(state, req) {
  return serializeCookie(OAUTH_STATE_COOKIE, state, {
    path: '/api/auth',
    maxAge: OAUTH_STATE_TTL_MS / 1000,
    sameSite: 'Lax',
    secure: req ? cookieSecure(req) : COOKIE_SECURE
  });
}

function createOAuthState(provider) {
  return `${provider}.${crypto.randomBytes(24).toString('hex')}`;
}

function isExpectedState(state, expectedState, provider) {
  return Boolean(
    state &&
      expectedState &&
      state === expectedState &&
      state.startsWith(`${provider}.`)
  );
}

function startGoogleOAuth(req, res) {
  if (!providerAvailable('google')) {
    redirect(res, '/login?error=google_not_configured');
    return;
  }

  const canonical = canonicalRedirectOrigin(req);
  if (canonical) {
    redirect(res, `${canonical}/api/auth/google`);
    return;
  }

  const redirectUri = getRedirectUri(req);
  if (!redirectUri) {
    redirect(res, '/login?error=redirect_not_configured');
    return;
  }

  const state = createOAuthState('google');
  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account'
  });

  redirect(res, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, {
    'Set-Cookie': oauthStateCookie(state, req)
  });
}

async function handleGoogleCallback(req, res, url) {
  const clearState = clearCookie(OAUTH_STATE_COOKIE, '/api/auth', req);
  const oauthError = url.searchParams.get('error');

  if (oauthError) {
    const errorCode = oauthError === 'access_denied' ? 'google_denied' : 'oauth_failed';
    if (errorCode === 'oauth_failed') {
      console.error(
        'Google OAuth:',
        oauthError,
        url.searchParams.get('error_description') || ''
      );
    }
    redirect(res, `/login?error=${errorCode}`, { 'Set-Cookie': clearState });
    return;
  }

  const state = url.searchParams.get('state') || '';
  const code = url.searchParams.get('code') || '';
  const expectedState = parseCookies(req)[OAUTH_STATE_COOKIE] || '';

  if (!isExpectedState(state, expectedState, 'google') || !code) {
    redirect(res, '/login?error=oauth_state', { 'Set-Cookie': clearState });
    return;
  }

  const redirectUri = getRedirectUri(req);
  if (!redirectUri) {
    redirect(res, '/login?error=redirect_not_configured', {
      'Set-Cookie': clearState
    });
    return;
  }

  try {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: new URLSearchParams({
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }),
      signal: AbortSignal.timeout(15000)
    });

    const tokenData = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error(
        'Google OAuth token:',
        tokenResponse.status,
        tokenData.error || '',
        tokenData.error_description || ''
      );
      throw new Error('Token Google inválido.');
    }

    const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      signal: AbortSignal.timeout(15000)
    });

    const profile = await profileResponse.json().catch(() => ({}));
    if (!profileResponse.ok || !profile.sub) {
      console.error('Google OAuth profile:', profileResponse.status, profile.error || '');
      throw new Error('Perfil Google indisponível.');
    }

    const user = upsertOAuthUser('google', {
      id: profile.sub,
      name: profile.name || profile.email || 'Jogador',
      email: profile.email || '',
      picture: profile.picture || ''
    });
    destroySession(req);
    const token = createSession(user.id);

    redirect(res, '/menu', {
      'Set-Cookie': [clearState, sessionCookie(token, req)]
    });
  } catch (error) {
    console.error('Google OAuth:', error);
    redirect(res, '/login?error=oauth_failed', { 'Set-Cookie': clearState });
  }
}

async function handleAuth(req, res, url, pathname) {
  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, {
      ok: true,
      uptime: Math.round(process.uptime()),
      relay: Boolean(relayServer)
    });
    return;
  }

  if (pathname === '/api/auth/providers' && req.method === 'GET') {
    sendJson(res, 200, {
      google: providerAvailable('google')
    });
    return;
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const user = getSessionUser(req);
    if (!user) {
      sendError(res, 401, 'Não autenticado.');
      return;
    }
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (pathname === '/api/auth/register' && req.method === 'POST') {
    await register(req, res);
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    await login(req, res);
    return;
  }

  if (pathname === '/api/auth/profile' && req.method === 'POST') {
    await updateProfile(req, res);
    return;
  }

  if (pathname === '/api/auth/game' && req.method === 'POST') {
    await recordGame(req, res);
    return;
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    destroySession(req);
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(SESSION_COOKIE, '/', req) });
    return;
  }

  if (pathname === '/api/auth/google' && req.method === 'GET') {
    startGoogleOAuth(req, res);
    return;
  }

  if (pathname === '/api/auth/google/callback' && req.method === 'GET') {
    await handleGoogleCallback(req, res, url);
    return;
  }

  sendError(res, 404, 'Endpoint não encontrado.');
}

function isBlockedStatic(pathname) {
  const normalized = pathname.toLowerCase();
  if (normalized === '/.env' || normalized.startsWith('/.env.')) return true;
  return BLOCKED_STATIC_PATHS.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

function notFound(res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end('Ficheiro não encontrado.');
}

async function serveStatic(req, res, pathname) {
  let relative;

  try {
    relative = decodeURIComponent(pathname);
  } catch (error) {
    notFound(res);
    return;
  }

  if (relative.includes('\0') || isBlockedStatic(relative)) {
    notFound(res);
    return;
  }

  if (relative === '/') relative = '/index.html';
  if (relative.endsWith('/')) relative += 'index.html';

  let filePath = path.resolve(ROOT, `.${relative}`);

  if (!filePath.startsWith(`${ROOT}${path.sep}`) && filePath !== ROOT) {
    notFound(res);
    return;
  }

  if (/(^|[\\/])\.env(\..*)?$/i.test(filePath) || /\.(db|sqlite|sqlite3)(-|$)/i.test(filePath)) {
    notFound(res);
    return;
  }

  let stat;

  try {
    stat = await fsp.stat(filePath);
  } catch (error) {
    notFound(res);
    return;
  }

  if (stat.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    stat = await fsp.stat(filePath).catch(() => null);
    if (!stat) {
      notFound(res);
      return;
    }
  }

  const extension = path.extname(filePath).toLowerCase();
  const cacheControl = ['.html', '.js', '.mjs', '.css'].includes(extension)
    ? 'no-cache'
    : 'public, max-age=3600';
  const headers = {
    'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
    'Content-Length': stat.size,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
    'Cache-Control': cacheControl
  };

  res.writeHead(200, headers);

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      notFound(res);
      return;
    }
    res.end();
  });
  stream.pipe(res);
}

function relaySend(socket, payload) {
  if (!socket || socket.readyState !== 1) return;
  try {
    socket.send(JSON.stringify(payload));
  } catch (error) {
    /* a ligação foi fechada entretanto */
  }
}

function relayError(socket, code) {
  relaySend(socket, { t: 'error', code });
}

function normalizeRelayRoom(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 5);
}

function sanitizeRelayName(value) {
  const name = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 18);
  return name || 'Jogador';
}

function cleanupRelaySocket(socket) {
  const meta = socket.meta || {};
  if (!meta.role || !meta.room) return;

  socket.meta = { role: null, room: null, id: null };
  const roomState = relayRooms.get(meta.room);
  if (!roomState) return;

  if (meta.role === 'host' && roomState.host === socket) {
    relayRooms.delete(meta.room);
    roomState.guests.forEach(function (guest) {
      relaySend(guest.socket, { t: 'hostLeft' });
      try {
        guest.socket.close(4000, 'host-left');
      } catch (error) {
        /* ignorar */
      }
    });
    return;
  }

  if (meta.role === 'guest' && roomState.guests.has(meta.id)) {
    roomState.guests.delete(meta.id);
    relaySend(roomState.host, { t: 'peerLeave', id: meta.id });
  }
}

function handleRelayMessage(socket, raw) {
  if (!raw || raw.length > RELAY_MAX_MESSAGE_BYTES) {
    relayError(socket, 'invalid');
    return;
  }

  let message;
  try {
    message = JSON.parse(raw.toString());
  } catch (error) {
    relayError(socket, 'invalid');
    return;
  }

  if (!message || typeof message.t !== 'string') {
    relayError(socket, 'invalid');
    return;
  }

  if (message.t === 'ping') {
    relaySend(socket, { t: 'pong' });
    return;
  }

  const meta = socket.meta || {};

  if (message.t === 'host') {
    if (meta.role) {
      relayError(socket, 'already-joined');
      return;
    }

    const room = normalizeRelayRoom(message.room);
    if (room.length !== 5) {
      relayError(socket, 'invalid');
      return;
    }

    if (relayRooms.has(room)) {
      relayError(socket, 'room-exists');
      return;
    }

    relayRooms.set(room, {
      code: room,
      host: socket,
      hostName: sanitizeRelayName(message.name),
      guests: new Map()
    });
    socket.meta = { role: 'host', room: room, id: 'host' };
    relaySend(socket, { t: 'hosted', room: room });
    return;
  }

  if (message.t === 'join') {
    if (meta.role) {
      relayError(socket, 'already-joined');
      return;
    }

    const room = normalizeRelayRoom(message.room);
    if (room.length !== 5) {
      relayError(socket, 'invalid');
      return;
    }

    const roomState = relayRooms.get(room);
    if (!roomState) {
      relayError(socket, 'not-found');
      return;
    }

    if (roomState.guests.size >= RELAY_MAX_GUESTS) {
      relayError(socket, 'full');
      return;
    }

    const id = `g-${crypto.randomBytes(6).toString('hex')}`;
    const name = sanitizeRelayName(message.name);
    roomState.guests.set(id, { socket: socket, name: name });
    socket.meta = { role: 'guest', room: room, id: id };
    relaySend(socket, { t: 'joined', id: id, hostName: roomState.hostName });
    relaySend(roomState.host, { t: 'peerJoin', id: id, name: name });
    return;
  }

  if (message.t === 'msg') {
    const data = message.data;
    if (!data || typeof data !== 'object') {
      relayError(socket, 'invalid');
      return;
    }

    const roomState = relayRooms.get(meta.room);
    if (!roomState) {
      relayError(socket, 'not-found');
      return;
    }

    if (meta.role === 'host') {
      if (message.to) {
        const guest = roomState.guests.get(String(message.to));
        if (guest) relaySend(guest.socket, { t: 'msg', from: 'host', data: data });
        return;
      }

      roomState.guests.forEach(function (guest) {
        relaySend(guest.socket, { t: 'msg', from: 'host', data: data });
      });
      return;
    }

    if (meta.role === 'guest') {
      relaySend(roomState.host, { t: 'msg', from: meta.id, data: data });
      return;
    }
  }

  if (message.t === 'leave') {
    cleanupRelaySocket(socket);
    try {
      socket.close(1000, 'leave');
    } catch (error) {
      /* ignorar */
    }
    return;
  }

  relayError(socket, 'invalid');
}

function setupRelayServer() {
  let WebSocketServer;

  try {
    ({ WebSocketServer } = require('ws'));
  } catch (error) {
    console.warn(
      'Relay online: módulo ws indisponível; o multiplayer usará PeerJS.',
      error && error.message ? error.message : error
    );
    return;
  }

  relayServer = new WebSocketServer({
    noServer: true,
    maxPayload: RELAY_MAX_MESSAGE_BYTES
  });

  relayServer.on('connection', function (socket) {
    socket.meta = { role: null, room: null, id: null };
    socket.isAlive = true;
    socket.on('pong', function () {
      socket.isAlive = true;
    });
    socket.on('message', function (raw) {
      handleRelayMessage(socket, raw);
    });
    socket.on('close', function () {
      cleanupRelaySocket(socket);
    });
    socket.on('error', function () {
      cleanupRelaySocket(socket);
    });
  });

  const heartbeat = setInterval(function () {
    relayServer.clients.forEach(function (socket) {
      if (socket.isAlive === false) {
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      try {
        socket.ping();
      } catch (error) {
        /* ignorar */
      }
    });
  }, RELAY_HEARTBEAT_MS);

  if (typeof heartbeat.unref === 'function') heartbeat.unref();

  relayServer.on('close', function () {
    clearInterval(heartbeat);
  });

  server.on('upgrade', function (req, socket, head) {
    let pathname;

    try {
      pathname = new URL(req.url, 'http://localhost').pathname;
    } catch (error) {
      socket.destroy();
      return;
    }

    if (pathname !== RELAY_PATH || !relayServer) {
      socket.destroy();
      return;
    }

    relayServer.handleUpgrade(req, socket, head, function (ws) {
      relayServer.emit('connection', ws, req);
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (
      COOKIE_SECURE &&
      (req.method === 'GET' || req.method === 'HEAD') &&
      !pathname.startsWith('/api/') &&
      !isSecureRequest(req)
    ) {
      const host = firstHeaderValue(req.headers['x-forwarded-host']) || req.headers.host || '';
      if (host && !isLoopbackHost(host.split(':')[0])) {
        redirect(res, `https://${host}${req.url}`);
        return;
      }
    }

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      await handleAuth(req, res, url, pathname);
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendError(res, 405, 'Método não permitido.');
      return;
    }

    const page = PAGE_ROUTES.get(pathname);
    if (page) {
      await serveStatic(req, res, `/${page}`);
      return;
    }

    if (pathname === '/index.html') {
      redirect(res, '/');
      return;
    }

    const lowerPath = pathname.toLowerCase();
    if (lowerPath === '/html' || lowerPath.startsWith('/html/')) {
      notFound(res);
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      if (req.url && req.url.startsWith('/api/')) {
        sendError(res, 500, 'Erro interno do servidor.');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro interno do servidor.');
      }
    } else {
      res.end();
    }
  }
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(
      `A porta ${PORT} já está em uso. Fecha a aplicação que a está a usar ou define outro PORT no .env.`
    );
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

setupRelayServer();

server.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' || HOST === '::' ? 'localhost' : HOST;
  console.log(`Kweha disponível em http://${displayHost}:${PORT}`);
  console.log(`Base de dados: ${DB_PATH}`);
  console.log(
    `Relay online: ${relayServer ? 'WebSocket em /ws/relay' : 'indisponível (fallback PeerJS)'}`
  );
  console.log(
    `OAuth Google: ${providerAvailable('google') ? 'configurado' : 'desativado (falta GOOGLE_CLIENT_ID/SECRET válidos)'}`
  );
  if (googleSecretLooksLikeClientId()) {
    console.warn(
      'Google OAuth: GOOGLE_CLIENT_SECRET parece ser o Client ID. Cola o Client Secret (normalmente começa por GOCSPX-).'
    );
  }
  if (
    !providerAvailable('google') &&
    !fs.existsSync(path.join(ROOT, '.env'))
  ) {
    console.log('Login com Google inativo. Define as credenciais no .env para o ativar.');
  }
});

function shutdown() {
  server.close(() => {
    try {
      db.close();
    } catch (error) {
      /* ignorar */
    }
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
