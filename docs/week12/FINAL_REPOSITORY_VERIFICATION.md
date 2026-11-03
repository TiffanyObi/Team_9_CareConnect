# Final Repository Verification

Date: November 3, 2026  
Verified merged commit: `b2bfa5b1d5792ea2c59e840a7815bb749fc6130a`  
Verification method: fresh isolated clone of `main`, locked dependency installation, automated checks, and production packaging on macOS.

## Results

| Platform | Lint/static checks | Tests | Coverage | Production build |
| --- | --- | --- | --- | --- |
| Flutter | `flutter analyze` passed | 54/54 passed | 948/1,129 lines, 83.97% | Release APK passed, 53.4 MB |
| React Native | ESLint and TypeScript passed | 50/50 passed in 9 suites; 1 snapshot passed | 94.77% statements, 89.21% branches, 95.27% functions, 98.98% lines | Expo prebuild and Gradle release APK passed |
| Electron | ESLint passed | 31/31 Jest tests in 6 suites; 5/5 window-state tests; all smoke, auth, clipboard, integration, and accessibility workflows passed | 94.25% statements, 90.14% branches, 92.54% functions, 95.77% lines | Renderer build and universal macOS DMG passed |
| React web | ESLint passed | 32/32 Jest/RTL tests in 14 suites; 9/9 PWA tests; 36/36 cross-browser E2E checks; 3/3 production-offline checks | 89.82% statements and lines, 80.40% branches, 82.84% functions | Vite production build and asset/PWA verification passed |

Electron's real-renderer accessibility workflow reported zero axe violations for 11 authentication, workspace, settings, help, and validation states.

## Commands

### Flutter

```sh
flutter pub get
flutter analyze
flutter test --coverage
flutter build apk --release
```

### React Native

```sh
npm ci
npm run lint
npm run typecheck
npm run test:coverage -- --runInBand
npx expo prebuild --platform android --no-install
JAVA_HOME=$(/usr/libexec/java_home -v 17) NODE_ENV=production ./android/gradlew -p android :app:assembleRelease
```

### Electron

```sh
npm ci
npm run lint
npm run test:all
npm run package:mac:universal
```

### React web

```sh
npm ci
npm run lint
npm test -- --coverage
npm run test:pwa
npm run build
npm run verify:build
npm run test:e2e
npm run test:e2e:offline
```

## Artifact and coverage policy

The platform build and release directories are ignored by Git. The final APK and DMG files are retained in the Week 12 SharePoint submission package, not committed to GitHub. At the verified commit, Git tracks the React Native HTML coverage entry point; the final Flutter, Electron, and React web HTML coverage packages are retained in SharePoint.

Expected generated locations are:

- Flutter APK: `mobile-flutter-app/build/app/outputs/flutter-apk/app-release.apk`
- React Native APK: `mobile-react-native-app/android/app/build/outputs/apk/release/app-release.apk`
- Electron DMG: `desktop-electron-app/release/CareConnect-Safeview-1.0.0-universal.dmg`
- Flutter coverage: `mobile-flutter-app/coverage/html/index.html`
- React Native coverage: `mobile-react-native-app/coverage/lcov-report/index.html`
- Electron coverage: `desktop-electron-app/coverage/lcov-report/index.html`
- React web coverage: `web-react-app/coverage/lcov-report/index.html`

## Warnings and limitations

- Flutter and React Native release builds completed with upstream SDK/deprecation warnings. These were non-fatal.
- The Electron DMG is unsigned and not notarized; it is intended for course evaluation.
- Electron dependency installation reports moderate transitive advisories. High-severity findings were removed without forcing breaking framework upgrades.
- All applications use local prototype data and are not approved to store real patient information.
- Manual screen-reader, keyboard, browser, PWA-installation, and deployment evidence remains in the final submission package; automated results do not replace those human checks.

## Link and repository-storage audit

Checked without browser session cookies on November 3, 2026:

| Resource | Result |
| --- | --- |
| Public GitHub repository | HTTP 200 |
| Deployed GitHub Pages application | HTTP 200 over HTTPS |
| Deployed PWA manifest | HTTP 200 over HTTPS |
| Week 12 SharePoint folder | Redirected to UMGC authentication, then HTTP 401 without a Microsoft 365 session |
| Final submission materials SharePoint folder | Redirected to UMGC authentication, then HTTP 401 without a Microsoft 365 session |
| Team charter SharePoint link | HTTP 401 without a Microsoft 365 session |

The SharePoint folders opened successfully in the team's signed-in UMGC session, but they are not anonymous public links. The instructor must use an authorized UMGC Microsoft 365 account, or the owner must grant that account access before submission.

The public GitHub repository has no GitHub Releases and no APK, AAB, IPA, DMG, EXE, MSIX, or AppImage tracked on `main`. This is intentional for the current repository policy: generated build/release directories are ignored, and submission binaries are stored in SharePoint. GitHub tracks the React Native HTML coverage entry point; the other final HTML coverage packages are retained in SharePoint.
