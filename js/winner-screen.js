/* ============================================================
   Kweha — Ecrã de vencedor
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const titleEl = document.getElementById('winner-title');
  const nameEl = document.getElementById('winner-name');
  const scoreEl = document.getElementById('winner-score');
  const prefixEl = document.getElementById('winner-prefix');
  const suffixEl = document.getElementById('winner-suffix');
  const finalScoresEl = document.getElementById('final-scores');
  const playAgainBtn = document.getElementById('play-again');
  const backToMenuBtn = document.getElementById('back-to-menu');
  const confettiLayer = document.getElementById('confetti-layer');

  function tr(key, params) {
    return window.I18N ? window.I18N.t(key, params) : key;
  }

  const players = loadResults();
  const gameMode = localStorage.getItem('gameMode') || 'computer';
  const onlineName = (localStorage.getItem('onlinePlayerName') || '').trim().slice(0, 18);

  if (players.length === 0) {
    players.push({ name: tr('winner.defaultPlayer'), score: 0 });
  }

  const sorted = players.slice().sort(function (a, b) {
    return b.score - a.score;
  });

  const topScore = sorted[0].score;
  const winners = sorted.filter(function (player) {
    return player.score === topScore;
  });

  const isComputerWinner = winners.some(function (player) {
    return player.isComputer || player.name === tr('winner.computer');
  });

  const onlineWinner = winners.some(function (player) {
    return onlineName && player.name === onlineName;
  });

  renderHeader(winners, isComputerWinner, topScore, gameMode);
  renderScores(sorted, topScore);
  launchConfetti();

  if (window.SoundManager) {
    if (gameMode === 'online') {
      window.SoundManager.play(onlineWinner ? 'win' : 'lose');
    } else {
      window.SoundManager.play(isComputerWinner ? 'lose' : 'win');
    }
  }

  if (gameMode === 'online') {
    playAgainBtn.textContent = tr('winner.playAgainOnline');
  }

  playAgainBtn.addEventListener('click', function () {
    if (window.SoundManager) window.SoundManager.play('button');

    if (gameMode === 'online') {
      localStorage.removeItem('gameResults');
      window.location.href = '/setup';
      return;
    }

    resetForNewGame();
    window.location.href = '/game';
  });

  backToMenuBtn.addEventListener('click', function () {
    if (window.SoundManager) window.SoundManager.play('button');
    window.location.href = '/menu';
  });

  function loadResults() {
    try {
      const stored = JSON.parse(localStorage.getItem('gameResults') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.map(function (player, index) {
          return {
            name: player.name || tr('common.playerNumber', { n: index + 1 }),
            score: Number(player.score) || 0,
            isComputer: Boolean(player.isComputer)
          };
        });
      }
    } catch (error) {
      /* compatibilidade com o formato antigo por URL */
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('player') || params.has('score')) {
      return [
        {
          name: decodeURIComponent(params.get('player') || tr('winner.defaultPlayer')),
          score: Number(params.get('score')) || 0
        },
        { name: tr('winner.computer'), score: 0, isComputer: true }
      ];
    }

    return [];
  }

  function renderHeader(winners, computerWinner, topScore, mode) {
    const tie = winners.length > 1;

    if (tie) {
      titleEl.textContent = tr('winner.tieTitle');
      nameEl.textContent = winners
        .map(function (player) {
          return player.name;
        })
        .join(' & ');
      prefixEl.textContent = tr('winner.tiePrefix');
      suffixEl.textContent = tr('winner.tieSuffix');
      scoreEl.textContent = topScore;
      return;
    }

    const winner = winners[0];

    if (computerWinner) {
      titleEl.textContent = tr('winner.computerTitle');
      nameEl.textContent = winner.name;
      prefixEl.textContent = tr('winner.computerPrefix');
      suffixEl.textContent = tr('winner.computerSuffix');
      scoreEl.textContent = topScore;
      return;
    }

    if (mode === 'online') {
      const iWon = onlineName && winner.name === onlineName;

      titleEl.textContent = iWon ? tr('winner.congrats') : tr('winner.gameOver');
      nameEl.textContent = winner.name;
      prefixEl.textContent = iWon
        ? tr('winner.onlineWinPrefix')
        : tr('winner.onlineLosePrefix', { name: winner.name });
      suffixEl.textContent = iWon
        ? tr('winner.onlineWinSuffix')
        : tr('winner.onlineLoseSuffix');
      scoreEl.textContent = topScore;
      return;
    }

    titleEl.textContent = tr('winner.congrats');
    nameEl.textContent = winner.name;

    if (mode === 'computer') {
      prefixEl.textContent = tr('winner.winComputerPrefix');
    } else {
      prefixEl.textContent = tr('winner.winMultiplayerPrefix');
    }

    suffixEl.textContent = tr('winner.pointsSuffix');
    scoreEl.textContent = topScore;
  }

  function renderScores(sortedPlayers, bestScore) {
    finalScoresEl.innerHTML = '';

    sortedPlayers.forEach(function (player, index) {
      const item = document.createElement('div');
      item.className = 'final-score-item';

      if (player.score === bestScore) {
        item.classList.add('is-winner');
      }

      const rank = document.createElement('span');
      rank.className = 'final-rank';
      rank.textContent = index + 1;

      const playerName = document.createElement('span');
      playerName.className = 'final-player';
      playerName.textContent = player.name;

      const points = document.createElement('span');
      points.className = 'final-points';
      points.textContent = player.score;
      const unit = document.createElement('small');
      unit.textContent = tr('winner.pts');
      points.appendChild(unit);

      item.appendChild(rank);
      item.appendChild(playerName);
      item.appendChild(points);
      finalScoresEl.appendChild(item);
    });
  }

  function resetForNewGame() {
    localStorage.removeItem('gameResults');
  }

  function launchConfetti() {
    if (!confettiLayer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colors = ['#ff7a18', '#e6213d', '#ffcc33', '#12b886', '#2f7fe0', '#8e44ad'];
    const pieces = 90;

    for (let index = 0; index < pieces; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = 6 + Math.random() * 8 + 'px';
      piece.style.height = 10 + Math.random() * 12 + 'px';
      piece.style.animationDuration = 2.4 + Math.random() * 2.6 + 's';
      piece.style.animationDelay = Math.random() * 0.9 + 's';
      piece.style.setProperty('--dx', Math.round((Math.random() - 0.5) * 220) + 'px');
      confettiLayer.appendChild(piece);
    }

    window.setTimeout(function () {
      confettiLayer.innerHTML = '';
    }, 6500);
  }
});
