const SHEET_NAME = 'Players';
const HEADERS = ['Date', 'Number', 'Country', 'Age', 'Telegram', 'Amount', 'Status'];

function doGet() {
  return json({ ok: true, service: 'Pair Pop registration' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    lock.waitLock(30000);
    locked = true;
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet();
    const number = normalizePhone(data.number);

    if (!number) return json({ ok: false, error: 'Phone number is required' });

    const row = findPhoneRow(sheet, number);

    if (data.action === 'register') {
      if (row) return json({ ok: true, exists: true });
      const newRow = sheet.getLastRow() + 1;
      sheet.getRange(newRow, 1, 1, HEADERS.length).setValues([[
        new Date(), number, clean(data.country), clean(data.age),
        clean(data.telegram), '', 'Registered'
      ]]);
      sheet.getRange(newRow, 2).setNumberFormat('@');
      return json({ ok: true, exists: false });
    }

    if (data.action === 'result') {
      if (!row) return json({ ok: false, error: 'Phone not registered' });
      const status = data.status === 'Won' ? 'Won' : 'Lost';
      // Re-save old rows in the canonical text format while updating them.
      sheet.getRange(row, 2).setNumberFormat('@').setValue(number);
      sheet.getRange(row, 6, 1, 2).setValues([[status === 'Won' ? '100$' : '', status]]);
      return json({ ok: true });
    }

    return json({ ok: false, error: 'Unknown action' });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (HEADERS.some((header, i) => current[i] !== header)) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange('B:B').setNumberFormat('@');
  sheet.setFrozenRows(1);
  return sheet;
}

function findPhoneRow(sheet, number) {
  if (sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getDisplayValues();
  const index = values.findIndex(row => normalizePhone(row[0]) === number);
  return index < 0 ? 0 : index + 2;
}

function normalizePhone(value) {
  const digits = clean(value).replace(/\D/g, '');
  return digits ? '+' + digits : '';
}

function clean(value) { return String(value == null ? '' : value).trim(); }
function json(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
