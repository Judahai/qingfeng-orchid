// ============================================================
// 慶豐蘭園 · 選舉花禮站 — GAS 後端腳本
// 
// 部署方式：
// 1. 開啟你的 Google Sheet
// 2. 擴充功能 → Apps Script
// 3. 貼上此檔案全部內容（替換掉預設的 myFunction）
// 4. 點「部署」→「新增部署作業」
//    - 類型：網頁應用程式
//    - 描述：Election Flower API v1
//    - 執行身分：我
//    - 存取權限：所有人
// 5. 複製部署後的 Web App URL
// 6. 貼到前端 app.js 的 CONFIG.GAS_URL
//
// Sheet 結構要求：
// 工作表 1 名稱：Candidates
// 欄位：ID | Name | Level | City | District | Village | Number | 
//       HQ_Address | Address_Confirmed | HQ_Date | Status
//
// 工作表 2 名稱：Products（選用,Phase 2 啟用）
// 欄位：ProductID | ProductName | Price | Size | PhotoFilename | Scene
// ============================================================


/**
 * HTTP GET 入口
 * ?action=candidates  → 回傳候選人 JSON（預設）
 * ?action=products    → 回傳商品 JSON
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'candidates';

  let result;
  switch (action) {
    case 'products':
      result = getProducts();
      break;
    case 'candidates':
    default:
      result = getCandidates();
      break;
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * 讀取 Candidates 工作表
 */
function getCandidates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Candidates');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // 跳過空行（ID 或 Name 為空）
    if (!row[0] && !row[1]) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const key = String(headers[j]).trim();
      let val = row[j];

      // 空值統一為 null
      if (val === '' || val === undefined) {
        val = null;
      }

      // 日期物件 → 字串
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'Asia/Taipei', 'yyyy/MM/dd');
      }

      obj[key] = val;
    }

    // 地址確認邏輯：未確認 → 覆蓋為「私訊代查」
    const confirmed = obj['Address_Confirmed'];
    if (confirmed !== true && confirmed !== 'TRUE' && confirmed !== 1) {
      obj['HQ_Address'] = '私訊代查';
    }

    // 移除 Address_Confirmed 欄位（前端不需要看到）
    delete obj['Address_Confirmed'];

    result.push(obj);
  }

  return result;
}


/**
 * 讀取 Products 工作表
 */
function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const key = String(headers[j]).trim();
      let val = row[j];
      if (val === '' || val === undefined) val = null;
      obj[key] = val;
    }
    result.push(obj);
  }

  return result;
}


// ============================================================
// 工具函式
// ============================================================

/**
 * 快速測試用：在 Apps Script 編輯器中執行此函式
 * 可在「執行記錄」看到 JSON 輸出
 */
function testCandidates() {
  const data = getCandidates();
  Logger.log(JSON.stringify(data, null, 2));
  Logger.log('共 ' + data.length + ' 筆候選人資料');
}

function testProducts() {
  const data = getProducts();
  Logger.log(JSON.stringify(data, null, 2));
  Logger.log('共 ' + data.length + ' 筆商品資料');
}
