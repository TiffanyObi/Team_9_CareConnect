# CareConnect Safeview Flutter

This folder contains Team 9's Flutter implementation of the CareConnect Safeview mobile design system. It includes light and dark themes, reusable accessible components, Provider-managed accessibility preferences, GoRouter navigation, ten core Week 4 evidence screens, and sign-in and account-setup flows.

The screen inventory is:

- Today dashboard
- Accessibility Settings
- Medications list and medication detail
- Care team list and care member detail
- Messages list and message detail

Provider supplies shared accessibility, authentication, medication-log, and health-log controllers. GoRouter handles the authentication, onboarding, workspace, and detail-screen routes. SharedPreferences stores accessibility preferences, while SQLite stores locally registered accounts, medication logs, and health logs behind repository interfaces. Passwords are never stored directly; local accounts use a random salt and PBKDF2-derived hash. In-memory repository implementations keep automated tests isolated and deterministic.

This local database is prototype persistence, not a production healthcare backend. Only fictional demonstration accounts and health information should be used. A deployed version would require a secured remote identity service, server-side authorization, encrypted transport, protected device secrets, audit controls, and a formal privacy/security review.

### Fictional demo account

- Email: `omartinez@careconnect.com`
- Password: `password`

The demo account is inserted only when it does not already exist. Its password is represented in the database by a salt and PBKDF2-derived hash rather than plaintext. These public demonstration credentials must never be used for real patient information.

All visual feedback is static by default. The implementation intentionally avoids flashing, pulsing, autoplay, and animation-only status cues.

From this folder:

```bash
flutter pub get
flutter analyze
flutter test
flutter run
flutter build apk --release
```

The release APK is written to `build/app/outputs/flutter-apk/app-release.apk`. The build directory is intentionally ignored; submit the verified APK through the Week 12 SharePoint package rather than committing it to Git.

### Flutter Web accessibility preview

Flutter Web is enabled for local browser accessibility and cross-browser checks:

```bash
flutter run -d chrome
flutter build web
```

The web preview uses in-memory repositories for accounts, medication logs, and
health logs. Data is not persisted across reloads, and this prototype must only
use fictional demo information. Do not enter real patient data.

The [Flutter Web accessibility report](../docs/week6/evidence/flutter-web-accessibility/ACCESSIBILITY_REPORT.md)
records the historical automated results and browser limitations. Final manual
mobile confirmations are documented in the combined mobile VPAT.

Run the device-level integration suite with a running emulator, simulator, or
physical device:

```bash
flutter test integration_test/app_workflows_test.dart -d <device-id>
```

The cross-framework Maestro E2E workflows and evidence commands are documented
in [`../docs/week6/INTEGRATION_E2E_TESTING.md`](../docs/week6/INTEGRATION_E2E_TESTING.md).

For complete prerequisites and troubleshooting, see the repository's root `README.md` and `docs/DEVELOPER_SETUP.md`. Run the Week 4 gate with `./tool/verify_week4.sh`.

The November 3, 2026 clean-checkout verification passed with no analyzer issues, 54 of 54 automated tests, and 948/1,129 covered lines (83.97%). The responsive suite exercises the core evidence screens at 100% and 200% text scale on phone and tablet surfaces, and all ten reviewed golden comparisons pass. Generate the local HTML report with `genhtml coverage/lcov.info --output-directory coverage/html --legend`.

The final release APK built successfully at 53.4 MB. The Android toolchain reported an SDK XML version warning while still completing the build; align Android Studio and command-line tools if a future SDK turns that warning into an error. iOS builds require macOS, Xcode, a configured signing team for device distribution, and were not included in the final submitted artifact set.

Run the repeatable security check with `./tool/security_audit.sh`. It performs static analysis, queries OSV for resolved hosted Pub packages, scans tracked files for common credential patterns, and checks Android and iOS transport exceptions.

## Week 4 evidence

- Reviewed screen evidence: [`../docs/week4/SCREENSHOT_INDEX.md`](../docs/week4/SCREENSHOT_INDEX.md)
- Unit, widget, accessibility, responsive, and visual-regression tests: [`test/`](test/)
- Generated coverage data: [`coverage/lcov.info`](coverage/lcov.info)
- Final verification record and device-only limitations: [`../docs/week4/VERIFICATION.md`](../docs/week4/VERIFICATION.md)
- Submission package checklist: [`../docs/week4/SUBMISSION_PACKAGE_2026-09-06.md`](../docs/week4/SUBMISSION_PACKAGE_2026-09-06.md)

## Week 6 verification

See the [test setup guide](../docs/week6/INTEGRATION_E2E_TESTING.md), [final execution ledger](../docs/week6/FINAL_TEST_PLAN_EXECUTION.md), and [Terence testing handoff](../docs/week6/TERENCE_TESTING_HANDOFF.md) for historical results, fixes, and known limits. The recorded Android run passed all three Flutter Maestro flows on Pixel 10 / Android 17 API 37. Final VoiceOver, TalkBack, keyboard, focus, display, target-size, and platform-behavior confirmations are documented in the combined mobile VPAT.

Keyboard traversal, expanded Flutter guideline coverage, and cross-framework touch-target checks are documented in [Keyboard, guideline, and touch-target verification](../docs/week6/KEYBOARD_GUIDELINES_TOUCH_TARGETS.md).

## Limitations

- Account, accessibility, medication, and health-log data remains on the device and does not synchronize with a clinical service or the other CareConnect implementations.
- Add appointment opens a draft form, but Save appointment is disabled. View calendar is also unavailable.
- New message opens a draft, but Send is disabled; no message is delivered to a caregiver.
- Emergency assistance displays guidance only. It does not call emergency services, alert a caregiver, or share location.
- The Flutter Web preview uses in-memory repositories and loses data on reload; the native application uses local persistence.
- The submitted build is Android. No signed iOS IPA is included.
