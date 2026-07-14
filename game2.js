(function () {
  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let lockBoard = false;

  function buildSymbolPool() {
    const photoSymbols = (typeof state !== 'undefined' ? state.plants : [])
      .filter(p => p.photo)
      .map(p => ({ type: 'photo', value: p.photo, key: 'photo-' + p.id }));

    const emojiPool = (typeof SPECIES_DICTIONARY !== 'undefined' ? SPECIES_DICTIONARY : [])
      .filter(s => s.id !== 'other')
      .map(s => ({ type: 'emoji', value: s.emoji, key: 'emoji-' + s.id }));

    // shuffle emoji pool so repeated plays don't always show the same species
    for (let i = emojiPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emojiPool[i], emojiPool[j]] = [emojiPool[j], emojiPool[i]];
    }

    const needed = 8;
    const symbols = photoSymbols.slice(0, needed);
    let i = 0;
    while (symbols.length < needed && i < emojiPool.length) {
      symbols.push(emojiPool[i]);
      i++;
    }
    return symbols;
  }

  function openMemoryGame() {
    if (document.getElementById('memoryBackdrop')) return;
    const symbols = buildSymbolPool();
    cards = symbols.concat(symbols).map((s, idx) => ({ ...s, id: idx, isFlipped: false, isMatched: false }));
    // shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    flipped = [];
    matchedCount = 0;
    moves = 0;
    lockBoard = false;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'memoryBackdrop';
    backdrop.innerHTML = `
      <div class="modal memory-modal">
        <h3>Memory Match</h3>
        <div class="memory-hud">
          <span>Moves: <strong id="memoryMoves">0</strong></span>
          <span>Pairs: <strong id="memoryPairs">0</strong>/8</span>
        </div>
        <div class="memory-grid" id="memoryGrid"></div>
        <div class="modal-actions">
          <button class="secondary" id="closeMemory">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target.id === 'memoryBackdrop' || e.target.id === 'closeMemory') {
        backdrop.remove();
      }
    });

    renderGrid();
  }

  function renderGrid() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    grid.innerHTML = cards.map(c => `
      <div class="memory-card ${c.isFlipped || c.isMatched ? 'memory-card-flipped' : ''} ${c.isMatched ? 'memory-card-matched' : ''}" data-id="${c.id}">
        <div class="memory-card-inner">
          <div class="memory-card-back">🌿</div>
          <div class="memory-card-front">${c.type === 'photo' ? `<img src="${c.value}" alt="" class="memory-card-photo">` : c.value}</div>
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
    if (lockBoard) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    flipped.push(card);
    if (window.playCatchSound) window.playCatchSound();
    renderGrid();

    if (flipped.length === 2) {
      moves++;
      const movesEl = document.getElementById('memoryMoves');
      if (movesEl) movesEl.textContent = moves;
      lockBoard = true;

      const [a, b] = flipped;
      const isMatch = a.key === b.key;

      if (isMatch) {
        setTimeout(() => {
          a.isMatched = true;
          b.isMatched = true;
          matchedCount++;
          const pairsEl = document.getElementById('memoryPairs');
          if (pairsEl) pairsEl.textContent = matchedCount;
          flipped = [];
          lockBoard = false;
          renderGrid();
          const rect = document.querySelector(`.memory-card[data-id="${a.id}"]`)?.getBoundingClientRect();
          if (window.fireConfetti && rect) window.fireConfetti(rect.left, rect.top);

          if (matchedCount === 8) {
            setTimeout(() => showCompletion(), 400);
          }
        }, 400);
      } else {
        setTimeout(() => {
          a.isFlipped = false;
          b.isFlipped = false;
          flipped = [];
          lockBoard = false;
          renderGrid();
        }, 800);
      }
    }
  }

  function showCompletion() {
    const backdrop = document.getElementById('memoryBackdrop');
    if (!backdrop) return;
    if (window.recordMemoryGameCompletion) window.recordMemoryGameCompletion();

    const modal = backdrop.querySelector('.modal');
    modal.innerHTML = `
      <h3>All matched! 🌿</h3>
      <div class="game-result">
        <div class="game-result-score">${moves}</div>
        <div class="game-result-label">moves to clear the board</div>
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
