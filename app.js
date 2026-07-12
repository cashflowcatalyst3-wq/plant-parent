const VAPID_PUBLIC_KEY = 'BN4ieWQBco1u_esfncKASD5n51MKDrjGJoDafo4eJP7FwjzxIRUq-2xsJEGRoMzZ-tyipIrn8zh2Kzy1H5pukrQ';

const ACHIEVEMENTS = [
  { id: 'first-sprout', emoji: '🌱', name: 'First Sprout', desc: 'Add your first plant' },
  { id: 'full-shelf', emoji: '🪴', name: 'Full Shelf', desc: 'Grow your collection to 5 plants' },
  { id: 'green-thumb', emoji: '🔥', name: 'Green Thumb', desc: '7-day watering streak on one plant' },
  { id: 'plant-parent-pro', emoji: '🏆', name: 'Plant Parent Pro', desc: '30-day watering streak on one plant' },
  { id: 'note-taker', emoji: '📝', name: 'Note Taker', desc: 'Write your first plant note' },
  { id: 'rainmaker', emoji: '💧', name: 'Rainmaker', desc: 'Score 15+ in Raindrop Catch' },
];

const state = {
  plants: [],
  activeId: null,
  showAddModal: false,
  showBadgesModal: false,
  notificationsEnabled: false,
  pendingModalPhoto: null, // dataURL waiting to be attached on save
  unlockedAchievements: [],
  gameHighScore: 0,
  celebrationQueue: [],
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
  checkAchievements();
}

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
  if (state.plants.some(p => calcStreak(p) >= 7)) unlock('green-thumb');
  if (state.plants.some(p => calcStreak(p) >= 30)) unlock('plant-parent-pro');
  if (state.plants.some(p => p.notes && p.notes.trim())) unlock('note-taker');
  if (state.gameHighScore >= 15) unlock('rainmaker');

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

  app.innerHTML = `
    <header>
      <div>
        <h1>Plant Parent</h1>
        <div class="tagline">a shelf that keeps time for you</div>
      </div>
      <div class="header-actions">
        <button class="secondary" id="badgesBtn">🏆 ${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}</button>
        <button class="secondary" id="gameBtn">🎮 Play</button>
        <button class="secondary" id="notifBtn">${state.notificationsEnabled ? '🔔 Reminders on' : '🔕 Enable reminders'}</button>
      </div>
    </header>
    <div class="layout">
      <div class="shelf" id="shelf"></div>
      <div class="panel" id="panel"></div>
    </div>
    ${state.showAddModal ? renderModal() : ''}
    ${state.showBadgesModal ? renderBadgesModal() : ''}
  `;

  const shelf = document.getElementById('shelf');
  state.plants.forEach(p => shelf.appendChild(renderCard(p)));
  const addBtn = document.createElement('div');
  addBtn.className = 'add-btn';
  addBtn.textContent = '+ Add a plant';
  addBtn.onclick = () => { state.pendingModalPhoto = null; state.showAddModal = true; render(); };
  shelf.appendChild(addBtn);

  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  panel.appendChild(active ? renderDetail(active) : renderEmpty());

  document.getElementById('notifBtn').onclick = enableNotifications;
  document.getElementById('badgesBtn').onclick = () => { state.showBadgesModal = true; render(); };
  document.getElementById('gameBtn').onclick = () => { if (window.openMiniGame) window.openMiniGame(); };

  if (state.showAddModal) {
    document.getElementById('modalNameInput')?.focus();
    wireModalPhoto();
  }
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
        <label>Species (optional)</label>
        <input id="modalSpeciesInput" placeholder="e.g. Fiddle-leaf fig">
      </div>
      <div class="field">
        <label>Water every how many days?</label>
        <input id="modalFreqInput" type="number" min="1" value="7">
        <div class="freq-hint">Most houseplants: 5–10 days. Succulents: 14–21.</div>
      </div>
      <div class="modal-actions">
        <button class="secondary" id="cancelModal">Cancel</button>
        <button class="primary" id="saveModal">Add plant</button>
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
  if (e.target.id === 'saveModal') {
    const name = document.getElementById('modalNameInput').value.trim();
    const species = document.getElementById('modalSpeciesInput').value.trim();
    const freq = parseInt(document.getElementById('modalFreqInput').value, 10) || 7;
    if (!name) return;
    const now = new Date(Date.now() - (freq-1)*24*60*60*1000).toISOString();
    const p = {
      id: nextId++,
      name, species,
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
    render();
  } catch (err) {
    console.error(err);
    alert("Couldn't turn on reminders. Try again in a bit.");
  }
}

// ---------- startup ----------

const loaded = loadPlants();
if (!loaded) {
  state.plants.push(
    { id: nextId++, name: 'Fig in the corner', species: 'Fiddle-leaf fig', frequency: 7, lastWatered: new Date(Date.now() - 5*24*60*60*1000).toISOString(), waterLog: [], photo: null },
    { id: nextId++, name: 'Kitchen pothos', species: 'Epipremnum aureum', frequency: 6, lastWatered: new Date(Date.now() - 6*24*60*60*1000).toISOString(), waterLog: [], photo: null }
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
