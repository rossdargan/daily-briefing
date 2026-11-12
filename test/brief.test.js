const test = require('node:test');
const assert = require('node:assert/strict');

const { buildBriefFromSnapshot } = require('../src/rules');
const { buildBriefPage } = require('../src/pageBuilder');

const sampleSnapshot = {
  patchMon: { securityUpdatesCount: 2 },
  todoist: { overdue: [{ text: 'Book dentist', ageDays: 12 }] },
  email: { triageCount: 1 },
  freezer: { required: ['Chicken thighs'] },
  batteries: { overnightChargeFailed: false },
  weather: { summary: 'Cloudy', temperatureC: 12 },
  appreciation: { note: 'Thanks for keeping it moving.' },
  budget: { totalBudget: 2000, spent: 1200, remaining: 800, overspends: [] },
  weight: { todaysWeightKg: 78.2, trendKg: -0.4, steps: 9200, calories: 2020, protein: 105, restingHeartRate: 58 },
  services: [{ name: 'Uptime Kuma', status: 'Healthy', detail: 'All monitors are green' }],
  calendars: { events: [{ title: 'School run', time: '15:45' }] },
  releases: [{ name: 'Home Assistant', version: '2026.11.6' }],
  body: {},
  allNormal: [],
  needsYou: []
};

test('buildBriefFromSnapshot creates actionable needs and all-normal items', () => {
  const brief = buildBriefFromSnapshot(sampleSnapshot);

  assert.equal(brief.needsYou.length >= 3, true);
  assert.equal(brief.allNormal.some((item) => item.title === 'Battery is healthy'), true);
  assert.equal(brief.freezer.required[0], 'Chicken thighs');
});

test('pageBuilder renders a brief with summary sections', () => {
  const brief = buildBriefFromSnapshot(sampleSnapshot);
  const html = buildBriefPage(brief);

  assert.match(html, /Needs you/);
  assert.match(html, /All normal/);
  assert.match(html, /Body/);
  assert.match(html, /Coming up/);
});
