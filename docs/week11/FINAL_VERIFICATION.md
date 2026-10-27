# Week 11 Final Web Verification

This record separates checks completed on the final documentation branch from checks that still require its public deployment or a real browser. The branch is based on `18f807a`, the merge of the repair and Care/E2E pull requests into `main`, and adds approved-plan tests, metadata, documentation, evidence, and a responsive focus fix. Commands were run from `web-react-app/` on October 27, 2026.

## Automated results

| Check | Result |
| --- | --- |
| ESLint | Passed with no errors |
| Jest and React Testing Library | 14 suites and 32 tests passed |
| Statements | 90.04% |
| Branches | 80.40% |
| Functions | 82.84% |
| Lines | 90.04% |
| Focused PWA tests | 9 of 9 passed |
| Playwright workflow, approved-plan, and responsive checks | 36 of 36 passed |
| Production PWA offline checks | 3 of 3 passed |
| Production Vite build | Passed; 72 modules transformed |
| Total initial JavaScript | 97,295 bytes gzip (about 95.0 KiB) |
| Main stylesheet | 5.67 KiB gzip |
| Live Lighthouse Performance | 100 |
| Live Lighthouse Accessibility | 100 |
| Live Lighthouse Best Practices | 100 |
| Live Lighthouse SEO | 100 |

The Playwright run covered account/access, appointments, medications, care/settings, approved-plan appointment/search/help/error paths, and responsive Care layouts at 375, 768, and 1440 pixels. Each test ran in Chromium, Firefox, and WebKit. The separate production PWA suite verified an installable shell, an offline nested route, a supported local save, reconnection, and update readiness in the same three engines.

## Deployment status

The production URL is `https://tiffanyobi.github.io/Team_9_CareConnect/`. GitHub Pages currently serves merged baseline assets `index-CnInck-t.js` and `index-CamkGXr8.css`. The page reports “Ready for offline use on this device,” and a browser log review found no warnings or errors. Lighthouse 12.8.2 audited that deployed baseline on October 27, 2026 and scored 100 in all four required categories. The measured FCP was 1.4 seconds, LCP was 1.5 seconds, CLS was 0, and total blocking time was 40 milliseconds. The documentation branch's local build emits `index-DH8gzStZ.js` and `index-CamkGXr8.css`; rerun the live audit after this branch merges and those assets deploy.

## Manual checks still required

- Run the real-Safari smoke checklist and record macOS version, Safari version, tester, date, and screenshots.
- After this branch merges, confirm GitHub Pages serves `index-DH8gzStZ.js` or the equivalent CI-generated final hash, then rerun Lighthouse against that deployment.
- Install the PWA from the final HTTPS site in a supported browser.
- Confirm offline reopening, supported local read/save behavior, reconnection, and explicit update handling on the deployed site.
- Save responsive screenshots at 375, 768, and 1440 pixels from the final deployment.
- Confirm there are no console errors or warnings during the final smoke run.

Automated WebKit is reported separately from real Safari. The current live Lighthouse HTML, JSON, and summary screenshot are stored under `docs/week11/evidence/` and identify the deployed baseline URL and timestamp.
