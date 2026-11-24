/* ============================================================
   Kweha — Configuração do multiplayer online
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const onlineName = document.getElementById('online-name');
  const onlineCode = document.getElementById('online-code');
  const onlineCodeField = document.getElementById('online-code-field');
  const roleCreate = document.getElementById('role-create');
  const roleJoin = document.getElementById('role-join');
  const startBtn = document.getElementById('start-btn');
  const startBtnText = document.getElementById('start-btn-text');
  const onlineNote = document.getElementById('online-note');

  let onlineRole = 'host';

  function tr(key) {
    return window.I18N ? window.I18N.t(key) : key;
  }

  onlineName.value = getStoredName();
  if (onlineNote) onlineNote.classList.remove('hidden');

  if (window.STOP_AUTH && !onlineName.value) {
    window.STOP_AUTH.refreshSession().then(function (user) {
      if (user && !onlineName.value) onlineName.value = user.name.slice(0, 18);
    }).catch(function () {
      /* sem servidor, ficam apenas os dados em cache */
    });
  }

  function getStoredName() {
    try {
      const user = JSON.parse(localStorage.getItem('stopUser') || 'null');
      if (user && user.name) return user.name.slice(0, 18);
    } catch (error) {
      /* usar o nome local abaixo */
    }

    const stored = localStorage.getItem('userName');
    if (stored && stored !== 'CONVIDADO') return stored.slice(0, 18);

    const onlineStored = localStorage.getItem('onlinePlayerName');
    return onlineStored ? onlineStored.slice(0, 18) : '';
  }

  function playButtonSound() {
    if (window.SoundManager) {
      window.SoundManager.play('button');
    }
  }

  function playStartSound() {
    if (window.SoundManager) {
      window.SoundManager.play('start');
    }
  }

  function updateStartButton() {
    const codigoPreenchido = onlineRole === 'host' || onlineCode.value.trim().length === 5;

    startBtn.disabled = !codigoPreenchido;
    startBtnText.textContent = tr(
      onlineRole === 'host' ? 'setup.createRoomBtn' : 'setup.joinRoomBtn'
    );
  }

  function setOnlineRole(nextRole) {
    onlineRole = nextRole;
    roleCreate.classList.toggle('ativo', nextRole === 'host');
    roleJoin.classList.toggle('ativo', nextRole === 'guest');
    roleCreate.setAttribute('aria-pressed', String(nextRole === 'host'));
    roleJoin.setAttribute('aria-pressed', String(nextRole === 'guest'));
    onlineCodeField.classList.toggle('hidden', nextRole !== 'guest');
    updateStartButton();

    if (nextRole === 'guest') {
      window.setTimeout(function () {
        onlineCode.focus();
      }, 80);
    }
  }

  function startOnlineGame() {
    const nome = (onlineName.value.trim() || tr('common.player')).slice(0, 18);

    if (onlineRole === 'host') {
      localStorage.setItem('gameMode', 'online');
      localStorage.setItem('onlineRole', 'host');
      localStorage.setItem('onlinePlayerName', nome);
      localStorage.removeItem('onlineRoomCode');
      playStartSound();
      window.location.href = '/categories';
      return;
    }

    const codigo = onlineCode.value.trim().toUpperCase();

    if (codigo.length !== 5) {
      alert(tr('setup.code5'));
      onlineCode.focus();
      return;
    }

    localStorage.setItem('gameMode', 'online');
    localStorage.setItem('onlineRole', 'guest');
    localStorage.setItem('onlinePlayerName', nome);
    localStorage.setItem('onlineRoomCode', codigo);
    playStartSound();
    window.location.href = '/game';
  }

  roleCreate.addEventListener('click', function () {
    playButtonSound();
    setOnlineRole('host');
  });

  roleJoin.addEventListener('click', function () {
    playButtonSound();
    setOnlineRole('guest');
  });

  onlineName.addEventListener('input', updateStartButton);

  onlineCode.addEventListener('input', function () {
    onlineCode.value = onlineCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    updateStartButton();
  });

  onlineName.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (!startBtn.disabled) startBtn.click();
  });

  onlineCode.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (!startBtn.disabled) startBtn.click();
  });

  startBtn.addEventListener('click', startOnlineGame);

  setOnlineRole('host');
});
