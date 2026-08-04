(function () {
  const BASE_PAIRS = 6;   // level 1 starts at 6 pairs (12 cards)
  const MAX_PAIRS = 12;   // grid size caps here; later levels get harder via time/preview instead
  const MISS_TIME_PENALTY = 3; // seconds lost per mismatch, once the clock is running

  let level = 1;
  let pairsThisLevel = BASE_PAIRS;
  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let missesThisLevel = 0;
  let lockBoard = true;

  let score = 0;
  let matchStreak = 0;
  let bestCombo = 0;
  let timeLeft = 0;

  let previewTimer = null;
  let levelTimer = null;
  let transitionTimer = null;

  let running = false;
  let gameEnded = false;
  let completionRecorded = false;

  function computePairs(lvl) {
    return Math.min(BASE_PAIRS + (lvl - 1), MAX_PAIRS);
  }
  function computePreviewSeconds(lvl) {
    return Math.max(1.2, 3.2 - (lvl - 1) * 0.2);
  }
  function computeTimeLimit(lvl, pairs) {
    const perPair = Math.max(3, 5 - (lvl - 1) * 0.35);
    return Math.round(pairs * perPair);
  }
  function comboMultiplier() {
    return Math.min(5, 1 + Math.floor((matchStreak - 1) / 3));
  }

  function clearTimers() {
    clearTimeout(previewTimer); previewTimer = null;
    clearInterval(levelTimer); levelTimer = null;
    clearTimeout(transitionTimer); transitionTimer = null;
  }

  function buildDeck(pairs) {
    // Only ever draws from the species emoji set — no plant photos in this game.
    const pool = (typeof SPECIES_DICTIONARY !== 'undefined' ? SPECIES_DICTIONARY : [])
      .filter(s => s.id !== 'other')
      .map(s => s.emoji);
    // De-dupe symbols first: several species share the same emoji, and two
    // different pairs showing an identical-looking glyph made matches
    // ambiguous in the old version.
    const unique = Array.from(new Set(pool));
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    const chosen = unique.slice(0, pairs);
    const deck = chosen.concat(chosen).map((emoji, idx) => ({
      key: emoji, value: emoji, id: idx, isFlipped: false, isMatched: false
    }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function openMemoryGame() {
    if (document.getElementById('memoryBackdrop')) return;
    level = 1;
    score = 0;
    matchStreak = 0;
    bestCombo = 0;
    running = true;
    gameEnded = false;
    completionRecorded = false;

    const highScore = (typeof state !== 'undefined' && state.memoryHighScore) || 0;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'memoryBackdrop';
    backdrop.innerHTML = `
      <div class="modal memory-modal">
        <h3>Memory Match</h3>
        <div class="memory-hud">
          <span>Score: <strong id="memoryScore">0</strong></span>
          <span>Level: <strong id="memoryLevel">1</strong></span>
          <span>Best: <strong id="memoryBest">${highScore}</strong></span>
          <span>Time: <strong id="memoryTime">--</strong>s</span>
        </div>
        <div class="game-combo" id="memoryCombo"></div>
        <div class="memory-grid" id="memoryGrid"></div>
        <div class="game-hint" id="memoryHint">Get ready...</div>
        <div class="modal-actions">
          <button class="secondary" id="closeMemory">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target.id === 'memoryBackdrop' || e.target.id === 'closeMemory') {
        quitRun();
      }
    });

    startLevel(1);
  }

  function quitRun() {
    if (!gameEnded && score > 0 && window.recordMemoryGameScore) window.recordMemoryGameScore(score);
    running = false;
    gameEnded = true;
    clearTimers();
    const backdrop = document.getElementById('memoryBackdrop');
    if (backdrop) backdrop.remove();
  }

  function setHint(text) {
    const el = document.getElementById('memoryHint');
    if (el) el.textContent = text;
  }

  function updateTimeDisplay() {
    const el = document.getElementById('memoryTime');
    if (!el) return;
    el.textContent = Math.max(0, timeLeft);
    el.classList.toggle('memory-time-low', timeLeft <= 5);
  }

  function updateScoreDisplay() {
    const scoreEl = document.getElementById('memoryScore');
    if (scoreEl) scoreEl.textContent = score;
    const bestEl = document.getElementById('memoryBest');
    if (bestEl && score > parseInt(bestEl.textContent, 10)) bestEl.textContent = score;
  }

  function updateComboDisplay() {
    const el = document.getElementById('memoryCombo');
    if (!el) return;
    const mult = comboMultiplier();
    if (matchStreak >= 3) {
      el.textContent = `🔥 ${matchStreak}-streak · ${mult}x`;
      el.classList.add('game-combo-active');
    } else {
      el.textContent = '';
      el.classList.remove('game-combo-active');
    }
  }

  function startLevel(lvl) {
    level = lvl;
    pairsThisLevel = computePairs(lvl);
    cards = buildDeck(pairsThisLevel);
    flipped = [];
    matchedCount = 0;
    missesThisLevel = 0;
    lockBoard = true;

    const levelEl = document.getElementById('memoryLevel');
    if (levelEl) levelEl.textContent = level;
    const timeEl = document.getElementById('memoryTime');
    if (timeEl) { timeEl.textContent = '--'; timeEl.classList.remove('memory-time-low'); }

    // Preview phase: show the whole board face-up briefly, then flip it down.
    cards.forEach(c => c.isFlipped = true);
    renderGrid();
    const previewSeconds = computePreviewSeconds(lvl);
    setHint(`Memorize the board — flipping in ${Math.ceil(previewSeconds)}s!`);

    previewTimer = setTimeout(() => {
      cards.forEach(c => c.isFlipped = false);
      renderGrid();
      lockBoard = false;
      setHint('Match pairs before time runs out — a miss costs 3s!');
      beginCountdown(lvl, pairsThisLevel);
    }, previewSeconds * 1000);
  }

  function beginCountdown(lvl, pairs) {
    timeLeft = computeTimeLimit(lvl, pairs);
    updateTimeDisplay();
    levelTimer = setInterval(() => {
      timeLeft--;
      updateTimeDisplay();
      if (timeLeft <= 0) {
        clearInterval(levelTimer);
        levelTimer = null;
        gameOver();
      }
    }, 1000);
  }

  function renderGrid() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    grid.innerHTML = cards.map(c => `
      <div class="memory-card ${c.isFlipped || c.isMatched ? 'memory-card-flipped' : ''} ${c.isMatched ? 'memory-card-matched' : ''}" data-id="${c.id}">
        <div class="memory-card-inner">
          <div class="memory-card-back">🌿</div>
          <div class="memory-card-front">${c.value}</div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.memory-card').forEach(el => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Memory card, tap to flip');
      el.addEventListener('click', () => handleCardClick(parseInt(el.dataset.id, 10)));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(parseInt(el.dataset.id, 10)); }
      });
    });
  }

  function handleCardClick(id) {
    if (lockBoard || !running) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    flipped.push(card);
    if (window.playCatchSound) window.playCatchSound();
    renderGrid();

    if (flipped.length === 2) {
      lockBoard = true;
      const [a, b] = flipped;
      const isMatch = a.key === b.key;

      if (isMatch) {
        setTimeout(() => {
          a.isMatched = true;
          b.isMatched = true;
          matchedCount++;
          matchStreak++;
          bestCombo = Math.max(bestCombo, matchStreak);
          score += 10 * comboMultiplier();
          updateScoreDisplay();
          updateComboDisplay();
          flipped = [];
          lockBoard = false;
          renderGrid();
          const rect = document.querySelector(`.memory-card[data-id="${a.id}"]`)?.getBoundingClientRect();
          if (window.fireConfetti && rect) window.fireConfetti(rect.left, rect.top);

          if (matchedCount === pairsThisLevel) levelComplete();
        }, 400);
      } else {
        const elA = document.querySelector(`.memory-card[data-id="${a.id}"]`);
        const elB = document.querySelector(`.memory-card[data-id="${b.id}"]`);
        if (elA) elA.classList.add('memory-card-wrong');
        if (elB) elB.classList.add('memory-card-wrong');
        matchStreak = 0;
        missesThisLevel++;
        updateComboDisplay();
        timeLeft = Math.max(0, timeLeft - MISS_TIME_PENALTY);
        updateTimeDisplay();
        setTimeout(() => {
          a.isFlipped = false;
          b.isFlipped = false;
          flipped = [];
          lockBoard = false;
          renderGrid();
          if (timeLeft <= 0) gameOver();
        }, 700);
      }
    }
  }

  function levelComplete() {
    clearInterval(levelTimer);
    levelTimer = null;
    lockBoard = true;

    if (!completionRecorded && window.recordMemoryGameCompletion) {
      window.recordMemoryGameCompletion();
      completionRecorded = true;
    }

    const timeBonus = timeLeft * 3;
    const perfectBonus = missesThisLevel === 0 ? 50 : 0;
    score += timeBonus + perfectBonus;
    updateScoreDisplay();

    let msg = `Level ${level} clear! +${timeBonus} time bonus`;
    if (perfectBonus) msg += ` · +${perfectBonus} perfect!`;
    setHint(msg);

    transitionTimer = setTimeout(() => startLevel(level + 1), 1500);
  }

  function gameOver() {
    if (gameEnded) return;
    gameEnded = true;
    running = false;
    lockBoard = true;
    clearTimers();
    if (window.recordMemoryGameScore) window.recordMemoryGameScore(score);

    const backdrop = document.getElementById('memoryBackdrop');
    if (!backdrop) return;
    const isNewHigh = typeof state !== 'undefined' && score > (state.memoryHighScore || 0);

    const modal = backdrop.querySelector('.modal');
    modal.innerHTML = `
      <h3>Time's up! 🧠</h3>
      <div class="game-result">
        <div class="game-result-score">${score}</div>
        <div class="game-result-label">points scored</div>
        <div class="game-result-sub">Reached level ${level} · best streak ${bestCombo}</div>
        ${isNewHigh ? '<div class="game-new-high">✨ New high score!</div>' : ''}
      </div>
      <div class="modal-actions">
        <button class="secondary" id="closeMemoryResult">Close</button>
        <button class="primary" id="playMemoryAgain">Play again</button>
      </div>
    `;
    document.getElementById('closeMemoryResult').onclick = () => backdrop.remove();
    document.getElementById('playMemoryAgain').onclick = () => { backdrop.remove(); openMemoryGame(); };
  }

  window.openMemoryGame = openMemoryGame;
})();
