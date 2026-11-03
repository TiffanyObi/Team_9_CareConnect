# CareConnect Expo application

This Expo/React Native implementation ports the CareConnect Flutter care-recipient experience. It uses React Navigation for tabs and detail flows, React Context for application state, SQLite repositories for accounts and user-scoped health/medication logs, user-scoped AsyncStorage keys for accessibility preferences, and TypeScript in an organized `src/` structure.

The local demonstration account is `omartinez@careconnect.com` with password `password`. This account is seeded at database initialization. New accounts are stored locally with normalized email addresses, random salts, and PBKDF2-derived password hashes; plaintext passwords are not stored.

## Run and validate

Use Node 22 LTS, npm, Android Studio, and JDK 17, then run:

```sh
npm ci
npm run lint
npm run typecheck
npm run security
npm run test:coverage -- --runInBand
npx expo-doctor
npx expo start
```
From the Expo terminal, press i for the iOS Simulator or a for an Android emulator. You can also run npm run ios or npm run android directly.

The sign-in form validates credentials against the local account database. The Olivia demonstration credentials are prefilled so the app can be explored immediately. Creating an account saves it locally and opens the required first-time accessibility setup; signing in to an existing account opens Today with the device's saved accessibility preferences.

## End-to-end tests

The `.maestro/` flows exercise sign-in, medication logging, accessibility
settings, logout confirmation, care navigation, and emergency feedback against
an installed native build. Setup, execution, and evidence commands are in
[`../docs/week6/INTEGRATION_E2E_TESTING.md`](../docs/week6/INTEGRATION_E2E_TESTING.md).

## Mobile builds

An Expo account is not required for a local Android build. With Android Studio, the Android SDK, and JDK 17 installed, generate the native project and release APK with:

```sh
npx expo prebuild --platform android
cd android
JAVA_HOME=$(/usr/libexec/java_home -v 17) NODE_ENV=production ./gradlew :app:assembleRelease
```

The APK is written to `android/app/build/outputs/apk/release/app-release.apk`. The verified Week 12 artifact is named `CareConnect-SafeView-ReactNative-1.0.0.apk`; it was generated from a temporary native prebuild so generated Android files were not added to the repository. Its package ID is `edu.umgc.team9.careconnect`. The same artifact can optionally be produced with EAS Build by signing in to Expo and running `npx eas-cli build --platform android --profile submission`; the `submission` profile explicitly requests an APK rather than the default Android App Bundle. The app configuration supplies Android and iOS bundle identifiers.

The November 3, 2026 fresh-checkout build repeated the local Expo prebuild and Gradle release process successfully. Generated `android/` and `dist-android/` outputs are intentionally ignored; the submission APK is stored in the Week 12 SharePoint package rather than GitHub. Upstream Expo and React Native dependencies emit Gradle, Kotlin, manifest-namespace, and deprecated-API warnings but did not fail the release build.

## Security notes

This prototype uses on-device persistence rather than a remote clinical backend. Passwords are salted and hashed locally, and no device location, contacts, or notification permissions are requested. A non-breaking `npm audit fix` removed the critical advisory found during finalization. The remaining audit findings are transitive Expo, React Native, and Jest tooling advisories; resolving them currently requires breaking dependency changes, so they are documented rather than force-fixed. Before production use, move authentication and protected health information to an approved server over TLS, store session tokens with `expo-secure-store`, validate all backend inputs, and configure platform privacy disclosures.

## Week 12 final verification

On November 2, 2026, all 50 Jest and React Native Testing Library tests passed in nine suites, with one reviewed snapshot. Coverage reached 94.77% statements, 89.21% branches, 95.27% functions, and 98.98% lines. ESLint, TypeScript, and all 21 Expo Doctor checks passed. The tracked HTML report is available at [`coverage/lcov-report/index.html`](coverage/lcov-report/index.html).

A release APK was installed on an Android emulator and used to verify seeded-user sign-in, first-time account onboarding, saved accessibility preferences, medication logging with timestamp persistence, logout, and meaningful native accessibility labels. See the [Week 12 React Native verification report](../docs/week12/react-native/FINAL_VERIFICATION.md), [manual accessibility checklist](../docs/week12/react-native/MANUAL_ACCESSIBILITY_CHECKLIST.md), and [demo guide](../docs/week12/react-native/DEMO_GUIDE.md). Automated checks and the Android accessibility tree do not replace final TalkBack or VoiceOver testing.

The final human review records passing TalkBack, VoiceOver, external-keyboard, focus, text-scaling, orientation, target-size, reduced-motion, native-control, and platform-behavior checks in the combined mobile VPAT. This is still an educational local-data prototype, not a production healthcare service.

## Historical Week 6 verification

On September 21, 2026, TypeScript and ESLint passed, and all 48 Jest tests passed in nine suites. Coverage was 99.47% lines, 95.21% statements, 95.96% functions, and 89.11% branches. See the [test setup guide](../docs/week6/INTEGRATION_E2E_TESTING.md), [final execution ledger](../docs/week6/FINAL_TEST_PLAN_EXECUTION.md), and [Terence testing handoff](../docs/week6/TERENCE_TESTING_HANDOFF.md) for commands, historical native evidence, and known limits. Automated checks do not replace VoiceOver or TalkBack review.

### React Native semantic and contrast evidence (September 21, 2026)

See the [accessibility audit](../docs/week6/RN_ACCESSIBILITY_AUDIT.md) for the Week 6 control coverage, fixes, test commands, contrast ratios, and the checks that were pending at that time. Those final manual checks are recorded as passed in the combined mobile VPAT.

Keyboard focusability, Flutter guideline scope, and cross-framework minimum touch-target checks are documented in [Keyboard, guideline, and touch-target verification](../docs/week6/KEYBOARD_GUIDELINES_TOUCH_TARGETS.md).

## Limitations

- Accounts, accessibility preferences, medication logs, and health logs are stored locally and do not synchronize with a clinical service or another platform.
- Add appointment opens a draft form, but Save appointment is disabled.
- New message opens a draft, but Send is disabled; no message is delivered.
- Emergency assistance displays an alert only. It does not place a call, alert a caregiver, or share location.
- Password recovery and remote account management are not implemented.
- The submitted native artifact is an Android APK. No signed iOS IPA is included.
