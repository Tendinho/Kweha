document.addEventListener('DOMContentLoaded', function () {
  const auth = window.STOP_AUTH;
  const backBtn = document.getElementById('back-to-menu');
  const localAuth = document.getElementById('local-auth');
  const dividerAuth = document.getElementById('divider-auth');
  const loginProviders = document.getElementById('login-providers');
  const googleBtn = document.getElementById('google-login');
  const guestBtn = document.getElementById('guest-login');
  const logoutBtn = document.getElementById('logout-btn');
  const note = document.getElementById('login-note');
  const loggedUser = document.getElementById('logged-user');
  const loggedAvatar = document.getElementById('logged-avatar');
  const loggedName = document.getElementById('logged-name');
  const loggedEmail = document.getElementById('logged-email');
  const loggedProvider = document.getElementById('logged-provider');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginSubmit = document.getElementById('login-submit');
  const registerSubmit = document.getElementById('register-submit');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const registerName = document.getElementById('register-name');
  const registerEmail = document.getElementById('register-email');
  const registerPassword = document.getElementById('register-password');
  const registerConfirm = document.getElementById('register-confirm');

  let busy = false;
  let providers = { google: false };
  const pendingError = readError();

  function tr(key, params) {
    return window.I18N ? window.I18N.t(key, params) : key;
  }

  if (!auth) {
    setNote(tr('login.authNotLoaded'), 'error');
    return;
  }

  init();

  function playButtonSound() {
    if (window.SoundManager) {
      window.SoundManager.play('button');
    }
  }

  function setNote(message, type) {
    note.textContent = message || '';
    note.className = 'login-note';
    if (type) note.classList.add('is-' + type);
  }

  function readError() {
    const error = new URLSearchParams(window.location.search).get('error');
    if (!error) return null;

    const messages = {
      google_not_configured: 'login.errorGoogleNotConfigured',
      redirect_not_configured: 'login.errorRedirectNotConfigured',
      google_denied: 'login.errorGoogleDenied',
      oauth_state: 'login.errorOauthState',
      oauth_failed: 'login.errorOauthFailed'
    };

    return tr(messages[error] || 'login.errorGeneric');
  }

  async function init() {
    try {
      await auth.refreshSession();
    } catch (error) {
      /* mantém a sessão em cache se o servidor não responder */
    }

    try {
      providers = await auth.getProviders();
    } catch (error) {
      providers = { google: false };
    }

    refresh();

    if (pendingError) {
      setNote(pendingError, 'error');
      return;
    }

    if (!auth.getUser()) {
      if (!providers.google) {
        setNote(tr('login.infoLocal'), 'info');
      } else {
        setNote(tr('login.infoGoogle'), 'info');
      }
    }
  }

  function refresh() {
    const user = auth.getUser();
    const googleReady = providers.google;

    loginSubmit.disabled = busy;
    registerSubmit.disabled = busy;
    tabLogin.disabled = busy;
    tabRegister.disabled = busy;
    guestBtn.disabled = busy;
    logoutBtn.disabled = busy;
    backBtn.disabled = busy;

    googleBtn.disabled = busy || !googleReady;
    googleBtn.title = googleReady ? '' : tr('login.googleUnavailableTitle');

    localAuth.classList.toggle('hidden', Boolean(user));
    dividerAuth.classList.toggle('hidden', Boolean(user));
    loginProviders.classList.toggle('hidden', Boolean(user));
    loggedUser.classList.toggle('hidden', !user);
    logoutBtn.classList.toggle('hidden', !user);

    if (user) {
      loggedName.textContent = user.name;
      loggedEmail.textContent = user.email || auth.providerLabel(user.provider);
      loggedProvider.textContent = auth.providerLabel(user.provider);

      if (user.picture) {
        loggedAvatar.style.backgroundImage = 'url("' + user.picture + '")';
        loggedAvatar.classList.add('has-photo');
      } else {
        loggedAvatar.style.backgroundImage = '';
        loggedAvatar.classList.remove('has-photo');
      }

      return;
    }

    loggedAvatar.style.backgroundImage = '';
    loggedAvatar.classList.remove('has-photo');
  }

  function showTab(tab) {
    if (busy) return;

    const isLogin = tab === 'login';
    loginForm.classList.toggle('hidden', !isLogin);
    registerForm.classList.toggle('hidden', isLogin);
    tabLogin.classList.toggle('ativo', isLogin);
    tabRegister.classList.toggle('ativo', !isLogin);
    tabLogin.setAttribute('aria-selected', String(isLogin));
    tabRegister.setAttribute('aria-selected', String(!isLogin));
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (busy) return;

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      setNote(tr('login.fillEmailPassword'), 'error');
      return;
    }

    playButtonSound();
    busy = true;
    refresh();
    setNote(tr('login.signingIn'), 'info');

    try {
      const user = await auth.login(email, password);
      setNote(tr('login.sessionStarted', { name: user.name }), 'success');
      window.setTimeout(function () {
        window.location.href = '/menu';
      }, 550);
    } catch (error) {
      busy = false;
      refresh();
      setNote(error && error.message ? error.message : tr('login.loginFailed'), 'error');
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    if (busy) return;

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = registerConfirm.value;

    if (!name || !email || !password) {
      setNote(tr('login.fillAll'), 'error');
      return;
    }

    if (password !== confirm) {
      setNote(tr('login.passwordsMismatch'), 'error');
      return;
    }

    playButtonSound();
    busy = true;
    refresh();
    setNote(tr('login.creatingAccount'), 'info');

    try {
      const user = await auth.register(name, email, password);
      setNote(tr('login.accountCreated', { name: user.name }), 'success');
      window.setTimeout(function () {
        window.location.href = '/menu';
      }, 650);
    } catch (error) {
      busy = false;
      refresh();
      setNote(error && error.message ? error.message : tr('login.createFailed'), 'error');
    }
  }

  function handleProvider(provider) {
    if (busy || !providers.google) return;

    playButtonSound();
    busy = true;
    refresh();
    setNote(tr('login.connectingGoogle'), 'info');
    auth.loginWithProvider(provider);
  }

  async function continueAsGuest() {
    if (busy) return;

    playButtonSound();
    busy = true;
    refresh();

    try {
      await auth.logout();
    } finally {
      localStorage.removeItem('onlinePlayerName');
      window.location.href = '/menu';
    }
  }

  async function logout() {
    if (busy) return;

    playButtonSound();
    busy = true;
    refresh();

    await auth.logout();

    busy = false;
    loginPassword.value = '';
    registerPassword.value = '';
    registerConfirm.value = '';
    refresh();
    setNote(tr('login.sessionEnded'), 'info');
  }

  tabLogin.addEventListener('click', function () {
    showTab('login');
  });

  tabRegister.addEventListener('click', function () {
    showTab('register');
  });

  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);

  googleBtn.addEventListener('click', function () {
    handleProvider('google');
  });

  guestBtn.addEventListener('click', continueAsGuest);
  logoutBtn.addEventListener('click', logout);

  backBtn.addEventListener('click', function () {
    playButtonSound();
    window.location.href = '/menu';
  });
});
