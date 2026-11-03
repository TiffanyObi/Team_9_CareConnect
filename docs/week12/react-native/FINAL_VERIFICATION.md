# React Native final verification

**Platform:** CareConnect Safeview React Native mobile application  
**Verification date:** November 2, 2026  
**Build:** Android release APK, version 1.0.0  
**Package ID:** `edu.umgc.team9.careconnect`

## Automated results

| Check | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript | Passed |
| Expo Doctor | 21 of 21 checks passed |
| Jest and React Native Testing Library | 9 suites, 50 tests, and 1 snapshot passed |
| Statements | 94.77% |
| Branches | 89.21% |
| Functions | 95.27% |
| Lines | 98.98% |

The tracked HTML coverage report is located at `mobile-react-native-app/coverage/lcov-report/index.html`.

## Release artifact

The release APK was produced locally with Expo prebuild and Gradle using JDK 17. Native generated files were created in a temporary directory and were not added to the repository.

- Filename: `CareConnect-SafeView-ReactNative-1.0.0.apk`
- Size: approximately 81 MB
- SHA-256: `ea847d3ac96041eec8a09b664b1e5b0baa7a9540e94d12622494c1efff900286`
- Local ignored output: `mobile-react-native-app/dist-android/`

## Native Android verification

The release APK was installed on a Pixel 10 Android emulator. The following checks passed:

- Seeded Olivia Martinez account signed in with the documented credentials.
- Today, Settings, Medications, Care, and first-use accessibility screens rendered without a blocking error.
- A new local account opened the accessibility setup before Today.
- Saving accessibility preferences opened Today for the new user.
- Levetiracetam could be logged as taken.
- The medication screen displayed “Logged today” and a date-and-time value.
- The medication timestamp remained after the app was stopped, reopened, and the user signed in again.
- Android's native accessibility tree exposed meaningful names for authentication controls, tabs, settings, and primary actions.

The sign-in and account-creation password derivation may take approximately 20–30 seconds on an emulator. This is a performance limitation of the local demonstration authentication and should not be treated as production authentication behavior.

## Accessibility improvements in this finalization

- Persistent visible labels were added to authentication, care, and message form fields.
- Shared buttons and fields now expose a visible three-pixel keyboard-focus border when focused.
- Form controls retain a minimum 48-pixel height.
- Medication and health-log history sections received explicit accessibility headings.
- Email, name, and password fields use appropriate capitalization and autofill metadata.
- Automated tests verify form labels, touch-target dimensions, focus styling, accessible roles, states, live regions, navigation, contrast, and user-scoped persistence.

## Security review

A non-breaking `npm audit fix` removed the critical advisory found during finalization. The final audit reported 20 production/transitive findings (1 low, 17 moderate, and 2 high) and 49 findings when development tooling was included. They originate in the Expo, React Native, Jest, and lint toolchains. A forced audit fix was not used because it proposed breaking framework or test-runner changes. The application remains an educational, on-device prototype and is not approved to store real protected health information.

## Evidence boundaries

The screenshots and Android accessibility tree confirm visible UI and native semantics, but they do not prove spoken output, rotor behavior, or real external-keyboard traversal. TalkBack or VoiceOver and external-keyboard checks must be performed manually and recorded separately. See `MANUAL_ACCESSIBILITY_CHECKLIST.md`.
