const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.env.DATA_DIR || './data');
const stateFile = path.join(dataDir, 'state.json');

function ensureState() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(stateFile)) {
    const initial = {
      brief: null,
      notifications: [],
      collectorStatus: {},
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(stateFile, JSON.stringify(initial, null, 2));
  }
}

function loadState() {
  ensureState();
  try {
    const raw = fs.readFileSync(stateFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read state', error.message);
    return { brief: null, notifications: [], collectorStatus: {}, updatedAt: new Date().toISOString() };
  }
}

function saveState(state) {
  ensureState();
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

async function updateState(delta) {
  const current = loadState();
  const next = { ...current, ...delta };
  saveState(next);
  return next;
}

module.exports = { ensureState, loadState, saveState, updateState };
