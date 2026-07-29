const PRODUCT_GROUPS = {
  '競總成立': document.getElementById('campaignProductGrid'),
  '當選祝賀': document.getElementById('electedProductGrid'),
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
    img.addEventListener('error', () => image.replaceChildren(document.createTextNode(text(product.Emoji, '🌿'))));
    image.appendChild(img);
  } else {
    image.textContent = text(product.Emoji, '🌿');
  }

  const info = document.createElement('div');
  info.className = 'product-info';
  const scene = normalizeScene(product.Scene);
  const fields = [
    ['div', 'product-scene', `適用：${scene}`],
    ['h3', 'product-name', text(product.ProductName, '未命名品項')],
    ['div', 'product-price', formatPrice(product.Price)],
    ['div', 'product-size', text(product.Size, '規格請洽詢')],
    ['p', 'product-desc', text(product.Description, '實際花材與樣式請洽詢確認。')],
  ];
  fields.forEach(([tag, className, content]) => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = content;
    info.appendChild(element);
  });
  card.append(image, info);
  return { card, scene };
}

async function loadProducts() {
  const status = document.getElementById('productLoadStatus');
  try {
    const response = await fetch(`${window.SITE_CONFIG.GAS_URL}?action=products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error('API 回傳格式不正確');

    const available = products
      .filter(product => product && product.ProductID && product.ProductName && isEnabled(product.Active))
      .sort((a, b) => (Number(a.Sort) || 9999) - (Number(b.Sort) || 9999));
    if (!available.length) throw new Error('沒有可顯示的品項');

    const cards = { '競總成立': [], '當選祝賀': [] };
    available.forEach(product => {
      const rendered = productCard(product);
      cards[rendered.scene].push(rendered.card);
    });
    Object.entries(PRODUCT_GROUPS).forEach(([scene, grid]) => {
      if (!grid || !cards[scene].length) return;
      grid.replaceChildren(...cards[scene]);
      grid.dataset.fallback = 'false';
    });
    status.textContent = `已載入 ${available.length} 項最新品項`;
    status.classList.add('is-success');
  } catch (error) {
    console.error('品項載入失敗，使用頁面內建品項：', error);
    status.textContent = '最新資料暫時無法載入，目前顯示參考品項；實際供應與價格請透過 LINE 確認。';
    status.classList.add('is-fallback');
  }
}

document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.toggle('open');
});

loadProducts();
