const EVENT_CONFIG = {
  GAS_URL: window.SITE_CONFIG.GAS_URL,
  LINE_URL: 'https://line.me/ti/p/K2LFf7aucm?text=',
  SHARE_LINE_URL: 'https://line.me/R/msg/text/?',
};

let allEvents = [];

function eventValue(event, ...keys) {
  for (const key of keys) {
    const value = event[key];
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return '';
}

function safeEventUrl(value) {
  const url = String(value || '').trim();
  return /^https?:\/\//i.test(url) ? url : '';
}

function parseEventDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const normalized = String(value).trim().replace(/\//g, '-');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const aDate = parseEventDate(eventValue(a, '開始時間', '開始日期', '日期'));
    const bDate = parseEventDate(eventValue(b, '開始時間', '開始日期', '日期'));
    const dateDifference = (aDate?.getTime() ?? Number.MAX_SAFE_INTEGER)
      - (bDate?.getTime() ?? Number.MAX_SAFE_INTEGER);
    if (dateDifference !== 0) return dateDifference;

    const cityDifference = String(eventValue(a, '縣市')).localeCompare(
      String(eventValue(b, '縣市')),
      'zh-TW'
    );
    if (cityDifference !== 0) return cityDifference;

    return String(eventValue(a, '鄉鎮市區')).localeCompare(
      String(eventValue(b, '鄉鎮市區')),
      'zh-TW'
    );
  });
}

async function fetchEvents(force = false) {
  const grid = document.getElementById('eventGrid');
  if (force && grid) grid.innerHTML = '<div class="loading-state">活動資料重新載入中…</div>';
  try {
    const data = await window.SITE_DATA.fetchJson(EVENT_CONFIG.GAS_URL + '?action=events', {
      cacheKey: 'events',
      force,
    });
    if (!Array.isArray(data)) throw new Error('活動資料格式不正確');
    allEvents = sortEvents(data);

    const total = document.getElementById('eventTotalCount');
    if (total) total.textContent = allEvents.length;

    buildEventCityDropdown();
    updateEventDistrictDropdown();
    applyEventFilters();
  } catch (error) {
    console.error('活動資料載入失敗：', error);
    if (grid) {
      grid.innerHTML = `
        <div class="error-state">
          <p>活動資料暫時無法載入</p>
          <p class="error-sub">Google 資料暫時沒有回應，可以重新載入或透過 LINE 聯絡。</p>
          <button type="button" class="btn-retry" id="retryEvents">重新載入</button>
          <a href="https://line.me/ti/p/K2LFf7aucm" class="btn-line-solid" target="_blank" rel="noopener">LINE 聯絡</a>
        </div>`;
      document.getElementById('retryEvents')?.addEventListener('click', () => fetchEvents(true));
    }
  }
}

function replaceOptions(select, label, values) {
  if (!select) return;
  select.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = label;
  select.appendChild(defaultOption);

  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function buildEventCityDropdown() {
  const cities = [...new Set(allEvents.map(event => eventValue(event, '縣市')).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'zh-TW'));
  replaceOptions(document.getElementById('eventCityFilter'), '全部縣市', cities);
}

function updateEventDistrictDropdown() {
  const city = document.getElementById('eventCityFilter')?.value || '';
  const districts = [...new Set(
    allEvents
      .filter(event => !city || eventValue(event, '縣市') === city)
      .map(event => eventValue(event, '鄉鎮市區'))
      .filter(Boolean)
  )].sort((a, b) => String(a).localeCompare(String(b), 'zh-TW'));

  replaceOptions(document.getElementById('eventDistrictFilter'), '全部鄉鎮市區', districts);
}

function applyEventFilters() {
  const city = document.getElementById('eventCityFilter')?.value || '';
  const district = document.getElementById('eventDistrictFilter')?.value || '';
  const type = document.getElementById('eventTypeFilter')?.value || '';
  const search = document.getElementById('eventSearch')?.value.trim() || '';

  const filtered = allEvents.filter(event => {
    const name = String(eventValue(event, '活動名稱', '名稱'));
    const organizer = String(eventValue(event, '主辦人姓名', '主辦人', '主辦單位'));
    return (!city || eventValue(event, '縣市') === city)
      && (!district || eventValue(event, '鄉鎮市區') === district)
      && (!type || eventValue(event, '活動類型', '類型') === type)
      && (!search || name.includes(search) || organizer.includes(search));
  });

  const count = document.getElementById('eventResultCount');
  if (count) count.textContent = `共 ${filtered.length} 場`;
  renderEventCards(filtered);
}

function formatEventDate(date, originalValue) {
  if (!date) return String(originalValue || '時間待確認');
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function eventCountdown(date) {
  if (!date) return '日期待確認';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(date);
  eventDay.setHours(0, 0, 0, 0);
  const days = Math.round((eventDay - today) / 86400000);

  if (days > 0) return `倒數 ${days} 天`;
  if (days === 0) return '就是今天';
  return `已結束 ${Math.abs(days)} 天`;
}

function eventLineMessage(event) {
  const id = eventValue(event, '編號');
  const name = eventValue(event, '活動名稱', '名稱');
  const rawDate = eventValue(event, '開始時間', '開始日期', '日期');
  const date = parseEventDate(rawDate);
  const location = eventValue(event, '地點名稱', '地點', '地址');
  const address = eventValue(event, '詳細地址');
  const city = eventValue(event, '縣市');
  const district = eventValue(event, '鄉鎮市區');
  const organizer = eventValue(event, '主辦人姓名', '主辦人', '主辦單位');
  const pending = eventValue(event, '狀態') === '審核中';
  const detailUrl = id
    ? new URL(`event.html?id=${encodeURIComponent(id)}`, window.location.href).href
    : '';

  return [
    `邀請你參加：${name}`,
    `時間：${formatEventDate(date, rawDate)}`,
    `地點：${[city, district, location, address].filter(Boolean).join(' ')}`,
    organizer ? `主辦：${organizer}` : '',
    pending ? '※ 此活動由主辦人提供，資料尚未完成確認。' : '',
    detailUrl,
  ].filter(Boolean).join('\n');
}

function renderEventCards(events) {
  const grid = document.getElementById('eventGrid');
  const empty = document.getElementById('eventEmptyState');
  if (!grid) return;

  if (events.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  grid.innerHTML = events.map((event, index) => {
    const id = eventValue(event, '編號');
    const name = eventValue(event, '活動名稱', '名稱');
    const type = eventValue(event, '活動類型', '類型') || '活動';
    const rawDate = eventValue(event, '開始時間', '開始日期', '日期');
    const date = parseEventDate(rawDate);
    const location = eventValue(event, '地點名稱', '地點', '地址');
    const address = eventValue(event, '詳細地址');
    const city = eventValue(event, '縣市');
    const district = eventValue(event, '鄉鎮市區');
    const organizer = eventValue(event, '主辦人姓名', '主辦人', '主辦單位') || '主辦人待確認';
    const status = eventValue(event, '狀態') || '已確認';
    const pending = status === '審核中';
    const photoValue = String(eventValue(event, '照片網址', '照片')).trim();
    const photoUrl = /^https?:\/\//i.test(photoValue)
      ? photoValue
      : 'assets/event-orchid-botanical-v3.jpg';
    const phone = eventValue(event, '電話', '聯絡電話');
    const line = safeEventUrl(eventValue(event, 'LINE', 'Line', '主辦人LINE', 'LINE連結'));
    const message = eventLineMessage(event);
    const shareLink = EVENT_CONFIG.SHARE_LINE_URL + encodeURIComponent(message);
    const contactLink = phone
      ? `tel:${String(phone).replace(/[^\d+]/g, '')}`
      : (line || EVENT_CONFIG.LINE_URL + encodeURIComponent(`您好，我想詢問「${name}」活動。`));
    const contactLabel = phone ? `聯絡主辦人 ${phone}` : 'LINE 聯絡主辦人';
    const contactClass = phone ? 'btn-contact' : 'btn-line';
    const contactButton = pending
      ? '<span class="btn-secondary is-disabled">資料確認後開放</span>'
      : `<a href="${escapeEventHtml(contactLink)}" class="${contactClass}" ${contactLink.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${escapeEventHtml(contactLabel)}</a>`;

    return `
      <article class="candidate-card event-card-position-${index % 3}${pending ? ' event-card-pending' : ''}${id ? ' event-card-linkable' : ''}"
        data-event-index="${index}"
        style="--event-card-image: url('${escapeEventHtml(photoUrl.replace(/'/g, '%27'))}')"
        ${id ? `data-detail-url="event.html?id=${encodeURIComponent(id)}" role="link" tabindex="0"` : ''}>
        <div class="card-header">
          <div class="card-name-row">
            <h2 class="card-name">${escapeEventHtml(name)}</h2>
            <span class="card-badge status-active">${escapeEventHtml(type)}</span>
          </div>
          <div class="event-status-row">
            <span class="event-status-badge${pending ? ' is-pending' : ' is-confirmed'}">${escapeEventHtml(status)}</span>
          </div>
          <div class="card-meta-row">
            <span class="card-level">${escapeEventHtml(formatEventDate(date, rawDate))}</span>
            <span class="card-number">${escapeEventHtml(eventCountdown(date))}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-info-row"><span class="info-label">地點</span><span>${escapeEventHtml([city, district, location, address].filter(Boolean).join(' ') || '地點待確認')}</span></div>
          <div class="card-info-row"><span class="info-label">主辦</span><span>${escapeEventHtml(organizer)}</span></div>
          ${pending ? '<p class="event-pending-note">此活動由主辦人提供，資料尚未完成確認。</p>' : ''}
        </div>
        <div class="card-footer">
          ${id ? `<a href="event.html?id=${encodeURIComponent(id)}" class="btn-secondary event-detail-button">查看詳情</a>` : ''}
          <a href="${escapeEventHtml(shareLink)}" class="btn-line event-share-button" target="_blank" rel="noopener">分享到 LINE</a>
          ${contactButton}
          <a href="products.html" class="btn-secondary event-flower-button">送花去</a>
        </div>
      </article>`;
  }).join('');
}

function escapeEventHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value ?? '');
  return div.innerHTML;
}

function initEventPage() {
  const city = document.getElementById('eventCityFilter');
  const district = document.getElementById('eventDistrictFilter');
  const type = document.getElementById('eventTypeFilter');
  const search = document.getElementById('eventSearch');
  const clear = document.getElementById('eventClearBtn');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let searchTimer;

  city?.addEventListener('change', () => {
    updateEventDistrictDropdown();
    applyEventFilters();
  });
  district?.addEventListener('change', applyEventFilters);
  type?.addEventListener('change', applyEventFilters);
  search?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyEventFilters, 300);
  });
  clear?.addEventListener('click', () => {
    if (city) city.value = '';
    updateEventDistrictDropdown();
    if (district) district.value = '';
    if (type) type.value = '';
    if (search) search.value = '';
    applyEventFilters();
  });
  const grid = document.getElementById('eventGrid');
  grid?.addEventListener('click', event => {
    if (event.target.closest('a, button')) return;
    const card = event.target.closest('[data-detail-url]');
    if (card) window.location.href = card.dataset.detailUrl;
  });
  grid?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('[data-detail-url]');
    if (!card) return;
    event.preventDefault();
    window.location.href = card.dataset.detailUrl;
  });
  hamburger?.addEventListener('click', () => mobileMenu?.classList.toggle('open'));

  fetchEvents();
}

document.addEventListener('DOMContentLoaded', initEventPage);
