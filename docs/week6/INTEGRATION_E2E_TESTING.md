# Week 6 integration and E2E checks

Updated September 20, 2026 (Eastern Time).

Start from this branch in a separate clone. Use fake accounts on a simulator or test device. These flows add local demo logs. They do not send messages or place emergency calls.

## Flutter

```sh
cd mobile-flutter-app
flutter pub get
flutter analyze
flutter test --coverage
flutter devices
flutter test integration_test/week6_test.dart -d <device-id> --reporter expanded
```

The four integration cases check native SQLite account scope and reopen, version 2 database migration, sign-in through medication logging, and 200% dark-theme settings with message cancel. The database cases use new `week6_*.db` files. They leave the normal app database alone. The UI cases use a test auth store; they do not test production password hashing. Unit and widget coverage is in `coverage/lcov.info`; device integration coverage is not merged into it.

The default app entry point requires sign-in. The seeded local account is `omartinez@careconnect.com` with password `password`. Do not use that password for a real account.

```sh
flutter build apk --debug --target-platform android-arm64
flutter build ios --simulator --debug
```

A simulator `.app` is not an IPA. The ARM64 debug APK is for testing, not store release.

## React Native

```sh
cd mobile-react-native-app
npm ci
npm run typecheck
npm run lint
npm run test:coverage
```

Use a native build whose Expo modules match the package lock. Expo Go failed to load ExpoAsset in the initial local check, so the recorded run used a native iOS Release build. To build locally on a Mac with Xcode and CocoaPods:

```sh
npx expo prebuild --platform ios --no-install
cd ios
pod install
xcodebuild -workspace CareConnect.xcworkspace -scheme CareConnect \
  -configuration Release -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,id=<device-id>' \
  -derivedDataPath ../build-ios CODE_SIGNING_ALLOWED=NO build
cd ..
xcrun simctl install <device-id> build-ios/Build/Products/Release-iphonesimulator/CareConnect.app
```

Prebuild makes native project files and may change local launch scripts. Keep generated build files out of your test commit. For Android, use the existing app README build steps.

Install [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli.md), then run these commands from `mobile-react-native-app`. Replace the device ID and evidence folder with your own paths:

```sh
maestro --udid <device-id> test -e APP_ID=edu.umgc.team9.careconnect \
  --format JUNIT --output <evidence-folder>/rn-maestro.xml \
  --test-output-dir <evidence-folder>/maestro .maestro
```

The recorded iOS run uses the demo account's saved dark theme and 200% app text size. Flows scroll controls clear of the tab bar; message Back uses the native iOS button and Android Back on Android. For a repeat run, set those preferences and save them first if you need the same large-text check.

The five flows cover sign-in and a dose, settings and logout cancel, the emergency demo, health-log validation/save, and message view/cancel. Tiffany added flows 1–3 in commit `9ee7807`; Terence's branch builds on that commit, updates the emergency assertion, and adds flows 4–5. Do not claim those changes as Tiffany's work.

## What these checks cannot prove

Maestro labels and Flutter/Jest assertions do not prove VoiceOver or TalkBack speech. Check speech, reading order, focus, error announcements, modal focus, and keyboard navigation with real assistive technology. Save each device, OS, app commit, result, and evidence file. Tiffany's VPAT remains pending until her file is pushed and reviewed.

Do not call the assignment complete based on line coverage. The rubric also needs the VPAT, both screen-reader demos, an APK or IPA, approved-plan E2E evidence, and the 10–15 minute build/test/document review video.

References: [Flutter integration testing](https://docs.flutter.dev/cookbook/testing/integration/introduction), [React Native accessibility](https://reactnative.dev/docs/accessibility), [native stack options](https://reactnavigation.org/docs/native-stack-navigator/).
