  // SVG map for each species (matches SPECIES_DICTIONARY ids)
  const SPECIES_SVGS = {
    pothos: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/></svg>',
    monstera: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 21V11"/><path d="M12 11C12 11 6 11 6 5C12 5 12 11 12 11Z"/><path d="M12 13C12 13 18 13 18 7C12 7 12 13 12 13Z"/></svg>',
    succulent: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><circle cx="12" cy="12" r="4"/><circle cx="6" cy="15" r="3"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="7" r="3"/></svg>',
    cactus: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><rect x="10" y="6" width="4" height="14" rx="2"/><rect x="6" y="10" width="4" height="6" rx="2"/><rect x="14" y="8" width="4" height="7" rx="2"/></svg>',
    'snake-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M8 20 Q6 12 10 4 Q12 12 12 20 Z"/><path d="M12 20 Q12 12 16 4 Q18 12 16 20 Z"/></svg>',
    'peace-lily': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 20V11"/><path d="M12 11 C 8 11 6 8 6 4 C 10 4 12 7 12 11 Z"/><path d="M12 11 C 16 11 18 8 18 4 C 14 4 12 7 12 11 Z"/><circle cx="12" cy="8" r="2" fill="#E8B84B"/></svg>',
    'spider-plant': '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 20V4"/><path d="M8 20 Q6 12 4 6"/><path d="M16 20 Q18 12 20 6"/><path d="M10 20 Q8 14 6 10"/><path d="M14 20 Q16 14 18 10"/></svg>',
    fern: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 22V4"/><path d="M12 8 L8 5"/><path d="M12 8 L16 5"/><path d="M12 12 L7 9"/><path d="M12 12 L17 9"/><path d="M12 16 L8 13"/><path d="M12 16 L16 13"/></svg>',
    aloe: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><path d="M12 22 Q10 12 12 4 Q14 12 12 22 Z"/><path d="M12 22 Q6 14 6 8 Q10 12 12 22 Z"/><path d="M12 22 Q18 14 18 8 Q14 12 12 22 Z"/></svg>',
    orchid: '<svg viewBox="0 0 24 24" fill="#C97B63"><circle cx="12" cy="10" r="4"/><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="10" r="1.5" fill="#E8B84B"/></svg>',
    calathea: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><ellipse cx="12" cy="12" rx="6" ry="9"/><path d="M12 3 V 21" stroke="#F7F2EB" stroke-width="1"/></svg>',
    basil: '<svg viewBox="0 0 24 24" fill="#8B9A6E"><ellipse cx="9" cy="10" rx="4" ry="6" transform="rotate(-20 9 10)"/><ellipse cx="15" cy="10" rx="4" ry="6" transform="rotate(20 15 10)"/><path d="M12 22 V 14"/></svg>'
  };

  function svgForSpecies(speciesId) {
    return SPECIES_SVGS[speciesId] || SPECIES_SVGS.pothos;
  }

  function buildDeck(pairs) {
    const pool = (typeof SPECIES_DICTIONARY !== 'undefined' ? SPECIES_DICTIONARY : [])
      .filter(s => s.id !== 'other' && SPECIES_SVGS[s.id]);
    const unique = Array.from(new Set(pool.map(s => s.id)));
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    const chosen = unique.slice(0, pairs);
    const deck = chosen.concat(chosen).map((speciesId, idx) => ({
      key: speciesId, speciesId, id: idx, isFlipped: false, isMatched: false
    }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function renderGrid() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    grid.innerHTML = cards.map(c => `
      <div class="memory-card ${c.isFlipped || c.isMatched ? 'memory-card-flipped' : ''} ${c.isMatched ? 'memory-card-matched' : ''}" data-id="${c.id}">
        <div class="memory-card-inner">
          <div class="memory-card-back">${'<svg viewBox="0 0 24 24" fill="#fff"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/></svg>'}</div>
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
