# Week 6 integration and E2E testing

This test layer exercises meaningful CareConnect care-recipient workflows in
both mobile implementations. Flutter uses its framework-supported
`integration_test` runner, while Maestro drives the installed Flutter and React
Native applications as a user would. Detox was not added because Maestro can
exercise both technology stacks with the same readable workflow format and
does not require a second React Native-specific native runner.

## Covered workflows

| Workflow | Flutter integration | Flutter Maestro | React Native Maestro |
| --- | --- | --- | --- |
| New-account accessibility onboarding | Yes | — | — |
| Existing-user sign-in | Yes | Yes | Yes |
| Today-to-medication navigation | Yes | Yes | Yes |
| Medication logging and visible status | Yes | Yes | Yes |
| Accessibility settings save feedback | — | Yes | Yes |
| Logout confirmation and cancellation | Yes | Yes | Yes |
| Care and emergency navigation | — | Yes | Yes |
| Emergency action feedback | — | Yes | Yes |

All accounts and health information used by these tests are fictional. Flutter
flows reset application state at launch. React Native sessions are in memory,
so relaunching returns to sign-in; persisted logs and preferences may remain,
and the assertions deliberately remain valid whether prior records exist.

## Flutter integration tests

Start an Android emulator or iOS Simulator, then run from
`mobile-flutter-app/`:

```sh
flutter pub get
flutter test integration_test/app_workflows_test.dart -d <device-id>
```

Use `flutter devices` to find the device ID. These tests inject in-memory
repositories so account and clinical-log assertions are deterministic while
still exercising the complete Provider, GoRouter, form, navigation, and screen
widget integration.

## Maestro E2E tests

Install Maestro by following its official installation instructions and make
sure one emulator/simulator is running. Maestro must drive an installed native
build; it cannot drive a Jest render or Flutter widget-test process.

Flutter, from `mobile-flutter-app/`:

```sh
flutter run -d <device-id>
maestro test -e APP_ID=edu.umgc.team9.careconnect_flutter .maestro # Android
maestro test -e APP_ID=edu.umgc.team9.careconnectFlutter .maestro  # iOS
```

React Native, from `mobile-react-native-app/`:

```sh
npm install
npx expo run:android
# Or on macOS: npx expo run:ios
maestro test -e APP_ID=edu.umgc.team9.careconnect .maestro
```

The React Native flow uses the seeded Olivia account, whose sign-in fields are
prefilled. The Flutter flow enters the same fictional credentials explicitly.

If the repository path contains spaces and an Expo iOS CocoaPods script fails
with a truncated path, build from a temporary checkout whose path has no
spaces. This affects native build tooling, not the Maestro flow definitions.
Use JDK 17 for local React Native Android release builds; newer JDKs may fail
during the native CMake configuration used by Expo and React Native.

For an evidence package, run each suite with JUnit and debug artifacts:

```sh
maestro test -e APP_ID=<platform-app-id> .maestro \
  --format junit --output maestro-results.xml \
  --debug-output maestro-artifacts
```

Capture the terminal summary and retain `maestro-results.xml` with the course
submission evidence. Do not commit generated videos, screenshots, native build
outputs, or device databases unless the team explicitly chooses to do so.

## Local verification record

On September 20, 2026, both Flutter integration workflows and all three Maestro
flows for each mobile implementation passed on an iPhone 17 simulator running
iOS 26.4. The same Flutter integration suite and all six Maestro flows passed on
an Android 17 API 37 emulator. Testing used Maestro CLI 2.10.0. The React Native
E2E run identified an accessible-container issue that hid buttons nested inside
cards from UI automation and screen readers; the shared card was corrected to
expose its child text and controls individually. Flutter analysis, Flutter
unit/widget tests, React Native ESLint, TypeScript checking, and Jest were rerun
after the changes.

## Scope boundary

These automated tests verify UI workflows and visible/accessible labels. They
do not replace the separate manual TalkBack and VoiceOver sessions required by
the assignment. Record assistive-technology device, OS version, reading order,
focus behavior, findings, and corrections in the team's accessibility test
evidence.
