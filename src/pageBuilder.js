function renderList(items, emptyText = 'Nothing to report') {
  if (!items || !items.length) {
    return `<p class="muted">${emptyText}</p>`;
  }

  return `<ul class="list">${items
    .map(
      (item) => `
        <li>
          <strong>${item.title || item.name}</strong>
          ${item.detail ? `<div class="muted">${item.detail}</div>` : ''}
          ${item.time ? `<div class="muted">${item.time}</div>` : ''}
          ${item.delta !== undefined ? `<span class="pill">£${item.delta}</span>` : ''}
        </li>
      `
    )
    .join('')}</ul>`;
}

function buildBriefPage(brief) {
  const needsYou = renderList(brief.needsYou, 'Everything is calm.');
  const allNormal = renderList(brief.allNormal, 'Nothing is flagged as healthy.');
  const services = renderList(
    brief.services.map((item) => ({ title: item.name, detail: `${item.status} — ${item.detail}` })),
    'No services are reporting issues.'
  );
  const comingUp = renderList(brief.comingUp, 'No upcoming commitments.');

  const weightTrend = brief.body.weightTrendKg >= 0 ? 'up' : 'down';

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${brief.title}</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <div class="page">
        <header class="topbar">
          <div>
            <p class="eyebrow">Morning Brief</p>
            <h1>Today</h1>
          </div>
          <div class="meta">
            <span class="pill">${new Date(brief.generatedAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
        </header>

        <section class="hero">
          <div>
            <strong>Weather</strong>
            <div>${brief.weather.summary} • ${brief.weather.temperatureC}°C</div>
          </div>
          <div>
            <strong>Appreciation</strong>
            <div>${brief.appreciation}</div>
          </div>
        </section>

        <section class="grid">
          <article class="card">
            <h2>Needs you</h2>
            ${needsYou}
          </article>
          <article class="card">
            <h2>All normal</h2>
            ${allNormal}
          </article>
        </section>

        <section class="grid">
          <article class="card">
            <h2>Body</h2>
            <ul class="stat-list">
              <li><span>Weight</span><strong>${brief.body.weightKg}kg</strong></li>
              <li><span>Trend</span><strong>${Math.abs(brief.body.weightTrendKg).toFixed(1)}kg ${weightTrend}</strong></li>
              <li><span>Steps</span><strong>${brief.body.steps}</strong></li>
              <li><span>Protein</span><strong>${brief.body.protein}g</strong></li>
              <li><span>RHR</span><strong>${brief.body.restingHeartRate}</strong></li>
            </ul>
          </article>

          <article class="card">
            <h2>Money</h2>
            <ul class="stat-list">
              <li><span>Spent</span><strong>£${brief.money.spent}</strong></li>
              <li><span>Remaining</span><strong>£${brief.money.remaining}</strong></li>
              <li><span>Budget</span><strong>£${brief.money.totalBudget}</strong></li>
            </ul>
            ${renderList(brief.money.overspends.map((item) => ({ title: item.name, detail: `£${item.delta} overspent` })), 'No overspend issues.')}
          </article>

          <article class="card">
            <h2>Services</h2>
            ${services}
          </article>

          <article class="card">
            <h2>Coming up</h2>
            ${comingUp}
          </article>
        </section>

        <section class="grid">
          <article class="card narrow">
            <h2>Freezer</h2>
            ${renderList(brief.freezer.required.map((item) => ({ title: item })), 'No freezer action needed.')}
          </article>
          <article class="card narrow">
            <h2>Releases</h2>
            ${renderList(brief.releases.map((item) => ({ title: item.name, detail: item.version })), 'No relevant releases.')}
          </article>
        </section>
      </div>
    </body>
  </html>`;
}

module.exports = { buildBriefPage };
