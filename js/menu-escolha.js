/* ============================================================
   Kweha — Seleção de categorias
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const categoryItems = Array.from(document.querySelectorAll('.category-item'));
  const nextBtn = document.getElementById('next-to-config');
  const backBtn = document.getElementById('back-to-mode');
  const countLabel = document.getElementById('selection-count');
  const onlineNote = document.getElementById('online-category-note');
  const difficultyPanel = document.getElementById('difficulty-panel');
  const difficultyBtns = Array.from(document.querySelectorAll('.difficulty-btn:not(.round-btn)'));
  const roundsPanel = document.getElementById('rounds-panel');
  const roundBtns = Array.from(document.querySelectorAll('.round-btn'));
  const gameMode = localStorage.getItem('gameMode') || 'computer';
  const REQUIRED = ['name', 'country'];
  const AVAILABLE = categoryItems.map((item) => item.dataset.category);
  const DIFFICULTIES = ['easy', 'normal', 'hard'];
  const ROUND_OPTIONS = [3, 5, 10, 15];
  let difficulty = localStorage.getItem('computerDifficulty') || 'normal';
  let rounds = readRounds();

  if (!DIFFICULTIES.includes(difficulty)) difficulty = 'normal';

  const saved = loadSavedCategories();
  let selectedCategories = Array.from(new Set([...REQUIRED, ...saved])).filter((category) =>
    AVAILABLE.includes(category)
  );

  applySelectionToDOM();
  updateCount();

  if (gameMode === 'online' && localStorage.getItem('onlineRole') === 'guest') {
    window.location.href = 'game-screen.html';
    return;
  }

  if (onlineNote && gameMode === 'online') {
    onlineNote.classList.remove('hidden');
  }

  if (gameMode === 'computer' && difficultyPanel) {
    difficultyPanel.classList.remove('hidden');
    applyDifficultyToDOM();
  }

  if (roundsPanel) {
    roundsPanel.classList.remove('hidden');
    applyRoundsToDOM();
  }

  difficultyBtns.forEach(function (button) {
    button.addEventListener('click', function () {
      const next = button.dataset.difficulty;
      if (!DIFFICULTIES.includes(next)) return;
      difficulty = next;
      localStorage.setItem('computerDifficulty', difficulty);
      applyDifficultyToDOM();
      playButtonSound();
    });
  });

  roundBtns.forEach(function (button) {
    button.addEventListener('click', function () {
      const next = Number(button.dataset.rounds);
      if (!ROUND_OPTIONS.includes(next)) return;
      rounds = next;
      localStorage.setItem('totalRounds', String(rounds));
      applyRoundsToDOM();
      playButtonSound();
    });
  });

  function readRounds() {
    const stored = Number(localStorage.getItem('totalRounds'));
    return ROUND_OPTIONS.includes(stored) ? stored : 10;
  }

  function applyDifficultyToDOM() {
    difficultyBtns.forEach(function (button) {
      const active = button.dataset.difficulty === difficulty;
      button.classList.toggle('ativo', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function applyRoundsToDOM() {
    roundBtns.forEach(function (button) {
      const active = Number(button.dataset.rounds) === rounds;
      button.classList.toggle('ativo', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function loadSavedCategories() {
    try {
      const stored = JSON.parse(localStorage.getItem('selectedCategories') || 'null');
      if (!Array.isArray(stored)) return [];
      return stored.filter((category) => typeof category === 'string');
    } catch (error) {
      return [];
    }
  }

  function applySelectionToDOM() {
    categoryItems.forEach((item) => {
      const category = item.dataset.category;
      const isSelected = selectedCategories.includes(category);
      item.classList.toggle('selected', isSelected);
      item.classList.toggle('locked', REQUIRED.includes(category));
      item.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function updateCount() {
    if (!countLabel) return;
    countLabel.textContent = window.I18N
      ? window.I18N.t('categories.count', {
          selected: selectedCategories.length,
          total: categoryItems.length
        })
      : selectedCategories.length + ' de ' + categoryItems.length + ' categorias';
  }

  function playButtonSound() {
    if (window.SoundManager) {
      window.SoundManager.play('button');
    }
  }

  categoryItems.forEach((item) => {
    item.addEventListener('click', function () {
      const category = item.dataset.category;

      if (REQUIRED.includes(category)) return;

      playButtonSound();

      const nowSelected = !item.classList.contains('selected');
      item.classList.toggle('selected', nowSelected);
      item.setAttribute('aria-pressed', String(nowSelected));

      if (nowSelected) {
        if (!selectedCategories.includes(category)) {
          selectedCategories.push(category);
        }
      } else {
        selectedCategories = selectedCategories.filter((value) => value !== category);
      }

      updateCount();
    });
  });

  nextBtn.addEventListener('click', function () {
    if (selectedCategories.length < 2) {
      alert(window.I18N ? window.I18N.t('categories.minAlert') : 'Seleciona pelo menos 2 categorias para jogar!');
      return;
    }

    const currentMode = localStorage.getItem('gameMode') || 'computer';
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    localStorage.setItem('totalRounds', String(rounds));

    if (currentMode === 'computer') {
      localStorage.setItem('computerDifficulty', difficulty);
    }

    playButtonSound();

    if (window.SoundManager) {
      window.SoundManager.play('start');
    }

    window.location.href = 'game-screen.html';
  });

  backBtn.addEventListener('click', function () {
    playButtonSound();
    const currentMode = localStorage.getItem('gameMode') || 'computer';

    if (currentMode === 'online') {
      window.location.href = 'player-setup.html';
      return;
    }

    window.location.href = 'main-menu.html';
  });
});
