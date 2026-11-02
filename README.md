# Little Witch – Game Feedback Site

A tiny static website where players submit feedback. Each response is saved as a new row in your Google Sheet.

```
index.html   – the feedback form
style.css    – styling
script.js    – validation + sending data (put your Web App URL here)
Code.gs      – Google Apps Script backend (paste into your Sheet)
```

No server needed: the website is static, and Google Apps Script receives the data and writes it into the Sheet.

## 1. Set up the Google Sheet backend

1. Create a new Google Sheet (e.g. "Little Witch Feedback").
2. Go to **Extensions → Apps Script**.
3. Delete the default code and paste the contents of `Code.gs`. Save.
4. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions, and copy the **Web app URL** (ends with `/exec`).

A `Feedback` tab with headers is created automatically on the first submission.

> If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**, otherwise the live URL keeps running the old code.

## 2. Connect the website

Open `script.js` and replace:

```js
const SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
```

with your Web app URL.

## 3. Test locally

Open `index.html` in a browser (or run `python -m http.server` in this folder), submit the form, and check that a row appears in the Sheet.

## 4. Publish (free) with GitHub Pages

1. Create a GitHub repository and upload these files (or `git push`).
2. Repo **Settings → Pages**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. Your site will be at `https://<your-username>.github.io/<repo-name>/`.

Share that link in your game (e.g. a "Give feedback" button on the home screen) or with testers.

## Notes

- **Spam protection:** hidden honeypot field, 30-second client cooldown, and server-side length limits. Anyone with the URL can still send requests, so for a public release consider adding a CAPTCHA.
- **Formula injection:** the backend prefixes text starting with `=`, `+`, `-`, `@` so players can't plant formulas in your Sheet.
- **Privacy:** name and email are optional. If you collect email, mention how you use it on the page.
- **Reading the response:** the browser uses `no-cors` mode (required for Apps Script), so the page can't see the server reply. It reports success if the request was sent; check the Sheet if rows seem to be missing.
- **Customising questions:** add a field in `index.html`, include it in `payload` in `script.js`, and add a column in `HEADERS` and `appendRow` in `Code.gs`.
