# Matching Puzzle

A responsive English/Arabic React + Vite pair-matching game. Registration is saved to Google Sheets before play; the same phone row is updated after a win or loss.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put the deployed Apps Script URL in `.env` as `VITE_GOOGLE_SCRIPT_URL=...`.
5. Run `npm run dev`.

The claim link is the `CONTACT_URL` constant in `src/config.js`.

## Google Sheets / Apps Script

1. Create a Google Sheet.
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with `GOOGLE_APPS_SCRIPT.js` and save.
4. Select **Deploy → New deployment → Web app**.
5. Set **Execute as** to yourself and **Who has access** to anyone.
6. Deploy, authorize it, and copy the `/exec` web-app URL.
7. Put that URL in local `.env` and in Netlify's `VITE_GOOGLE_SCRIPT_URL` variable.

Redeploy the web app after future Apps Script edits. The script creates the `Players` sheet and headers automatically, locks writes, rejects duplicate registrations, and updates the existing row for results.

## GitHub with VS Code

1. Open GitHub and create a new empty repository.
2. Copy its HTTPS URL.
3. Open this project folder in VS Code.
4. Open **Source Control** in the left sidebar.
5. Choose **Initialize Repository** if VS Code shows that option.
6. Open **Source Control → … → Remote → Add Remote**, paste the HTTPS URL, and name it `origin`.
7. Stage the files with the **+** button.
8. Enter a commit message such as `Initial Matching Puzzle game` and click **Commit**.
9. Click **Publish Branch**, **Sync Changes**, or **Push** and sign in to GitHub if asked.
10. Confirm VS Code shows the branch (normally `main`) and GitHub displays the files.

Optional terminal commands:

```bash
git init
git add .
git commit -m "Initial Matching Puzzle game"
git branch -M main
git remote add origin YOUR_GITHUB_HTTPS_URL
git push -u origin main
```

## Netlify deployment

1. Open Netlify and select **Add new site → Import an existing project**.
2. Choose GitHub and authorize access if requested.
3. Select the repository.
4. Set build command to `npm run build`.
5. Set publish directory to `dist`.
6. Open **Environment variables**, add `VITE_GOOGLE_SCRIPT_URL`, and paste the Apps Script `/exec` URL.
7. Deploy the site. Redeploy after changing an environment variable.

Never commit `.env`; it is already ignored by Git.
