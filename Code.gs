/**
 * Google Apps Script backend for the Little Witch feedback form.
 *
 * Setup: open your Google Sheet -> Extensions -> Apps Script -> paste this file
 * -> Deploy -> New deployment -> Web app (Execute as: Me, Access: Anyone).
 * See README.md for the full steps.
 */

const SHEET_NAME = "Feedback"; // tab name; created automatically if missing

const HEADERS = [
  "Timestamp", "Name", "Email", "Version", "Play time",
  "Overall", "Gameplay", "Visuals", "Audio", "Difficulty",
  "Recommend", "Liked", "Bugs", "Suggestions", "User agent"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);

    // Honeypot: silently drop bot submissions
    if (data.website) return json_({ ok: true });

    const overall = num_(data.overall);
    if (!overall) return json_({ ok: false, error: "Missing rating" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    sheet.appendRow([
      new Date(),
      clean_(data.name, 60),
      clean_(data.email, 100),
      clean_(data.version, 30),
      clean_(data.playtime, 40),
      overall,
      num_(data.gameplay),
      num_(data.visuals),
      num_(data.audio),
      num_(data.difficulty),
      clean_(data.recommend, 10),
      clean_(data.liked, 1000),
      clean_(data.bugs, 1000),
      clean_(data.suggestions, 1000),
      clean_(data.userAgent, 300)
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Visiting the URL in a browser just confirms the service is running.
function doGet() {
  return json_({ ok: true, message: "Feedback endpoint is running." });
}

// ---------- helpers ----------

function num_(v) {
  const n = Number(v);
  return n >= 1 && n <= 5 ? Math.round(n) : "";
}

// Trim, cap length, and neutralise spreadsheet formula injection (=, +, -, @).
function clean_(v, max) {
  let s = String(v == null ? "" : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
