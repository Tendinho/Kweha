/* ============================================================
   Kweha — Abertura
   ============================================================ */

(function () {
  'use strict';

  const DURATION = 7000;
  const NEXT_PAGE = '/menu';

  const loader = document.getElementById('splash-loader');
  const status = document.getElementById('splash-status');
  const skip = document.getElementById('splash-skip');

  if (!loader) return;

  let finished = false;
  const timers = [];

  function goToMenu() {
    if (finished) return;
    finished = true;

    timers.forEach((timer) => window.clearTimeout(timer));
    window.clearInterval(progressTicker);
    window.location.href = NEXT_PAGE;
  }

  const t = function (key) {
    return window.I18N ? window.I18N.t(key) : key;
  };

  const messages = [
    { at: 0, text: t('splash.statusSharpening') },
    { at: 0.3, text: t('splash.statusDrawing') },
    { at: 0.62, text: t('splash.statusShuffling') },
    { at: 0.88, text: t('splash.statusReady') }
  ];

  messages.forEach((message) => {
    timers.push(
      window.setTimeout(() => {
        if (status) status.textContent = message.text;
      }, message.at * DURATION)
    );
  });

  timers.push(window.setTimeout(goToMenu, DURATION));

  const start = performance.now();
  const progressTicker = window.setInterval(() => {
    const progress = Math.min(100, ((performance.now() - start) / DURATION) * 100);
    loader.setAttribute('aria-valuenow', String(Math.round(progress)));

    if (progress >= 100) {
      window.clearInterval(progressTicker);
    }
  }, 120);

  if (skip) {
    skip.addEventListener('click', goToMenu);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      event.preventDefault();
      goToMenu();
    }
  });
})();
