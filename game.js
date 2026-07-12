(function () {
  let gameActive = false;
  let score = 0;
  let timeLeft = 30;
  let spawnTimer = null;
  let countdownTimer = null;

  function openMiniGame() {
    if (document.getElementById('gameBackdrop')) return;
    score = 0;
    timeLeft = 30;
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
          <span>Time: <strong id="gameTime">30</strong>s</span>
        </div>
        <div class="game-area" id="gameArea"></div>
        <div class="game-hint">Tap the raindrops before they fall!</div>
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

    spawnTimer = setInterval(spawnDrop, 650);
    countdownTimer = setInterval(() => {
      timeLeft--;
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
    drop.className = 'raindrop';
    drop.textContent = '💧';
    const left = 5 + Math.random() * 85;
    const duration = 2.2 + Math.random() * 1.4;
    drop.style.left = left + '%';
    drop.style.animationDuration = duration + 's';

    drop.addEventListener('animationend', () => drop.remove());
    drop.addEventListener('click', () => catchDrop(drop));
    drop.addEventListener('touchstart', (e) => { e.preventDefault(); catchDrop(drop); }, { passive: false });

    area.appendChild(drop);
  }

  function catchDrop(drop) {
    if (!gameActive || !drop.isConnected) return;
    score++;
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) scoreEl.textContent = score;
    const rect = drop.getBoundingClientRect();
    if (window.fireConfetti) window.fireConfetti(rect.left, rect.top);
    if (window.playCatchSound) window.playCatchSound();
    drop.classList.add('raindrop-caught');
    setTimeout(() => drop.remove(), 150);
  }

  function endGame(skipResult) {
    gameActive = false;
    clearInterval(spawnTimer);
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
        <div class="game-result-label">raindrops caught</div>
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
