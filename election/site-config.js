// 全站共用設定。更換 GAS 部署時只需修改這一處。
window.SITE_CONFIG = Object.freeze({
  GAS_URL: 'https://script.google.com/macros/s/AKfycbz72l9INkPvi7eNs45JlTp7hZGkajzZ9SlhcVCGHiGXhMveaBZ37D5292D9OU_hRr92/exec',
  DATA_REQUEST_TIMEOUT_MS: 9000,
  DATA_CACHE_TTL_MS: 5 * 60 * 1000,
  FEATURES: Object.freeze({
    INTEREST_ENABLED: false,
    PRODUCT_PRICES_ENABLED: false,
  }),
});

// 共用的 GAS JSON 讀取：限制等待時間，並在同一瀏覽工作階段使用短期快取。
window.SITE_DATA = Object.freeze({
  async fetchJson(url, options = {}) {
    const cacheKey = options.cacheKey ? `qingfeng:${options.cacheKey}` : '';
    const maxAgeMs = options.maxAgeMs ?? window.SITE_CONFIG.DATA_CACHE_TTL_MS;
    const timeoutMs = options.timeoutMs ?? window.SITE_CONFIG.DATA_REQUEST_TIMEOUT_MS;
    const staleIfErrorMs = options.staleIfErrorMs ?? 6 * 60 * 60 * 1000;
    let cached = null;

    if (cacheKey) {
      try {
        cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
        const age = Date.now() - Number(cached?.savedAt || 0);
        if (!options.force && cached && age <= maxAgeMs) return cached.data;
      } catch (_) {
        cached = null;
      }
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (cacheKey) {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
        } catch (_) {
          // 快取不可用時仍照常顯示即時資料。
        }
      }
      return data;
    } catch (error) {
      const age = Date.now() - Number(cached?.savedAt || 0);
      if (cached && age <= staleIfErrorMs) return cached.data;
      if (error?.name === 'AbortError') throw new Error('資料讀取逾時');
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  },
});
