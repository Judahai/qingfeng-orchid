// ============================================================
// 慶豐蘭園 · 選舉花禮站 — 前端邏輯
// 資料源：Google Sheet → GAS → JSON
// ============================================================

// ──────────── 設定區（部署時改這裡）────────────
const CONFIG = {
  // 共用設定放在 site-config.js，避免各頁 API 網址不同步。
  GAS_URL: window.SITE_CONFIG.GAS_URL,

  // 慶豐蘭園 LINE 官方帳號 OA Message 連結
  // 格式：https://line.me/R/oaMessage/@你的ID/?
  // 若還沒建 OA，先用通用分享：https://line.me/R/msg/text/?
  LINE_OA_URL: 'https://line.me/ti/p/K2LFf7aucm?text=',
};


// ──────────── 狀態 ────────────
let allCandidates = [];


// ──────────── 排序邏輯 ────────────
// 規則：縣市 → 鄉鎮 → 號次(數字升序,沒號次排最後) → 姓名(locale)
function sortCandidates(arr) {
  return [...arr].sort((a, b) => {
    const cCity = (a.City || '').localeCompare(b.City || '', 'zh-TW');
    if (cCity !== 0) return cCity;

    const cDist = (a.District || '').localeCompare(b.District || '', 'zh-TW');
    if (cDist !== 0) return cDist;

    const aNum = parseInt(a.Number) || 9999;
    const bNum = parseInt(b.Number) || 9999;
    if (aNum !== bNum) return aNum - bNum;

    return (a.Name || '').localeCompare(b.Name || '', 'zh-TW');
  });
}


// ──────────── 資料取得 ────────────
async function fetchCandidates() {
  try {
    const res = await fetch(CONFIG.GAS_URL + '?action=candidates');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allCandidates = sortCandidates(data);

    // 更新 hero 數字
    const counter = document.getElementById('totalCount');
    if (counter) counter.textContent = allCandidates.length;

    buildCityDropdown();
    applyFilters();
  } catch (err) {
    console.error('資料載入失敗:', err);
    const grid = document.getElementById('candidateGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-state">
          <p>⚠️ 資料載入失敗</p>
          <p class="error-sub">請稍後重新整理，或直接透過 LINE 聯繫我們訂購</p>
          <a href="https://line.me/ti/p/K2LFf7aucm" class="btn-line-solid" target="_blank" rel="noopener">LINE 聯繫</a>
        </div>`;
    }
  }
}


// ──────────── 下拉選單串接（三層聯動）────────────
function buildCityDropdown() {
  const citySelect = document.getElementById('cityFilter');
  if (!citySelect) return;

  const cities = [...new Set(allCandidates.map(c => c.City).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'zh-TW'));

  cities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}

function updateDistrictDropdown() {
  const city = document.getElementById('cityFilter')?.value || '';
  const distSelect = document.getElementById('districtFilter');
  if (!distSelect) return;

  distSelect.innerHTML = '<option value="">全部鄉鎮</option>';
  // 村里也清空
  const villSelect = document.getElementById('villageFilter');
  if (villSelect) villSelect.innerHTML = '<option value="">全部村里</option>';

  const districts = [...new Set(
    allCandidates
      .filter(c => !city || c.City === city)
      .map(c => c.District)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'zh-TW'));

  districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    distSelect.appendChild(opt);
  });
}

function updateVillageDropdown() {
  const city = document.getElementById('cityFilter')?.value || '';
  const dist = document.getElementById('districtFilter')?.value || '';
  const villSelect = document.getElementById('villageFilter');
  if (!villSelect) return;

  villSelect.innerHTML = '<option value="">全部村里</option>';

  const villages = [...new Set(
    allCandidates
      .filter(c => (!city || c.City === city) && (!dist || c.District === dist))
      .map(c => c.Village)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'zh-TW'));

  villages.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    villSelect.appendChild(opt);
  });
}


// ──────────── 篩選 + 渲染 ────────────
function applyFilters() {
  const city  = document.getElementById('cityFilter')?.value || '';
  const dist  = document.getElementById('districtFilter')?.value || '';
  const vill  = document.getElementById('villageFilter')?.value || '';
  const level = document.getElementById('levelFilter')?.value || '';
  const name  = document.getElementById('nameSearch')?.value.trim() || '';

  const filtered = allCandidates.filter(c =>
    (!city  || c.City     === city)  &&
    (!dist  || c.District === dist)  &&
    (!vill  || c.Village  === vill)  &&
    (!level || c.Level    === level) &&
    (!name  || (c.Name || '').includes(name))
  );

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = `共 ${filtered.length} 位`;

  renderCards(filtered);
}

function renderCards(candidates) {
  const grid = document.getElementById('candidateGrid');
  const empty = document.getElementById('emptyState');
  if (!grid) return;

  if (candidates.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  grid.innerHTML = candidates.map(c => {
    // 狀態 badge
    const statusMap = {
      '準備中': 'status-preparing',
      '已成立': 'status-active',
      '已當選': 'status-elected',
    };
    const statusClass = statusMap[c.Status] || 'status-preparing';

    // 地址（GAS 已經處理未確認 → '私訊代查'）
    const hqAddr = c.HQ_Address || '私訊代查';

    // 日期格式化
    let hqDate = null;
    if (c.HQ_Date) {
      if (typeof c.HQ_Date === 'string') {
        hqDate = c.HQ_Date;
      } else {
        // Google Sheet 可能回傳 Date 物件的 ISO 字串
        try {
          hqDate = new Date(c.HQ_Date).toLocaleDateString('zh-TW');
        } catch (e) {
          hqDate = String(c.HQ_Date);
        }
      }
    }

    // 號次
    const number = c.Number ? `號次 ${c.Number}` : '號次待登記';

    // LINE 預填訊息
    const orderMsg = [
      '您好，我要訂花',
      '',
      `候選人：${c.Name}`,
      `選區：${c.City || ''} ${c.District || ''} ${c.Village || ''}`,
      '活動：競總成立花禮',
      '品項：（請告知預算或品項編號）',
      '',
      '感謝慶豐蘭園 🌿',
    ].join('\n');
    const lineLink = CONFIG.LINE_OA_URL + encodeURIComponent(orderMsg);

    return `
    <article class="candidate-card" data-id="${c.ID || ''}">
      <div class="card-header">
        <div class="card-name-row">
          <h2 class="card-name">${escapeHtml(c.Name || '')}</h2>
          <span class="card-badge ${statusClass}">${escapeHtml(c.Status || '準備中')}</span>
        </div>
        <div class="card-meta-row">
          <span class="card-level">${escapeHtml(c.Level || '')}</span>
          <span class="card-number">${escapeHtml(number)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info-row">
          <span class="info-icon">📍</span>
          <span>${escapeHtml(c.City || '')} ${escapeHtml(c.District || '')} ${escapeHtml(c.Village || '')}</span>
        </div>
        <div class="card-info-row">
          <span class="info-icon">🏠</span>
          <span class="${hqAddr === '私訊代查' ? 'addr-query' : ''}">${escapeHtml(hqAddr)}</span>
        </div>
        ${hqDate ? `<div class="card-info-row"><span class="info-icon">📅</span><span>競總成立：${escapeHtml(hqDate)}</span></div>` : ''}
      </div>
      <div class="card-footer">
        <a href="${lineLink}" target="_blank" rel="noopener" class="btn-line">
          <svg class="line-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          LINE 快速訂花
        </a>
        <a href="products.html" class="btn-secondary">查看品項</a>
      </div>
    </article>`;
  }).join('');
}


// ──────────── XSS 防護 ────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


// ──────────── 事件綁定 ────────────
function initEventListeners() {
  const cityFilter = document.getElementById('cityFilter');
  const distFilter = document.getElementById('districtFilter');
  const villFilter = document.getElementById('villageFilter');
  const levelFilter = document.getElementById('levelFilter');
  const nameSearch = document.getElementById('nameSearch');
  const clearBtn = document.getElementById('clearBtn');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (cityFilter) {
    cityFilter.addEventListener('change', () => {
      updateDistrictDropdown();
      updateVillageDropdown();
      applyFilters();
    });
  }

  if (distFilter) {
    distFilter.addEventListener('change', () => {
      updateVillageDropdown();
      applyFilters();
    });
  }

  if (villFilter) villFilter.addEventListener('change', applyFilters);
  if (levelFilter) levelFilter.addEventListener('change', applyFilters);

  // 搜尋框 debounce
  let searchTimer;
  if (nameSearch) {
    nameSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyFilters, 300);
    });
  }

  // 清除按鈕
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (cityFilter) {
        cityFilter.innerHTML = '<option value="">全部縣市</option>';
        buildCityDropdown();
      }
      if (distFilter) distFilter.innerHTML = '<option value="">全部鄉鎮</option>';
      if (villFilter) villFilter.innerHTML = '<option value="">全部村里</option>';
      if (levelFilter) levelFilter.value = '';
      if (nameSearch) nameSearch.value = '';
      applyFilters();
    });
  }

  // 漢堡選單
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }
}


// ──────────── 啟動 ────────────
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();

  // 只在首頁（有 candidateGrid）時載入候選人資料
  if (document.getElementById('candidateGrid')) {
    fetchCandidates();
  }
});
