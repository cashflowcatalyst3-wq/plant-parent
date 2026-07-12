const VAPID_PUBLIC_KEY = 'BN4ieWQBco1u_esfncKASD5n51MKDrjGJoDafo4eJP7FwjzxIRUq-2xsJEGRoMzZ-tyipIrn8zh2Kzy1H5pukrQ';

const SPECIES_DICTIONARY = [
  { id: 'pothos', name: 'Pothos', latin: 'Epipremnum aureum', emoji: '🍃', light: 'Low to bright, indirect', freq: 7, desc: 'A hardy trailing vine that tolerates neglect and low light well. Let the soil dry out between waterings.' },
  { id: 'fiddle-leaf-fig', name: 'Fiddle-leaf Fig', latin: 'Ficus lyrata', emoji: '🌳', light: 'Bright, indirect', freq: 7, desc: 'Loves consistent bright light and dislikes being moved around. Sensitive to overwatering and drafts.' },
  { id: 'snake-plant', name: 'Snake Plant', latin: 'Sansevieria', emoji: '🗡️', light: 'Low to bright', freq: 14, desc: 'Extremely drought-tolerant with striking upright leaves. A forgiving choice for beginners.' },
  { id: 'monstera', name: 'Monstera', latin: 'Monstera deliciosa', emoji: '🌿', light: 'Bright, indirect', freq: 7, desc: 'Known for its iconic split leaves. Enjoys humidity and steady, moderate watering.' },
  { id: 'succulent', name: 'Succulent', latin: 'assorted species', emoji: '🌵', light: 'Bright, direct', freq: 18, desc: 'Stores water in thick leaves — thrives on bright sun and being left alone between waterings.' },
  { id: 'zz-plant', name: 'ZZ Plant', latin: 'Zamioculcas zamiifolia', emoji: '🪴', light: 'Low to medium', freq: 16, desc: 'Nearly indestructible. Tolerates low light and infrequent watering better than almost anything.' },
  { id: 'peace-lily', name: 'Peace Lily', latin: 'Spathiphyllum', emoji: '🌸', light: 'Low to medium', freq: 7, desc: 'Droops dramatically when thirsty, then perks right back up soon after watering — an easy read.' },
  { id: 'spider-plant', name: 'Spider Plant', latin: 'Chlorophytum comosum', emoji: '🕷️', light: 'Medium to bright', freq: 7, desc: 'Fast-growing and forgiving. Produces little plantlets you can snip off and propagate.' },
  { id: 'orchid', name: 'Orchid', latin: 'Phalaenopsis', emoji: '🌺', light: 'Bright, indirect', freq: 10, desc: 'Prefers infrequent, deep watering and good airflow around its roots rather than damp soil.' },
  { id: 'aloe', name: 'Aloe Vera', latin: 'Aloe vera', emoji: '🪴', light: 'Bright, direct', freq: 21, desc: 'A succulent with soothing gel inside its leaves. Water sparingly and let it dry out fully.' },
  { id: 'rubber-plant', name: 'Rubber Plant', latin: 'Ficus elastica', emoji: '🍂', light: 'Bright, indirect', freq: 9, desc: 'Glossy, sturdy leaves. Wiping them occasionally helps it photosynthesize better.' },
  { id: 'philodendron', name: 'Philodendron', latin: 'Philodendron spp.', emoji: '🌿', light: 'Medium, indirect', freq: 7, desc: 'Easygoing trailing or climbing plant, forgiving of inconsistent watering schedules.' },
  { id: 'cactus', name: 'Cactus', latin: 'assorted species', emoji: '🌵', light: 'Bright, direct', freq: 21, desc: 'Built for drought. Overwatering, not underwatering, is the most common way to lose one.' },
  { id: 'fern', name: 'Boston Fern', latin: 'Nephrolepis exaltata', emoji: '🌿', light: 'Medium, indirect', freq: 4, desc: 'Loves humidity and consistently moist — but never soggy — soil.' },
  { id: 'basil', name: 'Basil', latin: 'Ocimum basilicum', emoji: '🌱', light: 'Bright, direct', freq: 3, desc: 'A thirsty kitchen herb. Keep the soil consistently moist for the best flavor.' },
  { id: 'other', name: 'Other / not sure', latin: '', emoji: '❓', light: 'Varies', freq: 7, desc: '' },
];

const ACHIEVEMENTS = [
  { id: 'first-sprout', emoji: '🌱', name: 'First Sprout', desc: 'Add your first plant' },
  { id: 'full-shelf', emoji: '🪴', name: 'Full Shelf', desc: 'Grow your collection to 5 plants' },
  { id: 'botanical-garden', emoji: '🌳', name: 'Botanical Garden', desc: 'Grow your collection to 10 plants' },
  { id: 'green-thumb', emoji: '🔥', name: 'Green Thumb', desc: '7-day watering streak on one plant' },
  { id: 'plant-parent-pro', emoji: '🏆', name: 'Plant Parent Pro', desc: '30-day watering streak on one plant' },
  { id: 'note-taker', emoji: '📝', name: 'Note Taker', desc: 'Write your first plant note' },
  { id: 'snapshot', emoji: '📸', name: 'Snapshot', desc: 'Add a photo to a plant' },
  { id: 'stay-alert', emoji: '🔔', name: 'Stay Alert', desc: 'Turn on push reminders' },
  { id: 'rainmaker', emoji: '💧', name: 'Rainmaker', desc: 'Score 15+ in Raindrop Catch' },
  { id: 'sharpshooter', emoji: '🎯', name: 'Sharpshooter', desc: 'Score 25+ in Raindrop Catch' },
];

const DAILY_TASKS = [
  { id: 'water-one', emoji: '💧', label: 'Water any one plant today', check: (s) => s.plants.some(p => daysSince(p.lastWatered) === 0) },
  { id: 'play-game', emoji: '🎮', label: 'Play a round of Raindrop Catch', check: () => localStorage.getItem('plant-parent-last-game-date') === todayStr() },
  { id: 'write-note', emoji: '📝', label: 'Add or update a note on a plant', check: (s) => s.plants.some(p => p.notesUpdatedAt && p.notesUpdatedAt.slice(0,10) === todayStr()) },
  { id: 'visit-garden', emoji: '🌻', label: 'Visit your Garden view', check: () => localStorage.getItem('plant-parent-last-garden-date') === todayStr() },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / (1000*60*60*24));
}

function getTodayTask() {
  return DAILY_TASKS[dayOfYear() % DAILY_TASKS.length];
}

const state = {
  plants: [],
  activeId: null,
  showAddModal: false,
  showBadgesModal: false,
  showSpeciesPicker: false,
  notificationsEnabled: false,
  pendingModalPhoto: null, // dataURL waiting to be attached on save
  pendingSpecies: null, // selected SPECIES_DICTIONARY entry for the plant being added
  unlockedAchievements: [],
  gameHighScore: 0,
  celebrationQueue: [],
  currentView: 'shelf', // 'shelf' | 'garden' | 'dictionary'
};

let nextId = 1;

// ---------- date / ring math ----------

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000*60*60*24));
}

function daysBetween(aIso, bIso) {
  return Math.floor((new Date(bIso) - new Date(aIso)) / (1000*60*60*24));
}

function ringPercent(plant) {
  const elapsed = daysSince(plant.lastWatered);
  const pct = Math.min(1, elapsed / plant.frequency);
  return pct;
}

function daysLeft(plant) {
  const elapsed = daysSince(plant.lastWatered);
  return Math.max(0, plant.frequency - elapsed);
}

function ringColor(pct) {
  if (pct >= 1) return 'var(--clay)';
  if (pct >= 0.7) return 'var(--clay-light)';
  return 'var(--sage)';
}

function calcStreak(plant) {
  const log = plant.waterLog || [];
  if (log.length === 0) return 0;
  let streak = 1;
  for (let i = log.length - 1; i > 0; i--) {
    const gap = daysBetween(log[i-1], log[i]);
    if (gap <= plant.frequency + 2) streak++;
    else break;
  }
  return streak;
}

function moodEmoji(plant) {
  const pct = ringPercent(plant);
  if (pct >= 1) return '😢';
  if (pct >= 0.7) return '😌';
  return '🌿';
}

function recordGameScore(score) {
  if (score > state.gameHighScore) {
    state.gameHighScore = score;
    localStorage.setItem('plant-parent-game-highscore', String(score));
  }
  localStorage.setItem('plant-parent-last-game-date', todayStr());
  checkAchievements();
  render();
}

// ---------- sound effects ----------

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type, volume) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = volume ?? 0.1;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // audio not available — fail silently
  }
}

function playClickSound() { playTone(520, 0.07, 'sine', 0.07); }
function playWaterSound() {
  playTone(440, 0.09, 'sine', 0.09);
  setTimeout(() => playTone(660, 0.12, 'sine', 0.08), 60);
}
function playCatchSound() { playTone(900, 0.1, 'sine', 0.11); }
function playUnlockSound() {
  playTone(523, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 90);
  setTimeout(() => playTone(784, 0.16, 'sine', 0.1), 180);
}

document.addEventListener('click', (e) => {
  if (e.target.closest && e.target.closest('button.primary, button.secondary, button.pill-btn')) {
    playClickSound();
  }
}, true);

window.playCatchSound = playCatchSound;

// ---------- celebrations ----------

function fireConfetti(x, y) {
  const colors = ['#8DA377', '#C4D97A', '#B5613C', '#D99A7D', '#F6F3EC'];
  const originX = x ?? window.innerWidth / 2;
  const originY = y ?? window.innerHeight / 3;
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;
    piece.style.left = originX + 'px';
    piece.style.top = originY + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--dx', dx + 'px');
    piece.style.setProperty('--dy', dy + 'px');
    piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    piece.style.animationDelay = (Math.random() * 0.1) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1000);
  }
}

function checkAchievements() {
  const unlocked = new Set(state.unlockedAchievements);
  const newlyUnlocked = [];
  const unlock = (id) => { if (!unlocked.has(id)) { unlocked.add(id); newlyUnlocked.push(id); } };

  if (state.plants.length >= 1) unlock('first-sprout');
  if (state.plants.length >= 5) unlock('full-shelf');
  if (state.plants.length >= 10) unlock('botanical-garden');
  if (state.plants.some(p => calcStreak(p) >= 7)) unlock('green-thumb');
  if (state.plants.some(p => calcStreak(p) >= 30)) unlock('plant-parent-pro');
  if (state.plants.some(p => p.notes && p.notes.trim())) unlock('note-taker');
  if (state.plants.some(p => p.photo)) unlock('snapshot');
  if (state.notificationsEnabled) unlock('stay-alert');
  if (state.gameHighScore >= 15) unlock('rainmaker');
  if (state.gameHighScore >= 25) unlock('sharpshooter');

  if (newlyUnlocked.length) {
    state.unlockedAchievements = Array.from(unlocked);
    localStorage.setItem('plant-parent-achievements', JSON.stringify(state.unlockedAchievements));
    newlyUnlocked.forEach(id => state.celebrationQueue.push(id));
    showNextCelebration();
  }
}

function showNextCelebration() {
  if (document.getElementById('celebrationToast')) return; // one at a time
  const id = state.celebrationQueue.shift();
  if (!id) return;
  const badge = ACHIEVEMENTS.find(a => a.id === id);
  if (!badge) return;

  const toast = document.createElement('div');
  toast.id = 'celebrationToast';
  toast.className = 'celebration-toast';
  toast.innerHTML = `
    <div class="celebration-emoji">${badge.emoji}</div>
    <div class="celebration-text">
      <div class="celebration-title">Badge unlocked!</div>
      <div class="celebration-name">${badge.name}</div>
    </div>
  `;
  document.body.appendChild(toast);
  fireConfetti(window.innerWidth / 2, 100);
  playUnlockSound();

  setTimeout(() => {
    toast.classList.add('celebration-toast-out');
    setTimeout(() => {
      toast.remove();
      showNextCelebration();
    }, 300);
  }, 2400);
}

// ---------- rendering ----------

function render() {
  const app = document.getElementById('app');
  const active = state.plants.find(p => p.id === state.activeId);
  const task = getTodayTask();
  const taskDone = task.check(state);
  if (taskDone && localStorage.getItem('plant-parent-daily-celebrated') !== todayStr()) {
    localStorage.setItem('plant-parent-daily-celebrated', todayStr());
    setTimeout(() => { fireConfetti(window.innerWidth / 2, 80); playUnlockSound(); }, 100);
  }

  app.innerHTML = `
    <div class="app-shell">
      <nav class="sidebar">
        <div class="sidebar-brand">🌿</div>
        <button class="sidebar-btn ${state.currentView === 'shelf' ? 'sidebar-active' : ''}" id="navShelf">
          <span class="sidebar-icon">🪴</span><span class="sidebar-label">Plants</span>
        </button>
        <button class="sidebar-btn ${state.currentView === 'garden' ? 'sidebar-active' : ''}" id="navGarden">
          <span class="sidebar-icon">🌻</span><span class="sidebar-label">Garden</span>
        </button>
        <button class="sidebar-btn ${state.currentView === 'dictionary' ? 'sidebar-active' : ''}" id="navDictionary">
          <span class="sidebar-icon">📖</span><span class="sidebar-label">Guide</span>
        </button>
        <div class="sidebar-divider"></div>
        <button class="sidebar-btn sidebar-badges" id="navBadges">
          <span class="sidebar-icon">🏆</span><span class="sidebar-label">${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}</span>
        </button>
        <button class="sidebar-btn sidebar-game" id="navGame">
          <span class="sidebar-icon">🎮</span><span class="sidebar-label">Play</span>
        </button>
        <button class="sidebar-btn" id="navNotif">
          <span class="sidebar-icon">${state.notificationsEnabled ? '🔔' : '🔕'}</span><span class="sidebar-label">${state.notificationsEnabled ? 'On' : 'Remind'}</span>
        </button>
      </nav>

      <div class="main-content">
        <header>
          <h1>Plant Parent</h1>
          <div class="tagline">a shelf that keeps time for you</div>
        </header>

        <div class="daily-card ${taskDone ? 'daily-card-done' : ''}">
          <div class="daily-emoji">${taskDone ? '✅' : task.emoji}</div>
          <div class="daily-text">
            <div class="daily-label">Today's little thing</div>
            <div class="daily-task">${task.label}</div>
          </div>
        </div>

        ${state.currentView === 'garden' ? `<div id="gardenView"></div>` : ''}
        ${state.currentView === 'dictionary' ? `<div id="dictionaryView"></div>` : ''}
        ${state.currentView === 'shelf' ? `
          <div class="layout">
            <div class="shelf" id="shelf"></div>
            <div class="panel" id="panel"></div>
          </div>
        ` : ''}
      </div>
    </div>
    ${state.showAddModal ? renderModal() : ''}
    ${state.showBadgesModal ? renderBadgesModal() : ''}
    ${state.showSpeciesPicker ? renderSpeciesPicker() : ''}
  `;

  if (state.currentView === 'garden') {
    document.getElementById('gardenView').appendChild(renderGarden());
  } else if (state.currentView === 'dictionary') {
    document.getElementById('dictionaryView').appendChild(renderDictionary());
  } else {
    const shelf = document.getElementById('shelf');
    state.plants.forEach(p => shelf.appendChild(renderCard(p)));
    const addBtn = document.createElement('div');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+ Add a plant';
    addBtn.onclick = () => { state.pendingModalPhoto = null; state.pendingSpecies = null; state.showAddModal = true; render(); };
    shelf.appendChild(addBtn);

    const panel = document.getElementById('panel');
    panel.innerHTML = '';
    panel.appendChild(active ? renderDetail(active) : renderEmpty());
  }

  document.getElementById('navNotif').onclick = enableNotifications;
  document.getElementById('navBadges').onclick = () => { state.showBadgesModal = true; render(); };
  document.getElementById('navGame').onclick = () => { if (window.openMiniGame) window.openMiniGame(); };
  document.getElementById('navShelf').onclick = () => { state.currentView = 'shelf'; render(); };
  document.getElementById('navGarden').onclick = () => {
    state.currentView = 'garden';
    localStorage.setItem('plant-parent-last-garden-date', todayStr());
    checkAchievements();
    render();
  };
  document.getElementById('navDictionary').onclick = () => { state.currentView = 'dictionary'; render(); };

  if (state.showAddModal) {
    document.getElementById('modalNameInput')?.focus();
    wireModalPhoto();
    const openBtn = document.getElementById('openSpeciesPicker');
    if (openBtn) openBtn.onclick = () => { state.showSpeciesPicker = true; render(); };
  }
  if (state.showSpeciesPicker) {
    document.querySelectorAll('.species-picker-row').forEach(row => {
      row.onclick = () => {
        const entry = SPECIES_DICTIONARY.find(s => s.id === row.dataset.id);
        state.pendingSpecies = entry;
        state.showSpeciesPicker = false;
        render();
      };
    });
  }
}

function renderDictionary() {
  const div = document.createElement('div');
  div.className = 'dictionary-grid';
  div.innerHTML = SPECIES_DICTIONARY.filter(s => s.id !== 'other').map(s => `
    <div class="dictionary-card" data-id="${s.id}">
      <div class="dictionary-emoji">${s.emoji}</div>
      <div class="dictionary-name">${s.name}</div>
      ${s.latin ? `<div class="dictionary-latin">${s.latin}</div>` : ''}
      <div class="dictionary-light">☀️ ${s.light}</div>
      <div class="dictionary-desc">${s.desc}</div>
      <button class="secondary dictionary-add-btn" data-id="${s.id}">+ Add one like this</button>
    </div>
  `).join('');

  div.querySelectorAll('.dictionary-add-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const entry = SPECIES_DICTIONARY.find(s => s.id === btn.dataset.id);
      state.pendingSpecies = entry;
      state.pendingModalPhoto = null;
      state.showAddModal = true;
      render();
    };
  });

  return div;
}

function gardenTier(plant) {
  const pct = ringPercent(plant);
  const streak = calcStreak(plant);
  const score = (1 - pct) * 0.65 + Math.min(streak / 10, 1) * 0.35;
  if (score < 0.25) return { emoji: '🥀', size: 30, label: 'wilting' };
  if (score < 0.5) return { emoji: '🌱', size: 38, label: 'sprouting' };
  if (score < 0.75) return { emoji: '🌿', size: 48, label: 'growing' };
  if (score < 0.92) return { emoji: '🪴', size: 58, label: 'thriving' };
  return { emoji: '🌸', size: 64, label: 'blooming' };
}

function renderGarden() {
  const div = document.createElement('div');
  div.className = 'garden-scene';

  if (state.plants.length === 0) {
    div.innerHTML = `<div class="garden-empty">Your garden is empty — add a plant to watch it grow here.</div>`;
    return div;
  }

  const avgScore = state.plants.reduce((sum, p) => {
    const pct = ringPercent(p);
    const streak = calcStreak(p);
    return sum + ((1 - pct) * 0.65 + Math.min(streak / 10, 1) * 0.35);
  }, 0) / state.plants.length;

  let summary;
  if (avgScore >= 0.75) summary = '🌻 Your garden is flourishing!';
  else if (avgScore >= 0.45) summary = '🌿 Your garden is doing alright.';
  else summary = '💧 A few plants could use some water.';

  div.innerHTML = `
    <div class="garden-summary">${summary}</div>
    <div class="garden-bed">
      ${state.plants.map(p => {
        const tier = gardenTier(p);
        return `
          <div class="garden-plant" data-id="${p.id}" title="${p.name} — ${tier.label}">
            <div class="garden-plant-emoji" style="font-size:${tier.size}px;">${tier.emoji}</div>
            <div class="garden-plant-name">${p.name}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="garden-ground"></div>
  `;

  div.querySelectorAll('.garden-plant').forEach(el => {
    el.onclick = () => {
      state.activeId = parseInt(el.dataset.id, 10);
      state.currentView = 'shelf';
      render();
    };
  });

  return div;
}

function renderBadgesModal() {
  return `
  <div class="modal-backdrop" id="badgesBackdrop">
    <div class="modal badges-modal">
      <h3>Your badges</h3>
      <div class="badges-grid">
        ${ACHIEVEMENTS.map(a => {
          const unlocked = state.unlockedAchievements.includes(a.id);
          return `
            <div class="badge-item ${unlocked ? '' : 'badge-locked'}">
              <div class="badge-emoji">${unlocked ? a.emoji : '🔒'}</div>
              <div class="badge-name">${a.name}</div>
              <div class="badge-desc">${a.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="modal-actions">
        <button class="primary" id="closeBadges">Close</button>
      </div>
    </div>
  </div>`;
}

function ringPortrait(p, size, strokeWidth) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = ringPercent(p);
  const offset = c * (1 - pct);
  const photoSize = size - strokeWidth * 2.6;
  const inner = p.photo
    ? `<img src="${p.photo}" class="ring-photo" style="width:${photoSize}px;height:${photoSize}px;">`
    : `<div class="ring-photo ring-photo-placeholder" style="width:${photoSize}px;height:${photoSize}px;font-size:${photoSize*0.4}px;">🌱</div>`;
  return `
    <div class="ring-wrap" style="width:${size}px;height:${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${strokeWidth}"></circle>
        <circle class="ring-fg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${strokeWidth}"
          stroke="${ringColor(pct)}"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}"></circle>
      </svg>
      ${inner}
    </div>
  `;
}

function renderCard(p) {
  const div = document.createElement('div');
  div.className = 'plant-card' + (p.id === state.activeId ? ' active' : '');
  const left = daysLeft(p);
  div.innerHTML = `
    ${ringPortrait(p, 54, 5)}
    <div class="info">
      <p class="name">${p.name} <span class="mood">${moodEmoji(p)}</span></p>
      <div class="species">${p.species || 'unlabeled'}</div>
    </div>
    <div class="days-badge">${left === 0 ? 'today!' : left + 'd'}</div>
  `;
  div.onclick = () => { state.activeId = p.id; render(); };
  return div;
}

function renderEmpty() {
  const div = document.createElement('div');
  div.className = 'empty-panel';
  div.innerHTML = `
    <svg class="big-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--sage)" stroke-width="6" stroke-dasharray="8 10"/></svg>
    <div style="font-family:'Fraunces',serif;font-size:18px;">No plant selected</div>
    <div style="font-size:13px;">Add one, or tap a plant on the shelf.</div>
  `;
  return div;
}

function renderDetail(p) {
  const div = document.createElement('div');
  const left = daysLeft(p);
  const streak = calcStreak(p);
  const log = (p.waterLog || []).slice(-5).reverse();

  div.innerHTML = `
    <div class="detail-header">
      <div class="detail-ring-click" id="detailRingClick">
        ${ringPortrait(p, 120, 8)}
      </div>
      <input type="file" id="detailPhotoInput" accept="image/*" capture="environment" style="display:none;">
      <div class="detail-title">
        <h2>${p.name} <span class="mood">${moodEmoji(p)}</span></h2>
        <div class="species">${p.species || 'species unlabeled'}</div>
        <div class="row-actions">
          <button class="primary" id="waterBtn">Water now</button>
          <button class="secondary" id="removeBtn">Remove plant</button>
        </div>
      </div>
    </div>

    <div class="section-label">care rhythm</div>
    <div style="font-size:14px;color:var(--soil);">
      Watered every <strong style="color:var(--ink)">${p.frequency} days</strong> ·
      last watered ${daysSince(p.lastWatered)} day${daysSince(p.lastWatered)===1?'':'s'} ago ·
      ${left} day${left===1?'':'s'} left
    </div>

    <div class="section-label">notes</div>
    <textarea class="notes-input" id="notesInput" placeholder="e.g. repot in spring, keep away from cold drafts…">${p.notes || ''}</textarea>
    ${p.speciesDesc ? `<div class="species-desc">🌿 <strong>${p.species}:</strong> ${p.speciesDesc}</div>` : ''}

    <div class="section-label">streak</div>
    <div class="streak-row">
      <span class="streak-count">${streak}</span>
      <span class="streak-label">on-time watering${streak===1?'':'s'} in a row</span>
    </div>

    <div class="section-label">history</div>
    ${log.length ? `
      <ul class="history-list">
        ${log.map(iso => `<li>${formatHistoryDate(iso)}</li>`).join('')}
      </ul>
    ` : `<div style="font-size:13px;color:var(--soil);">No waterings logged yet.</div>`}
  `;

  div.querySelector('#waterBtn').onclick = (e) => {
    p.lastWatered = new Date().toISOString();
    p.waterLog = p.waterLog || [];
    p.waterLog.push(p.lastWatered);
    if (p.waterLog.length > 30) p.waterLog = p.waterLog.slice(-30);
    const rect = e.target.getBoundingClientRect();
    fireConfetti(rect.left + rect.width / 2, rect.top);
    playWaterSound();
    render();
    savePlants();
  };
  div.querySelector('#removeBtn').onclick = () => {
    state.plants = state.plants.filter(x => x.id !== p.id);
    state.activeId = null;
    render();
    savePlants();
  };

  const photoInput = div.querySelector('#detailPhotoInput');
  div.querySelector('#detailRingClick').onclick = () => photoInput.click();
  photoInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    p.photo = await resizeImageToDataUrl(file, 300);
    render();
    savePlants();
  };

  const notesInput = div.querySelector('#notesInput');
  notesInput.addEventListener('blur', () => {
    p.notes = notesInput.value;
    p.notesUpdatedAt = new Date().toISOString();
    savePlants();
  });

  return div;
}

function formatHistoryDate(iso) {
  const d = new Date(iso);
  const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const ago = daysSince(iso);
  const agoText = ago === 0 ? 'today' : ago === 1 ? '1 day ago' : `${ago} days ago`;
  return `${label} — ${agoText}`;
}

function renderModal() {
  const preview = state.pendingModalPhoto
    ? `<img src="${state.pendingModalPhoto}" class="modal-photo-preview">`
    : '';
  const species = state.pendingSpecies;
  return `
  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal">
      <h3>Add a plant</h3>
      <div class="field">
        <label>Photo (optional)</label>
        <button class="id-photo-btn" id="modalPhotoBtn" type="button">📷 ${state.pendingModalPhoto ? 'Change photo' : 'Add a photo'}</button>
        <input type="file" id="modalPhotoInput" accept="image/*" capture="environment" style="display:none;">
        ${preview}
      </div>
      <div class="field">
        <label>Name</label>
        <input id="modalNameInput" placeholder="e.g. Fig in the corner">
      </div>
      <div class="field">
        <label>Species</label>
        <button class="species-picker-btn" id="openSpeciesPicker" type="button">
          ${species ? `<span class="species-picker-emoji">${species.emoji}</span> ${species.name}` : '🔍 Choose from the guide (optional)'}
        </button>
      </div>
      <div class="field">
        <label>Water every how many days?</label>
        <input id="modalFreqInput" type="number" min="1" value="${species ? species.freq : 7}">
        <div class="freq-hint">Most houseplants: 5–10 days. Succulents: 14–21.</div>
      </div>
      <div class="modal-actions">
        <button class="secondary" id="cancelModal">Cancel</button>
        <button class="primary" id="saveModal">Add plant</button>
      </div>
    </div>
  </div>`;
}

function renderSpeciesPicker() {
  return `
  <div class="modal-backdrop" id="speciesPickerBackdrop">
    <div class="modal species-picker-modal">
      <h3>Choose a species</h3>
      <div class="species-picker-list">
        ${SPECIES_DICTIONARY.map(s => `
          <div class="species-picker-row" data-id="${s.id}">
            <span class="species-picker-row-emoji">${s.emoji}</span>
            <div>
              <div class="species-picker-row-name">${s.name}</div>
              ${s.latin ? `<div class="species-picker-row-latin">${s.latin}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="modal-actions">
        <button class="secondary" id="cancelSpeciesPicker">Cancel</button>
      </div>
    </div>
  </div>`;
}

function wireModalPhoto() {
  const btn = document.getElementById('modalPhotoBtn');
  const input = document.getElementById('modalPhotoInput');
  if (!btn || !input) return;
  btn.onclick = () => input.click();
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    state.pendingModalPhoto = await resizeImageToDataUrl(file, 300);
    render();
  };
}

// ---------- image handling ----------

function resizeImageToDataUrl(file, maxDim) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- add / cancel plant ----------

document.addEventListener('click', (e) => {
  if (e.target.id === 'modalBackdrop') { state.showAddModal = false; render(); }
  if (e.target.id === 'cancelModal') { state.showAddModal = false; render(); }
  if (e.target.id === 'badgesBackdrop') { state.showBadgesModal = false; render(); }
  if (e.target.id === 'closeBadges') { state.showBadgesModal = false; render(); }
  if (e.target.id === 'speciesPickerBackdrop') { state.showSpeciesPicker = false; render(); }
  if (e.target.id === 'cancelSpeciesPicker') { state.showSpeciesPicker = false; render(); }
  if (e.target.id === 'saveModal') {
    const name = document.getElementById('modalNameInput').value.trim();
    const freq = parseInt(document.getElementById('modalFreqInput').value, 10) || 7;
    if (!name) return;
    const species = state.pendingSpecies;
    const now = new Date(Date.now() - (freq-1)*24*60*60*1000).toISOString();
    const p = {
      id: nextId++,
      name,
      species: species ? species.name : '',
      speciesId: species ? species.id : null,
      speciesDesc: species ? species.desc : '',
      frequency: freq,
      lastWatered: now,
      waterLog: [],
      photo: state.pendingModalPhoto || null,
      notes: ''
    };
    state.plants.push(p);
    state.activeId = p.id;
    state.showAddModal = false;
    state.pendingModalPhoto = null;
    state.pendingSpecies = null;
    render();
    savePlants();
  }
});

// ---------- persistence ----------

function getDeviceId() {
  let id = localStorage.getItem('plant-parent-device-id');
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
    localStorage.setItem('plant-parent-device-id', id);
  }
  return id;
}

function savePlants() {
  try {
    localStorage.setItem('plant-parent-plants', JSON.stringify(state.plants));
  } catch (err) {
    console.error('Could not save plants locally', err);
  }
  checkAchievements();
  syncToServer();
}

function loadPlants() {
  try {
    const raw = localStorage.getItem('plant-parent-plants');
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length) {
        state.plants = saved;
        nextId = Math.max(...saved.map(p => p.id)) + 1;
        return true;
      }
    }
  } catch (err) {
    // no saved plants yet
  }
  return false;
}

async function syncToServer() {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: getDeviceId(), plants: state.plants })
    });
  } catch (err) {
    // offline or backend not deployed yet — local storage still has the data
  }
}

// ---------- push notifications ----------

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function enableNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert("This browser doesn't support push notifications.");
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Notifications were not enabled. You can allow them later from your browser settings.');
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: getDeviceId(), subscription })
    });
    await syncToServer();
    state.notificationsEnabled = true;
    localStorage.setItem('plant-parent-notifications-enabled', '1');
    checkAchievements();
    render();
  } catch (err) {
    console.error(err);
    alert("Couldn't turn on reminders. Try again in a bit.");
  }
}

// ---------- startup ----------

const loaded = loadPlants();
if (!loaded) {
  const fig = SPECIES_DICTIONARY.find(s => s.id === 'fiddle-leaf-fig');
  const pothos = SPECIES_DICTIONARY.find(s => s.id === 'pothos');
  state.plants.push(
    { id: nextId++, name: 'Fig in the corner', species: fig.name, speciesId: fig.id, speciesDesc: fig.desc, frequency: 7, lastWatered: new Date(Date.now() - 5*24*60*60*1000).toISOString(), waterLog: [], photo: null },
    { id: nextId++, name: 'Kitchen pothos', species: pothos.name, speciesId: pothos.id, speciesDesc: pothos.desc, frequency: 6, lastWatered: new Date(Date.now() - 6*24*60*60*1000).toISOString(), waterLog: [], photo: null }
  );
  savePlants();
}
state.activeId = state.plants[0]?.id ?? null;
state.notificationsEnabled = localStorage.getItem('plant-parent-notifications-enabled') === '1';
try {
  state.unlockedAchievements = JSON.parse(localStorage.getItem('plant-parent-achievements') || '[]');
} catch (err) {
  state.unlockedAchievements = [];
}
state.gameHighScore = parseInt(localStorage.getItem('plant-parent-game-highscore') || '0', 10) || 0;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.error('SW registration failed', err));
}

render();
