const APP_LOAD_START = Date.now();

const VAPID_PUBLIC_KEY = 'BN4ieWQBco1u_esfncKASD5n51MKDrjGJoDafo4eJP7FwjzxIRUq-2xsJEGRoMzZ-tyipIrn8zh2Kzy1H5pukrQ';

const SPECIES_DICTIONARY = [
  { id: 'pothos', name: 'Pothos', latin: 'Epipremnum aureum', emoji: '🍃', shape: 'trailing', light: 'Low to bright, indirect', freq: 7, desc: 'A hardy trailing vine that tolerates neglect and low light well. Let the soil dry out between waterings.' },
  { id: 'fiddle-leaf-fig', name: 'Fiddle-leaf Fig', latin: 'Ficus lyrata', emoji: '🌳', shape: 'broad-leaf', light: 'Bright, indirect', freq: 7, desc: 'Loves consistent bright light and dislikes being moved around. Sensitive to overwatering and drafts.' },
  { id: 'snake-plant', name: 'Snake Plant', latin: 'Sansevieria', emoji: '🗡️', shape: 'spiky', light: 'Low to bright', freq: 14, desc: 'Extremely drought-tolerant with striking upright leaves. A forgiving choice for beginners.' },
  { id: 'monstera', name: 'Monstera', latin: 'Monstera deliciosa', emoji: '🌿', shape: 'split-leaf', light: 'Bright, indirect', freq: 7, desc: 'Known for its iconic split leaves. Enjoys humidity and steady, moderate watering.' },
  { id: 'succulent', name: 'Succulent', latin: 'assorted species', emoji: '🌵', shape: 'rosette', light: 'Bright, direct', freq: 18, desc: 'Stores water in thick leaves — thrives on bright sun and being left alone between waterings.' },
  { id: 'zz-plant', name: 'ZZ Plant', latin: 'Zamioculcas zamiifolia', emoji: '🪴', shape: 'tall-cane', light: 'Low to medium', freq: 16, desc: 'Nearly indestructible. Tolerates low light and infrequent watering better than almost anything.' },
  { id: 'peace-lily', name: 'Peace Lily', latin: 'Spathiphyllum', emoji: '🌸', shape: 'flower', accent: '#F7F4EA', light: 'Low to medium', freq: 7, desc: 'Droops dramatically when thirsty, then perks right back up soon after watering — an easy read.' },
  { id: 'spider-plant', name: 'Spider Plant', latin: 'Chlorophytum comosum', emoji: '🕷️', shape: 'spider', light: 'Medium to bright', freq: 7, desc: 'Fast-growing and forgiving. Produces little plantlets you can snip off and propagate.' },
  { id: 'orchid', name: 'Orchid', latin: 'Phalaenopsis', emoji: '🌺', shape: 'flower', accent: '#D17BA8', light: 'Bright, indirect', freq: 10, desc: 'Prefers infrequent, deep watering and good airflow around its roots rather than damp soil.' },
  { id: 'aloe', name: 'Aloe Vera', latin: 'Aloe vera', emoji: '🪴', shape: 'spiky', light: 'Bright, direct', freq: 21, desc: 'A succulent with soothing gel inside its leaves. Water sparingly and let it dry out fully.' },
  { id: 'rubber-plant', name: 'Rubber Plant', latin: 'Ficus elastica', emoji: '🍂', shape: 'broad-leaf', light: 'Bright, indirect', freq: 9, desc: 'Glossy, sturdy leaves. Wiping them occasionally helps it photosynthesize better.' },
  { id: 'philodendron', name: 'Philodendron', latin: 'Philodendron spp.', emoji: '🌿', shape: 'trailing', light: 'Medium, indirect', freq: 7, desc: 'Easygoing trailing or climbing plant, forgiving of inconsistent watering schedules.' },
  { id: 'cactus', name: 'Cactus', latin: 'assorted species', emoji: '🌵', shape: 'cactus', light: 'Bright, direct', freq: 21, desc: 'Built for drought. Overwatering, not underwatering, is the most common way to lose one.' },
  { id: 'fern', name: 'Boston Fern', latin: 'Nephrolepis exaltata', emoji: '🌿', shape: 'fern', light: 'Medium, indirect', freq: 4, desc: 'Loves humidity and consistently moist — but never soggy — soil.' },
  { id: 'basil', name: 'Basil', latin: 'Ocimum basilicum', emoji: '🌱', shape: 'herb', light: 'Bright, direct', freq: 3, desc: 'A thirsty kitchen herb. Keep the soil consistently moist for the best flavor.' },
  { id: 'bird-of-paradise', name: 'Bird of Paradise', latin: 'Strelitzia reginae', emoji: '🦩', shape: 'fan', light: 'Bright, direct to indirect', freq: 8, desc: 'A dramatic statement plant with large paddle leaves. Likes generous space and regular feeding.' },
  { id: 'calathea', name: 'Calathea', latin: 'Calathea spp.', emoji: '🎋', shape: 'broad-leaf', patterned: true, light: 'Medium, indirect', freq: 6, desc: 'Prized for patterned leaves that fold up at night. Fussy about humidity and water quality.' },
  { id: 'jade-plant', name: 'Jade Plant', latin: 'Crassula ovata', emoji: '🪙', shape: 'branching', light: 'Bright, direct', freq: 16, desc: 'A classic succulent that can live for decades. Let it dry out fully between waterings.' },
  { id: 'dracaena', name: 'Dracaena', latin: 'Dracaena spp.', emoji: '🌴', shape: 'tall-cane', light: 'Low to bright, indirect', freq: 10, desc: 'Tall and architectural, tolerant of a wide range of light. Sensitive to fluoride in tap water.' },
  { id: 'croton', name: 'Croton', latin: 'Codiaeum variegatum', emoji: '🍁', shape: 'broad-leaf', accent: '#C9622E', light: 'Bright, direct', freq: 6, desc: 'Bold, colorful leaves that need strong light to keep their vivid patterns.' },
  { id: 'anthurium', name: 'Anthurium', latin: 'Anthurium andraeanum', emoji: '❤️', shape: 'flower', accent: '#D94F4F', light: 'Bright, indirect', freq: 8, desc: 'Glossy, heart-shaped blooms. Likes humidity and to dry slightly between waterings.' },
  { id: 'chinese-money-plant', name: 'Chinese Money Plant', latin: 'Pilea peperomioides', emoji: '🪙', shape: 'coin', light: 'Bright, indirect', freq: 7, desc: 'Round coin-like leaves on a plant that\'s easy to propagate and share with friends.' },
  { id: 'air-plant', name: 'Air Plant', latin: 'Tillandsia spp.', emoji: '🌬️', shape: 'airplant', light: 'Bright, indirect', freq: 7, desc: 'No soil needed — mist or soak occasionally instead of traditional watering.' },
  { id: 'christmas-cactus', name: 'Christmas Cactus', latin: 'Schlumbergera', emoji: '🎄', shape: 'cactus', accent: '#E07BA0', light: 'Bright, indirect', freq: 10, desc: 'Unlike desert cacti, this one prefers slightly moist soil and blooms in winter.' },
  { id: 'english-ivy', name: 'English Ivy', latin: 'Hedera helix', emoji: '🍇', shape: 'trailing', light: 'Medium, indirect', freq: 6, desc: 'A fast, trailing climber. Keep soil lightly moist and give it room to spread.' },
  { id: 'prayer-plant', name: 'Prayer Plant', latin: 'Maranta leuconeura', emoji: '🙏', shape: 'broad-leaf', patterned: true, light: 'Medium, indirect', freq: 6, desc: 'Leaves fold up like praying hands at night. Enjoys humidity and consistent moisture.' },
  { id: 'hoya', name: 'Hoya', latin: 'Hoya carnosa', emoji: '💫', shape: 'trailing', accent: '#F2C6D9', light: 'Bright, indirect', freq: 12, desc: 'Waxy leaves and star-shaped, fragrant blooms. Prefers to dry out well between waterings.' },
  { id: 'other', name: 'Other / not sure', latin: '', emoji: '❓', shape: null, light: 'Varies', freq: 7, desc: '' },
];

const THEMES = [
  { id: 'sage', name: 'Sage', sage: '#8DA377', sageLight: '#C4D97A', clay: '#B5613C', clayLight: '#D99A7D' },
  { id: 'terracotta', name: 'Terracotta', sage: '#C17A4E', sageLight: '#E0A97E', clay: '#5B7A9B', clayLight: '#8FAFC9' },
  { id: 'lavender', name: 'Lavender', sage: '#9B87C4', sageLight: '#C7B8E0', clay: '#C46B87', clayLight: '#E0A0B4' },
  { id: 'ocean', name: 'Ocean', sage: '#4E8FA6', sageLight: '#8FC1D4', clay: '#D9935E', clayLight: '#EFC08F' },
  { id: 'blush', name: 'Blush', sage: '#C9748A', sageLight: '#E5AEBB', clay: '#7A9B6E', clayLight: '#A8C49C' },
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
  { id: 'rainmaker', emoji: '💧', name: 'Rainmaker', desc: 'Score 30+ in Raindrop Catch' },
  { id: 'sharpshooter', emoji: '🎯', name: 'Sharpshooter', desc: 'Score 50+ in Raindrop Catch' },
  { id: 'memory-master', emoji: '🧠', name: 'Memory Master', desc: 'Complete a round of Memory Match' },
  { id: 'memory-whiz', emoji: '🧩', name: 'Memory Whiz', desc: 'Score 300+ in Memory Match' },
  { id: 'community-builder', emoji: '🤝', name: 'Community Builder', desc: 'Invite a friend to Plant Parent' },
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
  showMoreMenu: false,
  notificationsEnabled: false,
  pendingModalPhoto: null, // dataURL waiting to be attached on save
  pendingSpecies: null, // selected SPECIES_DICTIONARY entry for the plant being added
  identifyLoading: false,
  identifyResults: null,
  identifyError: null,
  editingPlantId: null, // if set, the Add Plant modal is in edit mode for this plant
  modalDraft: null, // preserves typed name/room/freq across re-renders (e.g. opening the species picker)
  unlockedAchievements: [],
  gameHighScore: 0,
  celebrationQueue: [],
  currentView: 'shelf', // 'shelf' | 'garden' | 'dictionary'
  sortBy: 'urgent', // 'urgent' | 'az' | 'room'
  filterRoom: null, // null = all rooms
  weatherEnabled: false,
  soundEnabled: true,
  weatherNudge: null, // { text, emoji } once fetched
  seasonalTipsEnabled: true,
  latitude: null, // reused from weather geolocation, if granted, to guess hemisphere
  mobileDetailOpen: false,
  dictionarySearch: '',
  dictionaryLightFilter: null,
  dictionaryPage: 1,
  theme: 'sage',
  darkMode: false,
  showThemeModal: false,
  propagations: [],
  showAddPropModal: false,
  showCheckinModal: false,
  checkinPlantId: null,
  checkinDraftMood: null,
  showLeaderboardModal: false,
  leaderboardTab: 'streak', // 'streak' | 'plants'
  leaderboardJoined: false,
  leaderboardNickname: '',
  leaderboardData: { streaks: [], plants: [], raindrop: [], memory: [] },
  leaderboardLoading: false,
  leaderboardError: null,
  memoryGameCompleted: false,
  memoryHighScore: 0,
  showInviteModal: false,
  showAboutModal: false,
  showWelcome: false,
  hasInvited: false,
  confirmDeletePlantId: null,
  lastDeletedPlant: null,
  lastDeletedIndex: null,
  syncCode: null,
  showSyncModal: false,
  syncStatus: null, // transient status message shown in the sync modal
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

function fertilizeDaysLeft(p) {
  if (!p.lastFertilized) return null;
  const freq = p.fertilizeFrequency || 21;
  return freq - daysSince(p.lastFertilized);
}

function rotateDaysLeft(p) {
  if (!p.lastRotated) return null;
  const freq = p.rotateFrequency || 7;
  return freq - daysSince(p.lastRotated);
}

const MOOD_LABELS = {
  thriving: '🌿 Thriving',
  okay: '😐 Okay',
  struggling: '😟 Struggling',
  recovering: '🌱 Recovering',
};
function moodLabel(mood) {
  return MOOD_LABELS[mood] || mood;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRoomList() {
  const rooms = new Set();
  state.plants.forEach(p => { if (p.room && p.room.trim()) rooms.add(p.room.trim()); });
  return Array.from(rooms).sort();
}

function renderShelfOverviewStrip() {
  const dueToday = state.plants.filter(p => daysLeft(p) === 0).length;
  const thriving = state.plants.filter(p => ringPercent(p) < 0.5).length;
  const bestStreak = state.plants.reduce((max, p) => Math.max(max, calcStreak(p)), 0);

  return `
    <div class="shelf-overview">
      <div class="shelf-overview-hero ${dueToday > 0 ? 'shelf-overview-hero-urgent' : ''}">
        <div class="shelf-overview-hero-num">${dueToday}</div>
        <div class="shelf-overview-hero-label">${dueToday === 1 ? 'plant needs' : 'plants need'} water today</div>
      </div>
      <div class="shelf-overview-side">
        <div class="shelf-overview-mini">
          <span class="shelf-overview-mini-num">${thriving}</span>
          <span class="shelf-overview-mini-label">thriving</span>
        </div>
        <div class="shelf-overview-mini">
          <span class="shelf-overview-mini-num">${bestStreak}</span>
          <span class="shelf-overview-mini-label">best streak</span>
        </div>
      </div>
    </div>
  `;
}

function getVisiblePlants() {
  let list = state.plants.slice();
  if (state.filterRoom) {
    list = list.filter(p => (p.room || '').trim() === state.filterRoom);
  }
  if (state.sortBy === 'az') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.sortBy === 'room') {
    list.sort((a, b) => (a.room || 'zzz').localeCompare(b.room || 'zzz') || a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => daysLeft(a) - daysLeft(b));
  }
  return list;
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
    if (state.leaderboardJoined && typeof refreshMyLeaderboardStats === 'function') refreshMyLeaderboardStats();
  }
  localStorage.setItem('plant-parent-last-game-date', todayStr());
  checkAchievements();
  render();
}

function recordMemoryGameCompletion() {
  state.memoryGameCompleted = true;
  localStorage.setItem('plant-parent-memory-completed', '1');
  localStorage.setItem('plant-parent-last-game-date', todayStr());
  checkAchievements();
  render();
}

function recordMemoryGameScore(score) {
  if (score > state.memoryHighScore) {
    state.memoryHighScore = score;
    localStorage.setItem('plant-parent-memory-highscore', String(score));
    if (state.leaderboardJoined && typeof refreshMyLeaderboardStats === 'function') refreshMyLeaderboardStats();
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
  if (typeof state !== 'undefined' && state.soundEnabled === false) return;
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
  if (state.gameHighScore >= 30) unlock('rainmaker');
  if (state.gameHighScore >= 50) unlock('sharpshooter');
  if (state.memoryGameCompleted) unlock('memory-master');
  if (state.memoryHighScore >= 300) unlock('memory-whiz');
  if (state.hasInvited) unlock('community-builder');

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

// ---------- welcome screen ----------

function renderWelcome() {
  return `
  <div class="welcome-backdrop" id="welcomeBackdrop">
    <div class="welcome-card">
      <div class="welcome-flourish">🌿</div>
      <h2 class="welcome-title">Plant Parent</h2>
      <p class="welcome-subtitle">a shelf that keeps time for you</p>
      <div class="welcome-features">
        <div class="welcome-feature"><span>💧</span> Watering rings that never let a plant slip your mind</div>
        <div class="welcome-feature"><span>🌻</span> A garden that visibly grows the better you care for it</div>
        <div class="welcome-feature"><span>📖</span> A species guide with care tips for 27 common houseplants</div>
        <div class="welcome-feature"><span>🏆</span> Achievements, streaks, and a couple of mini-games</div>
        <div class="welcome-feature"><span>🔔</span> Real reminders, even when the app is closed</div>
      </div>
      <button class="primary welcome-btn" id="dismissWelcome">Get started 🌱</button>
    </div>
  </div>`;
}

// ---------- about / support ----------

function renderAboutModal() {
  const speciesCount = SPECIES_DICTIONARY.length - 1; // exclude "Other"
  const totalWaterings = state.plants.reduce((sum, p) => sum + (p.waterLog || []).length, 0);
  const longestStreak = state.plants.reduce((max, p) => Math.max(max, calcStreak(p)), 0);
  const oldestPlant = state.plants.reduce((oldest, p) => {
    if (!p.createdAt) return oldest;
    if (!oldest || new Date(p.createdAt) < new Date(oldest.createdAt)) return p;
    return oldest;
  }, null);
  const daysSinceStart = oldestPlant ? daysSince(oldestPlant.createdAt) : 0;

  return `
  <div class="modal-backdrop" id="aboutBackdrop">
    <div class="modal about-modal">
      <div class="about-hero">🌿</div>
      <h3>About Plant Parent</h3>
      <p class="about-story">
        I built Plant Parent because I kept forgetting to water my own plants and killing them one by one.
        It started as a simple watering tracker, and grew — one idea at a time — into a full plant-care
        companion: photos, care streaks, a species guide, weather-aware tips, even a couple of small games
        for when you just want to relax with your plants for a minute.
      </p>
      <div class="about-stats">
        <div class="about-stat"><div class="about-stat-num">${speciesCount}</div><div class="about-stat-label">species in the guide</div></div>
        <div class="about-stat"><div class="about-stat-num">${ACHIEVEMENTS.length}</div><div class="about-stat-label">achievements</div></div>
        <div class="about-stat"><div class="about-stat-num">$0</div><div class="about-stat-label">to run, forever</div></div>
      </div>
      ${state.plants.length ? `
        <div class="about-journey">
          <div class="about-journey-title">Your journey so far</div>
          <div class="about-journey-row"><span>🪴</span> ${state.plants.length} plant${state.plants.length === 1 ? '' : 's'} in your care</div>
          <div class="about-journey-row"><span>💧</span> ${totalWaterings} watering${totalWaterings === 1 ? '' : 's'} logged</div>
          <div class="about-journey-row"><span>🔥</span> Best streak: ${longestStreak} in a row</div>
          ${daysSinceStart > 0 ? `<div class="about-journey-row"><span>📅</span> ${daysSinceStart} day${daysSinceStart === 1 ? '' : 's'} since your first plant</div>` : ''}
        </div>
      ` : ''}
      <div class="modal-actions">
        <button class="secondary" id="closeAbout">Close</button>
      </div>
    </div>
  </div>`;
}

// ---------- invite / share app ----------

// ---------- delete confirmation ----------

// ---------- custom icon set ----------
// Consistent line-icon style used in the nav bar, More menu, and Settings —
// replacing emoji so the app's chrome looks designed rather than default.

const ICONS = {
  plants: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V11"/><path d="M12 11C12 11 6 11 6 5C12 5 12 11 12 11Z"/><path d="M12 13C12 13 18 13 18 7C12 7 12 13 12 13Z"/><path d="M7 21H17"/></svg>`,
  garden: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>`,
  guide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H12V20H5.5C4.7 20 4 19.3 4 18.5V5.5Z"/><path d="M20 5.5C20 4.7 19.3 4 18.5 4H12V20H18.5C19.3 20 20 19.3 20 18.5V5.5Z"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`,
  journal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h9.5A2.5 2.5 0 0 1 18 6v14l-3-2-3 2-3-2-3 2V6a2.5 2.5 0 0 1 2.5-2.5Z"/><path d="M9 8h6M9 11.5h6"/></svg>`,
  cuttings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="M12 9c0-3.5 2.5-6 6-6-.5 3.5-2.5 6-6 6Z"/><circle cx="7" cy="6" r="2.2"/><circle cx="7" cy="14" r="2.2"/><path d="M8.6 7.6 12 9M8.6 12.4 12 11"/></svg>`,
  badges: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 5H5a3 3 0 0 0 3 5"/><path d="M16 5h3a3 3 0 0 1-3 5"/><path d="M12 13v3"/><path d="M9 20h6"/><path d="M10 16h4v4h-4z"/></svg>`,
  game: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="10" rx="4"/><path d="M8 11v4M6 13h4"/><circle cx="16" cy="12" r="1"/><circle cx="18" cy="14.5" r="1"/></svg>`,
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5a2.7 2.7 0 0 0-2.7 2.7v.3A2.7 2.7 0 0 0 4.5 10v.6a2.7 2.7 0 0 0 1 5v.4A2.7 2.7 0 0 0 8.2 18.7h.8"/><path d="M15 4.5a2.7 2.7 0 0 1 2.7 2.7v.3A2.7 2.7 0 0 1 19.5 10v.6a2.7 2.7 0 0 1-1 5v.4A2.7 2.7 0 0 1 15.8 18.7h-.8"/><path d="M9 4.5V19M15 4.5V19"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V19a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5a6 6 0 1 0-12 0c0 4.5-2 6-2 6h16s-2-1.5-2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`,
  'bell-off': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5a6 6 0 0 0-9.3-5"/><path d="M6.3 6.3C6.1 7 6 7.7 6 8.5c0 4.5-2 6-2 6h13"/><path d="M10 19a2 2 0 0 0 4 0"/><path d="M4 4l16 16"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6-1.5A4 4 0 0 0 7 18Z"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 1 0-18c4.5 0 8 3 8 6.5 0 2-1.5 3.5-3.5 3.5H15a1.5 1.5 0 0 0-1 2.6c.5.5.7 1 .7 1.6 0 1.5-1.2 2.6-2.7 2.8Z"/><circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="11" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  sync: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V9m0 0-4 4m4-4 4 4M5 5h14"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7 7 5.5L18.5 7"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 4-13 14-14-1 10-6 14-14 14Z"/><path d="M6 18c3-3 5-6 6-10"/></svg>`,
};

function icon(name, size) {
  return `<span class="icon-wrap" style="width:${size || 22}px;height:${size || 22}px;">${ICONS[name] || ''}</span>`;
}

function renderDeleteConfirmModal() {
  const plant = state.plants.find(p => p.id === state.confirmDeletePlantId);
  if (!plant) return '';
  return `
  <div class="modal-backdrop" id="deleteConfirmBackdrop">
    <div class="modal delete-confirm-modal">
      <div class="delete-confirm-emoji">🥀</div>
      <h3>Remove ${plant.name}?</h3>
      <p class="delete-confirm-text">This deletes its photo, notes, and full watering history. This can't be undone after a few seconds, but you'll get a brief chance to undo right after.</p>
      <div class="modal-actions">
        <button class="secondary" id="cancelDeletePlant">Cancel</button>
        <button class="primary delete-confirm-btn" id="confirmDeletePlant">Remove plant</button>
      </div>
    </div>
  </div>`;
}

function performPlantDelete(plantId) {
  const index = state.plants.findIndex(p => p.id === plantId);
  if (index === -1) return;
  state.lastDeletedPlant = state.plants[index];
  state.lastDeletedIndex = index;
  state.plants = state.plants.filter(p => p.id !== plantId);
  state.activeId = null;
  state.mobileDetailOpen = false;
  state.confirmDeletePlantId = null;
  render();
  savePlants();
  showUndoToast();
}

function showMessageToast(text) {
  const existing = document.getElementById('messageToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'messageToast';
  toast.className = 'undo-toast';
  toast.innerHTML = `<span>${text}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

function showUndoToast() {
  const existing = document.getElementById('undoToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'undoToast';
  toast.className = 'undo-toast';
  toast.innerHTML = `
    <span>Plant removed</span>
    <button id="undoDeleteBtn">Undo</button>
  `;
  document.body.appendChild(toast);

  const timeoutId = setTimeout(() => {
    toast.remove();
    state.lastDeletedPlant = null;
    state.lastDeletedIndex = null;
  }, 5000);

  toast.querySelector('#undoDeleteBtn').onclick = () => {
    clearTimeout(timeoutId);
    if (state.lastDeletedPlant) {
      const restoreAt = Math.min(state.lastDeletedIndex, state.plants.length);
      state.plants.splice(restoreAt, 0, state.lastDeletedPlant);
      state.activeId = state.lastDeletedPlant.id;
      state.lastDeletedPlant = null;
      state.lastDeletedIndex = null;
      render();
      savePlants();
    }
    toast.remove();
  };
}

function renderInviteModal() {
  const url = window.location.origin + window.location.pathname;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;
  return `
  <div class="modal-backdrop" id="inviteBackdrop">
    <div class="modal invite-modal">
      <h3>Invite a friend</h3>
      <p class="invite-text">Scan this with a phone camera, or share the link below — anyone can install their own copy of Plant Parent for free.</p>
      <img src="${qrUrl}" alt="QR code linking to this Plant Parent app" class="invite-qr">
      <div class="invite-link-row">
        <input class="invite-link-input" id="inviteLinkInput" value="${url}" readonly>
        <button class="secondary" id="copyInviteLink">Copy</button>
      </div>
      <div class="modal-actions">
        <button class="secondary" id="closeInvite">Close</button>
        <button class="primary" id="shareInvite">📤 Share</button>
      </div>
    </div>
  </div>`;
}

async function shareAppLink() {
  const url = window.location.origin + window.location.pathname;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Plant Parent', text: 'Come take care of your plants with me 🌿', url });
      markInvited();
    } catch (err) {
      // user cancelled — no action needed
    }
  } else {
    copyInviteLink();
  }
}

function markInvited() {
  if (!state.hasInvited) {
    state.hasInvited = true;
    localStorage.setItem('plant-parent-has-invited', '1');
    checkAchievements();
  }
}

function copyInviteLink() {
  const input = document.getElementById('inviteLinkInput');
  if (input) {
    input.select();
    navigator.clipboard?.writeText(input.value).then(() => {
      const btn = document.getElementById('copyInviteLink');
      if (btn) { const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = orig; }, 1500); }
      markInvited();
    }).catch(() => {});
  }
}

// ---------- themes ----------

function applyTheme(id) {
  state.theme = id;
  document.body.dataset.theme = id;
  localStorage.setItem('plant-parent-theme', id);
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.body.dataset.mode = state.darkMode ? 'dark' : 'light';
  localStorage.setItem('plant-parent-dark-mode', state.darkMode ? '1' : '0');
  render();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem('plant-parent-sound', state.soundEnabled ? '1' : '0');
  if (state.soundEnabled) playClickSound();
  render();
}

function renderThemeModal() {
  return `
  <div class="modal-backdrop" id="themeBackdrop">
    <div class="modal theme-modal">
      <h3>Choose a theme</h3>
      <div class="theme-grid">
        ${THEMES.map(t => `
          <button class="theme-option ${state.theme === t.id ? 'theme-option-active' : ''}" data-theme="${t.id}">
            <span class="theme-swatch" style="background: linear-gradient(135deg, ${t.sage}, ${t.clay});"></span>
            <span>${t.name}</span>
          </button>
        `).join('')}
      </div>
      <div class="modal-actions">
        <button class="secondary" id="closeTheme">Close</button>
      </div>
    </div>
  </div>`;
}

// ---------- share plant card ----------

function getThemeColors() {
  const styles = getComputedStyle(document.body);
  return {
    sage: styles.getPropertyValue('--sage').trim() || '#8DA377',
    clay: styles.getPropertyValue('--clay').trim() || '#B5613C',
    bg: styles.getPropertyValue('--bg').trim() || '#F6F3EC',
    ink: styles.getPropertyValue('--ink').trim() || '#1F3324',
  };
}

async function generateShareCard(plant) {
  const colors = getThemeColors();
  const canvas = document.createElement('canvas');
  const W = 640, H = 800;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, colors.sage);
  grad.addColorStop(1, colors.clay);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  roundRect(ctx, 32, 32, W - 64, H - 64, 28);
  ctx.fill();

  const photoSize = 220;
  const photoX = W / 2;
  const photoY = 230;
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (plant.photo) {
    const img = await loadImage(plant.photo);
    const scale = Math.max(photoSize / img.width, photoSize / img.height);
    const w = img.width * scale, h = img.height * scale;
    ctx.drawImage(img, photoX - w / 2, photoY - h / 2, w, h);
  } else {
    ctx.fillStyle = '#EFEBDD';
    ctx.fillRect(photoX - photoSize/2, photoY - photoSize/2, photoSize, photoSize);
    ctx.font = '110px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌱', photoX, photoY + 10);
  }
  ctx.restore();

  ctx.strokeStyle = colors.sage;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = colors.ink;
  ctx.textAlign = 'center';
  ctx.font = '600 40px Georgia, serif';
  ctx.fillText(plant.name, W / 2, 400);

  if (plant.species) {
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillStyle = '#666';
    ctx.fillText(plant.species, W / 2, 432);
  }

  const streak = calcStreak(plant);
  ctx.font = '600 64px Georgia, serif';
  ctx.fillStyle = colors.clay;
  ctx.fillText(String(streak), W / 2, 540);
  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#666';
  ctx.fillText(`on-time watering${streak === 1 ? '' : 's'} in a row`, W / 2, 566);

  ctx.font = '600 18px Georgia, serif';
  ctx.fillStyle = colors.sage;
  ctx.fillText('🌿 Plant Parent', W / 2, H - 60);

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function shareCard(plant) {
  const canvas = await generateShareCard(plant);
  canvas.toBlob(async (blob) => {
    const file = new File([blob], `${plant.name.replace(/\s+/g, '-')}-plant-parent.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: plant.name, text: `${plant.name} on Plant Parent 🌿` });
        return;
      } catch (err) {
        // user cancelled or share failed — fall through to download
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plant.name.replace(/\s+/g, '-')}-plant-parent.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// ---------- journal ----------

function buildJournalEvents() {
  const events = [];
  state.plants.forEach(p => {
    if (p.createdAt) {
      events.push({ date: p.createdAt, emoji: '🌱', text: `Added <strong>${p.name}</strong> to your shelf` });
    }
    (p.waterLog || []).forEach(iso => {
      events.push({ date: iso, emoji: '💧', text: `Watered <strong>${p.name}</strong>` });
    });
    if (p.notesUpdatedAt) {
      events.push({ date: p.notesUpdatedAt, emoji: '📝', text: `Updated notes on <strong>${p.name}</strong>` });
    }
  });
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatJournalGroup(iso) {
  const days = daysSince(iso);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

function renderJournal() {
  const div = document.createElement('div');
  const events = buildJournalEvents();

  if (events.length === 0) {
    div.innerHTML = `<div class="garden-empty">No activity yet — water a plant or add a note to start your journal.</div>`;
    return div;
  }

  const groups = {};
  events.forEach(ev => {
    const key = formatJournalGroup(ev.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(ev);
  });

  div.innerHTML = Object.entries(groups).map(([label, evs]) => `
    <div class="journal-group">
      <div class="journal-group-label">${label}</div>
      ${evs.map(ev => `
        <div class="journal-event">
          <span class="journal-event-emoji">${ev.emoji}</span>
          <span class="journal-event-text">${ev.text}</span>
          <span class="journal-event-time">${new Date(ev.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  return div;
}

// ---------- propagation tracker ----------

function daysRooting(prop) {
  return daysSince(prop.startDate);
}

// ---------- settings ----------

function renderSettings() {
  const div = document.createElement('div');
  div.className = 'settings-page';

  div.innerHTML = `
    <div class="guide-hero">
      <div class="guide-hero-title">⚙️ Settings</div>
      <div class="guide-hero-sub">Everything about how Plant Parent looks and behaves</div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Appearance</div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Theme</div>
          <div class="settings-row-desc">Current: ${THEMES.find(t => t.id === state.theme)?.name || 'Sage'}</div>
        </div>
        <button class="secondary" id="settingsThemeBtn">${icon('palette', 16)} Change</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Dark mode</div>
          <div class="settings-row-desc">Easier on the eyes at night</div>
        </div>
        <button class="secondary ${state.darkMode ? 'settings-toggle-on' : ''}" id="settingsDarkModeBtn">${icon(state.darkMode ? 'moon' : 'sun', 16)} ${state.darkMode ? 'On' : 'Off'}</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Sound effects</div>
          <div class="settings-row-desc">Taps, watering chimes, and game sounds</div>
        </div>
        <button class="secondary ${state.soundEnabled ? 'settings-toggle-on' : ''}" id="settingsSoundBtn">${icon(state.soundEnabled ? 'bell' : 'bell-off', 16)} ${state.soundEnabled ? 'On' : 'Off'}</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Reminders</div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Push reminders</div>
          <div class="settings-row-desc">Real phone notifications for overdue plants</div>
        </div>
        <button class="secondary ${state.notificationsEnabled ? 'settings-toggle-on' : ''}" id="settingsNotifBtn">${icon('bell', 16)} ${state.notificationsEnabled ? 'On' : 'Off'}</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Weather tips</div>
          <div class="settings-row-desc">Watering nudges based on local weather</div>
        </div>
        <button class="secondary ${state.weatherEnabled ? 'settings-toggle-on' : ''}" id="settingsWeatherBtn">${icon('cloud', 16)} ${state.weatherEnabled ? 'On' : 'Off'}</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Seasonal tips</div>
          <div class="settings-row-desc">A care nudge based on the time of year</div>
        </div>
        <button class="secondary ${state.seasonalTipsEnabled ? 'settings-toggle-on' : ''}" id="settingsSeasonalBtn">${icon('sun', 16)} ${state.seasonalTipsEnabled ? 'On' : 'Off'}</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Sync &amp; backup</div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Sync across devices</div>
          <div class="settings-row-desc">${state.syncCode ? `Linked · code ${state.syncCode}` : 'Not linked to another device'}</div>
        </div>
        <button class="secondary" id="settingsSyncBtn">${icon('sync', 16)} ${state.syncCode ? 'Manage' : 'Set up'}</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Back up my plants</div>
          <div class="settings-row-desc">Download everything as a file</div>
        </div>
        <button class="secondary" id="settingsExportBtn">${icon('download', 16)} Back up</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Restore from backup</div>
          <div class="settings-row-desc">Replace current plants with a backup file</div>
        </div>
        <button class="secondary" id="settingsImportBtn">${icon('upload', 16)} Restore</button>
        <input type="file" id="settingsImportFileInput" accept="application/json" style="display:none;">
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Community</div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">Invite a friend</div>
          <div class="settings-row-desc">Share a QR code or link to the app</div>
        </div>
        <button class="secondary" id="settingsInviteBtn">${icon('mail', 16)} Invite</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">
          <div class="settings-row-name">About Plant Parent</div>
          <div class="settings-row-desc">The story behind the app, and your stats</div>
        </div>
        <button class="secondary" id="settingsAboutBtn">${icon('plants', 16)} View</button>
      </div>
    </div>
  `;

  div.querySelector('#settingsThemeBtn').onclick = () => { state.showThemeModal = true; render(); };
  div.querySelector('#settingsDarkModeBtn').onclick = () => toggleDarkMode();
  div.querySelector('#settingsSoundBtn').onclick = () => toggleSound();
  div.querySelector('#settingsNotifBtn').onclick = () => enableNotifications();
  div.querySelector('#settingsWeatherBtn').onclick = () => toggleWeather();
  div.querySelector('#settingsSeasonalBtn').onclick = () => toggleSeasonalTips();
  div.querySelector('#settingsSyncBtn').onclick = () => { state.syncStatus = null; state.showSyncModal = true; render(); };
  div.querySelector('#settingsExportBtn').onclick = () => exportBackup();
  div.querySelector('#settingsImportBtn').onclick = () => div.querySelector('#settingsImportFileInput').click();
  div.querySelector('#settingsImportFileInput').onchange = (e) => {
    const file = e.target.files[0];
    if (file) importBackup(file);
  };
  div.querySelector('#settingsInviteBtn').onclick = () => { state.showInviteModal = true; render(); };
  div.querySelector('#settingsAboutBtn').onclick = () => { state.showAboutModal = true; render(); };

  return div;
}

function renderPropagation() {
  const div = document.createElement('div');
  div.className = 'prop-list';

  if (state.propagations.length === 0) {
    div.innerHTML = `<div class="garden-empty">No cuttings being rooted right now. Start one below!</div>`;
  } else {
    div.innerHTML = state.propagations.map(prop => `
      <div class="prop-card" data-id="${prop.id}">
        <div class="prop-emoji">🌱</div>
        <div class="prop-info">
          <div class="prop-name">${prop.name}</div>
          <div class="prop-days">Rooting for ${daysRooting(prop)} day${daysRooting(prop) === 1 ? '' : 's'}</div>
          ${prop.notes ? `<div class="prop-notes">${prop.notes}</div>` : ''}
        </div>
        <div class="prop-actions">
          <button class="secondary prop-graduate-btn" data-id="${prop.id}">🌳 Graduate</button>
          <button class="secondary prop-remove-btn" data-id="${prop.id}">Remove</button>
        </div>
      </div>
    `).join('');
  }

  const addBtn = document.createElement('button');
  addBtn.className = 'primary prop-add-btn';
  addBtn.textContent = '+ Start a new cutting';
  addBtn.onclick = () => { state.showAddPropModal = true; render(); };
  div.appendChild(addBtn);

  div.querySelectorAll('.prop-graduate-btn').forEach(btn => {
    btn.onclick = () => {
      const prop = state.propagations.find(x => x.id === parseInt(btn.dataset.id, 10));
      if (!prop) return;
      const freq = 7;
      const p = {
        id: nextId++,
        name: prop.name,
        species: '', speciesId: null, speciesDesc: '',
        room: '',
        frequency: freq,
        lastWatered: new Date(Date.now() - (freq-1)*24*60*60*1000).toISOString(),
        waterLog: [],
        photo: null,
        notes: prop.notes || '',
        createdAt: new Date().toISOString(),
      };
      state.plants.push(p);
      state.propagations = state.propagations.filter(x => x.id !== prop.id);
      state.activeId = p.id;
      state.currentView = 'shelf';
      savePropagations();
      fireConfetti(window.innerWidth / 2, 100);
      render();
      savePlants();
    };
  });
  div.querySelectorAll('.prop-remove-btn').forEach(btn => {
    btn.onclick = () => {
      state.propagations = state.propagations.filter(x => x.id !== parseInt(btn.dataset.id, 10));
      savePropagations();
      render();
    };
  });

  return div;
}

function renderCheckinModal() {
  const p = state.plants.find(x => x.id === state.checkinPlantId);
  if (!p) return '';
  const moods = [
    { id: 'thriving', emoji: '🌿', label: 'Thriving' },
    { id: 'okay', emoji: '😐', label: 'Okay' },
    { id: 'struggling', emoji: '😟', label: 'Struggling' },
    { id: 'recovering', emoji: '🌱', label: 'Recovering' },
  ];
  return `
  <div class="modal-backdrop" id="checkinBackdrop">
    <div class="modal">
      <h3>How's ${p.name} doing?</h3>
      <div class="mood-picker">
        ${moods.map(m => `
          <button class="mood-option ${state.checkinDraftMood === m.id ? 'mood-option-selected' : ''}" data-mood="${m.id}">
            <span class="mood-option-emoji">${m.emoji}</span>
            <span class="mood-option-label">${m.label}</span>
          </button>
        `).join('')}
      </div>
      <div class="field">
        <label>Note (optional)</label>
        <input id="checkinNoteInput" placeholder="e.g. new leaf unfurling, moved to a brighter spot" aria-label="Note">
      </div>
      <div class="modal-actions">
        <button class="secondary" id="cancelCheckinModal">Cancel</button>
        <button class="primary" id="saveCheckinModal">Save check-in</button>
      </div>
    </div>
  </div>`;
}

function renderAddPropModal() {
  return `
  <div class="modal-backdrop" id="propModalBackdrop">
    <div class="modal">
      <h3>Start a new cutting</h3>
      <div class="field">
        <label>What is it?</label>
        <input id="propNameInput" placeholder="e.g. Pothos cutting from kitchen plant" aria-label="What is it">
      </div>
      <div class="field">
        <label>Notes (optional)</label>
        <input id="propNotesInput" placeholder="e.g. in water, on the windowsill" aria-label="Notes">
      </div>
      <div class="modal-actions">
        <button class="secondary" id="cancelPropModal">Cancel</button>
        <button class="primary" id="savePropModal">Start tracking</button>
      </div>
    </div>
  </div>`;
}

function savePropagations() {
  try {
    localStorage.setItem('plant-parent-propagations', JSON.stringify(state.propagations));
  } catch (err) {
    console.error('Could not save propagations', err);
  }
}

function loadPropagations() {
  try {
    const raw = localStorage.getItem('plant-parent-propagations');
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) state.propagations = saved;
    }
  } catch (err) {
    state.propagations = [];
  }
}

// ---------- backup / restore ----------

function exportBackup() {
  const backup = {
    exportedAt: new Date().toISOString(),
    plants: state.plants,
    unlockedAchievements: state.unlockedAchievements,
    gameHighScore: state.gameHighScore,
    memoryHighScore: state.memoryHighScore,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = todayStr();
  a.href = url;
  a.download = `plant-parent-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.plants)) throw new Error('Invalid backup file');
      const confirmed = confirm(`This will replace your current ${state.plants.length} plant(s) with ${data.plants.length} plant(s) from the backup. Continue?`);
      if (!confirmed) return;
      state.plants = data.plants;
      nextId = state.plants.length ? Math.max(...state.plants.map(p => p.id)) + 1 : 1;
      if (Array.isArray(data.unlockedAchievements)) {
        state.unlockedAchievements = data.unlockedAchievements;
        localStorage.setItem('plant-parent-achievements', JSON.stringify(state.unlockedAchievements));
      }
      if (typeof data.gameHighScore === 'number') {
        state.gameHighScore = data.gameHighScore;
        localStorage.setItem('plant-parent-game-highscore', String(state.gameHighScore));
      }
      if (typeof data.memoryHighScore === 'number') {
        state.memoryHighScore = data.memoryHighScore;
        localStorage.setItem('plant-parent-memory-highscore', String(state.memoryHighScore));
      }
      state.activeId = state.plants[0]?.id ?? null;
      render();
      savePlants();
      alert('Backup restored!');
    } catch (err) {
      alert("Couldn't read that file — make sure it's a Plant Parent backup.");
    }
  };
  reader.readAsText(file);
}

// ---------- weather-aware watering ----------

function getWeatherNudge(precipMm, tempC, humidity) {
  if (precipMm >= 8) {
    return { emoji: '🌧️', text: `It's rained a fair amount nearby the last few days (${precipMm.toFixed(0)}mm). Your plants may need a bit less water than usual — check the soil before watering.` };
  }
  if (precipMm >= 2) {
    return { emoji: '🌦️', text: `A little rain nearby lately. If any of your plants sit near an open window or balcony, they may not need their full usual watering.` };
  }
  if (tempC >= 28 && humidity <= 40) {
    return { emoji: '☀️', text: `Hot and dry the last few days (${Math.round(tempC)}°C, ${Math.round(humidity)}% humidity). Thirsty plants may dry out faster than usual — worth checking a little early.` };
  }
  if (humidity <= 30) {
    return { emoji: '🍂', text: `Low humidity lately (${Math.round(humidity)}%). Plants that like moisture, like ferns, may appreciate a light misting between waterings.` };
  }
  return { emoji: '🌤️', text: `Weather's been steady nearby — no changes needed to your usual watering routine.` };
}

const SEASON_TIPS = {
  winter: { emoji: '❄️', text: "It's winter — growth slows down for most houseplants, so they typically need less water and no fertilizer until spring." },
  spring: { emoji: '🌱', text: "It's spring — prime growing season. A good time to repot, propagate, and start feeding again if you paused over winter." },
  summer: { emoji: '☀️', text: "It's summer — longer days and warmth mean plants often dry out faster. Worth checking soil a little more often." },
  fall: { emoji: '🍂', text: "It's fall — as days shorten, growth slows. A good time to ease off fertilizing and watch for less frequent watering needs." },
};

function getHemisphere() {
  if (typeof state !== 'undefined' && typeof state.latitude === 'number') {
    return state.latitude < 0 ? 'south' : 'north';
  }
  return 'north'; // default assumption when location isn't known
}

function getSeason() {
  const month = new Date().getMonth(); // 0 = Jan
  const northSeasonByMonth = ['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'];
  let season = northSeasonByMonth[month];
  if (getHemisphere() === 'south') {
    const flip = { winter: 'summer', summer: 'winter', spring: 'fall', fall: 'spring' };
    season = flip[season];
  }
  return season;
}

function getSeasonalTip() {
  return SEASON_TIPS[getSeason()];
}

function toggleSeasonalTips() {
  state.seasonalTipsEnabled = !state.seasonalTipsEnabled;
  localStorage.setItem('plant-parent-seasonal-tips', state.seasonalTipsEnabled ? '1' : '0');
  render();
}

async function fetchWeather() {
  if (!('geolocation' in navigator)) {
    alert("This browser doesn't support location, so weather tips aren't available.");
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&past_days=3&forecast_days=1&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const precipMm = (data.daily?.precipitation_sum || []).reduce((sum, v) => sum + (v || 0), 0);
      const tempC = data.current?.temperature_2m ?? 20;
      const humidity = data.current?.relative_humidity_2m ?? 50;
      const nudge = getWeatherNudge(precipMm, tempC, humidity);
      state.weatherNudge = nudge;
      state.weatherEnabled = true;
      state.latitude = latitude;
      localStorage.setItem('plant-parent-latitude', String(latitude));
      localStorage.setItem('plant-parent-weather-enabled', '1');
      localStorage.setItem('plant-parent-weather-date', todayStr());
      localStorage.setItem('plant-parent-weather-nudge', JSON.stringify(nudge));
      render();
    } catch (err) {
      alert("Couldn't fetch weather right now. Try again later.");
    }
  }, () => {
    alert('Location access was not granted, so weather tips are unavailable.');
  }, { timeout: 10000 });
}

function toggleWeather() {
  if (state.weatherEnabled) {
    state.weatherEnabled = false;
    state.weatherNudge = null;
    localStorage.setItem('plant-parent-weather-enabled', '0');
    render();
  } else {
    fetchWeather();
  }
}

function maybeRefreshWeather() {
  if (!state.weatherEnabled) return;
  if (localStorage.getItem('plant-parent-weather-date') !== todayStr()) {
    fetchWeather();
  }
}

// ---------- rendering ----------

let __previousView = null;

function hideLoadingScreen() {
  const el = document.getElementById('loadingScreen');
  if (!el) return;
  const elapsed = Date.now() - (typeof APP_LOAD_START === 'number' ? APP_LOAD_START : 0);
  const minDisplay = 450; // keep it visible at least this long so it reads as intentional, not a glitch
  const wait = Math.max(0, minDisplay - elapsed);
  setTimeout(() => {
    el.classList.add('loading-hidden');
    setTimeout(() => el.remove(), 400); // matches the CSS opacity transition duration
  }, wait);
}

function render() {
  const app = document.getElementById('app');
  const active = state.plants.find(p => p.id === state.activeId);
  const task = getTodayTask();
  const taskDone = task.check(state);
  if (taskDone && localStorage.getItem('plant-parent-daily-celebrated') !== todayStr()) {
    localStorage.setItem('plant-parent-daily-celebrated', todayStr());
    setTimeout(() => { fireConfetti(window.innerWidth / 2, 80); playUnlockSound(); }, 100);
  }
  const viewChanged = state.currentView !== __previousView;

  app.innerHTML = `
    <div class="main-content ${viewChanged ? 'view-enter' : ''}">
      ${state.currentView !== 'garden' && state.currentView !== 'dictionary' && state.currentView !== 'settings' ? `
        <header class="app-topbar">
          <span class="app-topbar-mark">${icon('plants', 28)}</span>
          <h1 class="app-topbar-title"><span class="brand-plant">Plant</span> <span class="brand-parent">Parent</span></h1>
        </header>

        ${!state.mobileDetailOpen ? `
          <div class="daily-card ${taskDone ? 'daily-card-done' : ''}">
            <div class="daily-emoji">${taskDone ? '✅' : task.emoji}</div>
            <div class="daily-text">
              <div class="daily-label">Today's little thing</div>
              <div class="daily-task">${task.label}</div>
            </div>
          </div>

          ${state.weatherEnabled && state.weatherNudge ? `
            <div class="weather-card">
              <div class="weather-emoji">${state.weatherNudge.emoji}</div>
              <div class="weather-text">${state.weatherNudge.text}</div>
            </div>
          ` : ''}

          ${state.seasonalTipsEnabled ? (() => { const tip = getSeasonalTip(); return `
            <div class="weather-card">
              <div class="weather-emoji">${tip.emoji}</div>
              <div class="weather-text">${tip.text}</div>
            </div>
          `; })() : ''}
        ` : ''}
      ` : ''}

      ${state.currentView === 'garden' ? `<div id="gardenView"></div>` : ''}
      ${state.currentView === 'dictionary' ? `<div id="dictionaryView"></div>` : ''}
      ${state.currentView === 'journal' ? `<div id="journalView"></div>` : ''}
      ${state.currentView === 'propagation' ? `<div id="propagationView"></div>` : ''}
      ${state.currentView === 'settings' ? `<div id="settingsView"></div>` : ''}
      ${state.currentView === 'shelf' ? `
        <div class="layout ${state.mobileDetailOpen ? 'mobile-detail-open' : ''}">
          <div class="shelf-column">
            ${state.plants.length ? renderShelfOverviewStrip() : ''}
            <div class="shelf-controls">
              ${state.plants.length ? `<button class="primary water-all-btn" id="waterAllBtn">💧 Water all plants</button>` : ''}
              <select class="sort-select" id="sortSelect" aria-label="Sort plants by">
                <option value="urgent" ${state.sortBy === 'urgent' ? 'selected' : ''}>Most urgent first</option>
                <option value="az" ${state.sortBy === 'az' ? 'selected' : ''}>A–Z</option>
                <option value="room" ${state.sortBy === 'room' ? 'selected' : ''}>By room</option>
              </select>
              ${getRoomList().length ? `
                <div class="room-chips">
                  <button class="room-chip ${!state.filterRoom ? 'room-chip-active' : ''}" data-room="">All</button>
                  ${getRoomList().map(r => `<button class="room-chip ${state.filterRoom === r ? 'room-chip-active' : ''}" data-room="${r}">${r}</button>`).join('')}
                </div>
              ` : ''}
            </div>
            <div class="shelf" id="shelf"></div>
          </div>
          <div class="panel" id="panel"></div>
        </div>
      ` : ''}
    </div>

    <nav class="bottom-nav">
      <button class="bottom-nav-btn ${state.currentView === 'shelf' ? 'bottom-nav-active' : ''}" id="navShelf">
        <span class="bottom-nav-icon">${icon('plants')}</span><span class="bottom-nav-label">Plants</span>
      </button>
      <button class="bottom-nav-btn ${state.currentView === 'garden' ? 'bottom-nav-active' : ''}" id="navGarden">
        <span class="bottom-nav-icon">${icon('garden')}</span><span class="bottom-nav-label">Garden</span>
      </button>
      <button class="bottom-nav-btn ${state.currentView === 'dictionary' ? 'bottom-nav-active' : ''}" id="navDictionary">
        <span class="bottom-nav-icon">${icon('guide')}</span><span class="bottom-nav-label">Guide</span>
      </button>
      <button class="bottom-nav-btn ${state.showMoreMenu || ['settings','journal','propagation'].includes(state.currentView) ? 'bottom-nav-active' : ''}" id="navMore">
        <span class="bottom-nav-icon">${icon('more')}</span><span class="bottom-nav-label">More</span>
      </button>
    </nav>

    ${state.showMoreMenu ? `
      <div class="more-menu-backdrop" id="moreMenuBackdrop">
        <div class="more-menu">
          <button class="more-menu-item" id="navJournal">
            <span class="more-menu-icon">${icon('journal')}</span>
            <span>Journal</span>
          </button>
          <button class="more-menu-item" id="navPropagation">
            <span class="more-menu-icon">${icon('cuttings')}</span>
            <span>Cuttings${state.propagations.length ? ` (${state.propagations.length})` : ''}</span>
          </button>
          <div class="more-menu-divider"></div>
          <button class="more-menu-item" id="navBadges">
            <span class="more-menu-icon">${icon('badges')}</span>
            <span>Badges <strong>${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}</strong></span>
          </button>
          <button class="more-menu-item" id="navGame">
            <span class="more-menu-icon">${icon('game')}</span>
            <span>Raindrop Catch${state.gameHighScore ? ` · best ${state.gameHighScore}` : ''}</span>
          </button>
          <button class="more-menu-item" id="navMemoryGame">
            <span class="more-menu-icon">${icon('brain')}</span>
            <span>Memory Match${state.memoryHighScore ? ` · best ${state.memoryHighScore}` : ''}</span>
          </button>
          <button class="more-menu-item" id="navLeaderboard">
            <span class="more-menu-icon">${icon('trophy')}</span>
            <span>Leaderboard</span>
          </button>
          <div class="more-menu-divider"></div>
          <button class="more-menu-item" id="navSettings">
            <span class="more-menu-icon">${icon('settings')}</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    ` : ''}
    ${state.showInviteModal ? renderInviteModal() : ''}
    ${state.showAboutModal ? renderAboutModal() : ''}
    ${state.confirmDeletePlantId ? renderDeleteConfirmModal() : ''}
    ${state.showSyncModal ? renderSyncModal() : ''}
    ${state.showWelcome ? renderWelcome() : ''}

    ${state.showAddModal ? renderModal() : ''}
    ${state.showBadgesModal ? renderBadgesModal() : ''}
    ${state.showSpeciesPicker ? renderSpeciesPicker() : ''}
    ${state.showThemeModal ? renderThemeModal() : ''}
    ${state.showAddPropModal ? renderAddPropModal() : ''}
    ${state.showCheckinModal ? renderCheckinModal() : ''}
    ${state.showLeaderboardModal ? renderLeaderboardModal() : ''}
  `;

  if (state.currentView === 'garden') {
    document.getElementById('gardenView').appendChild(renderGarden());
  } else if (state.currentView === 'dictionary') {
    document.getElementById('dictionaryView').appendChild(renderDictionary());
  } else if (state.currentView === 'journal') {
    document.getElementById('journalView').appendChild(renderJournal());
  } else if (state.currentView === 'propagation') {
    document.getElementById('propagationView').appendChild(renderPropagation());
  } else if (state.currentView === 'settings') {
    document.getElementById('settingsView').appendChild(renderSettings());
  } else {
    const shelf = document.getElementById('shelf');
    getVisiblePlants().forEach(p => shelf.appendChild(renderCard(p)));
    const addBtn = document.createElement('div');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+ Add a plant';
    addBtn.onclick = () => { state.pendingModalPhoto = null; state.pendingSpecies = null; state.editingPlantId = null; state.modalDraft = null; state.identifyResults = null; state.identifyError = null; state.showAddModal = true; render(); };
    shelf.appendChild(addBtn);

    const panel = document.getElementById('panel');
    panel.innerHTML = '';
    panel.appendChild(active ? renderDetail(active) : renderEmpty());

    document.getElementById('sortSelect').onchange = (e) => { state.sortBy = e.target.value; render(); };
    document.querySelectorAll('.room-chip').forEach(chip => {
      chip.onclick = () => { state.filterRoom = chip.dataset.room || null; render(); };
    });
    const waterAllBtn = document.getElementById('waterAllBtn');
    if (waterAllBtn) waterAllBtn.onclick = (e) => {
      const count = waterAllPlants();
      const rect = e.target.getBoundingClientRect();
      if (count > 0) {
        fireConfetti(rect.left + rect.width / 2, rect.top);
        playWaterSound();
        showMessageToast(`💧 Watered ${count} plant${count === 1 ? '' : 's'}!`);
        savePlants();
      } else {
        showMessageToast(`Everything's already watered today 🌿`);
      }
      render();
    };
  }


  document.getElementById('navShelf').onclick = () => { state.currentView = 'shelf'; state.showMoreMenu = false; render(); };
  document.getElementById('navGarden').onclick = () => {
    state.currentView = 'garden';
    state.showMoreMenu = false;
    localStorage.setItem('plant-parent-last-garden-date', todayStr());
    checkAchievements();
    render();
  };
  document.getElementById('navDictionary').onclick = () => { state.currentView = 'dictionary'; state.showMoreMenu = false; render(); };
  document.getElementById('navMore').onclick = () => { state.showMoreMenu = !state.showMoreMenu; render(); };

  if (state.showMoreMenu) {
    document.getElementById('navBadges').onclick = () => { state.showMoreMenu = false; state.showBadgesModal = true; render(); };
    document.getElementById('navGame').onclick = () => { state.showMoreMenu = false; render(); if (window.openMiniGame) window.openMiniGame(); };
    document.getElementById('navMemoryGame').onclick = () => { state.showMoreMenu = false; render(); if (window.openMemoryGame) window.openMemoryGame(); };
    document.getElementById('navLeaderboard').onclick = () => {
      state.showMoreMenu = false;
      state.showLeaderboardModal = true;
      state.leaderboardError = null;
      render();
      if (state.leaderboardJoined) refreshMyLeaderboardStats();
      fetchLeaderboard();
    };
    document.getElementById('navJournal').onclick = () => { state.currentView = 'journal'; state.showMoreMenu = false; render(); };
    document.getElementById('navPropagation').onclick = () => { state.currentView = 'propagation'; state.showMoreMenu = false; render(); };
    document.getElementById('navSettings').onclick = () => { state.currentView = 'settings'; state.showMoreMenu = false; render(); };
    document.getElementById('moreMenuBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'moreMenuBackdrop') { state.showMoreMenu = false; render(); }
    });
  }

  if (state.showAddModal) {
    document.getElementById('modalNameInput')?.focus();
    wireModalPhoto();
    wireIdentify();
    const openBtn = document.getElementById('openSpeciesPicker');
    if (openBtn) openBtn.onclick = () => {
      captureModalDraft();
      state.showSpeciesPicker = true;
      render();
    };
    const freqInput = document.getElementById('modalFreqInput');
    const twiceDailyField = document.getElementById('twiceDailyField');
    if (freqInput && twiceDailyField) {
      freqInput.addEventListener('input', () => {
        const isDaily = Number(freqInput.value) === 1;
        twiceDailyField.style.display = isDaily ? '' : 'none';
        if (!isDaily) document.getElementById('modalTwiceDailyInput').checked = false;
      });
    }
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
  __previousView = state.currentView;
}

// ---------- species illustrations ----------
// Original vector illustrations (no external images/photos) that automatically
// adopt whichever color theme is active, since they use CSS variables for fills.

function potBase(wide) {
  const w = wide ? 34 : 26;
  return `<path d="M ${50-w} 78 L ${50+w} 78 L ${50+w-4} 94 L ${50-w+4} 94 Z" fill="var(--clay)"/>
          <rect x="${50-w-2}" y="74" width="${(w+2)*2}" height="6" rx="3" fill="var(--clay-light)"/>`;
}

function leafPair(cx, cy, len, angle, color) {
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + Math.cos(rad) * len;
  const tipY = cy - Math.sin(rad) * len;
  const ctrlX = cx + Math.cos(rad) * len * 0.5 + Math.sin(rad) * 8;
  const ctrlY = cy - Math.sin(rad) * len * 0.5 + Math.cos(rad) * 8;
  return `<path d="M ${cx} ${cy} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY} Q ${ctrlX} ${ctrlY-4} ${cx} ${cy} Z" fill="${color}"/>`;
}

function speciesIllustrationSVG(species) {
  const shape = species.shape;
  const accent = species.accent || null;
  const stripes = species.patterned ? `<line x1="50" y1="38" x2="50" y2="58" stroke="var(--sage-light)" stroke-width="1.5" opacity="0.6"/>` : '';

  let content = '';
  switch (shape) {
    case 'trailing':
      content = `
        ${potBase(false)}
        <path d="M50 76 Q46 50 30 40" stroke="var(--sage)" stroke-width="3" fill="none"/>
        <path d="M50 76 Q54 48 70 36" stroke="var(--sage)" stroke-width="3" fill="none"/>
        ${leafPair(30, 40, 14, 150, 'var(--sage)')}
        ${leafPair(38, 54, 12, 160, 'var(--sage-light)')}
        ${leafPair(70, 36, 14, 30, 'var(--sage)')}
        ${leafPair(62, 52, 12, 20, 'var(--sage-light)')}
        <ellipse cx="50" cy="30" rx="10" ry="12" fill="var(--sage)"/>
        ${accent ? `<circle cx="50" cy="26" r="3" fill="${accent}"/>` : ''}
      `;
      break;
    case 'broad-leaf':
      content = `
        ${potBase(true)}
        <path d="M50 76 L50 44" stroke="var(--sage)" stroke-width="3"/>
        <path d="M50 50 Q26 44 24 20 Q46 26 50 50 Z" fill="var(--sage)"/>
        <path d="M50 50 Q74 44 76 20 Q54 26 50 50 Z" fill="${accent || 'var(--sage-light)'}"/>
        ${stripes}
      `;
      break;
    case 'split-leaf':
      content = `
        ${potBase(true)}
        <path d="M50 76 L50 46" stroke="var(--sage)" stroke-width="3"/>
        <path d="M50 50 Q24 42 26 16 Q40 18 44 34 Q40 28 34 30 Q40 34 42 42 Q48 40 50 50 Z" fill="var(--sage)"/>
        <path d="M50 50 Q76 42 74 16 Q60 18 56 34 Q60 28 66 30 Q60 34 58 42 Q52 40 50 50 Z" fill="var(--sage-light)"/>
      `;
      break;
    case 'spiky':
      content = `
        ${potBase(false)}
        ${[-32,-18,-4,10,24].map((offset, i) => `
          <path d="M50 78 Q${50+offset*0.3} 50 ${50+offset} 18 Q${50+offset+3} 50 50 78 Z" fill="${i%2===0 ? 'var(--sage)' : 'var(--sage-light)'}"/>
        `).join('')}
      `;
      break;
    case 'rosette':
      content = `
        ${potBase(false)}
        ${[0,51,102,153,204,255,306].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 16;
          const y = 66 + Math.sin(rad) * 10;
          return `<ellipse cx="${x}" cy="${y}" rx="9" ry="14" transform="rotate(${deg} ${x} ${y})" fill="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}"/>`;
        }).join('')}
        <circle cx="50" cy="66" r="7" fill="var(--sage)"/>
      `;
      break;
    case 'tall-cane':
      content = `
        ${potBase(false)}
        <path d="M46 78 L44 24" stroke="var(--clay)" stroke-width="4"/>
        <path d="M56 78 L58 30" stroke="var(--clay)" stroke-width="4"/>
        ${leafPair(44, 24, 16, 140, 'var(--sage)')}
        ${leafPair(44, 24, 16, 60, 'var(--sage-light)')}
        ${leafPair(58, 30, 14, 120, 'var(--sage-light)')}
        ${leafPair(58, 30, 14, 40, 'var(--sage)')}
      `;
      break;
    case 'flower':
      content = `
        ${potBase(false)}
        <path d="M50 76 Q30 66 28 42" stroke="var(--sage)" stroke-width="3" fill="none"/>
        <path d="M50 76 Q70 66 72 42" stroke="var(--sage)" stroke-width="3" fill="none"/>
        ${leafPair(28, 42, 14, 150, 'var(--sage)')}
        ${leafPair(72, 42, 14, 30, 'var(--sage)')}
        <path d="M50 60 L50 28" stroke="var(--sage)" stroke-width="3"/>
        ${[0,72,144,216,288].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 9;
          const y = 20 + Math.sin(rad) * 9;
          return `<ellipse cx="${x}" cy="${y}" rx="6" ry="10" transform="rotate(${deg} ${x} ${y})" fill="${accent || '#F7F4EA'}"/>`;
        }).join('')}
        <circle cx="50" cy="20" r="4" fill="#E0B84E"/>
      `;
      break;
    case 'spider':
      content = `
        ${potBase(false)}
        ${[-40,-24,-8,8,24,40].map((offset, i) => `
          <path d="M50 76 Q${50+offset*0.5} 46 ${50+offset} 22" stroke="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}" stroke-width="4" fill="none"/>
        `).join('')}
        <circle cx="26" cy="60" r="2.5" fill="var(--sage-light)"/>
        <circle cx="74" cy="64" r="2.5" fill="var(--sage-light)"/>
      `;
      break;
    case 'cactus':
      content = `
        ${potBase(false)}
        <rect x="40" y="30" width="20" height="48" rx="10" fill="var(--sage)"/>
        <rect x="22" y="42" width="14" height="26" rx="7" fill="var(--sage-light)"/>
        <rect x="64" y="36" width="14" height="30" rx="7" fill="var(--sage-light)"/>
        <line x1="44" y1="36" x2="44" y2="72" stroke="var(--sage-light)" stroke-width="1" opacity="0.5"/>
        <line x1="56" y1="36" x2="56" y2="72" stroke="var(--sage-light)" stroke-width="1" opacity="0.5"/>
        ${accent ? `<ellipse cx="50" cy="26" rx="7" ry="8" fill="${accent}"/>` : ''}
      `;
      break;
    case 'fern':
      content = `
        ${potBase(false)}
        ${[-50,-34,-18,0,18,34,50].map((offset, i) => `
          <path d="M50 76 Q${50+offset*0.4} 50 ${50+offset*0.9} 24" stroke="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}" stroke-width="2.5" fill="none"/>
        `).join('')}
      `;
      break;
    case 'herb':
      content = `
        ${potBase(false)}
        ${[[38,58],[50,50],[62,58],[44,64],[56,64]].map(([x,y], i) => `
          <ellipse cx="${x}" cy="${y}" rx="9" ry="12" transform="rotate(${(i-2)*15} ${x} ${y})" fill="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}"/>
        `).join('')}
      `;
      break;
    case 'fan':
      content = `
        ${potBase(true)}
        ${[-50,-25,0,25,50].map((angle, i) => {
          const rad = ((90 - angle) * Math.PI) / 180;
          const baseX = 50, baseY = 70;
          const tipX = baseX + Math.cos(rad) * 34;
          const tipY = baseY - Math.sin(rad) * 44;
          return `<path d="M${baseX} ${baseY} Q${baseX + (tipX-baseX)*0.3} ${baseY - 20} ${tipX} ${tipY} Q${baseX + (tipX-baseX)*0.6} ${tipY+6} ${baseX} ${baseY} Z" fill="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}"/>`;
        }).join('')}
      `;
      break;
    case 'branching':
      content = `
        ${potBase(false)}
        <path d="M50 78 L50 56 M50 56 L34 38 M50 56 L66 40" stroke="var(--clay)" stroke-width="3" fill="none"/>
        ${[[34,38],[66,40],[50,56],[26,26],[74,28]].map(([x,y], i) => `
          <circle cx="${x}" cy="${y}" r="7" fill="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}"/>
        `).join('')}
      `;
      break;
    case 'coin':
      content = `
        ${potBase(false)}
        ${[[36,50],[50,34],[64,52],[44,66],[60,64]].map(([x,y], i) => `
          <line x1="50" y1="76" x2="${x}" y2="${y+8}" stroke="var(--sage)" stroke-width="2"/>
          <circle cx="${x}" cy="${y}" r="8" fill="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}"/>
        `).join('')}
      `;
      break;
    case 'airplant':
      content = `
        <ellipse cx="50" cy="86" rx="16" ry="4" fill="var(--line)"/>
        ${[-30,-10,10,30,0].map((angle, i) => {
          const rad = ((90 - angle) * Math.PI) / 180;
          const tipX = 50 + Math.cos(rad) * 22;
          const tipY = 82 - Math.sin(rad) * 46;
          return `<path d="M50 82 Q${50 + (tipX-50)*0.6} ${82 - (82-tipY)*0.5} ${tipX} ${tipY}" stroke="${i % 2 === 0 ? 'var(--sage)' : 'var(--sage-light)'}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
        }).join('')}
      `;
      break;
    default:
      content = `<text x="50" y="62" font-size="40" text-anchor="middle">🌱</text>`;
  }

  return `<svg viewBox="0 0 100 100" width="100%" height="100%">${content}</svg>`;
}

function speciesDifficulty(species) {
  if (species.freq >= 14) return { label: 'Low maintenance', emoji: '🟢', tier: 'easy' };
  if (species.freq >= 7) return { label: 'Easy care', emoji: '🟡', tier: 'moderate' };
  return { label: 'Needs attention', emoji: '🔴', tier: 'demanding' };
}

function lightCategory(lightText) {
  const t = lightText.toLowerCase();
  if (t.includes('low')) return 'low';
  if (t.includes('bright')) return 'bright';
  if (t.includes('medium')) return 'medium';
  return 'varies';
}

function buildDictionaryCardsHtml(list, search) {
  if (list.length === 0) {
    return `<div class="guide-no-results">No plants match "${search}" — try a different search or filter.</div>`;
  }
  return list.map(s => {
    const diff = speciesDifficulty(s);
    return `
      <div class="dictionary-card dictionary-card-${diff.tier}" data-id="${s.id}">
        <div class="dictionary-illustration">${speciesIllustrationSVG(s)}</div>
        <div class="dictionary-card-top">
          <div class="dictionary-difficulty-badge">${diff.emoji} ${diff.label}</div>
        </div>
        <div class="dictionary-name">${s.name}</div>
        ${s.latin ? `<div class="dictionary-latin">${s.latin}</div>` : ''}
        <div class="dictionary-meta-row">
          <span class="dictionary-meta-pill">☀️ ${s.light}</span>
          <span class="dictionary-meta-pill">💧 every ${s.freq}d</span>
        </div>
        <div class="dictionary-desc">${s.desc}</div>
        <button class="secondary dictionary-add-btn" data-id="${s.id}">+ Add one like this</button>
      </div>
    `;
  }).join('');
}

function wireDictionaryAddButtons(grid) {
  grid.querySelectorAll('.dictionary-add-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const entry = SPECIES_DICTIONARY.find(s => s.id === btn.dataset.id);
      state.pendingSpecies = entry;
      state.pendingModalPhoto = null;
      state.editingPlantId = null;
      state.modalDraft = null;
      state.showAddModal = true;
      render();
    };
  });
}

function filterDictionary(species, search, lightFilter) {
  return species.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.latin || '').toLowerCase().includes(search.toLowerCase());
    const matchesLight = !lightFilter || lightCategory(s.light) === lightFilter;
    return matchesSearch && matchesLight;
  });
}

const GUIDE_PAGE_SIZE = 8;

function renderDictionary() {
  const wrapper = document.createElement('div');
  const species = SPECIES_DICTIONARY.filter(s => s.id !== 'other');
  const search = state.dictionarySearch || '';
  const lightFilter = state.dictionaryLightFilter || null;
  const filtered = filterDictionary(species, search, lightFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / GUIDE_PAGE_SIZE));
  if (!state.dictionaryPage) state.dictionaryPage = 1;
  if (state.dictionaryPage > totalPages) state.dictionaryPage = totalPages;

  wrapper.innerHTML = `
    <div class="guide-hero">
      <div class="guide-hero-title">📖 Species Guide</div>
      <div class="guide-hero-sub">${species.length} plants, with care basics for each</div>
    </div>
    <div class="guide-controls">
      <input type="text" id="guideSearchInput" class="guide-search" placeholder="🔍 Search by name…" value="${search}">
      <div class="guide-light-chips">
        <button class="room-chip ${!lightFilter ? 'room-chip-active' : ''}" data-light="">All light</button>
        <button class="room-chip ${lightFilter === 'low' ? 'room-chip-active' : ''}" data-light="low">Low light</button>
        <button class="room-chip ${lightFilter === 'medium' ? 'room-chip-active' : ''}" data-light="medium">Medium light</button>
        <button class="room-chip ${lightFilter === 'bright' ? 'room-chip-active' : ''}" data-light="bright">Bright light</button>
      </div>
    </div>
    <div class="dictionary-grid" id="dictionaryGrid"></div>
    <div class="guide-pagination" id="guidePagination"></div>
  `;

  const grid = wrapper.querySelector('#dictionaryGrid');
  const paginationEl = wrapper.querySelector('#guidePagination');

  function renderPage() {
    const start = (state.dictionaryPage - 1) * GUIDE_PAGE_SIZE;
    const pageItems = filtered.slice(start, start + GUIDE_PAGE_SIZE);
    grid.innerHTML = buildDictionaryCardsHtml(pageItems, search);
    wireDictionaryAddButtons(grid);
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (filtered.length <= GUIDE_PAGE_SIZE) {
      paginationEl.innerHTML = '';
      return;
    }
    paginationEl.innerHTML = `
      <button class="secondary" id="guidePrevPage" ${state.dictionaryPage === 1 ? 'disabled' : ''}>← Prev</button>
      <span class="guide-page-label">Page ${state.dictionaryPage} of ${totalPages}</span>
      <button class="secondary" id="guideNextPage" ${state.dictionaryPage === totalPages ? 'disabled' : ''}>Next →</button>
    `;
    const prevBtn = paginationEl.querySelector('#guidePrevPage');
    const nextBtn = paginationEl.querySelector('#guideNextPage');
    if (prevBtn) prevBtn.onclick = () => { state.dictionaryPage--; renderPage(); };
    if (nextBtn) nextBtn.onclick = () => { state.dictionaryPage++; renderPage(); };
  }
  renderPage();

  const searchInput = wrapper.querySelector('#guideSearchInput');
  searchInput.addEventListener('input', () => {
    state.dictionarySearch = searchInput.value;
    state.dictionaryPage = 1;
    render();
  });

  wrapper.querySelectorAll('.guide-light-chips .room-chip').forEach(chip => {
    chip.onclick = () => {
      state.dictionaryLightFilter = chip.dataset.light || null;
      state.dictionaryPage = 1;
      render();
    };
  });

  return wrapper;
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
  const wrapper = document.createElement('div');
  const scene = document.createElement('div');
  scene.className = 'garden-scene';

  if (state.plants.length === 0) {
    scene.innerHTML = `
      <div class="garden-sky">
        <div class="garden-sun"></div>
        <div class="garden-cloud garden-cloud-1"></div>
        <div class="garden-cloud garden-cloud-2"></div>
      </div>
      <div class="garden-hill garden-hill-back"></div>
      <div class="garden-hill garden-hill-front"></div>
      <div class="garden-empty">Your garden is empty — add a plant to watch it grow here.</div>
    `;
    wrapper.appendChild(scene);
    wrapper.appendChild(renderGardenCuttings());
    return wrapper;
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

  const leafCount = Math.min(6, 2 + Math.floor(state.plants.length / 2));
  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const left = 8 + Math.random() * 84;
    const duration = 8 + Math.random() * 6;
    const delay = Math.random() * 8;
    const emoji = ['🍃', '🌸', '✨'][i % 3];
    return `<span class="garden-leaf" style="left:${left}%; animation-duration:${duration}s; animation-delay:-${delay}s;">${emoji}</span>`;
  }).join('');

  scene.innerHTML = `
    <div class="garden-sky">
      <div class="garden-sun"></div>
      <div class="garden-cloud garden-cloud-1"></div>
      <div class="garden-cloud garden-cloud-2"></div>
      <div class="garden-cloud garden-cloud-3"></div>
    </div>
    <div class="garden-particles">${leaves}</div>
    <div class="garden-summary-banner">${summary}</div>
    <div class="garden-hill garden-hill-back"></div>
    <div class="garden-hill garden-hill-front">
      <div class="garden-bed">
        ${state.plants.map(p => {
          const tier = gardenTier(p);
          return `
            <div class="garden-plant" data-id="${p.id}" title="${p.name} — ${tier.label}" role="button" tabindex="0" aria-label="${p.name}, ${tier.label}">
              <div class="garden-plant-emoji" style="font-size:${tier.size}px;">${tier.emoji}</div>
              <div class="garden-pot"></div>
              <div class="garden-plant-shadow"></div>
              <div class="garden-plant-name">${p.name}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  wrapper.appendChild(scene);
  wrapper.appendChild(renderGardenStats());
  wrapper.appendChild(renderGardenCuttings());

  wrapper.querySelectorAll('.garden-plant').forEach(el => {
    const select = () => {
      state.activeId = parseInt(el.dataset.id, 10);
      state.currentView = 'shelf';
      state.mobileDetailOpen = true;
      render();
    };
    el.onclick = select;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
    });
  });

  return wrapper;
}

function renderGardenStats() {
  const div = document.createElement('div');
  div.className = 'garden-stats';

  const totalPlants = state.plants.length;
  const totalStreakDays = state.plants.reduce((sum, p) => sum + calcStreak(p), 0);

  let star = state.plants[0];
  let needsAttention = state.plants[0];
  state.plants.forEach(p => {
    if (calcStreak(p) > calcStreak(star)) star = p;
    if (daysLeft(p) < daysLeft(needsAttention)) needsAttention = p;
  });

  div.innerHTML = `
    <div class="garden-stat-card">
      <div class="garden-stat-num">${totalPlants}</div>
      <div class="garden-stat-label">plant${totalPlants === 1 ? '' : 's'} growing</div>
    </div>
    <div class="garden-stat-card">
      <div class="garden-stat-num">${totalStreakDays}</div>
      <div class="garden-stat-label">combined streak days</div>
    </div>
    <div class="garden-stat-card garden-stat-highlight">
      <div class="garden-stat-icon">🌟</div>
      <div class="garden-stat-title">Star of the garden</div>
      <div class="garden-stat-name">${star.name}</div>
    </div>
    <div class="garden-stat-card garden-stat-highlight">
      <div class="garden-stat-icon">💧</div>
      <div class="garden-stat-title">Needs attention</div>
      <div class="garden-stat-name">${needsAttention.name}</div>
    </div>
  `;

  return div;
}

function renderGardenCuttings() {
  const div = document.createElement('div');
  div.className = 'garden-cuttings';

  const count = state.propagations.length;
  div.innerHTML = `
    <div class="garden-cuttings-header">
      <span class="garden-cuttings-title">🌱 Cuttings rooting</span>
      ${count ? `<span class="garden-cuttings-count">${count}</span>` : ''}
    </div>
    ${count === 0 ? `
      <div class="garden-cuttings-empty">No cuttings rooting yet — start one from the Cuttings screen.</div>
    ` : `
      <div class="garden-cuttings-row">
        ${state.propagations.map(prop => `
          <div class="garden-cutting-chip" data-id="${prop.id}" role="button" tabindex="0" aria-label="${prop.name}, rooting ${daysRooting(prop)} day${daysRooting(prop) === 1 ? '' : 's'}">
            <span class="garden-cutting-emoji">🌱</span>
            <span class="garden-cutting-name">${prop.name}</span>
            <span class="garden-cutting-days">${daysRooting(prop)}d</span>
          </div>
        `).join('')}
      </div>
    `}
    <button class="secondary garden-cuttings-btn" id="gardenCuttingsBtn">${count ? 'View all cuttings' : '+ Start a cutting'}</button>
  `;

  const openCuttings = () => {
    state.currentView = 'propagation';
    state.showMoreMenu = false;
    render();
  };
  div.querySelectorAll('.garden-cutting-chip').forEach(el => {
    el.onclick = openCuttings;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCuttings(); }
    });
  });
  div.querySelector('#gardenCuttingsBtn').onclick = openCuttings;

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
    ? `<img src="${p.photo}" alt="Photo of ${p.name}" class="ring-photo" style="width:${photoSize}px;height:${photoSize}px;">`
    : `<div class="ring-photo ring-photo-placeholder" style="width:${photoSize}px;height:${photoSize}px;font-size:${photoSize*0.4}px;" role="img" aria-label="No photo yet">🌱</div>`;
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
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `${p.name}, ${daysLeft(p) === 0 ? 'water today' : daysLeft(p) + ' days until watering'}`);
  const left = daysLeft(p);
  div.innerHTML = `
    ${ringPortrait(p, 54, 5)}
    <div class="info">
      <p class="name">${p.name} <span class="mood">${moodEmoji(p)}</span></p>
      <div class="species">${p.species || 'unlabeled'}${p.room ? ` · ${p.room}` : ''}</div>
    </div>
    <div class="days-badge">${left === 0 ? 'today!' : left + 'd'}</div>
  `;
  const selectCard = () => { state.activeId = p.id; state.mobileDetailOpen = true; render(); };
  div.onclick = selectCard;
  div.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCard(); }
  });
  return div;
}

function renderEmpty() {
  const div = document.createElement('div');
  div.className = 'empty-panel';
  if (state.plants.length === 0) {
    div.innerHTML = `
      <svg class="big-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--sage)" stroke-width="6" stroke-dasharray="8 10"/></svg>
      <div style="font-family:'Fraunces',serif;font-size:18px;">Your shelf is empty</div>
      <div style="font-size:13px;">Add your first plant to get started 🌱</div>
    `;
  } else {
    div.innerHTML = `
      <svg class="big-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--sage)" stroke-width="6" stroke-dasharray="8 10"/></svg>
      <div style="font-family:'Fraunces',serif;font-size:18px;">No plant selected</div>
      <div style="font-size:13px;">Tap a plant on the shelf to see its details.</div>
    `;
  }
  return div;
}

function wateredSlotToday(plant, slot) {
  const today = todayStr();
  if (slot === 'morning') return plant.lastMorningWatered === today;
  return plant.lastNightWatered === today;
}

function waterAllPlants() {
  const now = new Date().toISOString();
  const today = todayStr();
  let wateredCount = 0;

  for (const p of state.plants) {
    let didSomething = false;

    if (p.twiceDaily) {
      if (p.lastMorningWatered !== today) { p.lastMorningWatered = today; didSomething = true; }
      if (p.lastNightWatered !== today) { p.lastNightWatered = today; didSomething = true; }
    } else if (!p.lastWatered || daysSince(p.lastWatered) > 0) {
      didSomething = true;
    }

    if (didSomething) {
      p.lastWatered = now;
      p.waterLog = p.waterLog || [];
      p.waterLog.push(now);
      if (p.waterLog.length > 3650) p.waterLog = p.waterLog.slice(-3650);
      wateredCount++;
    }
  }

  return wateredCount;
}

function renderDetail(p) {
  const div = document.createElement('div');
  const left = daysLeft(p);
  const streak = calcStreak(p);
  const log = (p.waterLog || []).slice(-5).reverse();
  const healthLog = (p.healthLog || []).slice(-6).reverse();
  const w = window.innerWidth;
  const ringSize = w <= 480 ? 84 : w <= 800 ? 100 : 120;
  const ringStroke = w <= 480 ? 6 : w <= 800 ? 7 : 8;

  div.innerHTML = `
    <div class="detail-topbar">
      <button class="back-to-plants-btn" id="backToPlants">← Back to plants</button>
      ${state.plants.length > 1 ? `<button class="next-plant-btn" id="nextPlantBtn">Next plant →</button>` : ''}
    </div>
    <div class="detail-header">
      <div class="detail-ring-click" id="detailRingClick">
        ${ringPortrait(p, ringSize, ringStroke)}
      </div>
      <input type="file" id="detailPhotoInput" accept="image/*" capture="environment" style="display:none;">
      <div class="detail-title">
        <h2>${p.name} <span class="mood">${moodEmoji(p)}</span></h2>
        <div class="species">${p.species || 'species unlabeled'}</div>
        <div class="row-actions">
          ${p.twiceDaily ? `
            <button class="primary ${wateredSlotToday(p, 'morning') ? 'water-done' : ''}" id="waterMorningBtn">🌅 Morning${wateredSlotToday(p, 'morning') ? ' ✓' : ''}</button>
            <button class="primary ${wateredSlotToday(p, 'night') ? 'water-done' : ''}" id="waterNightBtn">🌙 Night${wateredSlotToday(p, 'night') ? ' ✓' : ''}</button>
          ` : `
            <button class="primary" id="waterBtn">Water now</button>
          `}
          <button class="secondary" id="editBtn">✏️ Edit</button>
          <button class="secondary" id="shareBtn">📤 Share</button>
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
    <input class="room-input" id="roomInput" placeholder="📍 Add a room (e.g. Kitchen)" value="${p.room || ''}" aria-label="Room">

    <div class="settings-row">
      <div class="settings-row-label">
        <div class="settings-row-name">🌾 Feeding</div>
        <div class="settings-row-desc">${p.lastFertilized
          ? `Every ${p.fertilizeFrequency || 21} days · fed ${daysSince(p.lastFertilized)} day${daysSince(p.lastFertilized) === 1 ? '' : 's'} ago · ${(() => { const d = fertilizeDaysLeft(p); return d <= 0 ? 'due now' : `${d} day${d === 1 ? '' : 's'} left`; })()}`
          : 'Not tracked yet'}</div>
      </div>
      <button class="secondary" id="feedBtn">Feed now</button>
    </div>
    <div class="settings-row">
      <div class="settings-row-label">
        <div class="settings-row-name">☀️ Rotation</div>
        <div class="settings-row-desc">${p.lastRotated
          ? `Every ${p.rotateFrequency || 7} days · rotated ${daysSince(p.lastRotated)} day${daysSince(p.lastRotated) === 1 ? '' : 's'} ago · ${(() => { const d = rotateDaysLeft(p); return d <= 0 ? 'due now' : `${d} day${d === 1 ? '' : 's'} left`; })()}`
          : 'Not tracked yet'}</div>
      </div>
      <button class="secondary" id="rotateBtn">Rotate now</button>
    </div>

    <div class="section-label">notes</div>
    <textarea class="notes-input" id="notesInput" aria-label="Notes" placeholder="e.g. repot in spring, keep away from cold drafts…">${p.notes || ''}</textarea>
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

    <div class="settings-row">
      <div class="settings-row-label">
        <div class="settings-row-name">📝 Health check-ins</div>
        <div class="settings-row-desc">Log how ${p.name} is doing over time</div>
      </div>
      <button class="secondary" id="checkinBtn">Check in</button>
    </div>
    ${healthLog.length ? `
      <ul class="history-list">
        ${healthLog.map(h => `<li>${moodLabel(h.mood)} · ${formatHistoryDate(h.date)}${h.note ? ` — ${escapeHtml(h.note)}` : ''}</li>`).join('')}
      </ul>
    ` : `<div style="font-size:13px;color:var(--soil);">No check-ins yet.</div>`}
  `;

  const doWater = (e, slot) => {
    p.lastWatered = new Date().toISOString();
    p.waterLog = p.waterLog || [];
    p.waterLog.push(p.lastWatered);
    if (p.waterLog.length > 3650) p.waterLog = p.waterLog.slice(-3650);
    if (slot === 'morning') p.lastMorningWatered = todayStr();
    if (slot === 'night') p.lastNightWatered = todayStr();
    const rect = e.target.getBoundingClientRect();
    fireConfetti(rect.left + rect.width / 2, rect.top);
    playWaterSound();
    render();
    savePlants();
  };
  const waterBtn = div.querySelector('#waterBtn');
  if (waterBtn) waterBtn.onclick = (e) => doWater(e);
  const waterMorningBtn = div.querySelector('#waterMorningBtn');
  if (waterMorningBtn) waterMorningBtn.onclick = (e) => doWater(e, 'morning');
  const waterNightBtn = div.querySelector('#waterNightBtn');
  if (waterNightBtn) waterNightBtn.onclick = (e) => doWater(e, 'night');

  const feedBtn = div.querySelector('#feedBtn');
  if (feedBtn) feedBtn.onclick = (e) => {
    p.lastFertilized = new Date().toISOString();
    p.fertilizeLog = p.fertilizeLog || [];
    p.fertilizeLog.push(p.lastFertilized);
    if (p.fertilizeLog.length > 3650) p.fertilizeLog = p.fertilizeLog.slice(-3650);
    const rect = e.target.getBoundingClientRect();
    fireConfetti(rect.left + rect.width / 2, rect.top);
    playWaterSound();
    render();
    savePlants();
  };

  const rotateBtn = div.querySelector('#rotateBtn');
  if (rotateBtn) rotateBtn.onclick = (e) => {
    p.lastRotated = new Date().toISOString();
    const rect = e.target.getBoundingClientRect();
    fireConfetti(rect.left + rect.width / 2, rect.top);
    playClickSound();
    render();
    savePlants();
  };

  const checkinBtn = div.querySelector('#checkinBtn');
  if (checkinBtn) checkinBtn.onclick = () => {
    state.checkinPlantId = p.id;
    state.checkinDraftMood = null;
    state.showCheckinModal = true;
    render();
  };
  div.querySelector('#backToPlants').onclick = () => {
    state.mobileDetailOpen = false;
    render();
  };
  const nextPlantBtn = div.querySelector('#nextPlantBtn');
  if (nextPlantBtn) {
    nextPlantBtn.onclick = () => {
      const idx = state.plants.findIndex(x => x.id === p.id);
      const next = state.plants[(idx + 1) % state.plants.length];
      state.activeId = next.id;
      state.mobileDetailOpen = true;
      render();
    };
  }
  div.querySelector('#editBtn').onclick = () => {
    state.editingPlantId = p.id;
    state.pendingModalPhoto = p.photo || null;
    state.pendingSpecies = SPECIES_DICTIONARY.find(s => s.id === p.speciesId) || null;
    state.modalDraft = null;
    state.identifyResults = null;
    state.identifyError = null;
    state.showAddModal = true;
    render();
  };
  div.querySelector('#shareBtn').onclick = async (e) => {
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = 'Preparing…';
    btn.disabled = true;
    try {
      await shareCard(p);
    } catch (err) {
      alert("Couldn't create the share image. Try again.");
    }
    btn.textContent = originalText;
    btn.disabled = false;
  };
  div.querySelector('#removeBtn').onclick = () => {
    state.confirmDeletePlantId = p.id;
    render();
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

  const roomInput = div.querySelector('#roomInput');
  roomInput.addEventListener('blur', () => {
    p.room = roomInput.value.trim();
    render();
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

function captureModalDraft() {
  state.modalDraft = {
    name: document.getElementById('modalNameInput')?.value || '',
    room: document.getElementById('modalRoomInput')?.value || '',
    freq: document.getElementById('modalFreqInput')?.value || 7,
    twiceDaily: document.getElementById('modalTwiceDailyInput')?.checked || false,
  };
}

function renderModal() {
  const preview = state.pendingModalPhoto
    ? `<img src="${state.pendingModalPhoto}" alt="Selected plant photo preview" class="modal-photo-preview">`
    : '';
  const species = state.pendingSpecies;
  const editingPlant = state.editingPlantId ? state.plants.find(p => p.id === state.editingPlantId) : null;
  const isEditing = !!editingPlant;
  const draft = state.modalDraft;
  const nameVal = draft ? draft.name : (isEditing ? editingPlant.name : '');
  const roomVal = draft ? draft.room : (isEditing ? (editingPlant.room || '') : '');
  const freqVal = draft ? draft.freq : (isEditing ? editingPlant.frequency : (species ? species.freq : 7));
  const twiceDailyVal = draft ? draft.twiceDaily : (isEditing && !!editingPlant.twiceDaily);
  const showTwiceDaily = Number(freqVal) === 1;
  return `
  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal">
      <h3>${isEditing ? 'Edit plant' : 'Add a plant'}</h3>
      <div class="field">
        <label>Photo (optional)</label>
        <button class="id-photo-btn" id="modalPhotoBtn" type="button">📷 ${state.pendingModalPhoto ? 'Change photo' : 'Add a photo'}</button>
        <input type="file" id="modalPhotoInput" accept="image/*" capture="environment" style="display:none;">
        ${preview}
      </div>
      <div class="field">
        <label>Name</label>
        <input id="modalNameInput" placeholder="e.g. Fig in the corner" value="${nameVal}" aria-label="Plant name">
      </div>
      <div class="field">
        <label>Species</label>
        <button class="species-picker-btn" id="openSpeciesPicker" type="button">
          ${species ? `<span class="species-picker-emoji">${species.emoji}</span> ${species.name}` : (isEditing && editingPlant.species ? editingPlant.species : '🔍 Choose from the guide (optional)')}
        </button>
        <button class="id-photo-btn identify-btn" id="identifyBtn" type="button">🔍 Identify from a photo</button>
        <input type="file" id="identifyInput" accept="image/*" capture="environment" style="display:none;">
        ${state.identifyLoading ? `<div class="identify-status">Identifying…</div>` : ''}
        ${state.identifyError ? `<div class="identify-status identify-error">${escapeHtml(state.identifyError)}</div>` : ''}
        ${state.identifyResults && state.identifyResults.length ? `
          <div class="identify-results">
            ${state.identifyResults.map((r, i) => `
              <button type="button" class="identify-result" data-idx="${i}">
                <span class="identify-result-name">${escapeHtml(r.commonNames[0] || r.scientificName)}</span>
                <span class="identify-result-latin">${escapeHtml(r.scientificName)}</span>
                <span class="identify-result-score">${Math.round(r.score * 100)}%</span>
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="field">
        <label>Room (optional)</label>
        <input id="modalRoomInput" placeholder="e.g. Kitchen, Bedroom, Balcony" value="${roomVal}" aria-label="Room">
      </div>
      <div class="field">
        <label>Water every how many days?</label>
        <input id="modalFreqInput" type="number" min="1" value="${freqVal}" aria-label="Water every how many days">
        <div class="freq-hint">Most houseplants: 5–10 days. Succulents: 14–21.</div>
      </div>
      <div class="field checkbox-field" id="twiceDailyField" style="${showTwiceDaily ? '' : 'display:none;'}">
        <label class="checkbox-label">
          <input type="checkbox" id="modalTwiceDailyInput" ${twiceDailyVal ? 'checked' : ''}>
          Water twice a day (morning &amp; night)
        </label>
      </div>
      <div class="modal-actions">
        <button class="secondary" id="cancelModal">Cancel</button>
        <button class="primary" id="saveModal">${isEditing ? 'Save changes' : 'Add plant'}</button>
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

function wireIdentify() {
  const btn = document.getElementById('identifyBtn');
  const input = document.getElementById('identifyInput');
  if (!btn || !input) return;
  btn.onclick = () => input.click();
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await identifyPhoto(file);
  };

  document.querySelectorAll('.identify-result').forEach((el) => {
    el.onclick = () => {
      const idx = parseInt(el.dataset.idx, 10);
      const result = state.identifyResults[idx];
      if (!result) return;
      applyIdentifyResult(result);
    };
  });
}

async function identifyPhoto(file) {
  state.identifyLoading = true;
  state.identifyError = null;
  state.identifyResults = null;
  render();
  try {
    const dataUrl = await resizeImageToDataUrl(file, 1024);
    const res = await fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: dataUrl, organ: 'leaf' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not identify this photo.');
    state.identifyResults = data.results || [];
    if (!state.identifyResults.length) {
      state.identifyError = "Couldn't find a confident match — try a clearer, closer photo of a leaf.";
    }
  } catch (err) {
    state.identifyError = err.message || 'Something went wrong — try again.';
  }
  state.identifyLoading = false;
  render();
}

// If the identified species roughly matches something in our built-in
// dictionary (by scientific name), use that richer entry — correct emoji,
// watering frequency, and care notes — instead of a generic placeholder.
function matchSpeciesDictionary(scientificName) {
  const normalized = scientificName.toLowerCase().trim();
  const genusSpecies = normalized.split(' ').slice(0, 2).join(' ');
  return SPECIES_DICTIONARY.find((s) => {
    const latin = (s.latin || '').toLowerCase();
    if (!latin || latin.includes('assorted') || latin.includes('spp.')) return false;
    return latin === normalized || latin === genusSpecies || normalized.includes(latin) || latin.includes(genusSpecies);
  });
}

function applyIdentifyResult(result) {
  const commonName = result.commonNames && result.commonNames[0];
  const matched = matchSpeciesDictionary(result.scientificName);
  if (matched) {
    state.pendingSpecies = matched;
  } else {
    state.pendingSpecies = {
      id: null,
      name: commonName || result.scientificName,
      latin: result.scientificName,
      emoji: '🌿',
      freq: 7,
      desc: '',
    };
  }
  state.identifyResults = null;
  state.identifyError = null;
  render();
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
  if (e.target.id === 'modalBackdrop') { state.showAddModal = false; state.editingPlantId = null; state.modalDraft = null; state.identifyResults = null; state.identifyError = null; render(); }
  if (e.target.id === 'cancelModal') { state.showAddModal = false; state.editingPlantId = null; state.modalDraft = null; state.identifyResults = null; state.identifyError = null; render(); }
  if (e.target.id === 'badgesBackdrop') { state.showBadgesModal = false; render(); }
  if (e.target.id === 'closeBadges') { state.showBadgesModal = false; render(); }
  if (e.target.id === 'speciesPickerBackdrop') { state.showSpeciesPicker = false; render(); }
  if (e.target.id === 'cancelSpeciesPicker') { state.showSpeciesPicker = false; render(); }
  if (e.target.id === 'themeBackdrop') { state.showThemeModal = false; render(); }
  if (e.target.id === 'inviteBackdrop') { state.showInviteModal = false; render(); }
  if (e.target.id === 'closeInvite') { state.showInviteModal = false; render(); }
  if (e.target.id === 'aboutBackdrop') { state.showAboutModal = false; render(); }
  if (e.target.id === 'closeAbout') { state.showAboutModal = false; render(); }
  if (e.target.id === 'deleteConfirmBackdrop') { state.confirmDeletePlantId = null; render(); }
  if (e.target.id === 'cancelDeletePlant') { state.confirmDeletePlantId = null; render(); }
  if (e.target.id === 'confirmDeletePlant') { performPlantDelete(state.confirmDeletePlantId); }
  if (e.target.id === 'syncBackdrop') { state.showSyncModal = false; render(); }
  if (e.target.id === 'cancelSyncModal') { state.showSyncModal = false; render(); }
  if (e.target.id === 'closeSyncModal') { state.showSyncModal = false; render(); }
  if (e.target.id === 'createSyncCode') { createAndPushSyncCode(); }
  if (e.target.id === 'joinSyncCode') {
    const input = document.getElementById('syncCodeInput');
    const code = (input?.value || '').trim().toUpperCase();
    if (code.length >= 4) joinExistingSyncCode(code);
  }
  if (e.target.id === 'pullSyncNow') { pullSyncNow(); }
  if (e.target.id === 'stopSyncing') { stopSyncing(); }
  if (e.target.id === 'copySyncCode') {
    navigator.clipboard?.writeText(state.syncCode).then(() => {
      const btn = document.getElementById('copySyncCode');
      if (btn) { const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = orig; }, 1500); }
    }).catch(() => {});
  }
  if (e.target.id === 'leaderboardBackdrop') { state.showLeaderboardModal = false; render(); }
  if (e.target.id === 'cancelLeaderboardModal') { state.showLeaderboardModal = false; render(); }
  if (e.target.id === 'closeLeaderboardModal') { state.showLeaderboardModal = false; render(); }
  if (e.target.id === 'leaderboardTabStreak') { state.leaderboardTab = 'streak'; render(); }
  if (e.target.id === 'leaderboardTabPlants') { state.leaderboardTab = 'plants'; render(); }
  if (e.target.id === 'leaderboardTabRaindrop') { state.leaderboardTab = 'raindrop'; render(); }
  if (e.target.id === 'leaderboardTabMemory') { state.leaderboardTab = 'memory'; render(); }
  if (e.target.id === 'joinLeaderboardBtn') {
    const input = document.getElementById('leaderboardNicknameInput');
    const nickname = input ? input.value.trim() : '';
    if (!nickname) {
      state.leaderboardError = 'Enter a nickname first.';
      render();
    } else {
      joinLeaderboard(nickname);
    }
  }
  if (e.target.id === 'leaveLeaderboardBtn') {
    if (confirm('Remove your nickname and scores from the public leaderboard?')) {
      leaveLeaderboard();
    }
  }
  if (e.target.id === 'dismissWelcome') {
    state.showWelcome = false;
    localStorage.setItem('plant-parent-welcome-seen', '1');
    render();
  }
  if (e.target.id === 'shareInvite') { shareAppLink(); }
  if (e.target.id === 'copyInviteLink') { copyInviteLink(); }
  if (e.target.id === 'closeTheme') { state.showThemeModal = false; render(); }
  if (e.target.closest && e.target.closest('.theme-option')) {
    const btn = e.target.closest('.theme-option');
    applyTheme(btn.dataset.theme);
    render();
  }
  if (e.target.id === 'propModalBackdrop') { state.showAddPropModal = false; render(); }
  if (e.target.id === 'cancelPropModal') { state.showAddPropModal = false; render(); }
  if (e.target.id === 'checkinBackdrop') { state.showCheckinModal = false; state.checkinDraftMood = null; render(); }
  if (e.target.id === 'cancelCheckinModal') { state.showCheckinModal = false; state.checkinDraftMood = null; render(); }
  if (e.target.closest && e.target.closest('.mood-option')) {
    const btn = e.target.closest('.mood-option');
    state.checkinDraftMood = btn.dataset.mood;
    // Update selection styling directly instead of a full render() —
    // a full re-render would wipe out any note text already typed below.
    document.querySelectorAll('.mood-option').forEach(el => el.classList.remove('mood-option-selected'));
    btn.classList.add('mood-option-selected');
  }
  if (e.target.id === 'saveCheckinModal') {
    const p = state.plants.find(x => x.id === state.checkinPlantId);
    if (p) {
      const noteInput = document.getElementById('checkinNoteInput');
      const note = noteInput ? noteInput.value.trim() : '';
      p.healthLog = p.healthLog || [];
      p.healthLog.push({ date: new Date().toISOString(), mood: state.checkinDraftMood || 'okay', note });
      if (p.healthLog.length > 500) p.healthLog = p.healthLog.slice(-500);
      savePlants();
    }
    state.showCheckinModal = false;
    state.checkinDraftMood = null;
    render();
  }
  if (e.target.id === 'savePropModal') {
    const name = document.getElementById('propNameInput').value.trim();
    const notes = document.getElementById('propNotesInput').value.trim();
    if (!name) return;
    state.propagations.push({
      id: nextId++,
      name,
      notes,
      startDate: new Date().toISOString(),
    });
    state.showAddPropModal = false;
    savePropagations();
    render();
  }
  if (e.target.id === 'saveModal') {
    const name = document.getElementById('modalNameInput').value.trim();
    const freq = parseInt(document.getElementById('modalFreqInput').value, 10) || 7;
    const room = document.getElementById('modalRoomInput').value.trim();
    const twiceDaily = freq === 1 && document.getElementById('modalTwiceDailyInput').checked;
    if (!name) return;
    const species = state.pendingSpecies;

    if (state.editingPlantId) {
      const p = state.plants.find(x => x.id === state.editingPlantId);
      if (p) {
        p.name = name;
        p.frequency = freq;
        p.room = room;
        p.twiceDaily = twiceDaily;
        p.photo = state.pendingModalPhoto || null;
        if (species) {
          p.species = species.name;
          p.speciesId = species.id;
          p.speciesDesc = species.desc;
        }
      }
      state.editingPlantId = null;
    } else {
      const now = new Date(Date.now() - (freq-1)*24*60*60*1000).toISOString();
      const p = {
        id: nextId++,
        name,
        species: species ? species.name : '',
        speciesId: species ? species.id : null,
        speciesDesc: species ? species.desc : '',
        room,
        frequency: freq,
        twiceDaily,
        lastWatered: now,
        waterLog: [],
        photo: state.pendingModalPhoto || null,
        notes: '',
        createdAt: new Date().toISOString()
      };
      state.plants.push(p);
      state.activeId = p.id;
    }

    state.showAddModal = false;
    state.pendingModalPhoto = null;
    state.pendingSpecies = null;
    state.modalDraft = null;
    state.identifyResults = null;
    state.identifyError = null;
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

function savePlantsLocalOnly() {
  try {
    localStorage.setItem('plant-parent-plants', JSON.stringify(state.plants));
  } catch (err) {
    console.error('Could not save plants locally', err);
  }
  checkAchievements();
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
      body: JSON.stringify({ deviceId: getDeviceId(), plants: state.plants, syncCode: state.syncCode || undefined })
    });
  } catch (err) {
    // offline or backend not deployed yet — local storage still has the data
  }
}

// ---------- multi-device sync ----------

function generateSyncCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function renderSyncModal() {
  const status = state.syncStatus;
  return `
  <div class="modal-backdrop" id="syncBackdrop">
    <div class="modal sync-modal">
      <h3>Sync across devices</h3>
      ${state.syncCode ? `
        <p class="about-story">This device is linked with the code below. Enter the same code in Plant Parent on another device to see the same plants there.</p>
        <div class="sync-code-display">${state.syncCode}</div>
        <div class="modal-actions">
          <button class="secondary" id="copySyncCode">Copy code</button>
          <button class="primary" id="pullSyncNow">🔄 Sync now</button>
        </div>
        <button class="sync-stop-btn" id="stopSyncing">Stop syncing this device</button>
      ` : `
        <p class="about-story">Link this device with another so you see the same plants on both. No account needed — just a short code.</p>
        <div class="sync-choice-row">
          <button class="primary" id="createSyncCode">✨ Create a new sync code</button>
        </div>
        <div class="sync-divider">or</div>
        <div class="field">
          <label>Enter a code from another device</label>
          <input id="syncCodeInput" placeholder="e.g. AB12CD" maxlength="6" style="text-transform:uppercase;">
        </div>
        <div class="modal-actions">
          <button class="secondary" id="cancelSyncModal">Cancel</button>
          <button class="primary" id="joinSyncCode">Link this device</button>
        </div>
      `}
      ${status ? `<div class="sync-status">${status}</div>` : ''}
      ${state.syncCode ? `<div class="modal-actions"><button class="secondary" id="closeSyncModal">Close</button></div>` : ''}
    </div>
  </div>`;
}

// ---------- community leaderboard ----------

function getBestStreak() {
  let best = 0;
  for (const p of state.plants) {
    const s = calcStreak(p);
    if (s > best) best = s;
  }
  return best;
}

async function fetchLeaderboard() {
  state.leaderboardLoading = true;
  state.leaderboardError = null;
  render();
  try {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not load leaderboard');
    state.leaderboardData = { streaks: data.streaks || [], plants: data.plants || [], raindrop: data.raindrop || [], memory: data.memory || [] };
  } catch (err) {
    state.leaderboardError = "Couldn't load the leaderboard right now — try again in a bit.";
  }
  state.leaderboardLoading = false;
  render();
}

async function joinLeaderboard(nickname) {
  state.leaderboardError = null;
  state.leaderboardLoading = true;
  render();
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        nickname,
        bestStreak: getBestStreak(),
        plantCount: state.plants.length,
        gameHighScore: state.gameHighScore || 0,
        memoryHighScore: state.memoryHighScore || 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not join the leaderboard');
    state.leaderboardJoined = true;
    state.leaderboardNickname = data.nickname;
    localStorage.setItem('plant-parent-leaderboard-joined', '1');
    localStorage.setItem('plant-parent-leaderboard-nickname', data.nickname);
    await fetchLeaderboard();
  } catch (err) {
    state.leaderboardError = err.message || "Couldn't join the leaderboard right now.";
    state.leaderboardLoading = false;
    render();
  }
}

async function refreshMyLeaderboardStats() {
  if (!state.leaderboardJoined) return;
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        nickname: state.leaderboardNickname,
        bestStreak: getBestStreak(),
        plantCount: state.plants.length,
        gameHighScore: state.gameHighScore || 0,
        memoryHighScore: state.memoryHighScore || 0,
      }),
    });
  } catch (err) {
    // best-effort — the leaderboard will just show slightly stale numbers
  }
}

async function leaveLeaderboard() {
  state.leaderboardLoading = true;
  render();
  try {
    await fetch('/api/leaderboard', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: getDeviceId() }),
    });
  } catch (err) {
    // best-effort — proceed to clear locally regardless
  }
  state.leaderboardJoined = false;
  state.leaderboardNickname = '';
  localStorage.setItem('plant-parent-leaderboard-joined', '0');
  localStorage.removeItem('plant-parent-leaderboard-nickname');
  state.leaderboardLoading = false;
  render();
}

function renderLeaderboardModal() {
  const myId = getDeviceId();
  const TAB_CONFIG = {
    streak: { data: state.leaderboardData.streaks, unit: 'day streak' },
    plants: { data: state.leaderboardData.plants, unit: 'plant' },
    raindrop: { data: state.leaderboardData.raindrop, unit: 'point' },
    memory: { data: state.leaderboardData.memory, unit: 'point' },
  };
  const { data: list, unit } = TAB_CONFIG[state.leaderboardTab] || TAB_CONFIG.streak;

  return `
  <div class="modal-backdrop" id="leaderboardBackdrop">
    <div class="modal leaderboard-modal">
      <h3>🏆 Leaderboard</h3>
      ${!state.leaderboardJoined ? `
        <p class="about-story">See how your garden compares with everyone else using Plant Parent. Your nickname, watering streak, plant count, and mini-game high scores are visible to anyone who opens this leaderboard — no other info about you or your plants is shared.</p>
        <div class="field">
          <label>Choose a nickname</label>
          <input id="leaderboardNicknameInput" placeholder="e.g. Fern Whisperer" maxlength="20">
        </div>
        ${state.leaderboardError ? `<div class="sync-status">${state.leaderboardError}</div>` : ''}
        <div class="modal-actions">
          <button class="secondary" id="cancelLeaderboardModal">Not now</button>
          <button class="primary" id="joinLeaderboardBtn" ${state.leaderboardLoading ? 'disabled' : ''}>${state.leaderboardLoading ? 'Joining…' : 'Join leaderboard'}</button>
        </div>
      ` : `
        <div class="leaderboard-tabs">
          <button class="leaderboard-tab ${state.leaderboardTab === 'streak' ? 'leaderboard-tab-active' : ''}" id="leaderboardTabStreak">🔥 Streak</button>
          <button class="leaderboard-tab ${state.leaderboardTab === 'plants' ? 'leaderboard-tab-active' : ''}" id="leaderboardTabPlants">🪴 Plants</button>
          <button class="leaderboard-tab ${state.leaderboardTab === 'raindrop' ? 'leaderboard-tab-active' : ''}" id="leaderboardTabRaindrop">💧 Raindrop</button>
          <button class="leaderboard-tab ${state.leaderboardTab === 'memory' ? 'leaderboard-tab-active' : ''}" id="leaderboardTabMemory">🧠 Memory</button>
        </div>
        ${state.leaderboardLoading ? `<div class="sync-status">Loading…</div>` : ''}
        ${state.leaderboardError ? `<div class="sync-status">${state.leaderboardError}</div>` : ''}
        ${!state.leaderboardLoading && list.length === 0 ? `<div class="sync-status">No one's on the board yet — be the first!</div>` : ''}
        ${list.length ? `
          <ol class="leaderboard-list">
            ${list.map((entry, i) => `
              <li class="leaderboard-row ${entry.deviceId === myId ? 'leaderboard-row-me' : ''}">
                <span class="leaderboard-rank">${i + 1}</span>
                <span class="leaderboard-name">${escapeHtml(entry.nickname)}${entry.deviceId === myId ? ' (you)' : ''}</span>
                <span class="leaderboard-value">${entry.value} ${unit}${entry.value === 1 ? '' : 's'}</span>
              </li>
            `).join('')}
          </ol>
        ` : ''}
        <div class="modal-actions">
          <button class="secondary" id="leaveLeaderboardBtn">Leave leaderboard</button>
          <button class="primary" id="closeLeaderboardModal">Close</button>
        </div>
      `}
    </div>
  </div>`;
}

async function createAndPushSyncCode() {
  localStorage.removeItem('plant-parent-pre-sync-backup');
  state.syncCode = generateSyncCode();
  localStorage.setItem('plant-parent-sync-code', state.syncCode);
  state.syncStatus = 'Setting up…';
  render();
  await syncToServer();
  state.syncStatus = 'Ready! Enter this code on your other device.';
  render();
}

async function joinExistingSyncCode(code) {
  state.syncStatus = 'Looking for that code…';
  render();
  try {
    const res = await fetch('/api/sync-pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncCode: code })
    });
    const data = await res.json();
    if (!res.ok) {
      state.syncStatus = data.error || "Couldn't find that code. Double check it and try again.";
      render();
      return;
    }
    const confirmed = confirm(`This will replace your current ${state.plants.length} plant(s) with ${data.plants.length} plant(s) from the linked device. Continue?`);
    if (!confirmed) {
      state.syncStatus = null;
      render();
      return;
    }
    // Save what this device had before joining, so "Stop syncing" can restore it later.
    try {
      localStorage.setItem('plant-parent-pre-sync-backup', JSON.stringify(state.plants));
    } catch (err) {
      // if this fails, stopping sync later will just keep the synced list instead of restoring
    }
    state.plants = data.plants;
    nextId = state.plants.length ? Math.max(...state.plants.map(p => p.id)) + 1 : 1;
    state.syncCode = code;
    localStorage.setItem('plant-parent-sync-code', code);
    state.activeId = null;
    state.syncStatus = 'Linked and up to date!';
    render();
    savePlants();
  } catch (err) {
    state.syncStatus = "Couldn't reach the server. Check your connection and try again.";
    render();
  }
}

async function pullSyncNow() {
  if (!state.syncCode) return;
  state.syncStatus = 'Checking for updates…';
  render();
  try {
    const res = await fetch('/api/sync-pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncCode: state.syncCode })
    });
    const data = await res.json();
    if (!res.ok) {
      state.syncStatus = data.error || 'Nothing to sync yet.';
      render();
      return;
    }
    state.plants = data.plants;
    nextId = state.plants.length ? Math.max(...state.plants.map(p => p.id)) + 1 : 1;
    state.activeId = null;
    state.syncStatus = 'Up to date!';
    render();
    savePlantsLocalOnly();
  } catch (err) {
    state.syncStatus = "Couldn't reach the server.";
    render();
  }
}

function stopSyncing() {
  let backup = null;
  try {
    const raw = localStorage.getItem('plant-parent-pre-sync-backup');
    if (raw) backup = JSON.parse(raw);
  } catch (err) {
    backup = null;
  }

  if (backup && Array.isArray(backup)) {
    const restore = confirm(`Restore the ${backup.length} plant(s) this device had before you joined the sync? Choose "Cancel" to keep the currently synced list instead.`);
    if (restore) {
      state.plants = backup;
      nextId = state.plants.length ? Math.max(...state.plants.map(p => p.id)) + 1 : 1;
      state.activeId = null;
    }
  }

  localStorage.removeItem('plant-parent-pre-sync-backup');
  state.syncCode = null;
  localStorage.removeItem('plant-parent-sync-code');
  state.showSyncModal = false;
  state.syncStatus = null;
  render();
  savePlantsLocalOnly();
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

loadPlants();
state.activeId = null;
state.notificationsEnabled = localStorage.getItem('plant-parent-notifications-enabled') === '1';
try {
  state.unlockedAchievements = JSON.parse(localStorage.getItem('plant-parent-achievements') || '[]');
} catch (err) {
  state.unlockedAchievements = [];
}
state.gameHighScore = parseInt(localStorage.getItem('plant-parent-game-highscore') || '0', 10) || 0;
state.weatherEnabled = localStorage.getItem('plant-parent-weather-enabled') === '1';
try {
  state.weatherNudge = JSON.parse(localStorage.getItem('plant-parent-weather-nudge') || 'null');
} catch (err) {
  state.weatherNudge = null;
}
state.seasonalTipsEnabled = localStorage.getItem('plant-parent-seasonal-tips') !== '0';
state.leaderboardJoined = localStorage.getItem('plant-parent-leaderboard-joined') === '1';
state.leaderboardNickname = localStorage.getItem('plant-parent-leaderboard-nickname') || '';
const storedLatitude = localStorage.getItem('plant-parent-latitude');
state.latitude = storedLatitude !== null ? parseFloat(storedLatitude) : null;
loadPropagations();
state.theme = localStorage.getItem('plant-parent-theme') || 'sage';
document.body.dataset.theme = state.theme;
const storedDarkMode = localStorage.getItem('plant-parent-dark-mode');
state.darkMode = storedDarkMode !== null
  ? storedDarkMode === '1'
  : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
document.body.dataset.mode = state.darkMode ? 'dark' : 'light';
state.soundEnabled = localStorage.getItem('plant-parent-sound') !== '0';
state.memoryGameCompleted = localStorage.getItem('plant-parent-memory-completed') === '1';
state.memoryHighScore = parseInt(localStorage.getItem('plant-parent-memory-highscore') || '0', 10) || 0;
state.hasInvited = localStorage.getItem('plant-parent-has-invited') === '1';
state.showWelcome = localStorage.getItem('plant-parent-welcome-seen') !== '1';
state.syncCode = localStorage.getItem('plant-parent-sync-code') || null;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.error('SW registration failed', err));
}

render();
maybeRefreshWeather();
hideLoadingScreen();

// If this device is linked to a sync code, quietly check for updates from
// other linked devices right on startup (no confirmation needed here since
// it's a normal refresh, not a first-time link).
if (state.syncCode) {
  (async () => {
    try {
      const res = await fetch('/api/sync-pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncCode: state.syncCode })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.plants)) {
        state.plants = data.plants;
        nextId = state.plants.length ? Math.max(...state.plants.map(p => p.id)) + 1 : 1;
        render();
        savePlantsLocalOnly();
      }
    } catch (err) {
      // offline or nothing to sync yet — local data stays as-is
    }
  })();
}
