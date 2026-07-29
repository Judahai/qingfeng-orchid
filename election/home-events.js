const HOME_EVENTS_CONFIG = {
  GAS_URL: window.SITE_CONFIG.GAS_URL,
  LIMIT: 3,
};

function homeEventValue(item, ...keys) {
  for (const key of keys) {
    const value = item[key];
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return '';
}

function parseHomeEventDate(value) {
  if (!value) return null;
  const date = new Date(String(value).trim().replace(/\//g, '-'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortHomeEvents(items) {
  return [...items].sort((a, b) => {
    const aDate = parseHomeEventDate(homeEventValue(a, '開始時間'));
    const bDate = parseHomeEventDate(homeEventValue(b, '開始時間'));
    return (aDate?.getTime() ?? Number.MAX_SAFE_INTEGER)
      - (bDate?.getTime() ?? Number.MAX_SAFE_INTEGER);
  });
}

function formatHomeEventDate(value) {
  const date = parseHomeEventDate(value);
  if (!date) return String(value || '時間待確認');

  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function escapeHomeEventHtml(value) {
  const element = document.createElement('div');
  element.textContent = String(value ?? '');
  return element.innerHTML;
}

function renderHomeEvents(items) {
  const track = document.getElementById('homeEventTrack');
  if (!track) return;

  const cards = sortHomeEvents(items)
    .slice(0, HOME_EVENTS_CONFIG.LIMIT)
    .map(item => {
      const name = homeEventValue(item, '活動名稱');
      const type = homeEventValue(item, '活動類型') || '活動';
      const start = homeEventValue(item, '開始時間');
      const city = homeEventValue(item, '縣市');
      const district = homeEventValue(item, '鄉鎮市區');
      const place = homeEventValue(item, '地點名稱');
      const id = homeEventValue(item, '編號');
      const status = homeEventValue(item, '狀態') || '已確認';
      const pending = status === '審核中';
      const location = [city, district, place].filter(Boolean).join(' ') || '地點待確認';

      return `
        <a class="home-event-card${pending ? ' is-pending' : ''}" href="${id ? `event.html?id=${encodeURIComponent(id)}` : 'events.html'}">
          <span class="home-event-card-type">${escapeHomeEventHtml(type)}</span>
          <span class="home-event-card-status${pending ? ' is-pending' : ' is-confirmed'}">${escapeHomeEventHtml(status)}</span>
          <h3>${escapeHomeEventHtml(name || '活動名稱待確認')}</h3>
          <p><span class="home-event-meta-label">時間</span>${escapeHomeEventHtml(formatHomeEventDate(start))}</p>
          <p><span class="home-event-meta-label">地點</span>${escapeHomeEventHtml(location)}</p>
        </a>`;
    });

  cards.push(`
    <a class="home-event-card home-event-more" href="events.html">
      <strong>查看全部活動</strong>
      <span>前往活動列表</span>
    </a>`);

  track.innerHTML = cards.join('');
}

async function fetchHomeEvents() {
  const track = document.getElementById('homeEventTrack');
  if (!track) return;

  try {
    const response = await fetch(HOME_EVENTS_CONFIG.GAS_URL + '?action=events');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('活動資料格式不正確');
    renderHomeEvents(data);
  } catch (error) {
    console.error('首頁活動載入失敗：', error);
    track.innerHTML = `
      <a class="home-event-card home-event-more" href="events.html">
        <strong>活動暫時無法載入</strong>
        <span>前往活動頁 →</span>
      </a>`;
  }
}

document.addEventListener('DOMContentLoaded', fetchHomeEvents);
