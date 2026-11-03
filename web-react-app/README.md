# CareConnect Safeview React web PWA

This React and Vite application provides the responsive CareConnect Safeview care-recipient experience at mobile, tablet, and desktop breakpoints. It includes local authentication and onboarding, accessibility preferences, dashboard summaries, appointments, medications and dose history, care and health logs, messages, search, emergency-demo feedback, route guards, lazy route loading, local user-scoped persistence, and an installable service worker.

The public HTTPS deployment is [https://tiffanyobi.github.io/Team_9_CareConnect/](https://tiffanyobi.github.io/Team_9_CareConnect/). The application uses hash routing so protected and nested routes survive GitHub Pages refreshes.

## Install, run, and build

Use Node.js 22.13 or newer. From this folder:

```sh
npm ci
npm start
npm run lint
npm test -- --coverage
npm run test:pwa
npm run build
npm run verify:build
```

`npm run build` writes the production PWA to `dist/`. `npm run verify:build` checks relative asset paths, the manifest, service worker, and application icons.

## Browser and offline tests

Install the Playwright browsers once, then run the normal and production-offline suites:

```sh
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:e2e:offline
npm run test:e2e:report
```

Playwright WebKit is not real Safari. Complete the separate [real Safari smoke check](SAFARI_SMOKE_CHECK.md) on macOS. Manual PWA installation, update, reconnection, WAVE, axe DevTools, Lighthouse, keyboard, and VoiceOver evidence is retained with the final submission.

## Deployment

GitHub Actions publishes `dist/` to the `gh-pages` branch. Repository Pages settings must use **Deploy from a branch**, `gh-pages`, and `/ (root)`, with HTTPS enabled. For full setup, CI, preview, rollback, manual publication, and refresh checks, see [DEPLOYMENT.md](DEPLOYMENT.md).

Manual production deployment, when authorized, is:

```sh
npm ci
npm run lint
npm test -- --coverage
npm run test:pwa
npm run build
npm run verify:build
npm run test:e2e
npm run test:e2e:offline
npm run deploy:production
```

## Final verification

On November 3, 2026, a fresh checkout of merged commit `b2bfa5b` passed ESLint, 32 Jest/React Testing Library tests in 14 suites, nine focused PWA/service-worker tests, 36 Playwright workflow and responsive checks across Chromium/Firefox/WebKit, three production-offline browser checks, the production Vite build, and build-asset verification. Coverage reached 89.82% statements and lines, 80.40% branches, and 82.84% functions. Earlier final evidence records the real Safari smoke check, PWA installation, and Lighthouse results.

Coverage is generated at `coverage/lcov-report/index.html`. Generated coverage, Playwright reports, and build output are submission evidence and may be ignored by Git; the final copies are retained in the Week 12 SharePoint package.

## Limitations

- This is a local-data educational prototype. Do not enter real patient information or reused credentials.
- It has no shared clinical backend, real messaging service, appointment booking integration, or emergency calling.
- Password recovery does not send email or change stored credentials, and account email addresses cannot be edited.
- Messages and replies are saved only in the current browser profile and are not delivered to care providers.
- Offline support covers the application shell and supported local demo data after an online load; it does not provide server synchronization.
- Browser install prompts depend on browser eligibility and may not appear when the PWA is already installed.
- Automated WebKit results do not replace real Safari, keyboard-only, or screen-reader checks.
