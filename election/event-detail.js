const EVENT_DETAIL_CONFIG = {
  GAS_URL: window.SITE_CONFIG.GAS_URL,
  INTEREST_ENABLED: window.SITE_CONFIG.FEATURES?.INTEREST_ENABLED === true,
  DEFAULT_LINE_URL: 'https://line.me/R/oaMessage/%40775yvfxq/?',
  SHARE_LINE_URL: 'https://line.me/R/share?text=',
};

function detailValue(item, ...keys) {
  for (const key of keys) {
    const value = item[key];
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return '';
}

function escapeDetailHtml(value) {
  const element = document.createElement('div');
  element.textContent = String(value ?? '');
  return element.innerHTML;
}

function parseDetailDate(value) {
  if (!value) return null;
  const match = String(value).trim().match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/
  );
  if (!match) return null;

  const [, year, month, day, hour = '0', minute = '0'] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDetailDate(value) {
  const date = parseDetailDate(value);
  if (!date) return String(value || '時間待確認');

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

function safeDetailUrl(value) {
  const url = String(value || '').trim();
  return /^https?:\/\//i.test(url) ? url : '';
}

function eventInterestStorageKey(id) {
  return `event_interest_${id}`;
}

function updateInterestButton(button, count, selected) {
  button.dataset.count = String(count);
  button.disabled = selected;
  button.classList.toggle('is-selected', selected);
  button.textContent = selected
    ? `♥ 已感興趣・關注熱度 ${count}`
    : `♡ 我感興趣・關注熱度 ${count}`;
}

async function submitEventInterest(button) {
  const id = button.dataset.eventId;
  if (!id || button.disabled) return;

  button.disabled = true;
  button.textContent = '正在送出…';

  try {
    const response = await fetch(EVENT_DETAIL_CONFIG.GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'interest',
        id,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || '送出失敗');

    localStorage.setItem(eventInterestStorageKey(id), '1');
    updateInterestButton(button, Number(result.count) || 0, true);
  } catch (error) {
    console.error('關注熱度送出失敗：', error);
    const count = Number(button.dataset.count) || 0;
    updateInterestButton(button, count, false);
    button.textContent = `稍後再試・關注熱度 ${count}`;
  }
}

function renderEventDetail(item) {
  const container = document.getElementById('eventDetail');
  if (!container) return;

  const id = detailValue(item, '編號');
  const status = detailValue(item, '狀態') || '已確認';
  const pending = status === '審核中';
  const name = detailValue(item, '活動名稱') || '活動名稱待確認';
  const type = detailValue(item, '活動類型') || '活動';
  const level = detailValue(item, '活動層級');
  const start = detailValue(item, '開始時間');
  const end = detailValue(item, '結束時間');
  const city = detailValue(item, '縣市');
  const district = detailValue(item, '鄉鎮市區');
  const place = detailValue(item, '地點名稱');
  const address = detailValue(item, '詳細地址');
  const organizer = detailValue(item, '主辦人姓名', '主辦人', '主辦單位') || '主辦人待確認';
  const description = detailValue(item, '簡介') || '目前沒有活動簡介。';
  const interestCount = Number(detailValue(item, '感興趣數')) || 0;
  const interestSelected = Boolean(id && localStorage.getItem(eventInterestStorageKey(id)));
  const imageUrl = safeDetailUrl(detailValue(item, '照片網址'));
  const phone = detailValue(item, '電話');
  const lineUrl = safeDetailUrl(detailValue(item, 'LINE'));
  const fullLocation = [city, district, place, address].filter(Boolean).join(' ') || '地點待確認';
  const mapUrl = fullLocation && fullLocation !== '地點待確認'
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullLocation)}`
    : '';
  const contactUrl = phone
    ? `tel:${String(phone).replace(/[^\d+]/g, '')}`
    : (lineUrl || EVENT_DETAIL_CONFIG.DEFAULT_LINE_URL + encodeURIComponent(`您好，我想詢問「${name}」活動。`));
  const contactLabel = phone ? `聯絡主辦人 ${phone}` : 'LINE 聯絡主辦人';
  const pageUrl = window.location.href;
  const shareMessage = [
    name,
    pending ? '狀態：未確認，參加前請再確認活動資訊' : '',
    `時間：${formatDetailDate(start)}${end ? ` 至 ${formatDetailDate(end)}` : ''}`,
    `地點：${fullLocation}`,
    mapUrl,
    pageUrl,
  ].filter(Boolean).join('\n');
  const shareUrl = EVENT_DETAIL_CONFIG.SHARE_LINE_URL + encodeURIComponent(shareMessage);
  const posterUrl = id ? `poster.html?id=${encodeURIComponent(id)}` : '';

  document.title = `${name}｜慶豐蘭園`;
  container.innerHTML = `
    <article class="event-detail-card" data-event-id="${escapeDetailHtml(id)}">
      ${imageUrl ? `<img class="event-detail-cover" src="${escapeDetailHtml(imageUrl)}" alt="${escapeDetailHtml(name)}">` : ''}
      <div class="event-detail-content">
        <div class="event-detail-badges">
          <span class="event-detail-badge">${escapeDetailHtml(type)}</span>
          ${level ? `<span class="event-detail-badge">${escapeDetailHtml(level)}</span>` : ''}
          ${pending ? '<span class="event-detail-badge event-status-badge is-pending">未確認</span>' : ''}
        </div>
        <h1 class="event-detail-title">${escapeDetailHtml(name)}</h1>
        <div class="event-detail-facts">
          <div class="event-detail-fact"><span>🗓</span><span>${escapeDetailHtml(formatDetailDate(start))}${end ? ` 至 ${escapeDetailHtml(formatDetailDate(end))}` : ''}</span></div>
          <div class="event-detail-fact"><span>📍</span><span>${escapeDetailHtml(fullLocation)}</span></div>
          <div class="event-detail-fact"><span>👤</span><span>${escapeDetailHtml(organizer)}</span></div>
        </div>
        <p class="event-detail-description">${escapeDetailHtml(description)}</p>
        ${EVENT_DETAIL_CONFIG.INTEREST_ENABLED && !pending ? `<div class="event-interest-panel">
          <button
            type="button"
            class="event-interest-button${interestSelected ? ' is-selected' : ''}"
            data-event-id="${escapeDetailHtml(id)}"
            data-count="${interestCount}"
            ${interestSelected || !id ? 'disabled' : ''}
          >${interestSelected ? `♥ 已感興趣・關注熱度 ${interestCount}` : `♡ 我感興趣・關注熱度 ${interestCount}`}</button>
          <p>此數字為關注熱度，不代表活動報名人數。</p>
        </div>` : ''}
        <div class="event-detail-actions">
          <a class="btn-line" href="${escapeDetailHtml(shareUrl)}" target="_blank" rel="noopener">分享到 LINE</a>
          ${pending
            ? '<span class="btn-secondary is-disabled">聯絡資料未提供</span>'
            : `<a class="btn-secondary" href="${escapeDetailHtml(contactUrl)}"${contactUrl.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${escapeDetailHtml(contactLabel)}</a>`}
          ${posterUrl ? `<a class="btn-secondary event-poster-link" href="${escapeDetailHtml(posterUrl)}">產生海報</a>` : ''}
          <a class="btn-secondary" href="products.html">送花去</a>
        </div>
      </div>
    </article>`;
}

function renderMissingEvent(message) {
  const container = document.getElementById('eventDetail');
  if (!container) return;

  container.innerHTML = `
    <div class="event-detail-card event-detail-state">
      <h1>活動不存在或已下架</h1>
      <p>${escapeDetailHtml(message)}</p>
      <a class="btn-line-solid" href="events.html">查看其他活動</a>
    </div>`;
}

function renderEventLoadError() {
  const container = document.getElementById('eventDetail');
  if (!container) return;
  container.innerHTML = `
    <div class="event-detail-card event-detail-state">
      <h1>活動資料暫時無法載入</h1>
      <p>Google 資料暫時沒有回應，可以重新載入或查看其他活動。</p>
      <button type="button" class="btn-retry" id="retryEventDetail">重新載入</button>
      <a class="btn-line-solid" href="events.html">查看其他活動</a>
    </div>`;
  document.getElementById('retryEventDetail')?.addEventListener('click', () => loadEventDetail(true));
}

async function loadEventDetail(force = false) {
  const id = new URLSearchParams(window.location.search).get('id')?.trim();
  if (!id) {
    renderMissingEvent('網址缺少活動編號。');
    return;
  }

  try {
    const items = await window.SITE_DATA.fetchJson(EVENT_DETAIL_CONFIG.GAS_URL + '?action=events', {
      cacheKey: 'events',
      force,
    });
    if (!Array.isArray(items)) throw new Error('活動資料格式不正確');

    const item = items.find(event => String(detailValue(event, '編號')) === id);
    if (!item) {
      renderMissingEvent('這場活動可能已被移除或超過下架日。');
      return;
    }

    renderEventDetail(item);
  } catch (error) {
    console.error('活動詳情載入失敗：', error);
    renderEventLoadError();
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('.event-interest-button');
  if (button) submitEventInterest(button);
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobileMenu')?.classList.toggle('open');
  });
  loadEventDetail();
});
