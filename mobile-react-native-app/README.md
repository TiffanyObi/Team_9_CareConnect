# CareConnect Expo application

This Expo/React Native implementation ports the CareConnect Flutter care-recipient experience. It uses React Navigation for tabs and detail flows, React Context for application state, SQLite repositories for accounts and user-scoped health/medication logs, user-scoped AsyncStorage keys for accessibility preferences, and TypeScript in an organized `src/` structure.

The local demonstration account is `omartinez@careconnect.com` with password `password`. This account is seeded at database initialization. New accounts are stored locally with normalized email addresses, random salts, and PBKDF2-derived password hashes; plaintext passwords are not stored.

## Run and validate

Use Node 22 LTS or a working npm installation, then run:

```sh
npm install
npm run lint
npm run typecheck
npm run security
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

The APK is written to `android/app/build/outputs/apk/release/app-release.apk`. The same artifact can optionally be produced with EAS Build by signing in to Expo and running `npx eas-cli build --platform android --profile submission`; the `submission` profile explicitly requests an APK rather than the default Android App Bundle. The app configuration supplies Android and iOS bundle identifiers.

## Security notes

This prototype uses on-device persistence rather than a remote clinical backend. Passwords are salted and hashed locally, and no device location, contacts, or notification permissions are requested. The current npm audit reports moderate transitive advisories in React Navigation and Expo tooling; npm offers no non-breaking complete fix for the current Expo version. Before production use, move authentication and protected health information to an approved server over TLS, store session tokens with `expo-secure-store`, validate all backend inputs, and configure platform privacy disclosures.

## Week 6 verification

On September 21, 2026, TypeScript and ESLint passed, and all 48 Jest tests passed in nine suites. Coverage was 99.47% lines, 95.21% statements, 95.96% functions, and 89.11% branches. See the [test setup guide](../docs/week6/INTEGRATION_E2E_TESTING.md), [final execution ledger](../docs/week6/FINAL_TEST_PLAN_EXECUTION.md), and [Terence testing handoff](../docs/week6/TERENCE_TESTING_HANDOFF.md) for commands, historical native evidence, and known limits. Automated checks do not replace VoiceOver or TalkBack review.

### React Native semantic and contrast evidence (September 21, 2026)

See the [accessibility audit](../docs/week6/RN_ACCESSIBILITY_AUDIT.md) for control coverage, fixes, test commands, contrast ratios, and the native checks still needed. Automated semantics and color checks do not replace VoiceOver or TalkBack testing.

Keyboard focusability, Flutter guideline scope, and cross-framework minimum touch-target checks are documented in [Keyboard, guideline, and touch-target verification](../docs/week6/KEYBOARD_GUIDELINES_TOUCH_TARGETS.md).
