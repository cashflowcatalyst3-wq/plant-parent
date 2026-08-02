(function () {
  let gameActive = false;
  let score = 0;
  let timeLeft = 30;
  let combo = 0;
  let bestCombo = 0;
  let spawnTimer = null;
  let countdownTimer = null;
  let elapsed = 0; // seconds since game start, drives difficulty ramp

  const GAME_LENGTH = 30;
  const HAZARD_TYPES = ['🥀', '🐛'];

  function comboMultiplier() {
    // +1x every 5-catch combo streak, capped at 4x so skilled play meaningfully
    // outscores casual tapping without becoming unbounded.
    return Math.min(4, 1 + Math.floor(combo / 5));
  }

  function currentSpawnInterval() {
    // Starts at 700ms, ramps down to 320ms by the end of the round.
    const progress = Math.min(1, elapsed / GAME_LENGTH);
    return Math.round(700 - progress * 380);
  }

  function currentFallDuration() {
    // Starts slow (2.4-3.6s), ramps down to fast (1.1-1.7s) by the end.
    const progress = Math.min(1, elapsed / GAME_LENGTH);
    const minD = 2.4 - progress * 1.3;
    const maxD = 3.6 - progress * 1.9;
    return minD + Math.random() * (maxD - minD);
  }

  function scheduleNextSpawn() {
    if (!gameActive) return;
    spawnDrop();
    spawnTimer = setTimeout(scheduleNextSpawn, currentSpawnInterval());
  }

  function openMiniGame() {
    if (document.getElementById('gameBackdrop')) return;
    score = 0;
    timeLeft = GAME_LENGTH;
    combo = 0;
    bestCombo = 0;
    elapsed = 0;
    gameActive = true;

    const highScore = (typeof state !== 'undefined' && state.gameHighScore) || 0;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'gameBackdrop';
    backdrop.innerHTML = `
      <div class="modal game-modal">
        <h3>Raindrop Catch</h3>
        <div class="game-hud">
          <span>Score: <strong id="gameScore">0</strong></span>
          <span>Best: <strong>${highScore}</strong></span>
          <span>Time: <strong id="gameTime">${GAME_LENGTH}</strong>s</span>
        </div>
        <div class="game-combo" id="gameCombo"></div>
        <div class="game-area" id="gameArea"></div>
        <div class="game-hint">Tap 💧 drops — avoid 🥀 and 🐛. Chain catches for a combo multiplier!</div>
        <div class="modal-actions">
          <button class="secondary" id="closeGame">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target.id === 'gameBackdrop' || e.target.id === 'closeGame') {
        endGame(true);
      }
    });

    scheduleNextSpawn();
    countdownTimer = setInterval(() => {
      timeLeft--;
      elapsed++;
      const timeEl = document.getElementById('gameTime');
      if (timeEl) timeEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame(false);
    }, 1000);
  }

  function spawnDrop() {
    if (!gameActive) return;
    const area = document.getElementById('gameArea');
    if (!area) return;

    const drop = document.createElement('div');
    const isHazard = Math.random() < 0.22; // roughly 1 in 5 drops is something to avoid
    const symbol = isHazard ? HAZARD_TYPES[Math.floor(Math.random() * HAZARD_TYPES.length)] : '💧';
    drop.className = 'raindrop' + (isHazard ? ' raindrop-hazard' : '');
    drop.dataset.hazard = isHazard ? '1' : '0';
    drop.textContent = symbol;
    const left = 5 + Math.random() * 85;
    const duration = currentFallDuration();
    drop.style.left = left + '%';
    drop.style.animationDuration = duration + 's';

    drop.addEventListener('animationend', () => drop.remove());
    drop.addEventListener('click', () => catchDrop(drop));
    drop.addEventListener('touchstart', (e) => { e.preventDefault(); catchDrop(drop); }, { passive: false });

    area.appendChild(drop);
  }

  function updateComboDisplay() {
    const el = document.getElementById('gameCombo');
    if (!el) return;
    const mult = comboMultiplier();
    if (combo >= 3) {
      el.textContent = `🔥 ${combo}-combo · ${mult}x`;
      el.classList.add('game-combo-active');
    } else {
      el.textContent = '';
      el.classList.remove('game-combo-active');
    }
  }

  function catchDrop(drop) {
    if (!gameActive || !drop.isConnected) return;
    const rect = drop.getBoundingClientRect();
    const isHazard = drop.dataset.hazard === '1';

    if (isHazard) {
      combo = 0;
      score = Math.max(0, score - 2);
      drop.classList.add('raindrop-hazard-hit');
    } else {
      combo++;
      bestCombo = Math.max(bestCombo, combo);
      score += comboMultiplier();
      if (window.fireConfetti) window.fireConfetti(rect.left, rect.top);
      if (window.playCatchSound) window.playCatchSound();
      drop.classList.add('raindrop-caught');
    }

    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) scoreEl.textContent = score;
    updateComboDisplay();
    setTimeout(() => drop.remove(), 150);
  }

  function endGame(skipResult) {
    gameActive = false;
    clearTimeout(spawnTimer);
    clearInterval(countdownTimer);
    const backdrop = document.getElementById('gameBackdrop');
    if (!backdrop) return;

    if (skipResult) {
      backdrop.remove();
      return;
    }

    const isNewHigh = typeof state !== 'undefined' && score > (state.gameHighScore || 0);
    if (window.recordGameScore) window.recordGameScore(score);

    const modal = backdrop.querySelector('.modal');
    modal.innerHTML = `
      <h3>Time's up! 🌦️</h3>
      <div class="game-result">
        <div class="game-result-score">${score}</div>
        <div class="game-result-label">points scored</div>
        <div class="game-result-sub">Best combo: ${bestCombo} in a row</div>
        ${isNewHigh ? '<div class="game-new-high">✨ New high score!</div>' : ''}
      </div>
      <div class="modal-actions">
        <button class="secondary" id="closeGameResult">Close</button>
        <button class="primary" id="playAgain">Play again</button>
      </div>
    `;
    document.getElementById('closeGameResult').onclick = () => backdrop.remove();
    document.getElementById('playAgain').onclick = () => { backdrop.remove(); openMiniGame(); };
  }

  window.openMiniGame = openMiniGame;
})();
