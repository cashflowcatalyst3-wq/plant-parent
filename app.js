const state = {
  plants: [],
  activeId: null,
  showAddModal: false,
};

let nextId = 1;

function daysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000*60*60*24));
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

function render() {
  const app = document.getElementById('app');
  const active = state.plants.find(p => p.id === state.activeId);

  app.innerHTML = `
    <header>
      <div>
        <h1>Plant Parent</h1>
        <div class="tagline">a shelf that keeps time for you</div>
      </div>
    </header>
    <div class="layout">
      <div class="shelf" id="shelf"></div>
      <div class="panel" id="panel"></div>
    </div>
    ${state.showAddModal ? renderModal() : ''}
  `;

  const shelf = document.getElementById('shelf');
  state.plants.forEach(p => shelf.appendChild(renderCard(p)));
  const addBtn = document.createElement('div');
  addBtn.className = 'add-btn';
  addBtn.textContent = '+ Add a plant';
  addBtn.onclick = () => { state.showAddModal = true; render(); };
  shelf.appendChild(addBtn);

  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  panel.appendChild(active ? renderDetail(active) : renderEmpty());

  if (state.showAddModal) {
    document.getElementById('modalNameInput')?.focus();
  }
}

function renderCard(p) {
  const div = document.createElement('div');
  div.className = 'plant-card' + (p.id === state.activeId ? ' active' : '');
  const pct = ringPercent(p);
  const r = 22, c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const left = daysLeft(p);
  div.innerHTML = `
    <div class="ring-wrap">
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle class="ring-bg" cx="27" cy="27" r="${r}"></circle>
        <circle class="ring-fg" cx="27" cy="27" r="${r}"
          stroke="${ringColor(pct)}"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}"></circle>
      </svg>
      <div class="ring-label">${left}d</div>
    </div>
    <div class="info">
      <p class="name">${p.name}</p>
      <div class="species">${p.species || 'unlabeled'}</div>
    </div>
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
  const pct = ringPercent(p);
  const r = 52, c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const left = daysLeft(p);

  div.innerHTML = `
    <div class="detail-header">
      <div class="big-ring-wrap">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle class="big-ring-bg" cx="60" cy="60" r="${r}"></circle>
          <circle class="big-ring-fg" cx="60" cy="60" r="${r}"
            stroke="${ringColor(pct)}"
            stroke-dasharray="${c}" stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="big-ring-label">
          <div class="num">${left}</div>
          <div class="unit">days left</div>
        </div>
      </div>
      <div class="detail-title">
        <h2>${p.name}</h2>
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
      last watered ${daysSince(p.lastWatered)} day${daysSince(p.lastWatered)===1?'':'s'} ago
    </div>
  `;

  div.querySelector('#waterBtn').onclick = () => {
    p.lastWatered = new Date().toISOString();
    render();
    savePlants();
  };
  div.querySelector('#removeBtn').onclick = () => {
    state.plants = state.plants.filter(x => x.id !== p.id);
    state.activeId = null;
    render();
    savePlants();
  };

  return div;
}

function renderModal() {
  return `
  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal">
      <h3>Add a plant</h3>
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

document.addEventListener('click', (e) => {
  if (e.target.id === 'modalBackdrop') { state.showAddModal = false; render(); }
  if (e.target.id === 'cancelModal') { state.showAddModal = false; render(); }
  if (e.target.id === 'saveModal') {
    const name = document.getElementById('modalNameInput').value.trim();
    const species = document.getElementById('modalSpeciesInput').value.trim();
    const freq = parseInt(document.getElementById('modalFreqInput').value, 10) || 7;
    if (!name) return;
    const p = {
      id: nextId++,
      name, species,
      frequency: freq,
      lastWatered: new Date(Date.now() - (freq-1)*24*60*60*1000).toISOString()
    };
    state.plants.push(p);
    state.activeId = p.id;
    state.showAddModal = false;
    render();
    savePlants();
  }
});

function savePlants() {
  try {
    localStorage.setItem('plant-parent-plants', JSON.stringify(state.plants));
  } catch (err) {
    console.error('Could not save plants', err);
  }
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

// load saved plants, or seed with two examples if none exist yet
const loaded = loadPlants();
if (!loaded) {
  state.plants.push(
    { id: nextId++, name: 'Fig in the corner', species: 'Fiddle-leaf fig', frequency: 7, lastWatered: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { id: nextId++, name: 'Kitchen pothos', species: 'Epipremnum aureum', frequency: 6, lastWatered: new Date(Date.now() - 6*24*60*60*1000).toISOString() }
  );
  savePlants();
}
state.activeId = state.plants[0]?.id ?? null;
render();
