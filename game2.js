(function () {
  const BASE_PAIRS = 6;
  const MAX_PAIRS = 12;
  const MISS_TIME_PENALTY = 3;

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

  // SVG map for each species (matches SPECIES_DICTIONARY ids)
  const SPECIES_SVGS = {
    pothos: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/></svg>',
    'fiddle-leaf-fig': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 21V11"/><path d="M12 11C12 11 6 11 6 5C12 5 12 11 12 11Z"/><path d="M12 13C12 13 18 13 18 7C12 7 12 13 12 13Z"/></svg>',
    'snake-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M8 20 Q6 12 10 4 Q12 12 12 20 Z"/><path d="M12 20 Q12 12 16 4 Q18 12 16 20 Z"/></svg>',
    monstera: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 21V11"/><path d="M12 11C12 11 6 11 6 5C12 5 12 11 12 11Z"/><path d="M12 13C12 13 18 13 18 7C12 7 12 13 12 13Z"/></svg>',
    succulent: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><circle cx="12" cy="12" r="4"/><circle cx="6" cy="15" r="3"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="7" r="3"/></svg>',
    'zz-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><rect x="10" y="6" width="4" height="14" rx="2"/><rect x="6" y="10" width="4" height="6" rx="2"/><rect x="14" y="8" width="4" height="7" rx="2"/></svg>',
    'peace-lily': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 20V11"/><path d="M12 11 C 8 11 6 8 6 4 C 10 4 12 7 12 11 Z"/><path d="M12 11 C 16 11 18 8 18 4 C 14 4 12 7 12 11 Z"/><circle cx="12" cy="8" r="2" fill="#E8B84B"/></svg>',
    'spider-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 20V4"/><path d="M8 20 Q6 12 4 6"/><path d="M16 20 Q18 12 20 6"/><path d="M10 20 Q8 14 6 10"/><path d="M14 20 Q16 14 18 10"/></svg>',
    orchid: '<svg viewBox="0 0 24 24" fill="#C97B63"><circle cx="12" cy="10" r="4"/><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="10" r="1.5" fill="#E8B84B"/></svg>',
    aloe: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 22 Q10 12 12 4 Q14 12 12 22 Z"/><path d="M12 22 Q6 14 6 8 Q10 12 12 22 Z"/><path d="M12 22 Q18 14 18 8 Q14 12 12 22 Z"/></svg>',
    'rubber-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><ellipse cx="12" cy="12" rx="6" ry="9"/><path d="M12 3 V 21" stroke="#F7F2EB" stroke-width="1"/></svg>',
    philodendron: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/><path d="M6 18c3-3 5-6 6-10"/></svg>',
    cactus: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><rect x="10" y="6" width="4" height="14" rx="2"/><rect x="6" y="10" width="4" height="6" rx="2"/><rect x="14" y="8" width="4" height="7" rx="2"/></svg>',
    fern: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 22V4"/><path d="M12 8 L8 5"/><path d="M12 8 L16 5"/><path d="M12 12 L7 9"/><path d="M12 12 L17 9"/><path d="M12 16 L8 13"/><path d="M12 16 L16 13"/></svg>',
    basil: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><ellipse cx="9" cy="10" rx="4" ry="6" transform="rotate(-20 9 10)"/><ellipse cx="15" cy="10" rx="4" ry="6" transform="rotate(20 15 10)"/><path d="M12 22 V 14"/></svg>',
    'bird-of-paradise': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 22 V 8"/><path d="M12 8 L6 4"/><path d="M12 8 L18 4"/><path d="M12 12 L7 8"/><path d="M12 12 L17 8"/></svg>',
    calathea: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><ellipse cx="12" cy="12" rx="6" ry="9"/><path d="M12 3 V 21" stroke="#F7F2EB" stroke-width="1"/></svg>',
    'jade-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="8" cy="16" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
    dracaena: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M8 20 Q6 12 10 4 Q12 12 12 20 Z"/><path d="M12 20 Q12 12 16 4 Q18 12 16 20 Z"/></svg>',
    croton: '<svg viewBox="0 0 24 24" fill="#C9622E"><ellipse cx="12" cy="10" rx="4" ry="6"/><ellipse cx="6" cy="14" rx="3" ry="4" transform="rotate(-30 6 14)"/><ellipse cx="18" cy="14" rx="3" ry="4" transform="rotate(30 18 14)"/></svg>',
    anthurium: '<svg viewBox="0 0 24 24" fill="#D94F4F"><path d="M12 20 L12 10"/><path d="M12 12 C 8 12 6 9 6 5 C 10 5 12 8 12 12 Z"/><path d="M12 12 C 16 12 18 9 18 5 C 14 5 12 8 12 12 Z"/></svg>',
    'chinese-money-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><circle cx="12" cy="14" r="3"/><circle cx="8" cy="18" r="2.5"/><circle cx="16" cy="18" r="2.5"/></svg>',
    'air-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 22 Q8 16 8 10 Q12 14 12 22 Z"/><path d="M12 22 Q16 16 16 10 Q12 14 12 22 Z"/></svg>',
    'christmas-cactus': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><rect x="10" y="6" width="4" height="14" rx="2"/><rect x="6" y="10" width="4" height="6" rx="2"/><rect x="14" y="8" width="4" height="7" rx="2"/></svg>',
    'english-ivy': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/></svg>',
    'prayer-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><ellipse cx="12" cy="12" rx="6" ry="9"/><path d="M12 3 V 21" stroke="#F7F2EB" stroke-width="1"/></svg>',
    hoya: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/></svg>'
  };

  function svgForSpecies(speciesId) {
    return SPECIES_SVGS[speciesId] || SPECIES_SVGS.pothos;
  }

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
    const availableIds = Object.keys(SPECIES_SVGS);
    for (let i = availableIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIds[i], availableIds[j]] = [availableIds[j], availableIds[i]];
    }
    const chosen = availableIds.slice(0, pairs);
    const deck = chosen.concat(chosen).map((speciesId, idx) => ({
      key: speciesId, speciesId, id: idx, isFlipped: false, isMatched: false
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
      el.textContent = matchStreak + '-streak, ' + mult + 'x';
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

    cards.forEach(c => c.isFlipped = true);
    renderGrid();
    const previewSeconds = computePreviewSeconds(lvl);
    setHint('Memorize the board, flipping in ' + Math.ceil(previewSeconds) + 's!');

    previewTimer = setTimeout(() => {
      cards.forEach(c => c.isFlipped = false);
      renderGrid();
      lockBoard = false;
      setHint('Match pairs before time runs out, a miss costs 3s!');
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
          <div class="memory-card-back"><svg viewBox="0 0 24 24" fill="#fff"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/></svg></div>
          <div class="memory-card-front">${svgForSpecies(c.speciesId)}</div>
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
          const rect = document.querySelector('.memory-card[data-id="' + a.id + '"]');
          if (window.fireConfetti && rect) {
            const r = rect.getBoundingClientRect();
            window.fireConfetti(r.left, r.top);
          }

          if (matchedCount === pairsThisLevel) levelComplete();
        }, 400);
      } else {
        const elA = document.querySelector('.memory-card[data-id="' + a.id + '"]');
        const elB = document.querySelector('.memory-card[data-id="' + b.id + '"]');
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

    let msg = 'Level ' + level + ' clear! +' + timeBonus + ' time bonus';
    if (perfectBonus) msg += ' , +' + perfectBonus + ' perfect!';
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
      <h3>Time's up</h3>
      <div class="game-result">
        <div class="game-result-score">${score}</div>
        <div class="game-result-label">points scored</div>
        <div class="game-result-sub">Reached level ${level} · best streak ${bestCombo}</div>
        ${isNewHigh ? '<div class="game-new-high">New high score</div>' : ''}
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
