/* ============================================================
   Kweha — Definições
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const soundToggle = document.getElementById('sound-toggle');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeDown = document.getElementById('volume-down');
  const volumeUp = document.getElementById('volume-up');
  const volumeValue = document.getElementById('volume-value');
  const languageOptions = Array.from(document.querySelectorAll('.language-option'));
  const backBtn = document.getElementById('back-to-main');

  const manager = window.SoundManager;
  const i18n = window.I18N;
  const initialLanguage = i18n ? i18n.getLanguage() : 'en';
  let settings = manager
    ? manager.getSettings()
    : { volume: 0.5, soundEnabled: true, language: initialLanguage };

  const initialVolume = Number(settings.volume);
  soundToggle.checked = Boolean(settings.soundEnabled);
  setVolumeValue(Number.isFinite(initialVolume) ? initialVolume : 0.5, false);
  applyLanguage(i18n ? initialLanguage : settings.language || 'en');

  soundToggle.addEventListener('change', function () {
    save({ soundEnabled: soundToggle.checked });
  });

  volumeSlider.addEventListener('input', function () {
    setVolumeValue(parseFloat(volumeSlider.value), true);
  });

  volumeDown.addEventListener('click', function () {
    const next = Math.max(0, Math.round((Number(volumeSlider.value) - 0.1) * 10) / 10);
    setVolumeValue(next, true);
  });

  volumeUp.addEventListener('click', function () {
    const next = Math.min(1, Math.round((Number(volumeSlider.value) + 0.1) * 10) / 10);
    setVolumeValue(next, true);
  });

  languageOptions.forEach((option) => {
    option.addEventListener('click', function () {
      const language = option.dataset.lang;
      applyLanguage(language);

      if (i18n) {
        i18n.setLanguage(language);
      }

      save({ language });
      if (manager) manager.play('button');
    });
  });

  backBtn.addEventListener('click', function () {
    if (manager) manager.play('button');
    window.location.href = 'main-menu.html';
  });

  function setVolumeValue(value, notify) {
    const volume = Math.max(0, Math.min(1, value));
    volumeSlider.value = volume;
    volumeSlider.style.setProperty('--value', Math.round(volume * 100) + '%');
    volumeValue.textContent = Math.round(volume * 100) + '%';

    save({ volume });

    if (notify && manager) {
      manager.play('button');
    }
  }

  function applyLanguage(language) {
    languageOptions.forEach((option) => {
      const isSelected = option.dataset.lang === language;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function save(patch) {
    settings = { ...settings, ...patch };
    if (manager) {
      settings = manager.setSettings(patch);
    }
  }
});
