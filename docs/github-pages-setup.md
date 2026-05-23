# GitHub Pages Setup For CardWise

The static site lives in the repository `docs/` folder.

## Pages To Publish

- Home: `docs/index.html`
- Privacy Policy: `docs/privacy.html`
- Support: `docs/support.html`

## Enable GitHub Pages

1. Push the latest `main` branch to GitHub.
2. Open the repository on GitHub: `https://github.com/lin60102/cardwise`.
3. Go to **Settings**.
4. In the left sidebar, open **Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
6. Under **Branch**, select:
   - Branch: `main`
   - Folder: `/docs`
7. Click **Save**.
8. Wait for GitHub Pages to finish deploying.

## Expected URLs

After GitHub Pages is enabled, the expected URLs are:

- Home: `https://lin60102.github.io/cardwise/`
- Privacy Policy: `https://lin60102.github.io/cardwise/privacy.html`
- Support: `https://lin60102.github.io/cardwise/support.html`

Use the Privacy Policy and Support URLs in App Store Connect.

## Notes

- If the repository is renamed, update the `/cardwise/` path in the URLs.
- If a custom domain is added later, update App Store Connect to the custom domain URLs.
- Keep the markdown drafts for editing history, but App Store Connect should use the HTML page URLs.
