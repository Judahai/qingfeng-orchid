// ============================================================
// 慶豐蘭園 · 人物查詢 — 候選人與現任公職統一介面
// 資料仍分開：Candidates / CurrentOfficials → GAS → UI
// ============================================================

const CONFIG = {
  GAS_URL: window.SITE_CONFIG.GAS_URL,
  LINE_OA_URL: 'https://line.me/R/oaMessage/%40775yvfxq/?',
};

let allPeople = [];

function normalizeCandidate(candidate) {
  return {
    ...candidate,
    Person_ID: candidate.ID,
    DataType: 'candidate',
    Level: candidate.Level || '',
    DisplayLevel: candidate.Level === '縣長' ? '縣市長' : (candidate.Level || ''),
  };
}

function normalizeOfficial(official) {
  return {
    ...official,
    Person_ID: official.Official_ID,
    DataType: 'official',
    Level: official.Current_Level || '村里長',
    DisplayLevel: official.Current_Level || '村里長',
    Status: official.Current_Status || '現任',
  };
}

function personCoverageAreas(person) {
  const district = String(person.District || '').trim();
  const village = String(person.Village || '').trim();
  const areas = [];

  if (/[^全][市區鎮鄉]$/.test(district) && !/^第.+選區$/.test(district)) {
    areas.push(district);
  }

  if (person.DataType === 'candidate') {
    village
      .split(/[、,，/／]/)
      .map(area => area.trim())
      .filter(area => /[市區鎮鄉]$/.test(area))
      .forEach(area => areas.push(area));
  }

  return [...new Set(areas)];
}

function personMatchesDistrict(person, district) {
  if (!district) return true;
  if (
    person.DataType === 'candidate' &&
    ['全縣', '全市', '平地原住民', '山地原住民'].includes(person.District)
  ) return true;
  return personCoverageAreas(person).includes(district);
}

function isPublicVillageValue(person) {
  const village = String(person.Village || '').trim();
  if (!village || /^C\d+$/i.test(village) || /[、,，/／]/.test(village)) return false;
  return person.DataType === 'official' || person.Level === '里長';
}

function sortPeople(people) {
  return [...people].sort((a, b) => {
    const city = (a.City || '').localeCompare(b.City || '', 'zh-TW');
    if (city !== 0) return city;
    const district = (a.District || '').localeCompare(b.District || '', 'zh-TW');
    if (district !== 0) return district;
    const village = (a.Village || '').localeCompare(b.Village || '', 'zh-TW');
    if (village !== 0) return village;
    const aNumber = parseInt(a.Number, 10) || 9999;
    const bNumber = parseInt(b.Number, 10) || 9999;
    if (aNumber !== bNumber) return aNumber - bNumber;
    return (a.Name || '').localeCompare(b.Name || '', 'zh-TW');
  });
}

async function fetchPeople(force = false) {
  const grid = document.getElementById('candidateGrid');
  if (force && grid) grid.innerHTML = '<div class="loading-state">人物資料重新載入中…</div>';

  const candidateRequest = window.SITE_DATA.fetchJson(
    CONFIG.GAS_URL + '?action=candidates',
    { cacheKey: 'candidates', force }
  );
  const officialRequest = window.SITE_DATA.fetchJson(
    CONFIG.GAS_URL + '?action=currentOfficials',
    { cacheKey: 'current-officials', force }
  );

  const [candidateResult, officialResult] = await Promise.allSettled([
    candidateRequest,
    officialRequest,
  ]);

  const candidates = candidateResult.status === 'fulfilled' && Array.isArray(candidateResult.value)
    ? candidateResult.value.filter(item => item && item.ID && item.Name).map(normalizeCandidate)
    : [];

  // 舊版 GAS 遇到未知 action 會回傳 Candidates，因此必須驗證 CurrentOfficials 專屬欄位。
  const officials = officialResult.status === 'fulfilled' && Array.isArray(officialResult.value)
    ? officialResult.value
      .filter(item => item && item.Official_ID && item.Current_Level && item.Name)
      .map(normalizeOfficial)
    : [];

  if (candidateResult.status === 'rejected') {
    console.error('候選人資料載入失敗:', candidateResult.reason);
  }
  if (officialResult.status === 'rejected') {
    console.warn('現任公職資料尚未啟用:', officialResult.reason);
  }

  if (candidateResult.status === 'rejected' && officialResult.status === 'rejected') {
    showLoadError();
    return;
  }

  allPeople = sortPeople([...candidates, ...officials]);
  updateHeroStats(candidates.length, officials.length);
  rebuildAllDropdowns();
  applyFilters();
}

function showLoadError() {
  const grid = document.getElementById('candidateGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="error-state">
      <p>⚠️ 人物資料載入失敗</p>
      <p class="error-sub">資料暫時沒有回應，可以重新載入或透過 LINE 聯繫。</p>
      <button type="button" class="btn-retry" id="retryPeople">重新載入</button>
      <a href="https://line.me/R/ti/p/%40775yvfxq" class="btn-line-solid" target="_blank" rel="noopener">LINE 聯繫</a>
    </div>`;
  document.getElementById('retryPeople')?.addEventListener('click', () => fetchPeople(true));
}

function updateHeroStats(candidateCount, officialCount) {
  const total = document.getElementById('totalCount');
  const candidates = document.getElementById('candidateCount');
  const officials = document.getElementById('officialCount');
  if (total) total.textContent = candidateCount + officialCount;
  if (candidates) candidates.textContent = candidateCount;
  if (officials) officials.textContent = officialCount;
}

function getTypeScopedPeople() {
  const type = document.getElementById('typeFilter')?.value || '';
  return allPeople.filter(person => !type || person.DataType === type);
}

function setSelectOptions(select, placeholder, options, display = value => value) {
  if (!select) return;
  const previous = select.value;
  select.innerHTML = '';

  const first = document.createElement('option');
  first.value = '';
  first.textContent = placeholder;
  select.appendChild(first);

  options.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = display(value);
    select.appendChild(option);
  });

  select.value = options.includes(previous) ? previous : '';
}

function rebuildAllDropdowns() {
  updateCityDropdown();
  updateDistrictDropdown();
  updateVillageDropdown();
  updateLevelDropdown();
}

function updateCityDropdown() {
  const cities = [...new Set(getTypeScopedPeople().map(person => person.City).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'zh-TW'));
  setSelectOptions(document.getElementById('cityFilter'), '全部縣市', cities);
}

function updateDistrictDropdown() {
  const city = document.getElementById('cityFilter')?.value || '';
  const districts = [...new Set(
    getTypeScopedPeople()
      .filter(person => !city || person.City === city)
      .flatMap(personCoverageAreas)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'zh-TW'));
  setSelectOptions(document.getElementById('districtFilter'), '全部鄉鎮', districts);
}

function updateVillageDropdown() {
  const city = document.getElementById('cityFilter')?.value || '';
  const district = document.getElementById('districtFilter')?.value || '';
  const select = document.getElementById('villageFilter');
  const group = document.getElementById('villageFilterGroup');

  const villages = [...new Set(
    getTypeScopedPeople()
      .filter(person =>
        isPublicVillageValue(person) &&
        (!city || person.City === city) &&
        personMatchesDistrict(person, district)
      )
      .map(person => person.Village)
  )].sort((a, b) => a.localeCompare(b, 'zh-TW'));

  setSelectOptions(select, '全部村里', villages);
  if (group) group.hidden = villages.length === 0;
}

function updateLevelDropdown() {
  const city = document.getElementById('cityFilter')?.value || '';
  const levels = [...new Set(
    getTypeScopedPeople()
      .filter(person => !city || person.City === city)
      .map(person => person.Level)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'zh-TW'));
  setSelectOptions(
    document.getElementById('levelFilter'),
    '全部層級',
    levels,
    value => value === '縣長' ? '縣市長' : value
  );
}

function applyFilters() {
  const type = document.getElementById('typeFilter')?.value || '';
  const city = document.getElementById('cityFilter')?.value || '';
  const district = document.getElementById('districtFilter')?.value || '';
  const village = document.getElementById('villageFilter')?.value || '';
  const level = document.getElementById('levelFilter')?.value || '';
  const name = document.getElementById('nameSearch')?.value.trim() || '';

  const filtered = allPeople.filter(person =>
    (!type || person.DataType === type) &&
    (!city || person.City === city) &&
    personMatchesDistrict(person, district) &&
    (!village || person.Village === village) &&
    (!level || person.Level === level) &&
    (!name || (person.Name || '').includes(name))
  );

  const candidateCount = filtered.filter(person => person.DataType === 'candidate').length;
  const officialCount = filtered.length - candidateCount;
  const count = document.getElementById('resultCount');
  if (count) {
    count.textContent = `共 ${filtered.length} 位（候選人 ${candidateCount}／現任公職 ${officialCount}）`;
  }

  renderPeople(filtered);
}

function renderPeople(people) {
  const grid = document.getElementById('candidateGrid');
  const empty = document.getElementById('emptyState');
  if (!grid) return;

  if (people.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  grid.innerHTML = people.map(person =>
    person.DataType === 'official'
      ? renderOfficialCard(person)
      : renderCandidateCard(person)
  ).join('');
}

function renderCandidateCard(candidate) {
  const statusMap = {
    '準備中': 'status-preparing',
    '已成立': 'status-active',
    '已當選': 'status-elected',
  };
  const statusClass = statusMap[candidate.Status] || 'status-preparing';
  const rawNumber = String(candidate.Number || '').trim();
  const number = /^\d+$/.test(rawNumber) ? `第 ${escapeHtml(rawNumber)} 號` : '尚未抽號';
  const hqAddress = candidate.HQ_Address || '私訊代查';
  // 雲端資料若再次發生錯欄污染，不把姓名或行政區誤顯示成號次／日期。
  const rawHqDate = String(candidate.HQ_Date || '').trim();
  const hqDate = /^\d{4}\/\d{2}\/\d{2}$/.test(rawHqDate) ? rawHqDate : '';
  const phone = candidate.ServiceOffice_Phone || '';
  const facebook = safeHttpUrl(candidate.Official_Facebook);
  const orderLink = buildOrderLink(candidate, '候選人');

  return `
    <article class="candidate-card person-card candidate-person" data-id="${escapeAttribute(candidate.Person_ID || '')}">
      <div class="person-type-strip candidate-type">候選人</div>
      <div class="card-header">
        <div class="card-name-row">
          <h2 class="card-name">${escapeHtml(candidate.Name || '')}</h2>
          <span class="card-badge ${statusClass}">${escapeHtml(candidate.Status || '準備中')}</span>
        </div>
        <div class="card-meta-row">
          <span class="card-level">${escapeHtml(candidate.DisplayLevel)}</span>
          <span class="card-number">${number}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info-row"><span class="info-icon">📍</span><span>${escapeHtml(formatLocation(candidate))}</span></div>
        <div class="card-info-row"><span class="info-icon">🏠</span><span class="${hqAddress === '私訊代查' ? 'addr-query' : ''}">${escapeHtml(hqAddress)}</span></div>
        ${hqDate ? `<div class="card-info-row"><span class="info-icon">📅</span><span>競總成立：${escapeHtml(hqDate)}</span></div>` : ''}
        ${phone ? `<div class="card-info-row"><span class="info-icon">☎️</span><a href="tel:${escapeAttribute(phone.replace(/[^\d+]/g, ''))}">${escapeHtml(phone)}</a></div>` : ''}
        ${facebook ? `<div class="card-info-row"><span class="info-icon">f</span><a href="${escapeAttribute(facebook)}" target="_blank" rel="noopener">官方 Facebook</a></div>` : ''}
      </div>
      <div class="card-footer">
        <a href="${escapeAttribute(orderLink)}" target="_blank" rel="noopener" class="btn-line">LINE 快速訂花</a>
        <a href="products.html" class="btn-secondary">查看品項</a>
      </div>
    </article>`;
}

function renderOfficialCard(official) {
  const phone = official.Office_Phone || '';
  const address = official.Office_Address || '';
  const facebook = safeHttpUrl(official.Official_Facebook);
  const source = safeHttpUrl(official.Source_URL);
  const orderLink = buildOrderLink(official, '現任公職');
  const hasContact = phone || address || facebook;

  return `
    <article class="candidate-card person-card official-person" data-id="${escapeAttribute(official.Person_ID || '')}">
      <div class="person-type-strip official-type">現任公職</div>
      <div class="card-header">
        <div class="card-name-row">
          <h2 class="card-name">${escapeHtml(official.Name || '')}</h2>
          <span class="card-badge status-incumbent">現任</span>
        </div>
        <div class="card-meta-row">
          <span class="card-level">${escapeHtml(official.DisplayLevel)}</span>
          <span class="card-number">${escapeHtml(official.Village || '村里未標示')}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info-row"><span class="info-icon">📍</span><span>${escapeHtml(formatLocation(official))}</span></div>
        ${phone ? `<div class="card-info-row"><span class="info-icon">☎️</span><a href="tel:${escapeAttribute(phone.replace(/[^\d+]/g, ''))}">${escapeHtml(phone)}（辦公室）</a></div>` : ''}
        ${address ? `<div class="card-info-row"><span class="info-icon">🏢</span><span>${escapeHtml(address)}（${escapeHtml(official.Address_Type || '未標示')}）</span></div>` : ''}
        ${facebook ? `<div class="card-info-row"><span class="info-icon">f</span><a href="${escapeAttribute(facebook)}" target="_blank" rel="noopener">官方 Facebook</a></div>` : ''}
        ${!hasContact ? '<div class="card-info-row contact-unavailable"><span class="info-icon">ℹ️</span><span>官方名冊未提供可公開的辦公聯絡方式</span></div>' : ''}
        <div class="official-source-row">
          ${source ? `<a href="${escapeAttribute(source)}" target="_blank" rel="noopener">政府資料來源 ↗</a>` : '<span>政府來源未標示</span>'}
          ${official.Verified_At ? `<span>查核 ${escapeHtml(official.Verified_At)}</span>` : ''}
        </div>
      </div>
      <div class="card-footer">
        ${phone ? `<a href="tel:${escapeAttribute(phone.replace(/[^\d+]/g, ''))}" class="btn-call">撥打辦公室</a>` : `<a href="${escapeAttribute(orderLink)}" target="_blank" rel="noopener" class="btn-line">LINE 詢問送花</a>`}
        <a href="products.html" class="btn-secondary">查看品項</a>
      </div>
    </article>`;
}

function formatLocation(person) {
  return [person.City, person.District, isPublicVillageValue(person) ? person.Village : '']
    .filter(Boolean)
    .join(' ');
}

function buildOrderLink(person, identityLabel) {
  const message = [
    '您好，我想詢問選舉／活動花禮：',
    `對象：${person.Name || ''}`,
    `身分：${identityLabel}・${person.DisplayLevel || person.Level || ''}`,
    `地區：${formatLocation(person)}`,
    '品項：（請告知預算或品項編號）',
    '',
    '感謝慶豐蘭園',
  ].join('\n');
  return CONFIG.LINE_OA_URL + encodeURIComponent(message);
}

function safeHttpUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value), window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value ?? '');
  return div.innerHTML;
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function resetFilters() {
  ['typeFilter', 'cityFilter', 'districtFilter', 'villageFilter', 'levelFilter']
    .forEach(id => {
      const element = document.getElementById(id);
      if (element) element.value = '';
    });
  const name = document.getElementById('nameSearch');
  if (name) name.value = '';
  rebuildAllDropdowns();
  applyFilters();
}

function initEventListeners() {
  const type = document.getElementById('typeFilter');
  const city = document.getElementById('cityFilter');
  const district = document.getElementById('districtFilter');
  const village = document.getElementById('villageFilter');
  const level = document.getElementById('levelFilter');
  const name = document.getElementById('nameSearch');
  const clear = document.getElementById('clearBtn');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  type?.addEventListener('change', () => {
    rebuildAllDropdowns();
    applyFilters();
  });
  city?.addEventListener('change', () => {
    updateDistrictDropdown();
    updateVillageDropdown();
    updateLevelDropdown();
    applyFilters();
  });
  district?.addEventListener('change', () => {
    updateVillageDropdown();
    applyFilters();
  });
  village?.addEventListener('change', applyFilters);
  level?.addEventListener('change', applyFilters);
  clear?.addEventListener('click', resetFilters);

  let searchTimer;
  name?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 250);
  });

  hamburger?.addEventListener('click', () => mobileMenu?.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  if (document.getElementById('candidateGrid')) fetchPeople();
});
