/* ============================================================
   Kweha — Menu principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const playVsComputerBtn = document.getElementById('play-vs-computer');
  const playMultiplayerBtn = document.getElementById('play-multiplayer');
  const settingsBtn = document.getElementById('settings-btn');
  const exitBtn = document.getElementById('exit-btn');
  const userButton = document.getElementById('user-button');
  const userAvatar = document.getElementById('user-avatar');
  const userLabel = document.getElementById('user-label');
  const auth = window.STOP_AUTH;

  let accountModal = null;

  function tr(key) {
    return window.I18N ? window.I18N.t(key) : key;
  }

  renderUser();

  if (auth) {
    auth.refreshSession().then(function () {
      renderUser();
    }).catch(function () {
      /* se o servidor não responder, mantém a sessão em cache */
    });
  }

  function playButtonSound() {
    if (window.SoundManager) {
      window.SoundManager.play('button');
    }
  }

  function currentUser() {
    return auth ? auth.getUser() : null;
  }

  function renderUser() {
    const user = currentUser();

    if (user) {
      userButton.textContent = user.name.slice(0, 18);
      userButton.title = tr('menu.userButtonManage');
      userLabel.textContent = auth.providerLabel(user.provider);

      if (user.picture) {
        userAvatar.style.backgroundImage = 'url("' + user.picture + '")';
        userAvatar.classList.add('has-photo');
      } else {
        userAvatar.style.backgroundImage = '';
        userAvatar.classList.remove('has-photo');
      }

      return;
    }

    userButton.textContent = tr('common.enter');
    userButton.title = tr('menu.userButtonTitle');
    userLabel.textContent = tr('menu.userLabel');
    userAvatar.style.backgroundImage = '';
    userAvatar.classList.remove('has-photo');
  }

  function closeAccountModal() {
    if (!accountModal) return;
    accountModal.remove();
    accountModal = null;
  }

  function openAccountModal(user) {
    closeAccountModal();

    const overlay = document.createElement('div');
    overlay.className = 'account-modal';

    const card = document.createElement('div');
    card.className = 'account-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    const avatar = document.createElement('div');
    avatar.className = 'account-avatar';

    if (user.picture) {
      avatar.style.backgroundImage = 'url("' + user.picture + '")';
      avatar.classList.add('has-photo');
    } else {
      avatar.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="../assets/icons/sprite.svg#i-user"></use></svg>';
    }

    const title = document.createElement('h2');
    title.className = 'account-title';
    title.textContent = tr('menu.accountTitle');

    const name = document.createElement('strong');
    name.className = 'account-name';
    name.textContent = user.name;

    const meta = document.createElement('span');
    meta.className = 'account-meta';
    meta.textContent = user.email
      ? user.email
      : auth.providerLabel(user.provider);

    const tabs = document.createElement('div');
    tabs.className = 'account-tabs';
    tabs.setAttribute('role', 'tablist');

    const profileTab = document.createElement('button');
    profileTab.type = 'button';
    profileTab.className = 'account-tab is-active';
    profileTab.setAttribute('role', 'tab');
    profileTab.setAttribute('aria-selected', 'true');
    profileTab.textContent = tr('menu.profileTab');

    const statsTab = document.createElement('button');
    statsTab.type = 'button';
    statsTab.className = 'account-tab';
    statsTab.setAttribute('role', 'tab');
    statsTab.setAttribute('aria-selected', 'false');
    statsTab.textContent = tr('menu.statsTab');

    tabs.appendChild(profileTab);
    tabs.appendChild(statsTab);

    const panes = document.createElement('div');
    panes.className = 'account-panes';

    const profilePane = document.createElement('div');
    profilePane.className = 'account-pane';
    profilePane.setAttribute('role', 'tabpanel');

    const profileForm = document.createElement('form');
    profileForm.className = 'account-form';

    const nameLabel = document.createElement('label');
    nameLabel.className = 'account-field';
    nameLabel.textContent = tr('menu.displayName');

    const nameInput = document.createElement('input');
    nameInput.className = 'input';
    nameInput.type = 'text';
    nameInput.maxLength = 40;
    nameInput.value = user.name;
    nameInput.autocomplete = 'off';
    nameInput.spellcheck = false;
    nameInput.required = true;

    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'btn btn-primary btn-sm';
    saveBtn.textContent = tr('menu.saveName');

    const feedback = document.createElement('p');
    feedback.className = 'account-feedback';
    feedback.setAttribute('aria-live', 'polite');

    nameLabel.appendChild(nameInput);
    profileForm.appendChild(nameLabel);
    profileForm.appendChild(saveBtn);
    profileForm.appendChild(feedback);
    profilePane.appendChild(profileForm);

    const statsPane = document.createElement('div');
    statsPane.className = 'account-pane account-stats';
    statsPane.setAttribute('role', 'tabpanel');
    statsPane.hidden = true;

    [
      [tr('menu.statsGames'), user.gamesPlayed],
      [tr('menu.statsWins'), user.gamesWon],
      [tr('menu.statsBest'), user.bestScore]
    ].forEach(function (entry) {
      const stat = document.createElement('div');
      stat.className = 'account-stat';

      const value = document.createElement('strong');
      value.textContent = String(Number(entry[1]) || 0);

      const label = document.createElement('span');
      label.textContent = entry[0];

      stat.appendChild(value);
      stat.appendChild(label);
      statsPane.appendChild(stat);
    });

    panes.appendChild(profilePane);
    panes.appendChild(statsPane);

    const actions = document.createElement('div');
    actions.className = 'account-actions';

    const switchBtn = document.createElement('button');
    switchBtn.type = 'button';
    switchBtn.className = 'btn btn-secondary btn-sm';
    switchBtn.textContent = tr('menu.switchAccount');

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'btn btn-danger btn-sm';
    logoutBtn.textContent = tr('menu.logout');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn btn-ghost btn-sm';
    closeBtn.textContent = tr('menu.close');

    actions.appendChild(switchBtn);
    actions.appendChild(logoutBtn);
    actions.appendChild(closeBtn);
    card.appendChild(avatar);
    card.appendChild(title);
    card.appendChild(name);
    card.appendChild(meta);
    card.appendChild(tabs);
    card.appendChild(panes);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    accountModal = overlay;

    let closed = false;

    const close = function () {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKeydown);
      closeAccountModal();
    };

    const onKeydown = function (event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    function setTab(activeTab) {
      const profileActive = activeTab === 'profile';
      profileTab.classList.toggle('is-active', profileActive);
      statsTab.classList.toggle('is-active', !profileActive);
      profileTab.setAttribute('aria-selected', String(profileActive));
      statsTab.setAttribute('aria-selected', String(!profileActive));
      profilePane.hidden = !profileActive;
      statsPane.hidden = profileActive;
    }

    profileTab.addEventListener('click', function () {
      playButtonSound();
      setTab('profile');
    });

    statsTab.addEventListener('click', function () {
      playButtonSound();
      setTab('stats');
    });

    profileForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      playButtonSound();

      const nextName = nameInput.value.trim();
      feedback.textContent = '';
      feedback.classList.remove('is-error');

      if (nextName.length < 2) {
        feedback.textContent = tr('menu.nameError');
        feedback.classList.add('is-error');
        nameInput.focus();
        return;
      }

      saveBtn.disabled = true;

      try {
        const updated = await auth.updateProfile(nextName);
        name.textContent = updated.name;
        nameInput.value = updated.name;
        feedback.textContent = tr('menu.nameSaved');
        renderUser();
      } catch (error) {
        feedback.textContent = error.message;
        feedback.classList.add('is-error');
      } finally {
        saveBtn.disabled = false;
      }
    });

    switchBtn.addEventListener('click', function () {
      playButtonSound();
      window.location.href = 'login.html';
    });

    logoutBtn.addEventListener('click', async function () {
      playButtonSound();
      if (auth) await auth.logout();
      localStorage.removeItem('onlinePlayerName');
      renderUser();
      close();
    });

    closeBtn.addEventListener('click', function () {
      playButtonSound();
      close();
    });

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) close();
    });

    document.addEventListener('keydown', onKeydown);
    card.scrollTop = 0;
    window.setTimeout(function () {
      closeBtn.focus({ preventScroll: true });
      card.scrollTop = 0;
    }, 50);
  }

  userButton.addEventListener('click', function () {
    playButtonSound();
    const user = currentUser();

    if (user) {
      openAccountModal(user);
      return;
    }

    window.location.href = 'login.html';
  });

  playVsComputerBtn.addEventListener('click', function () {
    playButtonSound();
    localStorage.setItem('gameMode', 'computer');
    window.location.href = 'category-select.html';
  });

  playMultiplayerBtn.addEventListener('click', function () {
    playButtonSound();
    localStorage.setItem('gameMode', 'online');
    localStorage.setItem('onlineRole', 'host');
    window.location.href = 'player-setup.html';
  });

  settingsBtn.addEventListener('click', function () {
    playButtonSound();
    window.location.href = 'game-options.html';
  });

  exitBtn.addEventListener('click', function () {
    playButtonSound();
    if (!confirm(tr('menu.confirmExit'))) return;

    window.close();
  });
});
