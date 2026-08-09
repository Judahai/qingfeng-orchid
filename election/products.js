const PRODUCT_GROUPS = {
  '競總成立': {
    grid: document.getElementById('campaignProductGrid'),
    section: document.getElementById('campaignProductSection'),
  },
  '當選祝賀': {
    grid: document.getElementById('electedProductGrid'),
    section: document.getElementById('electedProductSection'),
  },
};

function text(value, fallback = '') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function isEnabled(value) {
  if (value === null || value === undefined || value === '') return true;
  return !['false', '0', '否', '下架'].includes(String(value).trim().toLowerCase());
}

function formatPrice(value) {
  const amount = Number(String(value ?? '').replace(/[,$\s]/g, ''));
  return Number.isFinite(amount) ? `NT$ ${amount.toLocaleString('zh-TW')}` : text(value, '價格請洽詢');
}

function normalizeScene(value) {
  const scene = text(value, '競總成立').replace(/^適用[：:]\s*/, '');
  return scene.includes('當選') ? '當選祝賀' : '競總成立';
}

function productCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const image = document.createElement('div');
  image.className = 'product-img';
  const photoUrl = text(product.PhotoURL || product.PhotoFilename);
  if (/^https?:\/\//i.test(photoUrl)) {
    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = text(product.ProductName, '花禮商品');
    img.loading = 'lazy';
    img.addEventListener('error', () => image.replaceChildren(document.createTextNode(text(product.Emoji, '花禮').replace(/\u{1F33F}/gu, '') || '花禮')));
    image.appendChild(img);
  } else {
    image.textContent = text(product.Emoji, '花禮').replace(/\u{1F33F}/gu, '') || '花禮';
  }

  const info = document.createElement('div');
  info.className = 'product-info';
  const scene = normalizeScene(product.Scene);
  const fields = [
    ['div', 'product-scene', `適用：${scene}`],
    ['h3', 'product-name', text(product.ProductName, '未命名品項')],
    ['div', 'product-size', text(product.Size, '規格請洽詢')],
    ['p', 'product-desc', text(product.Description, '實際花材與樣式請洽詢確認。')],
  ];
  if (window.SITE_CONFIG.FEATURES.PRODUCT_PRICES_ENABLED) {
    fields.splice(2, 0, ['div', 'product-price', formatPrice(product.Price)]);
  }
  fields.forEach(([tag, className, content]) => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = content;
    info.appendChild(element);
  });
  card.append(image, info);
  return { card, scene };
}

async function loadProducts(force = false) {
  const status = document.getElementById('productLoadStatus');
  status.classList.remove('is-success', 'is-fallback');
  if (force) status.textContent = '正在重新載入最新品項…';
  try {
    const products = await window.SITE_DATA.fetchJson(`${window.SITE_CONFIG.GAS_URL}?action=products`, {
      cacheKey: 'products',
      force,
    });
    if (!Array.isArray(products)) throw new Error('API 回傳格式不正確');

    const available = products
      .filter(product => product && product.ProductID && product.ProductName && isEnabled(product.Active))
      .sort((a, b) => (Number(a.Sort) || 9999) - (Number(b.Sort) || 9999));
    if (!available.length) {
      status.textContent = '目前尚未上架最新品項；先提供慶豐蘭園實際作品與配置參考。';
      status.classList.add('is-fallback');
      return;
    }

    const cards = { '競總成立': [], '當選祝賀': [] };
    available.forEach(product => {
      const rendered = productCard(product);
      cards[rendered.scene].push(rendered.card);
    });
    Object.entries(PRODUCT_GROUPS).forEach(([scene, group]) => {
      if (!group.grid || !cards[scene].length) return;
      group.grid.replaceChildren(...cards[scene]);
      group.section.hidden = false;
    });
    status.textContent = `已載入 ${available.length} 項最新品項`;
    status.classList.add('is-success');
  } catch (error) {
    console.error('品項載入失敗，使用頁面內建品項：', error);
    status.innerHTML = '目前顯示實際作品；最新品項暫時無法載入。 <button type="button" class="btn-retry btn-retry-inline" id="retryProducts">重新載入</button>';
    status.classList.add('is-fallback');
    document.getElementById('retryProducts')?.addEventListener('click', () => loadProducts(true));
  }
}

document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.toggle('open');
});

loadProducts();
