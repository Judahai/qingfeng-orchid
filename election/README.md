# 選舉花禮站 — 部署指南

## 檔案清單

| 檔案 | 用途 |
|------|------|
| `index.html` | 首頁：三層選區篩選器 + 候選人卡片 + LINE 下單 |
| `products.html` | 花禮品項頁：成立花籃 3 檔 + 當選賀蘭 2 檔 |
| `info.html` | 訂購須知：流程、配送、付款、注意事項 |
| `style.css` | 設計系統（深墨綠+金色，中立風格） |
| `app.js` | 前端邏輯（GAS 資料抓取、篩選、LINE 預填） |
| `gas-backend.gs` | GAS 腳本（貼到 Google Sheet 的 Apps Script） |

---

## 第一步：建立 Google Sheet

1. **開新 Sheet**，命名為「選舉花禮資料庫」
2. 將第一個工作表重新命名為 `Candidates`
3. **A1:K1** 填入欄位標題（必須完全一致）：

```
ID | Name | Level | City | District | Village | Number | HQ_Address | Address_Confirmed | HQ_Date | Status
```

4. 填入一筆測試資料：

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| C001 | 陳大明 | 里長 | 雲林縣 | 北港鎮 | 光民里 | | 北港鎮文化路100號 | TRUE | 2026/08/15 | 準備中 |

### 欄位說明

| 欄位 | 說明 | 必填 |
|------|------|------|
| ID | 編號（自訂，如 C001） | ✅ |
| Name | 候選人姓名 | ✅ |
| Level | 層級：縣長/議員/鄉鎮市長/里長 | ✅ |
| City | 縣市（雲林縣/嘉義縣/嘉義市） | ✅ |
| District | 鄉鎮市區 | ✅ |
| Village | 村里或選區名稱 | 選填 |
| Number | 號次（登記後補填） | 選填 |
| HQ_Address | 競總地址 | 選填 |
| Address_Confirmed | 地址是否確認（TRUE/FALSE） | ✅ |
| HQ_Date | 競總成立日（YYYY/MM/DD） | 選填 |
| Status | 狀態：準備中/已成立/已當選 | ✅ |

> ⚠️ `Address_Confirmed` 為 FALSE 或空白時，前端會顯示「私訊代查」，不會洩漏未確認地址。

---

## 第二步：部署 GAS API

1. 在 Sheet 中點選 **擴充功能 → Apps Script**
2. 刪除預設的 `myFunction`，貼上 `gas-backend.gs` 的全部內容
3. 先執行 `testCandidates` 測試（第一次會要求授權，點允許）
4. 確認「執行記錄」出現你的測試資料
5. 點右上角 **部署 → 新增部署作業**
   - 類型：網頁應用程式
   - 描述：`Election Flower API v1`
   - 執行身分：我
   - 存取權限：**所有人**
6. 複製部署完成的 **Web App URL**

---

## 第三步：連接前端

1. 開啟 `app.js`
2. 找到 `CONFIG.GAS_URL`，替換為你的 Web App URL：

```javascript
GAS_URL: 'https://script.google.com/macros/s/你的部署ID/exec',
```

3. 找到 `CONFIG.LINE_OA_URL`，替換為慶豐的 LINE 連結：

```javascript
LINE_OA_URL: 'https://line.me/R/oaMessage/@你的LINE_ID/?',
```

---

## 第四步：本機測試

直接用瀏覽器打開 `index.html` 即可測試。

> ⚠️ GAS 的 CORS 限制：如果本機 `file://` 無法載入資料，用 VS Code 的 Live Server 或任何本地 HTTP server：
> ```
> npx -y http-server ./election -p 8080
> ```

### 測試檢查清單

- [ ] 首頁能載入候選人資料
- [ ] 三層下拉選單（縣市→鄉鎮→村里）正確聯動
- [ ] 姓名搜尋能即時篩選
- [ ] Address_Confirmed = FALSE 的候選人顯示「私訊代查」
- [ ] 「LINE 快速訂花」按鈕能正確帶出預填訊息
- [ ] 手機（iOS + Android）都能正常開啟 LINE
- [ ] 品項頁正常顯示
- [ ] 訂購須知頁正常顯示
- [ ] 手機版 hamburger 選單正常

---

## 第五步：部署到 GitHub Pages

1. 將 `election/` 資料夾內容推到你現有的 GitHub repo
2. 建議掛在子路徑：`你的網址/election/`
3. 確認 GitHub Pages 設定指向正確分支

```bash
git add election/
git commit -m "feat: 選舉花禮站 Phase 1 上線"
git push
```

---

## 日常操作（給錦媛/員工）

### 新增候選人
在 Google Sheet 的 `Candidates` 工作表新增一列，填入必填欄位即可。
網站會在下次瀏覽時自動讀取最新資料（無需重新部署）。

### 更新地址
1. 填入 `HQ_Address` 欄
2. 將 `Address_Confirmed` 改為 `TRUE`
3. 完成，網站會自動顯示地址

### 更新狀態
將 `Status` 改為 `已成立` 或 `已當選` 即可。

---

## Phase 2 待辦（8月中啟用）

- [ ] Products 工作表建立 + 品項頁改為動態讀取
- [ ] 候選人資訊卡 Canva 模板
- [ ] FB 社團貼文模板
- [ ] LINE OA 自動回覆設定

## Phase 3 待辦（9月後，看量觸發）

- [ ] 綠界金流整合
- [ ] 資訊卡自動生成
- [ ] 全雲嘉候選人資料補齊
