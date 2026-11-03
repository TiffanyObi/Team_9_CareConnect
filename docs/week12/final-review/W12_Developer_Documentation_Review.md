CareConnect Safeview Developer Documentation

Architecture setup testing deployment and maintenance

Team 9  |  Final edition  |  November 3, 2026

This document explains how to build, test, and maintain the four CareConnect Safeview implementations from a clean checkout. The repository is a multi-application workspace: each platform has its own dependency manager, entry point, test suite, and production artifact. All implementations model the same care-recipient workflows while using local prototype persistence rather than a production medical API.

Repository and prerequisites

Repository: https://github.com/TiffanyObi/Team_9_CareConnect

Git and a current Node.js/npm toolchain; the validated JavaScript environment used Node.js 22.14.0 and npm 10.9.2.

Flutter SDK plus Android Studio/Android SDK; Xcode on macOS for iOS development.

Android emulator or device, iOS Simulator where applicable, and modern Chrome, Firefox, Safari, or Edge browsers.

macOS for the submitted Electron DMG packaging workflow.

High-level architecture

Data flow: user interaction -> platform presentation component -> route/state controller -> local repository or storage service -> updated accessible UI. Electron-only privileged operations cross the context-isolated preload/IPC boundary; the web service worker handles application-shell caching and supported offline behavior. No production health-data API is connected.

Code structure

Clean checkout and run commands

Clone the repository, then run commands from the relevant application folder. Do not install one application’s dependencies into another application folder.

Testing strategy

Unit and state tests verify models, repositories, utilities, validation, and user-specific data behavior.

Widget/component tests verify accessible labels, form interaction, navigation, dialogs, feedback, and settings.

Integration and E2E suites verify authentication, appointments, medication logging, care/settings, emergency-demo, persistence, responsive layouts, and PWA offline flows.

Manual checks verify VoiceOver/TalkBack, keyboard-only navigation, focus visibility, dynamic text, native controls, orientation/responsive behavior, contrast, and reduced motion.

Final HTML coverage reports are stored under each application coverage directory; all four exceed 60%.

Build and deployment

Security and privacy

Use synthetic demonstration data only; no production medical backend or regulated data service is present.

Electron keeps main and renderer responsibilities separate, uses a preload/IPC boundary, context isolation, and restricted privileged operations.

Do not place credentials, signing keys, or real patient information in source, test fixtures, screenshots, or build artifacts.

Review dependency audits and security analyzer output before release; resolve high-impact warnings or document their applicability.

Service-worker caches must not be treated as encrypted medical storage. Clear local data when transferring a shared test device.

Accessibility maintenance checklist

Preserve meaningful names, roles, values, and status announcements for every interactive control.

Retest keyboard order, focus return, screen-reader output, contrast, 200% text, touch/click targets, reduced motion, and non-flashing behavior after UI changes.

Run WAVE, axe, and Lighthouse for web changes; run platform test suites and manual assistive-technology checks for native changes.

Update the applicable VPAT only from verified evidence and retain known limitations.

Known limitations

Local persistence is not a synchronized clinical backend.

Some stored medication and health-log records do not provide universal edit/reversal.

The submitted Electron DMG is unsigned and not notarized.

Playwright WebKit is not identical to real Safari; retain separate Safari smoke evidence.

iOS production distribution requires Apple signing and provisioning not included in the Android-focused mobile artifacts.

Architecture Diagram and Release Commands

Source reviewed at main commit 518683b. Arrows show the local flow within each app; no arrow indicates shared patient records or a remote clinical API.

Start in a clean clone of https://github.com/TiffanyObi/Team_9_CareConnect. Each command block starts at the repository root. Use Node 22.13 or newer, npm, Flutter, Android SDK, and JDK 17 as required. macOS packaging needs macOS. genhtml requires LCOV. Commands below were checked against current scripts; this review reruns coverage, not all installer builds.

React Native Android release

cd mobile-react-native-app
npm ci
npm run lint
npm run typecheck
npm run test:coverage -- --runInBand
npx expo prebuild --platform android --no-install
JAVA_HOME=$(/usr/libexec/java_home -v 17) NODE_ENV=production ./android/gradlew -p android :app:assembleRelease

Electron macOS release

cd desktop-electron-app
npm ci
npm run lint
npm run test:all
npm run package:mac:universal

Flutter Android release and HTML

cd mobile-flutter-app
flutter pub get
flutter analyze
flutter test --coverage
genhtml coverage/lcov.info --output-directory coverage/html --legend
flutter build apk --release

React web build and checks

cd web-react-app
npm ci
npm run lint
npm test -- --coverage
npm run test:pwa
npm run build
npm run verify:build
npx playwright install chromium firefox webkit
npm run test:e2e
npm run test:e2e:offline

Deployment and Installation

Flutter and React Native produce app-release.apk at the output paths in their READMEs. Install on an Android device with adb install -r followed by the quoted APK path, then check sign-in, navigation, and persistence. React Native package ID is edu.umgc.team9.careconnect. iOS device distribution needs a signing team and was not included. Electron writes release/CareConnect-Safeview-1.0.0-universal.dmg. Open the DMG and drag the app to Applications; the course build is unsigned. Do not bypass an unexpected browser or operating-system security warning.

Web CI builds and tests the app. The trusted web-pages-publish.yml workflow publishes a successful main build to gh-pages. Pages uses that branch at its root. After an approved deployment, check HTTPS, route refresh, assets, installability, and offline recovery. The review does not trigger a production deployment. See web-react-app/DEPLOYMENT.md for rollback and preview commands.

Local Interfaces and Known Limits

There is no remote clinical API to document. Flutter and React Native repositories isolate account and log storage. Electron exposes desktop actions through src/preload/preload.js and names IPC channels in src/shared/ipc-channels.cjs, including copy-appointment-details. Web contexts use local repository helpers and browser cache. Do not treat prototype authentication or local stores as production healthcare security.

Flutter Save appointment and Send message are disabled draft actions; calendar access is unavailable. Electron does not include mobile/web medication, health-log, or messaging workflows. Other apps use local demo records without real clinic booking, message delivery, or emergency calls. Shared UI language is not full feature parity. Final manual checks and team sign-off remain separate from the coverage rerun.