const { collectSourceSnapshot } = require('./collectors');

function generateDemoBrief() {
  const snapshot = collectSourceSnapshot();
  return buildBriefFromSnapshot(snapshot);
}

function buildBriefFromSnapshot(snapshot) {
  const needsYou = [];
  const allNormal = [];

  if (snapshot.patchMon.securityUpdatesCount > 0) {
    needsYou.push({
      id: 'patch-security',
      title: `${snapshot.patchMon.securityUpdatesCount} hosts have security updates waiting`,
      detail: 'PatchMon reports outstanding security updates on 3 hosts.',
      category: 'services'
    });
  } else {
    allNormal.push({ title: 'Security updates are clear', detail: 'PatchMon is clean' });
  }

  if (snapshot.todoist.overdue.length > 0) {
    needsYou.push({
      id: 'todo-overdue',
      title: `${snapshot.todoist.overdue.length} items are overdue`,
      detail: 'Older jobs are waiting in Todoist.',
      category: 'tasks'
    });
  } else {
    allNormal.push({ title: 'Todo list is current', detail: 'No item is lingering' });
  }

  if (snapshot.email.triageCount > 0) {
    needsYou.push({
      id: 'email-triage',
      title: `${snapshot.email.triageCount} new emails need triage`,
      detail: 'Inbox items from status pages and Synology are waiting.',
      category: 'mail'
    });
  } else {
    allNormal.push({ title: 'Inbox is quiet', detail: 'No email triage is pending' });
  }

  if (snapshot.freezer.required.length > 0) {
    needsYou.push({
      id: 'freezer',
      title: 'Freezer items need attention',
      detail: `Take ${snapshot.freezer.required.join(', ')} out of the freezer before tomorrow.`,
      category: 'food'
    });
  }

  if (!snapshot.batteries.overnightChargeFailed) {
    allNormal.push({
      title: 'Battery is healthy',
      detail: 'No overnight charging warning was recorded.'
    });
  }

  const body = {
    weightKg: snapshot.weight.todaysWeightKg,
    weightTrendKg: snapshot.weight.trendKg,
    steps: snapshot.weight.steps,
    calories: snapshot.weight.calories,
    protein: snapshot.weight.protein,
    restingHeartRate: snapshot.weight.restingHeartRate,
    summary: 'On track for the week; weight is trending down slightly.'
  };

  const money = {
    totalBudget: snapshot.budget.totalBudget,
    spent: snapshot.budget.spent,
    remaining: snapshot.budget.remaining,
    overspends: snapshot.budget.overspends,
    summary: 'Spend is tracking close to plan with two small overages.'
  };

  const services = snapshot.services.map((item) => ({
    name: item.name,
    status: item.status,
    detail: item.detail
  }));

  const comingUp = snapshot.calendars.events.map((event) => ({
    title: event.title,
    time: event.time
  }));

  return {
    generatedAt: new Date().toISOString(),
    title: 'Today',
    summary: 'A steady day with a couple of small actions and no major failures.',
    needsYou,
    allNormal,
    body,
    money,
    services,
    comingUp,
    appreciation: snapshot.appreciation.note,
    freezer: snapshot.freezer,
    releases: snapshot.releases,
    battery: snapshot.batteries,
    weather: snapshot.weather,
    calendar: snapshot.calendars,
    todoist: snapshot.todoist,
    patchMon: snapshot.patchMon,
    notifications: []
  };
}

function refreshBrief(state) {
  const snapshot = collectSourceSnapshot();
  const nextBrief = buildBriefFromSnapshot(snapshot);

  const seen = new Set((state.notifications || []).map((item) => item.id));
  nextBrief.notifications = nextBrief.needsYou
    .filter((item) => !seen.has(item.id))
    .map((item) => ({ ...item, deliveredAt: new Date().toISOString() }));

  return nextBrief;
}

module.exports = { buildBriefFromSnapshot, refreshBrief, generateDemoBrief };
