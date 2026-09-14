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

  // 12 distinct, filled, chunky icons — each visually different so they
  // can never be confused with each other on a small card.
  const SPECIES_SVGS = {
    // Monstera — big split leaf
    monstera: '<svg viewBox="0 0 24 24"><path d="M12 22 V 14 M12 14 C 6 14 3 10 3 4 C 9 4 12 8 12 14 Z M12 14 C 18 14 21 10 21 4 C 15 4 12 8 12 14 Z" fill="#4A5D3A" stroke="#4A5D3A" stroke-width="0.5" stroke-linejoin="round"/></svg>',

    // Sunflower — flower with petals
    sunflower: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.2" fill="#E8B84B"/><circle cx="12" cy="18" r="2.2" fill="#E8B84B"/><circle cx="6" cy="12" r="2.2" fill="#E8B84B"/><circle cx="18" cy="12" r="2.2" fill="#E8B84B"/><circle cx="7.5" cy="7.5" r="2.2" fill="#E8B84B"/><circle cx="16.5" cy="7.5" r="2.2" fill="#E8B84B"/><circle cx="7.5" cy="16.5" r="2.2" fill="#E8B84B"/><circle cx="16.5" cy="16.5" r="2.2" fill="#E8B84B"/><circle cx="12" cy="12" r="3.2" fill="#8B6F1E"/></svg>',

    // Cactus — tall with arms
    cactus: '<svg viewBox="0 0 24 24"><rect x="10" y="4" width="4" height="18" rx="2" fill="#5B7A52"/><rect x="5" y="9" width="4" height="8" rx="2" fill="#5B7A52"/><rect x="5" y="13" width="6" height="4" fill="#5B7A52"/><rect x="15" y="7" width="4" height="9" rx="2" fill="#5B7A52"/><rect x="13" y="12" width="6" height="4" fill="#5B7A52"/></svg>',

    // Rose — pink bloom with spiral
    rose: '<svg viewBox="0 0 24 24"><circle cx="12" cy="11" r="7" fill="#D17BA8"/><path d="M12 5 A 6 6 0 0 1 18 11 A 4.5 4.5 0 0 1 13.5 15.5 A 3 3 0 0 1 10.5 12.5 A 2 2 0 0 1 12.5 10.5" fill="none" stroke="#8E4D6E" stroke-width="1.6" stroke-linecap="round"/><path d="M12 18 V 22" stroke="#4A5D3A" stroke-width="1.6"/></svg>',

    // Pothos — two heart leaves
    pothos: '<svg viewBox="0 0 24 24"><path d="M12 20 C 5 17 3 10 5 4 C 10 6 12 12 12 17 Z" fill="#8B9A6E"/><path d="M12 20 C 19 17 21 10 19 4 C 14 6 12 12 12 17 Z" fill="#A9B78C"/><path d="M12 20 V 22" stroke="#4A5D3A" stroke-width="1.6"/></svg>',

    // Tulip — terracotta cup shape
    tulip: '<svg viewBox="0 0 24 24"><path d="M12 4 C 8 4 6 8 6 12 L 6 14 C 6 18 9 20 12 20 C 15 20 18 18 18 14 L 18 12 C 18 8 16 4 12 4 Z" fill="#C97B63"/><path d="M12 4 V 20" stroke="#8C4A2E" stroke-width="1.3"/><path d="M12 20 V 23" stroke="#4A5D3A" stroke-width="1.6"/></svg>',

    // Bonsai — round canopy on trunk
    bonsai: '<svg viewBox="0 0 24 24"><path d="M10 22 V 14 Q 8 12 8 10 Q 8 6 12 6 Q 16 6 16 10 Q 16 12 14 14 V 22 Z" fill="#6E7F52"/><rect x="6" y="21" width="12" height="2" rx="1" fill="#8B6F4E"/></svg>',

    // Succulent — teal rosette
    succulent: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="8" rx="3" ry="4" fill="#5B8C7A"/><ellipse cx="12" cy="16" rx="3" ry="4" fill="#7BA99A"/><ellipse cx="6" cy="12" rx="3" ry="4" fill="#7BA99A"/><ellipse cx="18" cy="12" rx="3" ry="4" fill="#7BA99A"/><ellipse cx="8" cy="8" rx="2.5" ry="3.5" fill="#9BC4B5"/><ellipse cx="16" cy="8" rx="2.5" ry="3.5" fill="#9BC4B5"/><ellipse cx="8" cy="16" rx="2.5" ry="3.5" fill="#9BC4B5"/><ellipse cx="16" cy="16" rx="2.5" ry="3.5" fill="#9BC4B5"/></svg>',

    // Fern — feathered fronds
    fern: '<svg viewBox="0 0 24 24"><path d="M12 22 V 3" stroke="#4A5D3A" stroke-width="1.5"/><ellipse cx="8" cy="6" rx="3" ry="2" fill="#5B7A52" transform="rotate(-30 8 6)"/><ellipse cx="16" cy="6" rx="3" ry="2" fill="#5B7A52" transform="rotate(30 16 6)"/><ellipse cx="7" cy="11" rx="3.5" ry="2" fill="#6E8A62" transform="rotate(-30 7 11)"/><ellipse cx="17" cy="11" rx="3.5" ry="2" fill="#6E8A62" transform="rotate(30 17 11)"/><ellipse cx="6" cy="16" rx="4" ry="2" fill="#8B9A6E" transform="rotate(-30 6 16)"/><ellipse cx="18" cy="16" rx="4" ry="2" fill="#8B9A6E" transform="rotate(30 18 16)"/></svg>',

    // Lavender — purple sprig
    lavender: '<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2.2" fill="#9B7BB8"/><circle cx="10" cy="7" r="2" fill="#9B7BB8"/><circle cx="14" cy="7" r="2" fill="#9B7BB8"/><circle cx="12" cy="10" r="2.2" fill="#B596CC"/><circle cx="10" cy="13" r="2" fill="#B596CC"/><circle cx="14" cy="13" r="2" fill="#B596CC"/><circle cx="12" cy="16" r="2.2" fill="#9B7BB8"/><path d="M12 18 V 23" stroke="#4A5D3A" stroke-width="1.5"/></svg>',

    // Bamboo — two segmented stalks
    bamboo: '<svg viewBox="0 0 24 24"><rect x="9" y="2" width="2.5" height="20" fill="#A9B78C"/><rect x="14" y="4" width="2.5" height="18" fill="#8B9A6E"/><line x1="9" y1="7" x2="11.5" y2="7" stroke="#4A5D3A" stroke-width="1"/><line x1="9" y1="13" x2="11.5" y2="13" stroke="#4A5D3A" stroke-width="1"/><line x1="9" y1="19" x2="11.5" y2="19" stroke="#4A5D3A" stroke-width="1"/><line x1="14" y1="9" x2="16.5" y2="9" stroke="#4A5D3A" stroke-width="1"/><line x1="14" y1="15" x2="16.5" y2="15" stroke="#4A5D3A" stroke-width="1"/></svg>',

    // Palm — trunk and fronds
    palm: '<svg viewBox="0 0 24 24"><path d="M12 22 V 10" stroke="#8B6F4E" stroke-width="2.5" stroke-linecap="round"/><path d="M12 10 Q 6 8 4 4 Q 8 6 12 8 Z" fill="#4A5D3A"/><path d="M12 10 Q 18 8 20 4 Q 16 6 12 8 Z" fill="#4A5D3A"/><path d="M12 10 Q 8 4 10 2 Q 11 6 12 8 Z" fill="#5B7A52"/><path d="M12 10 Q 16 4 14 2 Q 13 6 12 8 Z" fill="#5B7A52"/></svg>'
  };

  function svgForSpecies(speciesId) {
    return SPECIES_SVGS[speciesId] || SPECIES_SVGS.monstera;
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
