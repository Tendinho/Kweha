(function () {
  'use strict';

  const USER_KEY = 'stopUser';
  const NAME_KEY = 'userName';
  const API = '/api/auth';

  function readCache() {
    try {
      const stored = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (stored && stored.name) return stored;
    } catch (error) {
      /* cache inválida é ignorada */
    }
    return null;
  }

  function writeCache(user) {
    if (!user || !user.name) {
      clearUser();
      return null;
    }

    const normalized = {
      id: Number(user.id) || 0,
      name: String(user.name).slice(0, 40),
      email: String(user.email || ''),
      picture: String(user.picture || ''),
      provider: user.provider || 'local',
      gamesPlayed: Number(user.gamesPlayed) || 0,
      gamesWon: Number(user.gamesWon) || 0,
      bestScore: Number(user.bestScore) || 0
    };

    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    localStorage.setItem(NAME_KEY, normalized.name);
    return normalized;
  }

  function getUser() {
    return readCache();
  }

  function clearUser() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('onlinePlayerName');
    localStorage.setItem(NAME_KEY, 'CONVIDADO');
  }

  function providerLabel(provider) {
    if (window.I18N) return window.I18N.t('provider.' + provider);
    if (provider === 'google') return 'Google';
    if (provider === 'local') return 'Conta local';
    return 'Convidado';
  }

  async function request(path, options = {}, attempt = 0) {
    const headers = Object.assign(
      { Accept: 'application/json' },
      options.headers || {}
    );

    const controller =
      typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller
      ? window.setTimeout(function () {
          controller.abort();
        }, 25000)
      : null;

    let response;

    try {
      response = await fetch(API + path, {
        credentials: 'same-origin',
        cache: 'no-store',
        ...options,
        headers,
        signal: controller ? controller.signal : undefined
      });
    } catch (error) {
      // A instância gratuita do Render pode estar a acordar. Uma nova
      // tentativa resolve o primeiro pedido lento sem mostrar erro ao jogador.
      if (attempt < 1 && path !== '/register' && path !== '/game') {
        await new Promise(function (resolve) {
          window.setTimeout(resolve, 1800);
        });
        return request(path, options, attempt + 1);
      }

      throw new Error(
        window.I18N
          ? window.I18N.t('server.unavailable')
          : 'Não foi possível ligar ao servidor. Verifica se o servidor está a correr.'
      );
    } finally {
      if (timer) window.clearTimeout(timer);
    }

    let data = null;

    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const originalMessage =
        data && data.error
          ? data.error
          : window.I18N
            ? window.I18N.t('server.requestFailed')
            : 'Não foi possível concluir o pedido.';
      const translatedMessage = window.I18N
        ? window.I18N.translateError(originalMessage)
        : originalMessage;
      const requestError = new Error(translatedMessage || originalMessage);
      requestError.status = response.status;
      throw requestError;
    }

    return data;
  }

  async function login(email, password) {
    const data = await request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    return writeCache(data.user);
  }

  async function register(name, email, password) {
    const data = await request('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    return writeCache(data.user);
  }

  async function refreshSession() {
    try {
      const data = await request('/me');
      return writeCache(data.user);
    } catch (error) {
      if (error.status === 401) {
        clearUser();
        return null;
      }
      throw error;
    }
  }

  async function logout() {
    try {
      await request('/logout', { method: 'POST' });
    } catch (error) {
      /* a sessão local é limpa mesmo que o servidor não responda */
    } finally {
      clearUser();
    }
  }

  async function updateProfile(name) {
    const data = await request('/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    return writeCache(data.user);
  }

  async function recordGame(result) {
    const data = await request('/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: Number(result && result.score) || 0,
        won: Boolean(result && result.won)
      }),
      keepalive: true
    });

    return writeCache(data.user);
  }

  async function getProviders() {
    const data = await request('/providers');
    return {
      google: Boolean(data && data.google)
    };
  }

  function loginWithProvider(provider) {
    if (provider !== 'google') {
      throw new Error(
        window.I18N ? window.I18N.t('login.errorGeneric') : 'Fornecedor de login inválido.'
      );
    }

    window.location.href = `${API}/${provider}`;
  }

  window.STOP_AUTH = {
    getUser: getUser,
    clearUser: clearUser,
    providerLabel: providerLabel,
    login: login,
    register: register,
    refreshSession: refreshSession,
    logout: logout,
    updateProfile: updateProfile,
    recordGame: recordGame,
    getProviders: getProviders,
    loginWithProvider: loginWithProvider
  };
})();
