/* ============================================================
   Kweha — Modo online com PeerJS (host + até 3 convidados)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  if ((localStorage.getItem('gameMode') || 'computer') !== 'online') return;

  const PEER_PREFIX = 'stopgame-';
  const PEER_JS = '../assets/vendor/peerjs.min.js';
  const PEER_JS_CDN = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js';
  const ROUND_TIME = 120;
  const ROUND_OPTIONS = [3, 5, 10, 15];
  let maxRounds = readMaxRounds();
  const MAX_PLAYERS = 4;
  const LETTERS = 'ABCDEFGHIJLMNOPQRSTUVXZ';
  const ALLOWED_CATEGORIES = [
    'name',
    'country',
    'animal',
    'fruit',
    'color',
    'object',
    'city',
    'movie',
    'anime',
    'football',
    'novela',
    'series',
    'sport',
    'brand',
    'profession',
    'videogame'
  ];

  const role = localStorage.getItem('onlineRole') === 'host' ? 'host' : 'guest';
  const myName = getMyName();
  const savedRoomCode = normalizeCode(localStorage.getItem('onlineRoomCode') || '');
  const words = window.STOP_WORDS || { categories: {}, names: [] };

  function tr(key, params) {
    return window.I18N ? window.I18N.t(key, params) : key;
  }

  const currentLetterDisplay = document.getElementById('current-letter');
  const timerDisplay = document.getElementById('timer');
  const timerBox = document.getElementById('timer-box');
  const timerFill = document.getElementById('timer-fill');
  const roundPill = document.getElementById('round-pill');
  const turnHint = document.getElementById('turn-hint');
  const categoriesHeader = document.getElementById('categories-header');
  const categoryInputs = document.getElementById('category-inputs');
  const scoresContainer = document.getElementById('scores-container');
  const surrenderBtn = document.getElementById('surrender-btn');
  const submitBtn = document.getElementById('submit-answers');
  const liveProgress = document.getElementById('live-progress');
  const liveProgressText = document.getElementById('live-progress-text');
  const surrenderModal = document.getElementById('surrender-modal');
  const surrenderMessage = document.getElementById('surrender-message');
  const surrenderConfirmBtn = document.getElementById('surrender-confirm');
  const surrenderCancelBtn = document.getElementById('surrender-cancel');

  const overlay = document.getElementById('online-overlay');
  const overlayTitle = document.getElementById('online-title');
  const overlaySubtitle = document.getElementById('online-subtitle');
  const hostPanel = document.getElementById('online-host-panel');
  const guestPanel = document.getElementById('online-guest-panel');
  const codeDisplay = document.getElementById('online-code-display');
  const copyBtn = document.getElementById('copy-code-btn');
  const codeInput = document.getElementById('online-code-input');
  const statusEl = document.getElementById('online-status');
  const cancelBtn = document.getElementById('cancel-online-btn');
  const onlineLobby = document.getElementById('online-lobby');
  const onlinePlayerList = document.getElementById('online-player-list');
  const onlinePlayersLabel = document.getElementById('online-players-label');
  const startOnlineBtn = document.getElementById('start-online-btn');

  let categories = loadCategories();
  let peer = null;
  let conn = null;
  const hostConns = new Map();
  let roomCode = savedRoomCode;
  let hostReady = false;
  let guestConnected = false;
  let leaving = false;
  let gameOver = false;
  let gameRecorded = false;
  let lobbyStarted = false;
  let round = 0;
  let letter = '';
  let usedLetters = [];
  let timer = ROUND_TIME;
  let timerInterval = null;
  let finishTimer = null;
  let roundActive = false;
  let myId = role === 'host' ? 'host' : '';
  let players = role === 'host'
    ? [{ id: 'host', name: myName, score: 0, isHost: true, connected: true }]
    : [];
  let answersByPlayer = {};
  let penalties = {};
  let submitted = new Set();
  let progressByPlayer = {};
  let readyPlayers = new Set();
  let finalReadyMode = false;
  let roundModal = null;
  let typingTimer = null;

  setupOverlay();

  loadPeerJs()
    .then(function () {
      if (role === 'host') {
        createHostPeer();
        return;
      }

      if (savedRoomCode.length === 5) {
        connectToHost(savedRoomCode);
      }
    })
    .catch(function () {
      showLobbyError(tr('online.loadServiceFailed'));
    });

  window.addEventListener('beforeunload', closeConnection);

  function getMyName() {
    const onlineName = localStorage.getItem('onlinePlayerName');
    if (onlineName && onlineName.trim()) {
      return onlineName.trim().slice(0, 18);
    }

    try {
      const user = JSON.parse(localStorage.getItem('stopUser') || 'null');
      if (user && user.name) {
        return String(user.name).trim().slice(0, 18);
      }
    } catch (error) {
      /* usar o nome local abaixo */
    }

    const stored = localStorage.getItem('userName');
    return String(stored && stored !== 'CONVIDADO' ? stored : tr('common.player'))
      .trim()
      .slice(0, 18);
  }

  function readMaxRounds() {
    const stored = Number(localStorage.getItem('totalRounds'));
    return ROUND_OPTIONS.includes(stored) ? stored : 10;
  }

  function sanitizeMaxRounds(value, fallback) {
    const number = Number(value);
    if (ROUND_OPTIONS.includes(number)) return number;
    return ROUND_OPTIONS.includes(Number(fallback)) ? Number(fallback) : 10;
  }

  function normalizeCode(value) {
    return String(value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 5);
  }

  function generateRoomCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';

    for (let index = 0; index < 5; index += 1) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    return code;
  }

  function setupOverlay() {
    overlay.classList.remove('hidden');
    cancelBtn.addEventListener('click', leaveOnline);
    copyBtn.addEventListener('click', copyCode);
    startOnlineBtn.addEventListener('click', function () {
      startGame();
    });

    guestPanel.addEventListener('submit', function (event) {
      event.preventDefault();
      connectToHost(codeInput.value);
    });

    codeInput.addEventListener('input', function () {
      codeInput.value = normalizeCode(codeInput.value);
    });

    submitBtn.addEventListener('click', function () {
      submitMyAnswers(false);
    });

    surrenderBtn.addEventListener('click', surrender);

    cancelBtn.textContent = tr('common.cancel');

    if (role === 'host') {
      overlayTitle.textContent = tr('online.createRoomTitle');
      overlaySubtitle.textContent = tr('online.shareCode');
      hostPanel.classList.remove('hidden');
      guestPanel.classList.add('hidden');
      onlineLobby.classList.remove('hidden');
      statusEl.textContent = tr('online.creatingRoom');
      updateLobbyUI();
      return;
    }

    overlayTitle.textContent = tr('online.joinRoomTitle');
    overlaySubtitle.textContent = tr('online.enterCode');
    hostPanel.classList.add('hidden');
    guestPanel.classList.remove('hidden');
    onlineLobby.classList.add('hidden');
    codeInput.value = savedRoomCode;
    statusEl.textContent = savedRoomCode
      ? tr('online.connectingToRoom', { code: savedRoomCode })
      : tr('online.enterCodePrompt');
  }

  function loadPeerJs() {
    if (typeof window.Peer === 'function') return Promise.resolve();

    return loadPeerScript(PEER_JS).catch(function () {
      return loadPeerScript(PEER_JS_CDN);
    });
  }

  function loadPeerScript(src) {
    return new Promise(function (resolve, reject) {
      let settled = false;
      const existing = document.querySelector('script[data-peerjs="' + src + '"]');
      const script = existing || document.createElement('script');
      const timeout = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error('PeerJS indisponível.'));
      }, 15000);

      const finish = function () {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve();
      };

      const fail = function () {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        reject(new Error('PeerJS indisponível.'));
      };

      script.addEventListener('load', finish);
      script.addEventListener('error', fail);

      if (existing) {
        if (window.Peer) finish();
        return;
      }

      script.src = src;
      script.async = true;
      script.dataset.peerjs = src;
      document.head.appendChild(script);
    });
  }

  function createHostPeer(attempt) {
    const tryNumber = attempt || 0;

    if (!roomCode || roomCode.length !== 5) {
      roomCode = generateRoomCode();
    }

    const code = roomCode;
    const hostPeer = new Peer(PEER_PREFIX + code);
    peer = hostPeer;

    hostPeer.on('open', function () {
      hostReady = true;
      codeDisplay.textContent = code;
      statusEl.classList.remove('is-error');
      overlayTitle.textContent = tr('online.createRoomTitle');
      overlaySubtitle.textContent = tr('online.shareCode');
      hostPanel.classList.remove('hidden');
      guestPanel.classList.add('hidden');
      onlineLobby.classList.remove('hidden');
      players = [{ id: 'host', name: myName, score: 0, isHost: true, connected: true }];
      updateLobbyUI();
    });

    hostPeer.on('connection', function (connection) {
      wireConnection(connection, true);
    });

    hostPeer.on('error', function (error) {
      if (error && error.type === 'unavailable-id' && tryNumber < 8) {
        try {
          hostPeer.destroy();
        } catch (destroyError) {
          /* ignorar */
        }

        roomCode = generateRoomCode();
        createHostPeer(tryNumber + 1);
        return;
      }

      if (lobbyStarted) {
        showDisconnected();
        return;
      }

      showLobbyError(tr('online.createFailed'));
    });
  }

  function connectToHost(value) {
    const code = normalizeCode(value);

    if (code.length !== 5) {
      statusEl.textContent = tr('online.code5');
      statusEl.classList.add('is-error');
      return;
    }

    if (typeof window.Peer !== 'function') {
      statusEl.textContent = tr('online.loadingService');
      loadPeerJs()
        .then(function () {
          connectToHost(code);
        })
        .catch(function () {
          showLobbyError(tr('online.loadServiceFailed'));
        });
      return;
    }

    roomCode = code;
    statusEl.classList.remove('is-error');
    statusEl.textContent = tr('online.connectingToRoom', { code: code });
    codeInput.value = code;

    closeConnection();

    const guestPeer = new Peer();
    peer = guestPeer;

    guestPeer.on('open', function () {
      conn = guestPeer.connect(PEER_PREFIX + code, { reliable: true });
      wireConnection(conn, false);
    });

    guestPeer.on('error', function (error) {
      if (guestConnected) {
        showDisconnected();
        return;
      }

      if (error && error.type === 'peer-unavailable') {
        showLobbyError(tr('online.roomNotFound'));
        return;
      }

      showLobbyError(tr('online.joinFailed'));
    });
  }

  function wireConnection(connection, hostSide) {
    if (hostSide) {
      hostConns.set(connection.peer, connection);
    }

    connection.on('open', function () {
      if (hostSide) return;

      guestConnected = true;
      connection.send({ type: 'join', name: myName });
      statusEl.textContent = tr('online.connectedWaitingHost');
      statusEl.classList.remove('is-error');
    });

    connection.on('data', function (message) {
      handleMessage(message, connection);
    });

    connection.on('close', function () {
      if (hostSide) {
        hostConns.delete(connection.peer);
        removePlayer(connection.peer, true);
        return;
      }

      if (conn === connection) {
        conn = null;
        guestConnected = false;

        if (!gameOver && !leaving) {
          showDisconnected();
        }
      }
    });

    connection.on('error', function () {
      if (!hostSide && conn === connection && !gameOver && !leaving) {
        showDisconnected();
      }
    });
  }

  function handleMessage(message, connection) {
    if (!message || typeof message.type !== 'string') return;

    if (role === 'host') {
      handleHostMessage(message, connection);
      return;
    }

    handleGuestMessage(message);
  }

  function handleHostMessage(message, connection) {
    switch (message.type) {
      case 'join':
        handleJoin(message, connection);
        break;

      case 'answers':
        if (!roundActive) return;
        answersByPlayer[connection.peer] = sanitizeAnswers(message.answers);
        penalties[connection.peer] = clampPenalty(message.penalty);
        submitted.add(connection.peer);
        if (message.manual) {
          playSound('stop');
          sendAllExcept(connection.peer, { type: 'stopSound' });
        }
        updateRoundHint();
        maybeFinishRound();
        break;

      case 'stopSound':
        playSound('stop');
        break;

      case 'ready':
        readyPlayers.add(connection.peer);
        maybeAdvanceRound();
        break;

      case 'progress':
        progressByPlayer[connection.peer] = clampProgress(message.filled);
        broadcastProgress();
        break;

      case 'surrender':
        removePlayer(connection.peer, true);
        break;
    }
  }

  function handleGuestMessage(message) {
    switch (message.type) {
      case 'welcome':
        myId = String(message.you || 'guest');
        players = sanitizePlayers(message.players);
        categories = sanitizeCategories(message.categories);
        maxRounds = sanitizeMaxRounds(message.maxRounds, maxRounds);
        setupBoard();
        updateScoreboard();
        updateRoundPill();
        hostPanel.classList.add('hidden');
        guestPanel.classList.add('hidden');
        onlineLobby.classList.remove('hidden');
        updateLobbyUI();
        break;

      case 'lobby':
        if (lobbyStarted) return;
        players = sanitizePlayers(message.players);
        categories = sanitizeCategories(message.categories);
        maxRounds = sanitizeMaxRounds(message.maxRounds, maxRounds);
        updateRoundPill();
        updateLobbyUI();
        break;

      case 'roundStart':
        beginRound(message);
        break;

      case 'roundEnd':
        finishRoundFromHost(message);
        break;

      case 'progress':
        progressByPlayer = sanitizeProgress(message.values);
        updateProgressDisplay();
        break;

      case 'timeUp':
        if (roundActive && !submitted.has(myId)) {
          submitMyAnswers(true);
        }
        break;

      case 'stopSound':
        playSound('stop');
        break;

      case 'playerLeft':
        players = players.filter(function (player) {
          return player.id !== message.id;
        });
        updateScoreboard();
        updateLobbyUI();
        break;

      case 'gameOver':
        goToResults(Array.isArray(message.results) ? message.results : []);
        break;

      case 'full':
        showLobbyError(tr('online.roomFull'));
        break;

      case 'started':
        showLobbyError(tr('online.gameStarted'));
        break;
    }
  }

  function handleJoin(message, connection) {
    if (lobbyStarted || gameOver) {
      hostConns.delete(connection.peer);
      safeSend(connection, { type: 'started' });
      window.setTimeout(function () {
        try {
          connection.close();
        } catch (error) {
          /* ignorar */
        }
      }, 200);
      return;
    }

    if (players.length >= MAX_PLAYERS) {
      hostConns.delete(connection.peer);
      safeSend(connection, { type: 'full' });
      window.setTimeout(function () {
        try {
          connection.close();
        } catch (error) {
          /* ignorar */
        }
      }, 200);
      return;
    }

    if (players.some(function (player) { return player.id === connection.peer; })) {
      return;
    }

    const name = String(message.name || tr('online.guestName')).trim().slice(0, 18) ||
      tr('online.guestName');

    players.push({
      id: connection.peer,
      name: name,
      score: 0,
      isHost: false,
      connected: true
    });

    hostConns.set(connection.peer, connection);
    safeSend(connection, {
      type: 'welcome',
      you: connection.peer,
      players: publicPlayers(),
      categories: categories,
      maxRounds: maxRounds
    });
    broadcastLobby();
    updateLobbyUI();
  }

  function startGame() {
    if (role !== 'host' || !hostReady || players.length < 2 || lobbyStarted) return;

    lobbyStarted = true;
    gameOver = false;
    maxRounds = readMaxRounds();
    round = 0;
    usedLetters = [];
    finalReadyMode = false;
    players.forEach(function (player) {
      player.score = 0;
    });

    setupBoard();
    updateScoreboard();
    hideOverlay();
    if (liveProgress) liveProgress.classList.remove('hidden');
    broadcastLobby();
    startNextRound();
  }

  function startNextRound() {
    if (role !== 'host' || gameOver || !lobbyStarted) return;
    clearTimeout(finishTimer);

    if (players.length < 2) {
      broadcastGameOver(buildResults());
      return;
    }

    if (round >= maxRounds) {
      broadcastGameOver(buildResults());
      return;
    }

    round += 1;
    letter = pickLetter();
    finalReadyMode = false;
    hideOverlay();
    prepareRound(round, letter);
    sendAll({
      type: 'roundStart',
      round: round,
      letter: letter,
      categories: categories,
      maxRounds: maxRounds
    });
  }

  function beginRound(message) {
    if (gameOver) return;

    lobbyStarted = true;
    const nextRound = Number(message.round);
    const nextLetter = String(message.letter || '').toUpperCase().slice(0, 1);

    maxRounds = sanitizeMaxRounds(message.maxRounds, maxRounds);
    round =
      Number.isFinite(nextRound) && nextRound > 0 && nextRound <= maxRounds
        ? nextRound
        : round + 1;
    letter = LETTERS.includes(nextLetter) ? nextLetter : pickLetter();
    categories = sanitizeCategories(message.categories || categories);
    setupBoard();
    hideOverlay();
    if (liveProgress) liveProgress.classList.remove('hidden');
    prepareRound(round, letter);
  }

  function prepareRound(roundValue, letterValue) {
    round = roundValue;
    letter = letterValue;
    answersByPlayer = {};
    penalties = {};
    submitted = new Set();
    progressByPlayer = {};
    readyPlayers = new Set();
    roundActive = true;
    clearInterval(timerInterval);
    clearTimeout(finishTimer);
    players.forEach(function (player) {
      progressByPlayer[player.id] = 0;
    });
    updateRoundPill();
    updateScoreboard();
    updateLetter();
    resetInputs();
    updateRoundHint();
    updateProgressDisplay();
    startTimer();
    enableInputs(true);
    sendMyProgress();

    const firstInput = categoryInputs.querySelector('input');
    if (firstInput) {
      window.setTimeout(function () {
        firstInput.focus();
      }, 140);
    }
  }

  function pickLetter() {
    if (usedLetters.length >= LETTERS.length) {
      usedLetters = [];
    }

    let candidate;

    do {
      candidate = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    } while (usedLetters.includes(candidate));

    usedLetters.push(candidate);
    return candidate;
  }

  function startTimer() {
    timer = ROUND_TIME;
    clearInterval(timerInterval);
    updateTimerUI();
    timerInterval = window.setInterval(function () {
      timer -= 1;
      updateTimerUI();

      if (timer <= 0) {
        clearInterval(timerInterval);
        handleTimeUp();
      }
    }, 1000);
  }

  function handleTimeUp() {
    if (!roundActive) return;

    if (!submitted.has(myId)) {
      submitMyAnswers(true);
    }

    if (role === 'host') {
      sendAll({ type: 'timeUp' });
      clearTimeout(finishTimer);
      finishTimer = window.setTimeout(function () {
        finishRound();
      }, 1400);
    }
  }

  function updateTimerUI() {
    const safeTimer = Math.max(0, timer);
    timerDisplay.textContent = formatTime(safeTimer);

    if (timerFill) {
      timerFill.style.width =
        Math.max(0, Math.min(100, (safeTimer / ROUND_TIME) * 100)) + '%';
    }

    if (timerBox) {
      timerBox.classList.toggle('low', safeTimer <= 20);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function setupBoard() {
    categories = sanitizeCategories(categories);
    categoriesHeader.innerHTML = '';
    categoryInputs.innerHTML = '';

    categories.forEach(function (category) {
      const label = document.createElement('div');
      label.textContent = getCategoryName(category);
      categoriesHeader.appendChild(label);

      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'answer-' + category;
      input.dataset.category = category;
      input.maxLength = 40;
      input.autocomplete = 'off';
      input.autocorrect = 'off';
      input.autocapitalize = 'none';
      input.spellcheck = false;
      input.setAttribute('aria-autocomplete', 'none');
      input.setAttribute('data-lpignore', 'true');
      input.setAttribute('data-1p-ignore', 'true');
      input.setAttribute('aria-label', getCategoryName(category));
      input.disabled = true;

      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitMyAnswers(false);
        }
      });

      input.addEventListener('input', function () {
        input.classList.remove('valid', 'invalid');
        updateProgressForMe();

        if (roundActive && !submitted.has(myId)) {
          pingTypingSound();
        }
      });

      input.addEventListener('blur', stopTypingSound);

      categoryInputs.appendChild(input);
    });
  }

  function getCategoryName(category) {
    return window.I18N ? window.I18N.categoryName(category) : category;
  }

  function resetInputs() {
    stopTypingSound();
    categoryInputs.querySelectorAll('input').forEach(function (input) {
      input.value = '';
      input.disabled = true;
      input.classList.remove('valid', 'invalid');
    });
  }

  function enableInputs(enabled) {
    categoryInputs.querySelectorAll('input').forEach(function (input) {
      input.disabled = !enabled;
    });
    submitBtn.disabled = !enabled;
  }

  function updateRoundPill() {
    if (roundPill) {
      roundPill.textContent = tr('game.round', { round: Math.max(1, round), max: maxRounds });
    }
  }

  function updateLetter() {
    currentLetterDisplay.textContent = letter;
    currentLetterDisplay.classList.remove('is-dealing');
    void currentLetterDisplay.offsetWidth;
    currentLetterDisplay.classList.add('is-dealing');
  }

  function updateRoundHint() {
    if (!turnHint) return;

    if (!roundActive) {
      turnHint.textContent = tr('online.roundEnded');
      return;
    }

    const activePlayers = players.filter(function (player) {
      return player.connected;
    });

    if (submitted.has(myId) && activePlayers.every(function (player) {
      return submitted.has(player.id);
    })) {
      turnHint.textContent = tr('online.answersComplete');
      return;
    }

    if (submitted.has(myId)) {
      turnHint.textContent = tr('online.answersSent');
      return;
    }

    if (activePlayers.some(function (player) {
      return player.id !== myId && submitted.has(player.id);
    })) {
      turnHint.textContent = tr('online.opponentSent');
      return;
    }

    turnHint.textContent = tr('online.letterHint', { letter: letter });
  }

  function updateScoreboard() {
    scoresContainer.innerHTML = '';

    players.forEach(function (player) {
      const row = document.createElement('div');
      row.className = 'player-score';

      if (player.id === myId) {
        row.classList.add('current');
      }

      const name = document.createElement('span');
      name.textContent = player.name + (player.id === myId ? tr('common.youSuffix') : '');

      const score = document.createElement('span');
      score.textContent = player.score;

      row.appendChild(name);
      row.appendChild(score);
      scoresContainer.appendChild(row);
    });
  }

  function updateProgressForMe() {
    const filled = countMyFilled();

    if (role === 'host') {
      progressByPlayer[myId] = filled;
      broadcastProgress();
      return;
    }

    progressByPlayer[myId] = filled;
    updateProgressDisplay();
    send({ type: 'progress', filled: filled });
  }

  function countMyFilled() {
    let filled = 0;

    categoryInputs.querySelectorAll('input').forEach(function (input) {
      if (input.value.trim().length > 0) filled += 1;
    });

    return filled;
  }

  function sendMyProgress() {
    const filled = countMyFilled();

    if (role === 'host') {
      progressByPlayer[myId] = filled;
      broadcastProgress();
      return;
    }

    send({ type: 'progress', filled: filled });
    updateProgressDisplay();
  }

  function broadcastProgress() {
    if (role !== 'host') return;

    sendAll({
      type: 'progress',
      values: progressByPlayer,
      total: categories.length
    });
    updateProgressDisplay();
  }

  function updateProgressDisplay() {
    if (!liveProgressText) return;

    let roomFilled = 0;
    let roomTotal = 0;

    players.forEach(function (player) {
      roomFilled += Number(progressByPlayer[player.id]) || 0;
      roomTotal += categories.length;
    });

    const mine = Number(progressByPlayer[myId]) || 0;
    liveProgressText.textContent =
      tr('game.progressYou', { filled: mine, total: categories.length }) +
      ' · ' +
      tr('game.progressRoom', { filled: roomFilled, total: roomTotal });
  }

  function submitMyAnswers(autoSubmit) {
    if (!roundActive || submitted.has(myId)) return;

    const inputs = categoryInputs.querySelectorAll('input');
    const answers = {};

    inputs.forEach(function (input) {
      answers[input.dataset.category] = input.value.trim();
    });

    let penalty = 0;

    if (!autoSubmit) {
      const requiredValid = ['name', 'country'].every(function (category) {
        return isAnswerValid(category, answers[category] || '');
      });

      if (!requiredValid) {
        const proceed = confirm(tr('online.requiredMissing'));

        if (!proceed) return;

        penalty = 5;
      }
    }

    submitted.add(myId);
    answersByPlayer[myId] = answers;
    penalties[myId] = penalty;
    clearInterval(timerInterval);
    stopTypingSound();

    const valid = validateAnswers(answers);

    inputs.forEach(function (input) {
      const category = input.dataset.category;
      input.disabled = true;
      input.classList.toggle('valid', Boolean(valid[category]));
      input.classList.toggle('invalid', !valid[category] && input.value.trim().length > 0);
    });

    submitBtn.disabled = true;

    if (!autoSubmit) {
      playSound('stop');
      if (role === 'host') {
        sendAll({ type: 'stopSound' });
      }
    }

    updateRoundHint();
    updateProgressForMe();

    if (role === 'guest') {
      send({ type: 'answers', answers: answers, penalty: penalty, manual: !autoSubmit });
      return;
    }

    maybeFinishRound();
  }

  function maybeFinishRound() {
    if (role !== 'host' || !roundActive) return;

    const activePlayers = players.filter(function (player) {
      return player.connected;
    });

    if (activePlayers.every(function (player) {
      return submitted.has(player.id);
    })) {
      finishRound();
    }
  }

  function finishRound() {
    if (role !== 'host' || !roundActive) return;

    roundActive = false;
    stopTypingSound();
    clearInterval(timerInterval);
    clearTimeout(finishTimer);

    const payloadPlayers = calculateRoundScores();
    const payload = {
      type: 'roundEnd',
      round: round,
      letter: letter,
      players: payloadPlayers,
      final: round >= maxRounds
    };

    updateRoundHint();
    sendAll(payload);
    markAnswersFromResult(payload);
    showRoundModal(payload);
  }

  function calculateRoundScores() {
    const result = players.map(function (player) {
      const answers = sanitizeAnswers(answersByPlayer[player.id]);
      return {
        id: player.id,
        name: player.name,
        answers: answers,
        valid: validateAnswers(answers),
        points: 0,
        penalty: clampPenalty(penalties[player.id]),
        score: player.score
      };
    });

    categories.forEach(function (category) {
      const groups = {};

      result.forEach(function (player) {
        if (!player.valid[category]) return;
        const key = normalize(player.answers[category] || '');
        if (!key) return;
        if (!groups[key]) groups[key] = [];
        groups[key].push(player);
      });

      const groupKeys = Object.keys(groups);
      const totalValidAnswers = groupKeys.reduce(function (sum, key) {
        return sum + groups[key].length;
      }, 0);

      groupKeys.forEach(function (key) {
        const group = groups[key];
        let points = 10;

        if (totalValidAnswers === 1) {
          points = 20;
        } else if (group.length > 1) {
          points = 5;
        }

        group.forEach(function (player) {
          player.points += points;
        });
      });
    });

    result.forEach(function (player) {
      player.score = player.score - player.penalty + player.points;
      const original = players.find(function (item) {
        return item.id === player.id;
      });
      if (original) original.score = player.score;
    });

    updateScoreboard();
    return result;
  }

  function finishRoundFromHost(message) {
    if (gameOver) return;

    roundActive = false;
    stopTypingSound();
    clearInterval(timerInterval);
    clearTimeout(finishTimer);
    round = Number(message.round) || round;
    letter = String(message.letter || letter).toUpperCase().slice(0, 1);

    const payloadPlayers = sanitizeResultPlayers(message.players);
    payloadPlayers.forEach(function (incoming) {
      const player = players.find(function (item) {
        return item.id === incoming.id;
      });

      if (player) {
        player.name = incoming.name;
        player.score = incoming.score;
      }
    });

    updateScoreboard();
    updateRoundHint();

    const payload = {
      type: 'roundEnd',
      round: round,
      letter: letter,
      players: payloadPlayers,
      final: Boolean(message.final)
    };

    markAnswersFromResult(payload);
    showRoundModal(payload);
  }

  function markAnswersFromResult(payload) {
    const me = payload.players.find(function (player) {
      return player.id === myId;
    });

    if (!me) return;

    const inputs = categoryInputs.querySelectorAll('input');

    inputs.forEach(function (input) {
      const category = input.dataset.category;
      const answer = me.answers && me.answers[category] ? me.answers[category] : '';

      if (!input.value.trim() && answer) {
        input.value = answer;
      }

      input.disabled = true;
      const value = input.value.trim();
      input.classList.toggle('valid', Boolean(me.valid && me.valid[category]));
      input.classList.toggle('invalid', Boolean(me.valid && !me.valid[category] && value.length > 0));
    });

    submitBtn.disabled = true;
  }

  function showRoundModal(payload) {
    closeRoundModal();

    const modal = document.createElement('div');
    modal.className = 'game-modal';

    const card = document.createElement('div');
    card.className = 'game-modal-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    const title = document.createElement('h2');
    title.className = 'game-modal-title';
    title.textContent = tr('online.roundEndTitle', { round: payload.round });

    const subtitle = document.createElement('p');
    subtitle.className = 'game-modal-subtitle';
    subtitle.textContent = tr('online.roundEndSubtitleMulti', { letter: payload.letter });

    const body = document.createElement('div');
    body.className = 'game-modal-body';

    categories.forEach(function (category) {
      const row = document.createElement('div');
      row.className = 'game-modal-row online-answer-row';

      const label = document.createElement('span');
      label.textContent = getCategoryName(category);

      const value = document.createElement('strong');
      value.textContent = payload.players.map(function (player) {
        const answer = player.answers && player.answers[category];
        return player.name + ': ' + (answer || '—');
      }).join('  ·  ');

      row.appendChild(label);
      row.appendChild(value);
      body.appendChild(row);
    });

    payload.players.forEach(function (player) {
      const row = document.createElement('div');
      row.className = 'game-modal-row';

      const label = document.createElement('span');
      label.textContent = player.name + (player.id === myId ? tr('common.youSuffix') : '');

      const value = document.createElement('strong');
      value.textContent =
        tr('online.points', { points: player.points }) +
        (player.penalty ? ' · -' + player.penalty + ' pts' : '') +
        ' · ' + player.score + ' pts';

      row.appendChild(label);
      row.appendChild(value);
      body.appendChild(row);
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary';
    button.textContent = payload.final ? tr('online.seeResult') : tr('online.nextRound');
    button.addEventListener('click', function () {
      if (payload.final) {
        handleFinalContinue();
        return;
      }

      handleNextRound();
    });

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(body);
    card.appendChild(button);
    modal.appendChild(card);
    document.body.appendChild(modal);
    roundModal = modal;

    window.setTimeout(function () {
      button.focus();
    }, 60);
  }

  function closeRoundModal() {
    if (!roundModal) return;
    roundModal.remove();
    roundModal = null;
  }

  function handleNextRound() {
    closeRoundModal();
    readyPlayers.add(myId);

    if (role === 'host') {
      maybeAdvanceRound();
      return;
    }

    send({ type: 'ready' });
    showWaitingOverlay(tr('online.waitingNextRound'));
  }

  function maybeAdvanceRound() {
    if (role !== 'host') return;

    if (finalReadyMode) {
      if (allActiveReady()) {
        broadcastGameOver(buildResults());
        return;
      }

      showWaitingOverlay(tr('online.waitingAllReady'));
      return;
    }

    if (!allActiveReady()) {
      showWaitingOverlay(tr('online.waitingAllReady'));
      return;
    }

    if (round >= maxRounds) {
      broadcastGameOver(buildResults());
      return;
    }

    hideOverlay();
    startNextRound();
  }

  function handleFinalContinue() {
    closeRoundModal();
    readyPlayers.add(myId);

    if (role === 'host') {
      finalReadyMode = true;
      maybeAdvanceRound();
      return;
    }

    send({ type: 'ready' });
    showWaitingOverlay(tr('online.waitingHostResult'));
  }

  function allActiveReady() {
    const activePlayers = players.filter(function (player) {
      return player.connected;
    });

    return activePlayers.length > 0 && activePlayers.every(function (player) {
      return readyPlayers.has(player.id);
    });
  }

  function removePlayer(id, notify) {
    const removed = players.find(function (player) {
      return player.id === id;
    });

    if (!removed) return;

    players = players.filter(function (player) {
      return player.id !== id;
    });
    submitted.delete(id);
    readyPlayers.delete(id);
    delete answersByPlayer[id];
    delete penalties[id];
    delete progressByPlayer[id];

    if (notify && role === 'host') {
      sendAll({ type: 'playerLeft', id: id, name: removed.name });
    }

    updateScoreboard();

    if (role !== 'host') return;

    if (!lobbyStarted) {
      broadcastLobby();
      updateLobbyUI();
      return;
    }

    if (players.length < 2) {
      broadcastGameOver(buildResults());
      return;
    }

    broadcastProgress();

    if (roundActive) {
      updateRoundHint();
      maybeFinishRound();
    }
  }

  function validateAnswers(answers) {
    const valid = {};

    categories.forEach(function (category) {
      valid[category] = isAnswerValid(category, answers[category] || '');
    });

    return valid;
  }

  function isAnswerValid(category, answer) {
    if (!answer || !startsWithLetter(answer)) return false;

    if (category === 'name') {
      return normalize(answer).length >= 1;
    }

    if (category === 'profession') {
      return normalize(answer).length >= 3;
    }

    const dictionaries = getCategoryDictionaries(category);
    return dictionaries.some(function (dictionary) {
      return dictionary.some(function (word) {
        return normalize(word) === normalize(answer);
      });
    });
  }

  function getCategoryDictionaries(category) {
    const seen = new Set();
    const list = [];

    function addDictionary(dictionary) {
      if (!Array.isArray(dictionary) || seen.has(dictionary)) return;
      seen.add(dictionary);
      list.push(dictionary);
    }

    addDictionary(words.categories && words.categories[category]);

    if (window.STOP_WORDS_BY_LANG) {
      Object.keys(window.STOP_WORDS_BY_LANG).forEach(function (languageKey) {
        const languageData = window.STOP_WORDS_BY_LANG[languageKey];
        addDictionary(languageData && languageData.categories && languageData.categories[category]);
      });
    }

    return list;
  }

  function startsWithLetter(text) {
    return normalize(text).startsWith(normalize(letter));
  }

  function normalize(text) {
    const helper = window.KwehaText;
    if (helper && typeof helper.normalize === 'function') {
      return helper.normalize(text);
    }

    return String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function sanitizeAnswers(value) {
    const result = {};

    categories.forEach(function (category) {
      const answer = value && typeof value === 'object' ? value[category] : '';
      result[category] = typeof answer === 'string' ? answer.slice(0, 40) : '';
    });

    return result;
  }

  function sanitizeCategories(value) {
    const list = Array.isArray(value) ? value : [];
    const valid = list.filter(function (category) {
      return ALLOWED_CATEGORIES.includes(category);
    });

    return Array.from(new Set(['name', 'country', ...valid]));
  }

  function sanitizePlayers(value) {
    const list = Array.isArray(value) ? value : [];
    return list.filter(function (player) {
      return player && typeof player.id === 'string';
    }).map(function (player) {
      return {
        id: player.id,
        name: String(player.name || tr('common.player')).slice(0, 18),
        score: Number(player.score) || 0,
        isHost: Boolean(player.isHost),
        connected: player.connected !== false
      };
    });
  }

  function sanitizeResultPlayers(value) {
    const list = Array.isArray(value) ? value : [];
    return list.filter(function (player) {
      return player && typeof player.id === 'string';
    }).map(function (player) {
      return {
        id: player.id,
        name: String(player.name || tr('common.player')).slice(0, 18),
        answers: sanitizeAnswers(player.answers),
        valid: player.valid && typeof player.valid === 'object' ? player.valid : {},
        points: Number(player.points) || 0,
        penalty: clampPenalty(player.penalty),
        score: Number(player.score) || 0
      };
    });
  }

  function sanitizeProgress(value) {
    const result = {};

    if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) {
        result[key] = clampProgress(value[key]);
      });
    }

    return result;
  }

  function clampProgress(value) {
    const number = Math.max(0, Math.floor(Number(value) || 0));
    return Math.min(number, categories.length);
  }

  function clampPenalty(value) {
    return Number(value) === 5 ? 5 : 0;
  }

  function publicPlayers() {
    return players.map(function (player) {
      return {
        id: player.id,
        name: player.name,
        score: player.score,
        isHost: player.isHost,
        connected: player.connected
      };
    });
  }

  function loadCategories() {
    try {
      const stored = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
      return sanitizeCategories(stored);
    } catch (error) {
      return ['name', 'country'];
    }
  }

  function buildResults() {
    return players
      .map(function (player) {
        return { name: player.name, score: player.score };
      })
      .sort(function (a, b) {
        return b.score - a.score;
      });
  }

  function broadcastLobby() {
    if (role !== 'host') return;

    sendAll({
      type: 'lobby',
      players: publicPlayers(),
      categories: categories,
      maxRounds: maxRounds
    });
  }

  function updateLobbyUI() {
    if (!onlineLobby || !onlinePlayerList) return;

    onlinePlayerList.innerHTML = '';

    players.forEach(function (player) {
      const item = document.createElement('li');
      item.className = 'online-player-item';

      const name = document.createElement('span');
      name.textContent = player.name + (player.id === myId ? tr('common.youSuffix') : '');

      const badge = document.createElement('span');
      badge.className = 'online-player-badge';
      badge.textContent = player.isHost ? tr('online.hostName') : tr('online.guestName');
      if (!player.isHost) badge.classList.add('is-guest');

      item.appendChild(name);
      item.appendChild(badge);
      onlinePlayerList.appendChild(item);
    });

    if (onlinePlayersLabel) {
      onlinePlayersLabel.textContent = tr('online.playersInRoom', {
        count: players.length,
        max: MAX_PLAYERS
      });
    }

    if (role === 'host') {
      startOnlineBtn.classList.remove('hidden');
      startOnlineBtn.disabled = players.length < 2 || lobbyStarted || !hostReady;
      statusEl.classList.remove('is-error');

      if (!hostReady) {
        statusEl.textContent = tr('online.creatingRoom');
      } else if (players.length < 2) {
        statusEl.textContent = tr('online.waitingPlayers', {
          count: players.length,
          max: MAX_PLAYERS
        });
      } else {
        statusEl.textContent = tr('online.hostStartHint');
      }
      return;
    }

    startOnlineBtn.classList.add('hidden');
    statusEl.classList.remove('is-error');
    statusEl.textContent = tr('online.waitingLobbyHost');
  }

  function broadcastGameOver(results) {
    if (gameOver) return;

    gameOver = true;
    roundActive = false;
    clearInterval(timerInterval);
    clearTimeout(finishTimer);
    sendAll({ type: 'gameOver', results: results });
    window.setTimeout(function () {
      goToResults(results);
    }, 250);
  }

  function goToResults(results) {
    gameOver = true;
    roundActive = false;
    stopTypingSound();
    clearInterval(timerInterval);
    clearTimeout(finishTimer);

    if (!gameRecorded && window.STOP_AUTH) {
      gameRecorded = true;
      const mine = players.find(function (player) {
        return player.id === myId;
      });

      if (mine && window.STOP_AUTH.getUser()) {
        const bestScore = results.reduce(function (best, player) {
          return Math.max(best, Number(player.score) || 0);
        }, Number.NEGATIVE_INFINITY);

        window.STOP_AUTH.recordGame({
          score: mine.score,
          won: mine.score >= bestScore
        }).catch(function () {
          /* offline ou sessão expirada: o jogo continua normalmente */
        });
      }
    }

    closeRoundModal();
    hideOverlay();
    localStorage.setItem('gameResults', JSON.stringify(results));
    localStorage.setItem('gameMode', 'online');
    window.location.href = 'winner-screen.html';
  }

  function askSurrender(messageKey) {
    if (!surrenderModal || !surrenderConfirmBtn || !surrenderCancelBtn) {
      return Promise.resolve(window.confirm(tr(messageKey)));
    }

    surrenderMessage.textContent = tr(messageKey);
    surrenderModal.classList.remove('hidden');

    return new Promise(function (resolve) {
      let settled = false;

      function finish(value) {
        if (settled) return;
        settled = true;
        surrenderModal.classList.add('hidden');
        surrenderConfirmBtn.removeEventListener('click', onConfirm);
        surrenderCancelBtn.removeEventListener('click', onCancel);
        surrenderModal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKeydown);
        resolve(value);
      }

      function onConfirm() {
        finish(true);
      }

      function onCancel() {
        finish(false);
      }

      function onBackdrop(event) {
        if (event.target === surrenderModal) finish(false);
      }

      function onKeydown(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          finish(false);
        }
      }

      surrenderConfirmBtn.addEventListener('click', onConfirm);
      surrenderCancelBtn.addEventListener('click', onCancel);
      surrenderModal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKeydown);
      window.setTimeout(function () {
        surrenderCancelBtn.focus();
      }, 30);
    });
  }

  async function surrender() {
    if (gameOver) return;

    if (!guestConnected && role === 'guest') {
      leaveOnline();
      return;
    }

    playSound('button');

    if (!(await askSurrender('online.surrenderConfirm'))) {
      return;
    }

    if (role === 'host') {
      broadcastGameOver(buildResults());
      return;
    }

    send({ type: 'surrender' });
    leaving = true;
    window.setTimeout(function () {
      closeConnection();
      window.location.href = 'main-menu.html';
    }, 150);
  }

  function send(message) {
    if (!conn || !conn.open) return false;
    return safeSend(conn, message);
  }

  function sendAll(message) {
    if (role !== 'host') return;

    hostConns.forEach(function (connection) {
      if (connection.open) safeSend(connection, message);
    });
  }

  function sendAllExcept(excludePeer, message) {
    if (role !== 'host') return;

    hostConns.forEach(function (connection, peerId) {
      if (peerId !== excludePeer && connection.open) safeSend(connection, message);
    });
  }

  function safeSend(connection, message) {
    try {
      connection.send(message);
      return true;
    } catch (error) {
      return false;
    }
  }

  function copyCode() {
    if (!roomCode) return;

    const done = function () {
      copyBtn.textContent = tr('online.copied');
      window.setTimeout(function () {
        copyBtn.textContent = tr('online.copyCode');
      }, 1800);
    };

    const fallback = function () {
      const temp = document.createElement('textarea');
      temp.value = roomCode;
      document.body.appendChild(temp);
      temp.select();

      try {
        document.execCommand('copy');
        done();
      } catch (error) {
        /* copiar manualmente */
      }

      temp.remove();
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(roomCode).then(done).catch(fallback);
      return;
    }

    fallback();
  }

  function showLobbyError(message) {
    overlay.classList.remove('hidden');
    overlayTitle.textContent =
      role === 'host' ? tr('online.createErrorTitle') : tr('online.joinErrorTitle');
    overlaySubtitle.textContent = '';
    statusEl.textContent = message;
    statusEl.classList.add('is-error');
    cancelBtn.classList.remove('hidden');
    cancelBtn.textContent = tr('online.backToMenu');
    onlineLobby.classList.add('hidden');

    if (role === 'host') {
      hostPanel.classList.add('hidden');
      guestPanel.classList.add('hidden');
      return;
    }

    hostPanel.classList.add('hidden');
    guestPanel.classList.remove('hidden');
    codeInput.value = roomCode || savedRoomCode;
  }

  function showDisconnected() {
    guestConnected = false;
    roundActive = false;
    clearInterval(timerInterval);
    clearTimeout(finishTimer);
    closeRoundModal();
    overlay.classList.remove('hidden');
    overlayTitle.textContent = tr('online.connectionLost');
    overlaySubtitle.textContent = tr('online.connectionLostSubtitle');
    hostPanel.classList.add('hidden');
    guestPanel.classList.add('hidden');
    onlineLobby.classList.add('hidden');
    statusEl.textContent = tr('online.cannotContinue');
    statusEl.classList.add('is-error');
    cancelBtn.classList.remove('hidden');
    cancelBtn.textContent = tr('online.backToMenu');
  }

  function showWaitingOverlay(message) {
    overlay.classList.remove('hidden');
    overlayTitle.textContent = tr('online.waitTitle');
    overlaySubtitle.textContent = '';
    hostPanel.classList.add('hidden');
    guestPanel.classList.add('hidden');
    onlineLobby.classList.add('hidden');
    statusEl.textContent = message;
    statusEl.classList.remove('is-error');
    cancelBtn.classList.add('hidden');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    statusEl.classList.remove('is-error');
    cancelBtn.classList.remove('hidden');
    cancelBtn.textContent = tr('common.cancel');
  }

  function leaveOnline() {
    if (window.SoundManager) {
      window.SoundManager.play('button');
    }

    leaving = true;
    closeConnection();
    window.location.href = 'main-menu.html';
  }

  function closeConnection() {
    hostConns.forEach(function (connection) {
      try {
        connection.close();
      } catch (error) {
        /* ignorar */
      }
    });
    hostConns.clear();

    try {
      if (conn) conn.close();
    } catch (error) {
      /* ignorar */
    }

    try {
      if (peer) peer.destroy();
    } catch (error) {
      /* ignorar */
    }

    conn = null;
    peer = null;
  }

  function playSound(name) {
    if (window.SoundManager) {
      window.SoundManager.play(name);
    }
  }

  function pingTypingSound() {
    if (!roundActive || submitted.has(myId)) return;
    if (window.SoundManager) window.SoundManager.startLoop('typing');
    clearTimeout(typingTimer);
    typingTimer = window.setTimeout(stopTypingSound, 700);
  }

  function stopTypingSound() {
    clearTimeout(typingTimer);
    typingTimer = null;
    if (window.SoundManager) window.SoundManager.stopLoop('typing');
  }
});
