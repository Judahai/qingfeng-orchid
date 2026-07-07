// ===============================================
// 慶豐蘭園 — 共用導覽列 nav.js
// ===============================================
// 用法：在任何頁面 <body> 結尾前加 <script src="nav.js"></script>
// 會自動注入頂部導覽列（桌面）與底部分頁列（手機）
// ===============================================

(function () {
    'use strict';

    // ----- 設定 -----
    const LINE_URL = 'https://line.me/ti/p/K2LFf7aucm';
    const NAV_ITEMS = [
        { label: '訂花', href: 'index.html', icon: svgFlower() },
        { label: '選舉花禮', href: 'election/index.html', icon: svgVote() },
        { label: '輓聯產生器', href: 'condolence.html', icon: svgScroll() },
        { label: '賀詞產生器', href: 'greeting.html', icon: svgScroll() },
        { label: '訂購須知', href: 'faq.html', icon: svgInfo() },
    ];

    // ----- SVG Icons (Lucide-style, 24x24) -----
    function svgScroll() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M2 18h10"/></svg>';
    }
    function svgFlower() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 1 0 4.5-4.5M12 16.5V15m4.5-3H15"/><circle cx="12" cy="12" r="3"/><path d="m8 16 1.5-1.5M16 8l-1.5 1.5M8 8l1.5 1.5M16 16l-1.5-1.5"/></svg>';
    }
    function svgVote() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>';
    }
    function svgInfo() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
    }

    // ----- 判斷當前頁面 -----
    function isActive(href) {
        const path = window.location.pathname;
        if (href === 'index.html') {
            return path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('/index-v2.html');
        }
        // 處理像是 'election/index.html' 這樣可能被省略為 'election/' 的情況
        const normalizedHref = href.replace('index.html', ''); 
        return path.includes(normalizedHref);
    }

    // ----- 注入 CSS -----
    const style = document.createElement('style');
    style.textContent = `

        /* ===== 頂部導覽列（桌面） ===== */
        .qf-nav-top {
            position: fixed; top: 32px; left: 0; right: 0; z-index: 9000;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid #e9ecef;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 24px; height: 56px;
            font-family: 'Noto Sans TC', sans-serif;
        }
        .qf-nav-brand {
            font-family: 'Noto Serif TC', serif;
            font-size: 1.1rem; font-weight: 700; color: #1a1a1a;
            text-decoration: none; letter-spacing: 1px;
        }
        .qf-nav-links { display: flex; gap: 8px; align-items: center; }
        .qf-nav-link {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 16px; border-radius: 8px;
            color: #555; text-decoration: none;
            font-size: 0.9rem; font-weight: 500;
            transition: all 0.2s;
        }
        .qf-nav-link:hover { background: #f5f5f5; color: #1a1a1a; }
        .qf-nav-link.active { background: #1a1a1a; color: #fff; }
        .qf-nav-link.active svg { stroke: #fff; }
        .qf-nav-line {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 16px; border-radius: 8px;
            background: #06C755; color: #fff;
            text-decoration: none; font-size: 0.9rem; font-weight: 600;
            transition: transform 0.2s;
        }
        .qf-nav-line:hover { transform: scale(1.03); }

        /* ===== 底部分頁列（手機） ===== */
        .qf-nav-bottom {
            display: none;
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 9000;
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(12px);
            border-top: 1px solid #e9ecef;
            height: 60px;
            font-family: 'Noto Sans TC', sans-serif;
        }
        .qf-nav-bottom-inner {
            display: flex; justify-content: space-around; align-items: center;
            height: 100%; max-width: 480px; margin: 0 auto;
        }
        .qf-nav-tab {
            display: flex; flex-direction: column; align-items: center; gap: 2px;
            color: #999; text-decoration: none; font-size: 0.7rem; font-weight: 500;
            padding: 4px 0; transition: color 0.2s;
        }
        .qf-nav-tab.active { color: #1a1a1a; }
        .qf-nav-tab.active svg { stroke: #1a1a1a; }

        /* ===== 響應式 ===== */
        @media (max-width: 768px) {
            .qf-nav-top { display: none; }
            .qf-nav-bottom { display: block; }
            body { padding-bottom: 68px; }
        }
        @media (min-width: 769px) {
            body { padding-top: 64px; }
        }
    `;
    document.head.appendChild(style);

    // (取消由 nav.js 注入頂部黑色工具列，改為由各別 HTML 獨立控制)

    // ----- 注入頂部導覽列 -----
    const topNav = document.createElement('nav');
    topNav.className = 'qf-nav-top';
    topNav.innerHTML = `
        <a href="index.html" class="qf-nav-brand">慶豐蘭園</a>
        <div class="qf-nav-links">
            ${NAV_ITEMS.map(item => `
                <a href="${item.href}" class="qf-nav-link${isActive(item.href) ? ' active' : ''}">
                    ${item.icon} ${item.label}
                </a>
            `).join('')}
            <a href="${LINE_URL}" class="qf-nav-line" target="_blank" rel="noopener">
                LINE 聯繫
            </a>
        </div>
    `;
    document.body.prepend(topNav);

    // ----- 注入底部分頁列 -----
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'qf-nav-bottom';
    bottomNav.innerHTML = `
        <div class="qf-nav-bottom-inner">
            ${NAV_ITEMS.map(item => `
                <a href="${item.href}" class="qf-nav-tab${isActive(item.href) ? ' active' : ''}">
                    ${item.icon} ${item.label}
                </a>
            `).join('')}
        </div>
    `;
    document.body.appendChild(bottomNav);

})();
