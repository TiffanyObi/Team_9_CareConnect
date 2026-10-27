# Week 11 Submission Evidence Index

Use this index to assemble the final package after the current `main` build is deployed. Every screenshot or report should identify the tested commit, URL when applicable, date, tester, browser or tool version, and result.

## Repository evidence

| Evidence | Location or action | Status |
| --- | --- | --- |
| Source repository | `https://github.com/TiffanyObi/Team_9_CareConnect` | Ready |
| Merged application baseline | `18f807a` before documentation and approved-plan additions | Verified locally and deployed |
| Final documentation branch | Based on `18f807a`; adds tests, metadata, focus fix, and evidence | Verified locally; deployment pending merge |
| Build and test instructions | Root `README.md` and `web-react-app/DEPLOYMENT.md` | Updated on documentation branch |
| Coverage HTML | Run `npm run test:coverage`; open `web-react-app/coverage/lcov-report/index.html` | Generated locally; ignored by Git |
| Playwright HTML | Run `npm run test:e2e`; open `web-react-app/playwright-report/index.html` | Generated locally; ignored by Git |
| PWA offline report | Run `npm run test:e2e:offline` | Passed locally |
| Coverage screenshot | `docs/week11/evidence/coverage-final-summary.png` | Ready |
| Cross-browser E2E screenshot | `docs/week11/evidence/e2e-final-summary.png` | Ready |
| Approved-plan 60% screenshot | `docs/week11/evidence/approved-plan-60-percent.png` | Ready; 15 of 25 exact passes |
| PWA offline screenshot | `docs/week11/evidence/pwa-offline-final-summary.png` | Ready |
| Responsive Care screenshots | `responsive-care-375px.png`, `responsive-care-768px.png`, and `responsive-care-1440px.png` | Ready and visually reviewed |
| Lighthouse screenshot | `docs/week11/evidence/lighthouse-final-summary.png` | Four scores of 100 on deployed baseline; refresh after final merge |
| Lighthouse HTML and JSON | `docs/week11/evidence/lighthouse-final.report.html` and `.json` | Baseline deployment evidence; refresh after final merge |

## Screenshots and reports to submit

- Coverage summary showing all four categories above 75%.
- Playwright summary showing the cross-browser workflow results.
- Production PWA offline summary.
- Responsive screenshots at 375, 768, and 1440 pixels.
- Real-Safari smoke evidence, labeled separately from Playwright WebKit.
- Installed PWA and deployed offline/reconnection/update evidence.
- Lighthouse screenshot showing 100 for Performance, Accessibility, Best Practices, and SEO on the final public URL.
- Optional full Lighthouse HTML/JSON reports for traceability.

## Final link and manual checks

- Confirmed `https://tiffanyobi.github.io/Team_9_CareConnect/` serves merged baseline assets `index-CnInck-t.js` and `index-CamkGXr8.css` with offline readiness and no browser warnings or errors.
- After this branch merges, confirm the deployed JavaScript hash changes to the final branch build and refresh the Lighthouse reports.
- Test the public URL while signed out and in a private window.
- Refresh a nested hash route and confirm the correct screen returns.
- Verify manifest, icons, service worker, `robots.txt`, and `sitemap.xml` return successfully.
- Confirm there are no console errors or warnings.
- Complete `web-react-app/SAFARI_SMOKE_CHECK.md`.
- Update `docs/week11/WEB_TEST_PLAN_EXECUTION.md` after each remaining manual case.
- Record the final documentation commit and deployed URL in the video and submission message.

## Video coverage

The 10-15 minute video should show a fresh checkout, dependency installation, lint, coverage, production build, browser tests, the live PWA, offline behavior, Lighthouse scores, responsive layouts, README instructions, test-plan mapping, and known limitations. Keep each team member's contribution clear and use only synthetic demonstration data.
