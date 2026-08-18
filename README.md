# Team_9_CareConnect Safeview

Team 9 UI Design Implementation for a CareConnect Recipient with Photosensitive Epilepsy.

This repository provides one shared starting point for the CareConnect recipient experience across web, desktop, and mobile platforms. The current applications are intentionally small "Hello, SWEN 661!" starters. Their purpose is to prove that another developer can clone the repository, install its dependencies, and launch each required technology before feature development begins.

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
| `mobile-react-native-app/` | React Native + Expo | Cross-platform mobile starter |
| `mobile-flutter-app/` | Flutter | Flutter mobile starter for Android and iOS |
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

```bash
cd mobile-flutter-app
flutter pub get
flutter run
```

Run the automated Flutter checks with:

```bash
flutter analyze
flutter test
```

## Current Limitations and Known Issues

- These are environment-verification starters, not completed CareConnect product features.
- Each application is installed and run independently; there is no shared API or backend yet.
- iOS builds require macOS and Xcode.
- Android builds require a configured Android SDK and accepted SDK licenses.
- Expo and Flutter simulator startup can take longer on the first run while tools download or compile platform components.
- As of August 17, 2026, `npm audit` reports 18 transitive advisories in Expo/Metro tooling (`image-size` and `uuid`). The non-breaking fix cannot resolve them, and the forced fix proposes a breaking Expo SDK downgrade, so it was not applied. Expo Doctor still passes all 21 checks and the iOS JavaScript bundle completes successfully. Recheck the advisories before production use.
- The Flutter Android debug build succeeds but may warn that the installed Android Studio and command-line tools understand different SDK XML versions. Align those tools if the warning becomes a build error.
- No flashing or animated content is included, but future features still require accessibility review and testing.

See [Developer Setup and Troubleshooting](docs/DEVELOPER_SETUP.md) for a clean-checkout checklist and common fixes.
