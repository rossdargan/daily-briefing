const { loadState, updateState } = require('./dataStore');
const { refreshBrief } = require('./rules');
const { sendMorningPush, sendEveningNudge } = require('./notify');

function parseCronTime(value) {
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

function scheduleAtTime(value, fn) {
  const { hour, minute } = parseCronTime(value);

  const run = () => {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next.getTime() - now.getTime();
    setTimeout(async () => {
      await fn();
      run();
    }, delay);
  };

  run();
}

async function refreshAndPersist() {
  const state = await loadState();
  const refreshed = refreshBrief(state);
  await updateState({ brief: refreshed, updatedAt: new Date().toISOString() });
  return refreshed;
}

function scheduleTasks() {
  setInterval(async () => {
    try {
      await refreshAndPersist();
    } catch (error) {
      console.error('Refresh cycle failed', error.message);
    }
  }, 15 * 60 * 1000);

  scheduleAtTime('07:15', async () => {
    try {
      const state = await loadState();
      const brief = refreshBrief(state);
      await sendMorningPush(brief);
      await updateState({ brief, notifications: [...(state.notifications || []), ...brief.notifications], updatedAt: new Date().toISOString() });
      console.log('Morning push sent');
    } catch (error) {
      console.error('Failed to send morning push', error.message);
    }
  });

  scheduleAtTime('20:30', async () => {
    try {
      const state = await loadState();
      const brief = refreshBrief(state);
      await sendEveningNudge(brief);
      await updateState({ brief, notifications: [...(state.notifications || []), ...brief.notifications], updatedAt: new Date().toISOString() });
      console.log('Evening nudge sent');
    } catch (error) {
      console.error('Failed to send evening nudge', error.message);
    }
  });
}

module.exports = { scheduleAtTime, scheduleTasks, refreshAndPersist };
