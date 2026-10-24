# Terence Assignment 11 handoff

October 23, 2026 EDT. Branch: feature/terence-week11-pwa. Base: 904f0a905db1f2c5c952df37f5bd0103f2cdc33f.

## Scope

This branch contains Terence's revised assignments: PWA setup, offline support, lazy routes, route recovery, appointment date and save fixes, focused tests, and bundle tooling. The earlier Team_9_Assignment11_Terence checkout remains intact. Care pages from that older draft are not in this branch; Tiffany now owns them. Zach retains messages, placeholders, Jest, lint, main browser setup, and hosting.

## Run checks

From web-react-app, use Node 22.13 or newer:

```sh
npm ci
node --test tests/terence-core.node.mjs
npm test -- --coverage
npm run build
node scripts/analyze-bundle.mjs
npm run preview -- --host 127.0.0.1 --port 4173
```

After Zach adds Playwright and its browsers, run this from another terminal:

```sh
BASE_URL=http://127.0.0.1:4173 EVIDENCE_DIR=/private/tmp/terence-offline-evidence node e2e/run-offline.mjs
```

Use the deployed HTTPS URL for final evidence. The standalone offline flow uses appointments so it does not depend on Tiffany's care pages. The runner labels Chromium, Firefox, and WebKit separately and saves traces. It does not claim real Safari testing.

## PWA and routes

The production build writes a content-versioned service worker after all route chunks and public icons exist. It precaches static files, including routes not yet opened. It does not cache private API responses. Demo records stay in localStorage. Use synthetic data only.

The app shows connection, readiness, install help, and an explicit update button. Install appears only when the browser offers it. Logout blocks private routes but keeps saved records on the device. Save forms and close other app tabs before applying an update.

Use HTTPS or localhost, a root-path deployment, and a host fallback to index.html for nested routes. Dev mode does not register the worker. A subpath deployment needs router basename and manifest changes first. Review static-cache headers with Zach; sw.js and index.html should revalidate while hashed chunks may use immutable caching.

## Manual install and two-build update check

1. Build version A and serve it on one fixed origin. Use a clean browser profile. Open the app and wait for offline readiness. Check the manifest and icon requests, then install with the real browser menu or install prompt. Save a screenshot of the installed app.
2. Log in and save a synthetic visit. Go offline and open an unvisited nested route. Reload; confirm local records remain. Log out; confirm private routes redirect. Reconnect.
3. Keep version A open. Change a visible label on a temporary test branch, build version B, and serve it at the same origin. Focus the old tab to check for an update. The old app should keep working until the user chooses Reload to update.
4. Save open forms and close other app tabs. Choose Reload to update. Confirm version B appears, local records remain, and old app caches are removed without touching unrelated caches. Save before and after screenshots and both build hashes. Do not leave the test label in the PR.

These steps are pending; controlled Node worker tests do not prove a real install or two-build browser update.

## Performance checks

Build main at the recorded base in a separate clean checkout. Run scripts/analyze-bundle.mjs on both base and final dist folders and save both JSON reports. Compare initial gzip bytes and route chunks. Do not claim a bundle reduction without both builds.

After Zach provides the final HTTPS URL, run Lighthouse with a clean Chrome profile. Save HTML and JSON reports plus score screenshots for Performance, Accessibility, Best Practices, and SEO. Record date, URL, device mode, final commit, and Chrome version. Required target: 90 or more in each category. No new score or bundle measurement is claimed yet.

## Current limits

The dependency download fails with registry.npmjs.org ENOTFOUND even outside the sandbox. There is no complete locked install, so full build, RTL, coverage, browser, fresh-checkout, install, update, and performance checks remain pending. No live URL was found in repository metadata. The existing app has unfinished features owned by the other team members.

See TERENCE_REVIEW.md for source findings. See TERENCE_VIDEO_SCRIPT.md for Terence's planned video segment. Team approval and course submission remain open. Submit only after all three approve; keep the course receipt.
