# Team 9 - CareConnect Safeview

Team 9 UI Design Implementation for a CareConnect Recipient with Photosensitive Epilepsy.

This repository contains Flutter, React Native, React web, and Electron implementations of the CareConnect Safeview care-recipient experience. The applications include authentication, accessibility preferences, medication logging, care and appointment workflows, messaging, emergency-demo feedback, local prototype persistence, and automated tests.

## Team Members

Tiffany Obi, Chris Colclough, Terence Boyce, Zack Bristor

Team Charter: View [here](https://umuc365-my.sharepoint.com/:w:/g/personal/tboyce11_student_umgc_edu/IQA6FjPtPCpYTZd5HCF-ij7xAbVbqCUF-9Jd5F3E0uAMafk?e=VrXKoE) (UMGC Microsoft 365 sign-in required).

## Accessibility Focus

Team 9's assigned focus is **photosensitive epilepsy**. The interfaces therefore avoid flashing content, autoplay, and decorative motion. New features should continue to avoid rapid flashes and unnecessary animation, respect reduced-motion preferences where available, and provide equivalent non-motion feedback.

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

Each platform folder has its own README with exact setup, testing, packaging, deployment, and limitation details. The final clean-checkout verification is recorded in [`docs/week12/FINAL_REPOSITORY_VERIFICATION.md`](docs/week12/FINAL_REPOSITORY_VERIFICATION.md).

## Prerequisites

- Git
- Node.js **22.13 or newer** and npm
- Flutter SDK with Android Studio/Android SDK for Android development
- Xcode on macOS for iOS Simulator development
- An Android emulator or physical Android device for Android runs
- Expo Go or an iOS/Android simulator for the React Native application

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

See the [React web README](web-react-app/README.md) for PWA, end-to-end, offline, deployment, and browser-verification commands.

Playwright end-to-end flows run in Chromium, Firefox, and WebKit:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:e2e:report
```

The account/access, appointment, medication, care/settings, responsive-layout, and production-offline checks save an HTML report to `web-react-app/playwright-report/` and machine-readable results, screenshots, videos, and failure traces to `web-react-app/test-results/`. Playwright WebKit is not real Safari. The final package includes a separate real-Safari smoke check; repeat it after browser, framework, or deployment changes. See [SAFARI_SMOKE_CHECK.md](./web-react-app/SAFARI_SMOKE_CHECK.md).

Run the production PWA offline flow separately:

```bash
npm run test:e2e:offline
```

### Web preview and production deploy

The web app deploys to GitHub Pages from `web-react-app/`, using `dist/` as build output. GitHub Actions runs lint, Jest/coverage, focused PWA tests, the production build, and all three Playwright browser projects before publishing a same-repository pull request preview or the `main` production site. Configure Pages and follow the deploy and HTTPS smoke-check steps in [the deployment guide](./web-react-app/DEPLOYMENT.md).

## Final verification summary

Fresh checkout of merged commit `b2bfa5b1d5792ea2c59e840a7815bb749fc6130a` passed the following checks on November 3, 2026:

- Flutter: analyzer clean; 54 tests; 83.97% line coverage; release APK built successfully.
- React Native: ESLint and TypeScript clean; 50 tests in nine suites; 94.77% statements, 89.21% branches, 95.27% functions, and 98.98% lines; release APK built successfully.
- Electron: ESLint clean; 31 Jest tests in six suites plus all native window, IPC, authentication, clipboard, integration, and axe workflow checks; 94.25% statements, 90.14% branches, 92.54% functions, and 95.77% lines; universal macOS DMG built successfully.
- React web: ESLint clean; 32 Jest/React Testing Library tests in 14 suites, nine focused PWA tests, 36 Playwright checks across Chromium/Firefox/WebKit, and three production-offline browser checks; 89.82% statements and lines, 80.40% branches, and 82.84% functions; production PWA build and asset verification passed.

Generated release binaries and most HTML coverage directories are intentionally ignored by Git. Submission copies belong in the Week 12 SharePoint package. The React Native HTML coverage report is also tracked at [`mobile-react-native-app/coverage/lcov-report/index.html`](mobile-react-native-app/coverage/lcov-report/index.html).

### Electron

```bash
cd desktop-electron-app
npm install
npm start
npm run lint
npm run test:all
npm run package:mac:universal
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

The design samples are kept separate from the main Flutter application so teammates can review and modify them without replacing the implemented mobile app:

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
flutter build apk --release
```

Week 6 integration and installed-app E2E testing for both mobile frameworks is
documented in [`docs/week6/INTEGRATION_E2E_TESTING.md`](docs/week6/INTEGRATION_E2E_TESTING.md).

## Mobile testing

The final mobile evidence records:

- Flutter: analyzer clean, 54 of 54 automated tests passing, 83.97% line coverage in the final clean checkout, ten passing golden comparisons, and 3 of 3 Android Maestro flows passing in the recorded mobile evidence.
- React Native: TypeScript and ESLint clean, 50 of 50 Jest tests passing in nine suites, 98.98% line coverage, and 89.21% branch coverage.

See the [Week 6 integration/E2E guide](docs/week6/INTEGRATION_E2E_TESTING.md), [approved-plan mapping](docs/week6/TEST_PLAN_MAPPING.md), and [final execution ledger](docs/week6/FINAL_TEST_PLAN_EXECUTION.md). Automated checks do not replace the required manual VoiceOver and TalkBack testing.

## Current Limitations and Known Issues

- The applications use local prototype persistence rather than a shared production medical backend. Use only synthetic demonstration data.
- Browser support tests use Playwright Chromium, Firefox, and WebKit. WebKit automation does not replace the required real-Safari smoke check.
- PWA install prompts depend on browser support and installation eligibility. The final deployment was manually checked; repeat installation, update, and offline checks after deployment or service-worker changes.
- Each application is installed and run independently; user data does not synchronize between platforms.
- Flutter and React Native appointment creation and message sending remain intentionally disabled prototypes. Their emergency actions do not call services, contact caregivers, or share location.
- Electron and React web password recovery show privacy-preserving confirmation but do not send email or change a password. Web messages are saved locally and are not delivered.
- iOS builds require macOS and Xcode.
- Android builds require a configured Android SDK and accepted SDK licenses.
- Expo and Flutter simulator startup can take longer on the first run while tools download or compile platform components.
- React Native and Flutter Android builds emit upstream SDK/deprecation warnings. Both release APK builds completed successfully in the final clean checkout; align Android Studio, command-line tools, and framework dependencies if those warnings become errors in a future toolchain.
- The Electron DMG is unsigned and intended for course evaluation. macOS may require the user to approve opening it; production distribution requires Apple signing and notarization.
- Release binaries are not committed because platform build/release folders are ignored. Use the Week 12 SharePoint package for the submitted APK and DMG files.
- No flashing or animated content is included, but future features still require accessibility review and testing.

See [Developer Setup and Troubleshooting](docs/DEVELOPER_SETUP.md) for a clean-checkout checklist and common fixes.
