# Team 9 - CareConnect Safeview

Team 9 UI Design Implementation for a CareConnect Recipient with Photosensitive Epilepsy.

This repository contains Flutter, React Native, React web, and Electron implementations of the CareConnect Safeview care-recipient experience. The applications include authentication, accessibility preferences, medication logging, care and appointment workflows, messaging, emergency-demo feedback, local prototype persistence, and automated tests.

## Team Members

Tiffany Obi, Chris Colclough, Terence Boyce, Zack Bristor

Team Charter: View [here](https://umuc365-my.sharepoint.com/:w:/g/personal/tboyce11_student_umgc_edu/IQA6FjPtPCpYTZd5HCF-ij7xAbVbqCUF-9Jd5F3E0uAMafk?e=VrXKoE)

## Accessibility Focus

Team 9's assigned focus is **photosensitive epilepsy**. The starter screens therefore avoid flashing content, autoplay, and decorative motion. New features should continue to avoid rapid flashes and unnecessary animation, respect reduced-motion preferences where available, and provide equivalent non-motion feedback.

## Repository Structure

| Folder | Technology | Purpose |
| --- | --- | --- |
| `web-react-app/` | React + Vite | Responsive, installable CareConnect PWA |
| `desktop-electron-app/` | Electron + React | Desktop CareConnect application |
| `mobile-react-native-app/` | React Native + Expo | Functional cross-platform mobile application |
| `mobile-flutter-app/` | Flutter | Functional Flutter application for Android and iOS |
| `design-samples/careconnect-calm-flutter/` | Flutter | Five runnable CareConnect interface samples focused on photosensitive-epilepsy safety |
| `docs/` | Markdown | Developer setup and troubleshooting documentation |

These are project folders inside one repository, not separate Git submodules or sub-repositories.

## Prerequisites

- Git
- Node.js **22.13 or newer** and npm
- Flutter SDK with Android Studio/Android SDK for Android development
- Xcode on macOS for iOS Simulator development
- An Android emulator or physical Android device for Android runs
- Expo Go or an iOS/Android simulator for the React Native starter

The validation environment used Node.js 22.14.0 and npm 10.9.2. Run `flutter doctor` to identify any missing Flutter platform requirements on your computer.

## Clone the Repository

```bash
git clone https://github.com/TiffanyObi/Team_9_CareConnect.git
cd Team_9_CareConnect
```

To update an existing checkout:

```bash
git checkout main
git pull origin main
```

## Install and Run

Each application manages its own dependencies. Run commands from the application's folder.

### React + Vite

```bash
cd web-react-app
npm install
npm start
```

The public HTTPS deployment is available at [https://tiffanyobi.github.io/Team_9_CareConnect/](https://tiffanyobi.github.io/Team_9_CareConnect/). The web app uses hash-based routes so protected and nested pages can refresh correctly on GitHub Pages.

Run ESLint and tests with coverage reporting:

```bash
npm run lint
npm test -- --coverage
```

The coverage command writes `web-react-app/coverage/lcov-report/index.html` and enforces a 75% minimum for statements, branches, functions, and lines. It includes all application source; it excludes `src/main.jsx` because it only mounts the app, `src/test/` because those are test harness helpers, and `*.test.js`/`*.test.jsx` because test code is not production code.

Production build check:

```bash
npm run build
```

Playwright end-to-end flows run in Chromium, Firefox, and WebKit:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:e2e:report
```

The account/access, appointment, medication, care/settings, responsive-layout, and production-offline checks save an HTML report to `web-react-app/playwright-report/` and machine-readable results, screenshots, videos, and failure traces to `web-react-app/test-results/`. Playwright WebKit is not real Safari. A separate real-Safari smoke check must be run on macOS; see [SAFARI_SMOKE_CHECK.md](./web-react-app/SAFARI_SMOKE_CHECK.md).

Run the production PWA offline flow separately:

```bash
npm run test:e2e:offline
```

### Web preview and production deploy

The web app deploys to GitHub Pages from `web-react-app/`, using `dist/` as build output. GitHub Actions runs lint, Jest/coverage, focused PWA tests, the production build, and all three Playwright browser projects before publishing a same-repository pull request preview or the `main` production site. Configure Pages and follow the deploy and HTTPS smoke-check steps in [the deployment guide](./web-react-app/DEPLOYMENT.md).

## Week 11 web verification

The final documentation branch, based on merged application commit `18f807a`, passed the following local checks on October 27, 2026:

- ESLint with no errors.
- 14 Jest/React Testing Library suites and 32 tests.
- 90.04% statement and line coverage, 80.40% branch coverage, and 82.84% function coverage.
- Nine focused PWA and service-worker tests.
- 36 Playwright workflow, approved-plan, and responsive-layout checks across Chromium, Firefox, and WebKit.
- Three production PWA offline checks across Chromium, Firefox, and WebKit.
- Production Vite build with route-level lazy chunks.

See the [Week 11 final verification record](docs/week11/FINAL_VERIFICATION.md), [test-plan execution map](docs/week11/WEB_TEST_PLAN_EXECUTION.md), and [submission evidence index](docs/week11/EVIDENCE_INDEX.md). Live deployment, real Safari, install-prompt, and final Lighthouse evidence remain separate manual checks and must be recorded against the final deployed build.

### Electron

```bash
cd desktop-electron-app
npm install
npm start
```

### React Native + Expo

```bash
cd mobile-react-native-app
npm install
npm start
```

From the Expo terminal, press `i` for the iOS Simulator or `a` for an Android emulator. You can also run `npm run ios` or `npm run android` directly.

### Flutter

Note: iOS simulator and/or Android emulator should be running prior to running 'flutter run'

```bash
cd mobile-flutter-app
flutter pub get
flutter run
```

### CareConnect Calm design samples

The design samples are kept separate from the shared Flutter starter so teammates can review and modify them without replacing the existing application:

```bash
cd design-samples/careconnect-calm-flutter
flutter pub get
flutter analyze
flutter test
flutter run -d chrome
```

Run the automated Flutter checks with:

```bash
flutter analyze
flutter test
```

Week 6 integration and installed-app E2E testing for both mobile frameworks is
documented in [`docs/week6/INTEGRATION_E2E_TESTING.md`](docs/week6/INTEGRATION_E2E_TESTING.md).

## Week 6 mobile testing

The current main-derived verification branch records:

- Flutter: analyzer clean, 54 of 54 automated tests passing, 84.68% line coverage, ten passing golden comparisons, and 3 of 3 Android Maestro flows passing.
- React Native: TypeScript and ESLint clean, 48 of 48 Jest tests passing in nine suites, 99.47% line coverage, and 89.11% branch coverage.

See the [Week 6 integration/E2E guide](docs/week6/INTEGRATION_E2E_TESTING.md), [approved-plan mapping](docs/week6/TEST_PLAN_MAPPING.md), and [final execution ledger](docs/week6/FINAL_TEST_PLAN_EXECUTION.md). Automated checks do not replace the required manual VoiceOver and TalkBack testing.

## Current Limitations and Known Issues

- The applications use local prototype persistence rather than a shared production medical backend. Use only synthetic demonstration data.
- Browser support tests use Playwright Chromium, Firefox, and WebKit. WebKit automation does not replace the required real-Safari smoke check.
- PWA install prompts depend on browser support and installation eligibility. Final install, update, and deployed-offline behavior require manual confirmation on the published HTTPS site.
- Each application is installed and run independently. The mobile apps use local prototype persistence rather than a shared production backend.
- iOS builds require macOS and Xcode.
- Android builds require a configured Android SDK and accepted SDK licenses.
- Expo and Flutter simulator startup can take longer on the first run while tools download or compile platform components.
- React Native native builds remain environment-dependent. A September 21 Android build attempt on this host stopped during Gradle CMake configuration for Expo Modules Core and React Native Screens; this does not invalidate the passing Jest, TypeScript, or ESLint checks.
- The Flutter Android debug build succeeds but may warn that the installed Android Studio and command-line tools understand different SDK XML versions. Align those tools if the warning becomes a build error.
- No flashing or animated content is included, but future features still require accessibility review and testing.

See [Developer Setup and Troubleshooting](docs/DEVELOPER_SETUP.md) for a clean-checkout checklist and common fixes.

## Week 4 Flutter workflow

Week 4 development continues in the existing `mobile-flutter-app/`; do not create or add another Flutter application. The reviewable requirements, implementation phases, risk controls, push boundary, and verification checklist are under [`docs/week4/`](docs/week4/README.md).

From `mobile-flutter-app/`, run the repeatable local gate with:

```bash
./tool/verify_week4.sh
```

The current Week 4 implementation has ten core evidence screens plus sign-in and account-setup flows. Provider supplies shared accessibility state, and GoRouter owns app-level routes and Back behavior. On September 8, 2026, the local gate passed with no analyzer issues, 41 passing tests, and 718/780 lines covered (92.05%). Ten reviewed screenshots are indexed in [`docs/week4/SCREENSHOT_INDEX.md`](docs/week4/SCREENSHOT_INDEX.md). The repeatable security audit also passed. TalkBack/VoiceOver, external-keyboard, physical-device, remote PR, and course-submission states remain separate review items.
