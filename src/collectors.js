function collectSourceSnapshot() {
  const now = new Date();

  return {
    dateIso: now.toISOString(),
    weather: {
      summary: 'Light cloud',
      temperatureC: 12,
      feelLikeC: 10,
      rainChance: 20,
      source: 'Home Assistant'
    },
    batteries: {
      overnightChargeFailed: false,
      status: 'Healthy',
      items: [
        { name: 'Leaf battery', status: 'Charging', percentage: 95 },
        { name: 'Powerwall', status: 'On track', percentage: 72 }
      ]
    },
    todoist: {
      today: [
        { text: 'Sort out the garage shelves', priority: 'medium' },
        { text: 'Reply to the plumber', priority: 'high' }
      ],
      overdue: [
        { text: 'Upload the holiday photos', ageDays: 5 },
        { text: 'Book the dentist', ageDays: 12 }
      ],
      countOlderOverdue: 2,
      source: 'Todoist'
    },
    calendars: {
      dayShape: 'Steady, with no hard clashes',
      events: [
        { title: 'Laura PT', time: '18:30' },
        { title: 'School run', time: '15:45' }
      ],
      away: false,
      source: 'Calendars'
    },
    budget: {
      totalBudget: 1750,
      spent: 1482,
      remaining: 268,
      overspends: [
        { name: 'Groceries', delta: 23 },
        { name: 'Transport', delta: 17 }
      ],
      source: 'Actual Budget'
    },
    weight: {
      todaysWeightKg: 78.4,
      trendKg: -0.7,
      steps: 9420,
      calories: 2140,
      protein: 106,
      restingHeartRate: 57,
      source: 'SparkyFitness'
    },
    strava: {
      weeklyDistanceKm: 24.5,
      best5k: '22:13',
      runCount: 2,
      source: 'Strava'
    },
    services: [
      { name: 'Uptime Kuma', status: 'Healthy', detail: 'All monitored services are green' },
      { name: 'Home Assistant', status: 'Healthy', detail: 'No offline devices' },
      { name: 'Proxmox VE', status: 'Healthy', detail: 'Nodes stable, storage at 62%' },
      { name: 'Mealie', status: 'Healthy', detail: 'Dinner plan ready for tonight' }
    ],
    patchMon: {
      securityUpdatesCount: 3,
      updatesCount: 11,
      needsReboot: false,
      rebootReason: null,
      advisoryNodes: 1,
      securityPatches: [
        { host: 'proxmox-01', package: 'linux-6.8.0-52-generic', isSecurityUpdate: true },
        { host: 'pve-02', package: 'qemu-server', isSecurityUpdate: true },
        { host: 'nas-1', package: 'openssh', isSecurityUpdate: true }
      ]
    },
    email: {
      triageCount: 2,
      senders: ['Status page', 'Synology'],
      source: 'Email'
    },
    releases: [
      { name: 'Home Assistant', version: '2026.11.6', critical: false },
      { name: 'Proxmox VE', version: '8.3.3', critical: false },
      { name: 'Unraid', version: '7.0.1', critical: false }
    ],
    freezer: {
      required: ['Chicken thighs', 'Peppers'],
      lowStock: ['spinach'],
      source: 'Jotty + Mealie'
    },
    appreciation: {
      note: 'You kept the house going smoothly this week.',
      source: 'Jotty'
    }
  };
}

module.exports = { collectSourceSnapshot };
