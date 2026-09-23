# Team 9 - CareConnect Safeview

Team 9 UI Design Implementation for a CareConnect Recipient with Photosensitive Epilepsy.

This repository contains Flutter and React Native implementations of the CareConnect Safeview care-recipient experience, plus web and desktop starters. Both mobile applications include authentication, accessibility preferences, medication logging, care and appointment workflows, messaging, emergency-demo feedback, local prototype persistence, and automated tests.

## Team Members

Tiffany Obi, Chris Colclough, Terence Boyce

Team Charter: View [here](https://umuc365-my.sharepoint.com/:w:/g/personal/tboyce11_student_umgc_edu/IQA6FjPtPCpYTZd5HCF-ij7xAbVbqCUF-9Jd5F3E0uAMafk?e=VrXKoE)

## Accessibility Focus

Team 9's assigned focus is **photosensitive epilepsy**. The starter screens therefore avoid flashing content, autoplay, and decorative motion. New features should continue to avoid rapid flashes and unnecessary animation, respect reduced-motion preferences where available, and provide equivalent non-motion feedback.

## Repository Structure

| Folder | Technology | Purpose |
| --- | --- | --- |
| `web-react-app/` | React + Vite | Browser-based CareConnect starter |
| `desktop-electron-app/` | Electron | Desktop CareConnect starter |
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
npm run dev
```

Production build check:

```bash
npm run build
```

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

- The web and desktop folders remain environment-verification starters; the Flutter and React Native applications contain the current mobile workflows.
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
