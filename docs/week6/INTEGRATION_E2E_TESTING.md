# Week 6 integration and E2E testing

Updated September 21, 2026 (ET). Current execution branch: `feature/week6-final-testing-evidence`, based on main `96a5859`.

Tiffany's PR #15 and Terence's PR #16 are merged. This guide covers both sets of tests. Use fake accounts on a simulator or test device: these flows change local demo data. Emergency actions do not place calls or share location.

## Before running

Use a clean checkout and record `git rev-parse HEAD`, device ID, OS, and tool versions with each run. Run `flutter devices` for Flutter targets. Install the app before using Maestro; widget/Jest renders are not installed apps.

The former duplicate Flutter dependency is resolved. The Flutter emergency Maestro assertion now expects the current truthful message, `Demo only — no call placed`. After rebuilding and reinstalling the current Flutter app, all three Android Maestro flows passed on Pixel 10, Android 17 API 37.

The full Flutter automated suite now passes 54 of 54 tests with 84.68% line coverage. React Native passes 48 of 48 Jest tests with 99.47% line coverage; TypeScript and ESLint pass. See [the final approved-plan execution ledger](FINAL_TEST_PLAN_EXECUTION.md) for the separate approved-case calculations and their scope-approval requirement.

## Flutter suites and builds

From `mobile-flutter-app`:

```sh
flutter pub get
flutter analyze
flutter test --coverage
flutter devices
flutter test integration_test/app_workflows_test.dart -d <device-id> --reporter expanded
flutter test integration_test/week6_test.dart -d <device-id> --reporter expanded
flutter build apk --debug --target-platform android-arm64
# On macOS with Xcode:
flutter build ios --simulator --debug
```

| Suite | Scope |
| --- | --- |
| `test/` | Unit/widget tests, guideline checks, responsive layouts, keyboard checks, and ten golden comparisons |
| `integration_test/app_workflows_test.dart` | Tiffany's two workflows: new-account onboarding; returning-user medication and logout. Uses in-memory repositories. |
| `integration_test/week6_test.dart` | Terence's four cases: native SQLite account scope/reopen; v2 migration; medication workflow; large-text settings and message cancel. |

The native database cases use separate `week6_*.db` files. UI cases use a test auth store; they do not establish production password-hashing correctness. Widget coverage is `coverage/lcov.info`; device integration results are separate. A simulator `.app` is not an IPA. The ARM64 debug APK is a test build.

## React Native suites and builds

From `mobile-react-native-app`:

```sh
npm ci
npm run typecheck
npm run lint
npm run test:coverage
# Choose the target platform:
npx expo run:android
# Or on macOS with Xcode and CocoaPods:
npx expo run:ios
```

Use a native build with modules matching the package lock. The saved September 20 run used an iOS Release build because Expo Go failed to load ExpoAsset. For that build path:

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

Prebuild can change native files and launch scripts. Keep generated build files separate from test-source commits. If a CocoaPods script fails on a path with spaces, use a clean checkout without spaces. The team's Android instructions call for JDK 17.

## Maestro workflows

Install Maestro using its [official instructions](https://docs.maestro.dev/getting-started/installing-maestro). Run from the app folder. Use `maestro test --help` to confirm artifact flags for the installed CLI.

| Flow | Flutter | React Native |
| --- | --- | --- |
| `01_sign_in_and_medication.yaml` | Sign-in and dose | Sign-in and dose |
| `02_accessibility_and_logout.yaml` | Settings save and logout cancel | Settings save and logout cancel |
| `03_care_and_emergency.yaml` | Care and emergency demo; current assertion passes | Care and emergency demo |
| `04_health_log.yaml` | Not in Flutter Maestro set | Validation and save |
| `05_messages.yaml` | Not in Flutter Maestro set | Detail and cancel |

Flutter app IDs are `edu.umgc.team9.careconnect_flutter` on Android and `edu.umgc.team9.careconnectFlutter` on iOS. RN uses `edu.umgc.team9.careconnect` on both. Use an absolute evidence folder outside the checkout.

```sh
maestro --udid <device-id> test -e APP_ID=<platform-app-id> \
  --format JUNIT --output <evidence-folder>/maestro-results.xml \
  --test-output-dir <evidence-folder>/maestro .maestro
```

The seeded fictional account is `omartinez@careconnect.com`, password `password`. Flutter flows enter it explicitly; RN fields are prefilled. Flutter flows clear state at launch; RN logs/preferences may persist. To repeat Terence's large-text RN run, save dark theme and 200% app text first. App text scaling does not establish system text-scaling support.

Tiffany supplied the first three RN flows at `9ee7807` and the later Flutter flows at `939b1cf`. Terence updated RN flows 1–3 and added 4–5 at `ae51f39`. Both Flutter integration suites remain in the repo.

## Saved results and their limits

The repository evidence below preserves historical September 20 runs. Current branch verification performed September 21–22 adds a passing 54-test Flutter run, 84.68% Flutter line coverage, a passing 48-test React Native run, 99.47% React Native line coverage, and a 3-of-3 Flutter Android Maestro run. Associate final submission copies with the commit produced from this branch.

| Evidence | Saved result | Scope |
| --- | --- | --- |
| [Flutter suite log](evidence/flutter-tests.txt) | 48 passed; 84.47% line coverage | September 20, Terence's tested source |
| [Flutter device log](evidence/integration-ios-integration.txt) | 4 passed | iPhone 17, iOS 26.5 |
| [RN suite log](evidence/rn-tests.txt) | 35 tests, 6 suites, 1 snapshot; 100% line coverage | September 20, Terence's tested source |
| [RN Maestro XML](evidence/rn-maestro-verified.xml) | 5 flows, 0 failures | iPhone 17, iOS 26.5; dark/200% app text |

See [evidence notes](evidence/README.md) for historical source hashes. Do not relabel those older logs as current-branch output.

Tiffany's original guide reports two Flutter integration workflows and three Maestro flows per app on iOS 26.4 and Android 17/API 37. Treat that as a historical report. Her separately reviewed SharePoint XML/summary files supply additional E2E evidence; retain their own device/date/build limits rather than combining them into one run.

## Plan mapping and manual evidence

Use [TEST_PLAN_MAPPING.md](TEST_PLAN_MAPPING.md) and the row-level CSV beside it. A passing flow or line-coverage percentage is not the percentage of approved plan cases passed.

The updated VPAT draft and Zack's partial Flutter iOS review were placed in the team's shared Week 6 folder. They are separate from these repository test logs. Do not describe them as absent merely because they are not committed here, or as final conformance proof.

Complete missing VoiceOver/TalkBack, keyboard, focus, and spoken error/status checks. Record app/build, device/OS, reader/settings, steps, expected/actual result, exact speech, tester/date, and evidence filename. Reconcile Zack's conflicting screen results. The final submission also needs the approved-plan result mapping, APK or IPA, reader videos, and the 10–15 minute checkout/build/test/document review video. Preserve the September 20 [handoff](TERENCE_TESTING_HANDOFF.md) as historical evidence; its pending-status wording is not a current inventory.
