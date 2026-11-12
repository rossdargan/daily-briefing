const axios = require('axios');

async function sendNtfy(title, message, options = {}) {
  const topic = options.topic || process.env.NTFY_TOPIC;
  const ntfyUrl = options.url || process.env.NTFY_URL || 'https://ntfy.sh';

  if (!topic) {
    return { skipped: true, reason: 'NTFY_TOPIC not configured' };
  }

  const headers = {
    Title: title,
    Priority: options.priority || 'default',
    Tags: options.tags || 'calendar,briefing'
  };

  if (process.env.NTFY_TOKEN) {
    headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;
  }

  try {
    const response = await axios.post(`${ntfyUrl}/${topic}`, message, { headers });
    return { skipped: false, status: response.status, data: response.data };
  } catch (error) {
    return { skipped: true, reason: error.message };
  }
}

async function sendMorningPush(brief) {
  const headline = brief.needsYou.length ? `${brief.needsYou.length} things need you today` : 'Everything looks normal today';
  const body = brief.needsYou.slice(0, 3).map((item) => item.title).join(' • ') || 'No action items this morning';
  return sendNtfy('Morning Brief', `${headline} — ${body}`, { tags: 'sunrise,briefing', priority: 'default' });
}

async function sendEveningNudge(brief) {
  const action = brief.freezer.required.length ? `Take out ${brief.freezer.required.join(', ')} from the freezer.` : 'No freezer items to move.';
  const message = `${action} Tomorrow starts early, so keep the prep light and remember to appreciate the work.`;
  return sendNtfy('Evening Nudge', message, { tags: 'moon,briefing', priority: 'default' });
}

module.exports = { sendNtfy, sendMorningPush, sendEveningNudge };
