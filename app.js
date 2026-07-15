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
  { id: 'bird-of-paradise', name: 'Bird of Paradise', latin: 'Strelitzia reginae', emoji: '🦩', light: 'Bright, direct to indirect', freq: 8, desc: 'A dramatic statement plant with large paddle leaves. Likes generous space and regular feeding.' },
  { id: 'calathea', name: 'Calathea', latin: 'Calathea spp.', emoji: '🎋', light: 'Medium, indirect', freq: 6, desc: 'Prized for patterned leaves that fold up at night. Fussy about humidity and water quality.' },
  { id: 'jade-plant', name: 'Jade Plant', latin: 'Crassula ovata', emoji: '🪙', light: 'Bright, direct', freq: 16, desc: 'A classic succulent that can live for decades. Let it dry out fully between waterings.' },
  { id: 'dracaena', name: 'Dracaena', latin: 'Dracaena spp.', emoji: '🌴', light: 'Low to bright, indirect', freq: 10, desc: 'Tall and architectural, tolerant of a wide range of light. Sensitive to fluoride in tap water.' },
  { id: 'croton', name: 'Croton', latin: 'Codiaeum variegatum', emoji: '🍁', light: 'Bright, direct', freq: 6, desc: 'Bold, colorful leaves that need strong light to keep their vivid patterns.' },
  { id: 'anthurium', name: 'Anthurium', latin: 'Anthurium andraeanum', emoji: '❤️', light: 'Bright, indirect', freq: 8, desc: 'Glossy, heart-shaped blooms. Likes humidity and to dry slightly between waterings.' },
  { id: 'chinese-money-plant', name: 'Chinese Money Plant', latin: 'Pilea peperomioides', emoji: '🪙', light: 'Bright, indirect', freq: 7, desc: 'Round coin-like leaves on a plant that\'s easy to propagate and share with friends.' },
  { id: 'air-plant', name: 'Air Plant', latin: 'Tillandsia spp.', emoji: '🌬️', light: 'Bright, indirect', freq: 7, desc: 'No soil needed — mist or soak occasionally instead of traditional watering.' },
  { id: 'christmas-cactus', name: 'Christmas Cactus', latin: 'Schlumbergera', emoji: '🎄', light: 'Bright, indirect', freq: 10, desc: 'Unlike desert cacti, this one prefers slightly moist soil and blooms in winter.' },
  { id: 'english-ivy', name: 'English Ivy', latin: 'Hedera helix', emoji: '🍇', light: 'Medium, indirect', freq: 6, desc: 'A fast, trailing climber. Keep soil lightly moist and give it room to spread.' },
  { id: 'prayer-plant', name: 'Prayer Plant', latin: 'Maranta leuconeura', emoji: '🙏', light: 'Medium, indirect', freq: 6, desc: 'Leaves fold up like praying hands at night. Enjoys humidity and consistent moisture.' },
  { id: 'hoya', name: 'Hoya', latin: 'Hoya carnosa', emoji: '💫', light: 'Bright, indirect', freq: 12, desc: 'Waxy leaves and star-shaped, fragrant blooms. Prefers to dry out well between waterings.' },
  { id: 'other', name: 'Other / not sure', latin: '', emoji: '❓', light: 'Varies', freq: 7, desc: '' },
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
  { id: 'rainmaker', emoji: '💧', name: 'Rainmaker', desc: 'Score 15+ in Raindrop Catch' },
  { id: 'sharpshooter', emoji: '🎯', name: 'Sharpshooter', desc: 'Score 25+ in Raindrop Catch' },
  { id: 'memory-master', emoji: '🧠', name: 'Memory Master', desc: 'Complete a round of Memory Match' },
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
  editingPlantId: null, // if set, the Add Plant modal is in edit mode for this plant
  unlockedAchievements: [],
  gameHighScore: 0,
  celebrationQueue: [],
  currentView: 'shelf', // 'shelf' | 'garden' | 'dictionary'
  sortBy: 'urgent', // 'urgent' | 'az' | 'room'
  filterRoom: null, // null = all rooms
  weatherEnabled: false,
  weatherNudge: null, // { text, emoji } once fetched
  mobileDetailOpen: false,
  theme: 'sage',
  showThemeModal: false,
  propagations: [],
  showAddPropModal: false,
  memoryGameCompleted: false,
  showInviteModal: false,
  showAboutModal: false,
  showWelcome: false,
  hasInvited: false,
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

function getRoomList() {
  const rooms = new Set();
  state.plants.forEach(p => { if (p.room && p.room.trim()) rooms.add(p.room.trim()); });
  return Array.from(rooms).sort();
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
  if (state.memoryGameCompleted) unlock('memory-master');
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
      <div class="about-testimonials">
        <div class="about-testimonial">"I haven't lost a plant since I started using this." <span>— early tester</span></div>
        <div class="about-testimonial">"The garden view is genuinely satisfying to check every day." <span>— early tester</span></div>
      </div>
      <div class="modal-actions">
        <button class="secondary" id="closeAbout">Close</button>
      </div>
    </div>
  </div>`;
}

// ---------- invite / share app ----------

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
    <div class="main-content">
      ${state.currentView !== 'garden' && state.currentView !== 'dictionary' ? `
        <header>
          <div class="header-flourish">🌿</div>
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

        ${state.weatherEnabled && state.weatherNudge ? `
          <div class="weather-card">
            <div class="weather-emoji">${state.weatherNudge.emoji}</div>
            <div class="weather-text">${state.weatherNudge.text}</div>
          </div>
        ` : ''}
      ` : ''}

      ${state.currentView === 'garden' ? `<div id="gardenView"></div>` : ''}
      ${state.currentView === 'dictionary' ? `<div id="dictionaryView"></div>` : ''}
      ${state.currentView === 'journal' ? `<div id="journalView"></div>` : ''}
      ${state.currentView === 'propagation' ? `<div id="propagationView"></div>` : ''}
      ${state.currentView === 'shelf' ? `
        <div class="layout ${state.mobileDetailOpen ? 'mobile-detail-open' : ''}">
          <div class="shelf-column">
            <div class="shelf-controls">
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
        <span class="bottom-nav-icon">🪴</span><span class="bottom-nav-label">Plants</span>
      </button>
      <button class="bottom-nav-btn ${state.currentView === 'garden' ? 'bottom-nav-active' : ''}" id="navGarden">
        <span class="bottom-nav-icon">🌻</span><span class="bottom-nav-label">Garden</span>
      </button>
      <button class="bottom-nav-btn ${state.currentView === 'dictionary' ? 'bottom-nav-active' : ''}" id="navDictionary">
        <span class="bottom-nav-icon">📖</span><span class="bottom-nav-label">Guide</span>
      </button>
      <button class="bottom-nav-btn ${state.showMoreMenu ? 'bottom-nav-active' : ''}" id="navMore">
        <span class="bottom-nav-icon">⋯</span><span class="bottom-nav-label">More</span>
      </button>
    </nav>

    ${state.showMoreMenu ? `
      <div class="more-menu-backdrop" id="moreMenuBackdrop">
        <div class="more-menu">
          <button class="more-menu-item" id="navJournal">
            <span class="more-menu-icon">📓</span>
            <span>Journal</span>
          </button>
          <button class="more-menu-item" id="navPropagation">
            <span class="more-menu-icon">🌱</span>
            <span>Cuttings${state.propagations.length ? ` (${state.propagations.length})` : ''}</span>
          </button>
          <div class="more-menu-divider"></div>
          <button class="more-menu-item" id="navBadges">
            <span class="more-menu-icon">🏆</span>
            <span>Badges <strong>${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}</strong></span>
          </button>
          <button class="more-menu-item" id="navGame">
            <span class="more-menu-icon">🎮</span>
            <span>Raindrop Catch${state.gameHighScore ? ` · best ${state.gameHighScore}` : ''}</span>
          </button>
          <button class="more-menu-item" id="navMemoryGame">
            <span class="more-menu-icon">🧠</span>
            <span>Memory Match</span>
          </button>
          <div class="more-menu-divider"></div>
          <button class="more-menu-item" id="navNotif">
            <span class="more-menu-icon">${state.notificationsEnabled ? '🔔' : '🔕'}</span>
            <span>${state.notificationsEnabled ? 'Reminders on' : 'Enable reminders'}</span>
          </button>
          <button class="more-menu-item" id="navWeather">
            <span class="more-menu-icon">${state.weatherEnabled ? '🌦️' : '⛅'}</span>
            <span>${state.weatherEnabled ? 'Weather tips on' : 'Enable weather tips'}</span>
          </button>
          <button class="more-menu-item" id="navTheme">
            <span class="more-menu-icon">🎨</span>
            <span>Theme: ${THEMES.find(t => t.id === state.theme)?.name || 'Sage'}</span>
          </button>
          <div class="more-menu-divider"></div>
          <button class="more-menu-item" id="navInvite">
            <span class="more-menu-icon">💌</span>
            <span>Invite a friend</span>
          </button>
          <button class="more-menu-item" id="navAbout">
            <span class="more-menu-icon">🌱</span>
            <span>About Plant Parent</span>
          </button>
          <div class="more-menu-divider"></div>
          <button class="more-menu-item" id="navExport">
            <span class="more-menu-icon">⬇️</span>
            <span>Back up my plants</span>
          </button>
          <button class="more-menu-item" id="navImport">
            <span class="more-menu-icon">⬆️</span>
            <span>Restore from backup</span>
          </button>
          <input type="file" id="importFileInput" accept="application/json" style="display:none;">
        </div>
      </div>
    ` : ''}
    ${state.showInviteModal ? renderInviteModal() : ''}
    ${state.showAboutModal ? renderAboutModal() : ''}
    ${state.showWelcome ? renderWelcome() : ''}

    ${state.showAddModal ? renderModal() : ''}
    ${state.showBadgesModal ? renderBadgesModal() : ''}
    ${state.showSpeciesPicker ? renderSpeciesPicker() : ''}
    ${state.showThemeModal ? renderThemeModal() : ''}
    ${state.showAddPropModal ? renderAddPropModal() : ''}
  `;

  if (state.currentView === 'garden') {
    document.getElementById('gardenView').appendChild(renderGarden());
  } else if (state.currentView === 'dictionary') {
    document.getElementById('dictionaryView').appendChild(renderDictionary());
  } else if (state.currentView === 'journal') {
    document.getElementById('journalView').appendChild(renderJournal());
  } else if (state.currentView === 'propagation') {
    document.getElementById('propagationView').appendChild(renderPropagation());
  } else {
    const shelf = document.getElementById('shelf');
    getVisiblePlants().forEach(p => shelf.appendChild(renderCard(p)));
    const addBtn = document.createElement('div');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+ Add a plant';
    addBtn.onclick = () => { state.pendingModalPhoto = null; state.pendingSpecies = null; state.editingPlantId = null; state.showAddModal = true; render(); };
    shelf.appendChild(addBtn);

    const panel = document.getElementById('panel');
    panel.innerHTML = '';
    panel.appendChild(active ? renderDetail(active) : renderEmpty());

    document.getElementById('sortSelect').onchange = (e) => { state.sortBy = e.target.value; render(); };
    document.querySelectorAll('.room-chip').forEach(chip => {
      chip.onclick = () => { state.filterRoom = chip.dataset.room || null; render(); };
    });
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
    document.getElementById('navNotif').onclick = () => { state.showMoreMenu = false; enableNotifications(); };
    document.getElementById('navWeather').onclick = () => { state.showMoreMenu = false; render(); toggleWeather(); };
    document.getElementById('navExport').onclick = () => { state.showMoreMenu = false; render(); exportBackup(); };
    document.getElementById('navImport').onclick = () => { document.getElementById('importFileInput').click(); };
    document.getElementById('importFileInput').onchange = (e) => {
      const file = e.target.files[0];
      state.showMoreMenu = false;
      render();
      if (file) importBackup(file);
    };
    document.getElementById('navBadges').onclick = () => { state.showMoreMenu = false; state.showBadgesModal = true; render(); };
    document.getElementById('navGame').onclick = () => { state.showMoreMenu = false; render(); if (window.openMiniGame) window.openMiniGame(); };
    document.getElementById('navMemoryGame').onclick = () => { state.showMoreMenu = false; render(); if (window.openMemoryGame) window.openMemoryGame(); };
    document.getElementById('navJournal').onclick = () => { state.currentView = 'journal'; state.showMoreMenu = false; render(); };
    document.getElementById('navPropagation').onclick = () => { state.currentView = 'propagation'; state.showMoreMenu = false; render(); };
    document.getElementById('navTheme').onclick = () => { state.showMoreMenu = false; state.showThemeModal = true; render(); };
    document.getElementById('navInvite').onclick = () => { state.showMoreMenu = false; state.showInviteModal = true; render(); };
    document.getElementById('navAbout').onclick = () => { state.showMoreMenu = false; state.showAboutModal = true; render(); };
    document.getElementById('moreMenuBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'moreMenuBackdrop') { state.showMoreMenu = false; render(); }
    });
  }

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
      state.editingPlantId = null;
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
  return (plant.waterLog || []).some(iso => {
    if (iso.slice(0, 10) !== today) return false;
    const hour = new Date(iso).getHours();
    return slot === 'morning' ? hour < 12 : hour >= 12;
  });
}

function renderDetail(p) {
  const div = document.createElement('div');
  const left = daysLeft(p);
  const streak = calcStreak(p);
  const log = (p.waterLog || []).slice(-5).reverse();

  div.innerHTML = `
    <button class="back-to-plants-btn" id="backToPlants">← Back to plants</button>
    <div class="detail-header">
      <div class="detail-ring-click" id="detailRingClick">
        ${ringPortrait(p, 120, 8)}
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
  `;

  const doWater = (e) => {
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
  const waterBtn = div.querySelector('#waterBtn');
  if (waterBtn) waterBtn.onclick = doWater;
  const waterMorningBtn = div.querySelector('#waterMorningBtn');
  if (waterMorningBtn) waterMorningBtn.onclick = doWater;
  const waterNightBtn = div.querySelector('#waterNightBtn');
  if (waterNightBtn) waterNightBtn.onclick = doWater;
  div.querySelector('#backToPlants').onclick = () => {
    state.mobileDetailOpen = false;
    render();
  };
  div.querySelector('#editBtn').onclick = () => {
    state.editingPlantId = p.id;
    state.pendingModalPhoto = p.photo || null;
    state.pendingSpecies = SPECIES_DICTIONARY.find(s => s.id === p.speciesId) || null;
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
    state.plants = state.plants.filter(x => x.id !== p.id);
    state.activeId = null;
    state.mobileDetailOpen = false;
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

function renderModal() {
  const preview = state.pendingModalPhoto
    ? `<img src="${state.pendingModalPhoto}" alt="Selected plant photo preview" class="modal-photo-preview">`
    : '';
  const species = state.pendingSpecies;
  const editingPlant = state.editingPlantId ? state.plants.find(p => p.id === state.editingPlantId) : null;
  const isEditing = !!editingPlant;
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
        <input id="modalNameInput" placeholder="e.g. Fig in the corner" value="${isEditing ? editingPlant.name : ''}" aria-label="Plant name">
      </div>
      <div class="field">
        <label>Species</label>
        <button class="species-picker-btn" id="openSpeciesPicker" type="button">
          ${species ? `<span class="species-picker-emoji">${species.emoji}</span> ${species.name}` : (isEditing && editingPlant.species ? editingPlant.species : '🔍 Choose from the guide (optional)')}
        </button>
      </div>
      <div class="field">
        <label>Room (optional)</label>
        <input id="modalRoomInput" placeholder="e.g. Kitchen, Bedroom, Balcony" value="${isEditing ? (editingPlant.room || '') : ''}" aria-label="Room">
      </div>
      <div class="field">
        <label>Water every how many days?</label>
        <input id="modalFreqInput" type="number" min="1" value="${isEditing ? editingPlant.frequency : (species ? species.freq : 7)}" aria-label="Water every how many days">
        <div class="freq-hint">Most houseplants: 5–10 days. Succulents: 14–21.</div>
      </div>
      <div class="field checkbox-field">
        <label class="checkbox-label">
          <input type="checkbox" id="modalTwiceDailyInput" ${isEditing && editingPlant.twiceDaily ? 'checked' : ''}>
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
  if (e.target.id === 'modalBackdrop') { state.showAddModal = false; state.editingPlantId = null; render(); }
  if (e.target.id === 'cancelModal') { state.showAddModal = false; state.editingPlantId = null; render(); }
  if (e.target.id === 'badgesBackdrop') { state.showBadgesModal = false; render(); }
  if (e.target.id === 'closeBadges') { state.showBadgesModal = false; render(); }
  if (e.target.id === 'speciesPickerBackdrop') { state.showSpeciesPicker = false; render(); }
  if (e.target.id === 'cancelSpeciesPicker') { state.showSpeciesPicker = false; render(); }
  if (e.target.id === 'themeBackdrop') { state.showThemeModal = false; render(); }
  if (e.target.id === 'inviteBackdrop') { state.showInviteModal = false; render(); }
  if (e.target.id === 'closeInvite') { state.showInviteModal = false; render(); }
  if (e.target.id === 'aboutBackdrop') { state.showAboutModal = false; render(); }
  if (e.target.id === 'closeAbout') { state.showAboutModal = false; render(); }
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
    const twiceDaily = document.getElementById('modalTwiceDailyInput').checked;
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

loadPlants();
state.activeId = state.plants[0]?.id ?? null;
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
loadPropagations();
state.theme = localStorage.getItem('plant-parent-theme') || 'sage';
document.body.dataset.theme = state.theme;
state.memoryGameCompleted = localStorage.getItem('plant-parent-memory-completed') === '1';
state.hasInvited = localStorage.getItem('plant-parent-has-invited') === '1';
state.showWelcome = localStorage.getItem('plant-parent-welcome-seen') !== '1';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.error('SW registration failed', err));
}

render();
maybeRefreshWeather();
