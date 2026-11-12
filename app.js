require('dotenv').config();

const express = require('express');
const path = require('path');
const { buildBriefPage } = require('./src/pageBuilder');
const { loadState, ensureState, updateState } = require('./src/dataStore');
const { refreshBrief, generateDemoBrief } = require('./src/rules');
const { scheduleTasks } = require('./src/scheduler');

const app = express();
const PORT = Number(process.env.PORT || 3000);

ensureState();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const state = await loadState();
  const brief = state.brief || generateDemoBrief();
  const html = buildBriefPage(brief);
  res.send(html);
});

app.get('/api/brief', async (req, res) => {
  const state = await loadState();
  res.json(state.brief || generateDemoBrief());
});

app.get('/api/refresh', async (req, res) => {
  const state = await loadState();
  const refreshed = refreshBrief(state);
  await updateState({ brief: refreshed, updatedAt: new Date().toISOString() });
  res.json(refreshed);
});

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'daily-briefing' });
});

const server = app.listen(PORT, () => {
  console.log(`Daily briefing dashboard running on http://localhost:${PORT}`);
});

scheduleTasks();

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
