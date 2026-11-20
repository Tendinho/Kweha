/* ============================================================
   Kweha — Gerenciador de efeitos sonoros partilhado
   Sons e preferências guardadas em localStorage.
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'gameSettings';

  const DEFAULTS = {
    volume: 0.5,
    soundEnabled: true,
    language: window.I18N ? window.I18N.getLanguage() : 'en'
  };

  const SOURCES = {
    button: '../assets/sounds/Select.mp3',
    typing: '../assets/sounds/SFX - Lápis Escrevendo.mp3',
    stop: '../assets/sounds/14- Sino Escola.mp3',
    win: '../assets/sounds/Es Tu Mesmo.mp3',
    lose: '../assets/sounds/Ta picar (eiii).mp3'
  };

  const ICONS = {
    on: '<svg class="icon" aria-hidden="true"><use href="../assets/icons/sprite.svg#i-sound-on"></use></svg>',
    off: '<svg class="icon" aria-hidden="true"><use href="../assets/icons/sprite.svg#i-sound-off"></use></svg>'
  };

  function label(key, fallback) {
    return window.I18N ? window.I18N.t(key) : fallback;
  }

  function readSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      return { ...DEFAULTS, ...stored };
    } catch (error) {
      return { ...DEFAULTS };
    }
  }

  let settings = readSettings();
  const sounds = {};

  let toggleButton = null;

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      /* armazenamento indisponível */
    }
  }

  function applyVolume() {
    const volume = Math.max(0, Math.min(1, Number(settings.volume) || 0));
    Object.keys(sounds).forEach((name) => {
      sounds[name].volume = volume;
    });
  }

  function getSound(name) {
    if (!SOURCES[name]) return null;

    if (!sounds[name]) {
      const audio = new Audio(SOURCES[name]);
      audio.preload = 'auto';
      audio.volume = Math.max(0, Math.min(1, Number(settings.volume) || 0));
      sounds[name] = audio;
    }

    return sounds[name];
  }

  function play(name) {
    if (!settings.soundEnabled) return;

    const sound = getSound(name);
    if (!sound) return;

    try {
      sound.currentTime = 0;
      const promise = sound.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    } catch (error) {
      /* reprodução bloqueada pelo navegador */
    }
  }

  function startLoop(name) {
    if (!settings.soundEnabled) return;

    const sound = getSound(name);
    if (!sound) return;

    sound.loop = true;

    if (!sound.paused) return;

    try {
      const promise = sound.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    } catch (error) {
      /* reprodução bloqueada pelo navegador */
    }
  }

  function stopLoop(name) {
    const sound = sounds[name];
    if (!sound) return;

    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (error) {
      /* ignorar */
    }
  }

  function stopAllLoops() {
    Object.keys(sounds).forEach((name) => {
      if (sounds[name].loop) stopLoop(name);
    });
  }

  function updateToggle() {
    if (!toggleButton) return;

    const enabled = settings.soundEnabled;
    toggleButton.innerHTML = enabled ? ICONS.on : ICONS.off;
    toggleButton.classList.toggle('is-off', !enabled);
    const actionLabel = enabled
      ? label('options.soundOff', 'Desligar som')
      : label('options.soundOn', 'Ligar som');
    toggleButton.setAttribute('aria-label', actionLabel);
    toggleButton.setAttribute('title', actionLabel);
    toggleButton.setAttribute('aria-pressed', String(enabled));
  }

  function setSettings(patch) {
    settings = { ...settings, ...patch };
    saveSettings();
    applyVolume();
    updateToggle();

    if (!settings.soundEnabled) {
      stopAllLoops();
    }

    return { ...settings };
  }

  function buildToggle() {
    if (toggleButton || document.querySelector('.sound-toggle')) {
      toggleButton = document.querySelector('.sound-toggle');
      updateToggle();
      return;
    }

    toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'sound-toggle';

    toggleButton.addEventListener('click', () => {
      const enabled = !settings.soundEnabled;
      setSettings({ soundEnabled: enabled });
      if (enabled) play('button');
    });

    document.body.appendChild(toggleButton);
    updateToggle();
  }

  window.addEventListener('stop:languagechange', updateToggle);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const control = target.closest('button, a, [role="button"]');
    if (!control) return;
    if (control.disabled || control.getAttribute('aria-disabled') === 'true') return;
    if (control.hasAttribute('data-no-click-sound')) return;

    play('button');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAllLoops();
    }
  });

  window.SoundManager = {
    play,
    startLoop,
    stopLoop,
    getSettings: () => ({ ...settings }),
    setSettings,
    get soundEnabled() {
      return settings.soundEnabled;
    }
  };

  function init() {
    applyVolume();
    buildToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
