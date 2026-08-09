const POSTER_CONFIG = {
  GAS_URL: window.SITE_CONFIG.GAS_URL,
  FALLBACK_IMAGE: 'assets/event-orchid-botanical-v3.jpg',
};

let posterDownloadFilename = '活動海報.jpg';
let posterMode = 'existing';
let posterShareMessage = '活動海報，請查看圖片內容。';

function posterMapUrl(location) {
  const query = String(location || '').trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
}

function posterValue(item, ...keys) {
  for (const key of keys) {
    const value = item[key];
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return '';
}

function parsePosterDate(value) {
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

function formatPosterDate(startValue, endValue) {
  const start = parsePosterDate(startValue);
  if (!start) return String(startValue || '時間待確認');

  const dateText = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(start);
  const startTime = new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(start);
  const end = parsePosterDate(endValue);
  if (!end) return `${dateText} ${startTime}`;

  const endTime = new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(end);
  return `${dateText} ${startTime}–${endTime}`;
}

function formatPosterFilenameDate(value) {
  const date = parsePosterDate(value);
  if (!date) return '日期待確認';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function safePosterFilename(value) {
  return String(value || '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function safePosterImage(value) {
  const url = String(value || '').trim();
  return /^https?:\/\//i.test(url) ? url : POSTER_CONFIG.FALLBACK_IMAGE;
}

function setPosterText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(value || '');
}

function updatePosterScale() {
  const viewport = document.getElementById('posterViewport');
  const shell = document.getElementById('posterScaleShell');
  const poster = document.getElementById('posterCanvas');
  if (!viewport || !shell || !poster) return;

  const scale = Math.min(1, viewport.clientWidth / 1080);
  poster.style.transform = `scale(${scale})`;
  shell.style.height = `${1350 * scale}px`;
}

function selectPosterTemplate(template) {
  const allowedTemplates = ['bold', 'split', 'bordered'];
  if (!allowedTemplates.includes(template)) return;

  const poster = document.getElementById('posterCanvas');
  if (!poster) return;
  allowedTemplates.forEach(name => poster.classList.remove(`poster-template-${name}`));
  poster.classList.add(`poster-template-${template}`);

  document.querySelectorAll('[data-poster-template]').forEach(button => {
    const selected = button.dataset.posterTemplate === template;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function initPosterTemplatePicker() {
  document.getElementById('posterTemplatePicker')?.addEventListener('click', event => {
    const button = event.target.closest('[data-poster-template]');
    if (button) selectPosterTemplate(button.dataset.posterTemplate);
  });
}

function renderPosterQrCode(id) {
  const container = document.getElementById('posterQrCode');
  if (!container) return;
  container.replaceChildren();
  if (!id) return;

  if (typeof window.QRCode !== 'function') {
    container.textContent = 'QR';
    return;
  }

  const detailUrl = new URL(`event.html?id=${encodeURIComponent(id)}`, window.location.href).href;
  new window.QRCode(container, {
    text: detailUrl,
    width: 144,
    height: 144,
    colorDark: '#20251f',
    colorLight: '#ffffff',
    correctLevel: window.QRCode.CorrectLevel.M,
  });
}

function renderPoster(item, options = {}) {
  const id = posterValue(item, '編號');
  const status = posterValue(item, '狀態');
  const confirmed = status === '已確認' || status === '通過';
  const pending = status === '審核中' || status === '未確認';
  const showActions = options.showActions !== false;
  const name = String(posterValue(item, '活動名稱') || '活動名稱待確認');
  const type = posterValue(item, '活動類型') || '活動';
  const start = posterValue(item, '開始時間');
  const end = posterValue(item, '結束時間');
  const place = posterValue(item, '地點名稱') || '地點待確認';
  const address = [
    posterValue(item, '縣市'),
    posterValue(item, '鄉鎮市區'),
    posterValue(item, '詳細地址'),
  ].filter(Boolean).join(' ');
  const fullLocation = [address, place].filter(Boolean).join(' ');
  const organizer = posterValue(item, '主辦人姓名', '主辦人', '主辦單位') || '主辦人待確認';
  posterDownloadFilename = `${safePosterFilename(name)}_${formatPosterFilenameDate(start)}.jpg`;
  posterShareMessage = [
    name,
    pending ? '狀態：未確認，參加前請再確認活動資訊' : '',
    `時間：${formatPosterDate(start, end)}`,
    `地點：${fullLocation}`,
    posterMapUrl(fullLocation),
    `主辦：${organizer}`,
    id ? new URL(`event.html?id=${encodeURIComponent(id)}`, window.location.href).href : '',
  ].filter(Boolean).join('\n');

  setPosterText('posterType', type);
  setPosterText('posterTitle', name);
  setPosterText('posterDate', formatPosterDate(start, end));
  setPosterText('posterPlace', place);
  setPosterText('posterAddress', address);
  setPosterText('posterOrganizer', organizer);
  setPosterText(
    'posterFooterNote',
    '請以活動詳情頁的最新內容為準'
  );

  const title = document.getElementById('posterTitle');
  title?.classList.toggle('is-long', name.length > 14);
  title?.classList.toggle('is-very-long', name.length > 18);

  const background = document.getElementById('posterBackground');
  if (background) {
    background.onerror = () => {
      background.onerror = null;
      background.src = POSTER_CONFIG.FALLBACK_IMAGE;
    };
    background.src = safePosterImage(posterValue(item, '照片網址'));
  }

  const backLink = document.getElementById('posterBackLink');
  if (backLink && id) backLink.href = `event.html?id=${encodeURIComponent(id)}`;
  const qrGroup = document.getElementById('posterQrGroup');
  const showQr = Boolean(id && confirmed);
  qrGroup?.classList.toggle('hidden', !showQr);
  renderPosterQrCode(showQr ? id : '');

  document.getElementById('posterState')?.classList.add('hidden');
  document.getElementById('posterTemplatePicker')?.classList.remove('hidden');
  document.getElementById('posterViewport')?.classList.remove('hidden');
  document.getElementById('posterActions')?.classList.toggle('hidden', !showActions);
  if (options.updateTitle !== false) document.title = `${name}｜活動海報`;
  const downloadStatus = document.getElementById('posterDownloadStatus');
  if (downloadStatus && window.location.protocol === 'file:') {
    downloadStatus.textContent = '本機 QR 僅供版面測試；正式上線後才會帶入公開活動網址。';
  }
  updatePosterScale();
}

async function createPosterCanvas() {
  const poster = document.getElementById('posterCanvas');
  if (!poster) throw new Error('找不到海報內容');
  if (typeof window.html2canvas !== 'function') throw new Error('轉圖工具尚未載入');

  const previousTransform = poster.style.transform;
  try {
    await document.fonts?.ready;
    poster.style.transform = 'none';
    return await window.html2canvas(poster, {
      width: 1080,
      height: 1350,
      scale: 1,
      backgroundColor: '#f4f0e7',
      useCORS: true,
      allowTaint: false,
      logging: false,
    });
  } finally {
    poster.style.transform = previousTransform;
  }
}

function posterCanvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('無法建立 JPG')),
      'image/jpeg',
      0.92
    );
  });
}

async function downloadPoster() {
  const button = document.getElementById('posterDownloadButton');
  const status = document.getElementById('posterDownloadStatus');
  if (!button || !status) return;

  button.disabled = true;
  button.textContent = '正在產生海報…';
  status.textContent = '請稍候，正在輸出 1080 × 1350 JPG。';
  status.classList.remove('is-error');

  try {
    const canvas = await createPosterCanvas();
    const link = document.createElement('a');
    link.download = posterDownloadFilename;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
    status.textContent = '海報已下載。';
  } catch (error) {
    console.error('海報下載失敗：', error);
    status.textContent = '海報產生失敗。若活動使用外部照片，請先確認圖片允許跨網站讀取。';
    status.classList.add('is-error');
  } finally {
    button.disabled = false;
    button.textContent = '下載海報';
  }
}

async function sharePoster() {
  const button = document.getElementById('posterShareButton');
  const status = document.getElementById('posterDownloadStatus');
  if (!button || !status) return;

  button.disabled = true;
  button.textContent = '正在準備分享…';
  status.textContent = '請稍候，正在建立海報圖片。';
  status.classList.remove('is-error');

  try {
    const canvas = await createPosterCanvas();
    const blob = await posterCanvasToBlob(canvas);
    const file = new File([blob], posterDownloadFilename, { type: 'image/jpeg' });
    const shareData = {
      files: [file],
      title: '活動海報',
      text: posterShareMessage,
    };

    if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
      throw new Error('此瀏覽器不支援圖片分享');
    }

    await navigator.share(shareData);
    status.textContent = '分享選單已開啟；請選擇 LINE。';
  } catch (error) {
    if (error?.name === 'AbortError') {
      status.textContent = '已取消分享。';
    } else {
      console.error('海報分享失敗：', error);
      status.textContent = '此瀏覽器無法直接分享圖片，請先按「下載海報」再用 LINE 傳送。';
      status.classList.add('is-error');
    }
  } finally {
    button.disabled = false;
    button.textContent = '分享海報';
  }
}

function renderPosterError(message, retry = false) {
  const state = document.getElementById('posterState');
  if (!state) return;
  state.replaceChildren(document.createTextNode(message));
  if (retry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-retry';
    button.textContent = '重新載入';
    button.addEventListener('click', () => loadPoster(true));
    state.appendChild(button);
  }
  state.classList.add('is-error');
}

function posterFormItem(form) {
  const item = {};
  new FormData(form).forEach((value, key) => {
    if (key !== 'confirmAccuracy' && key !== 'confirmAuthorization') {
      item[key] = String(value).trim();
    }
  });
  return item;
}

function updateSubmissionPreview() {
  const form = document.getElementById('posterSubmissionForm');
  if (!form) return;
  renderPoster(
    {
      ...posterFormItem(form),
    },
    {
      showActions: false,
      updateTitle: false,
    }
  );
}

function submissionSourceFingerprint() {
  const storageKey = 'event_submission_source';
  let value = localStorage.getItem(storageKey);
  if (value) return value;

  value = window.crypto?.randomUUID?.()
    || `source-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(storageKey, value);
  return value;
}

async function submitPosterForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = document.getElementById('posterSubmitButton');
  const status = document.getElementById('posterSubmitStatus');
  if (!form.reportValidity() || !button || !status) return;

  button.disabled = true;
  button.textContent = '正在建立活動…';
  status.textContent = '正在送出資料，請稍候。';
  status.className = 'poster-submit-status';

  const item = posterFormItem(form);
  const payload = {
    action: 'submit',
    ...item,
    confirmAccuracy: form.elements.confirmAccuracy.checked,
    confirmAuthorization: form.elements.confirmAuthorization.checked,
    sourceFingerprint: submissionSourceFingerprint(),
  };

  try {
    const response = await fetch(POSTER_CONFIG.GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    if (!result.ok || !result.id) {
      throw new Error(result.error || '投稿失敗');
    }

    Array.from(form.elements).forEach(control => {
      control.disabled = true;
    });
    button.textContent = '資料已送出';
    status.textContent = `已收到，編號 ${result.id}。現在可以下載或分享海報。`;
    status.classList.add('is-success');
    renderPoster(
      {
        ...item,
        編號: result.id,
        狀態: result.status || '審核中',
      },
      {
        showActions: true,
      }
    );
  } catch (error) {
    console.error('活動投稿失敗：', error);
    status.textContent = error.message || '目前無法送出活動資料，請稍後再試。';
    status.classList.add('is-error');
    button.disabled = false;
    button.textContent = '免費建立海報並送出';
  }
}

function initSubmissionMode() {
  posterMode = 'submission';
  const shell = document.querySelector('.poster-page-shell');
  shell?.classList.add('is-submission');
  setPosterText('posterPageTitle', '免費建立活動分享海報');
  setPosterText('posterPageDescription', '不用自己排版，填寫活動時間與地點，就能立即產生三款海報、下載圖片或分享至 LINE，並同步建立活動頁。');

  const backLink = document.getElementById('posterBackLink');
  if (backLink) backLink.textContent = '← 查看近期活動';
  document.getElementById('posterState')?.classList.add('hidden');
  document.getElementById('posterSubmissionForm')?.classList.remove('hidden');
  document.getElementById('posterTemplatePicker')?.classList.remove('hidden');
  document.getElementById('posterViewport')?.classList.remove('hidden');

  const today = new Date();
  const todayValue = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const form = document.getElementById('posterSubmissionForm');
  const startInput = form?.elements['開始時間'];
  const endInput = form?.elements['結束時間'];
  const expireInput = form?.elements['下架日'];
  if (startInput) startInput.min = `${todayValue}T00:00`;
  if (endInput) endInput.min = `${todayValue}T00:00`;
  if (expireInput) expireInput.min = todayValue;

  updateSubmissionPreview();
  document.title = '免費建立活動分享海報';
}

async function loadPoster(force = false) {
  const requestedId = new URLSearchParams(window.location.search).get('id')?.trim();
  if (!requestedId) {
    initSubmissionMode();
    return;
  }

  try {
    const items = await window.SITE_DATA.fetchJson(`${POSTER_CONFIG.GAS_URL}?action=events`, {
      cacheKey: 'events',
      force,
    });
    if (!Array.isArray(items)) throw new Error('活動資料格式不正確');

    const item = items.find(event => String(posterValue(event, '編號')) === requestedId);
    if (!item) {
      renderPosterError('活動不存在或已下架。');
      return;
    }
    renderPoster(item);
  } catch (error) {
    console.error('海報資料載入失敗：', error);
    renderPosterError('目前無法載入活動資料，請稍後再試。', true);
  }
}

window.addEventListener('resize', updatePosterScale);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobileMenu')?.classList.toggle('open');
  });
  initPosterTemplatePicker();
  const submissionForm = document.getElementById('posterSubmissionForm');
  submissionForm?.addEventListener('input', updateSubmissionPreview);
  submissionForm?.addEventListener('change', event => {
    if (event.target.name === '開始時間') {
      const startDate = String(event.target.value || '').slice(0, 10);
      const expireInput = submissionForm.elements['下架日'];
      if (startDate && expireInput) {
        expireInput.min = startDate;
        if (expireInput.value && expireInput.value < startDate) expireInput.value = startDate;
      }
    }
    updateSubmissionPreview();
  });
  submissionForm?.addEventListener('submit', submitPosterForm);
  document.getElementById('posterDownloadButton')?.addEventListener('click', downloadPoster);
  document.getElementById('posterShareButton')?.addEventListener('click', sharePoster);
  loadPoster();
});
