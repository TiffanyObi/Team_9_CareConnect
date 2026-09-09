# CareConnect Safeview Flutter

This folder contains Team 9's Flutter implementation of the CareConnect Safeview mobile design system. It includes light and dark themes, reusable accessible components, Provider-managed accessibility preferences, GoRouter navigation, ten core Week 4 evidence screens, and sign-in and account-setup flows.

The screen inventory is:

- Today dashboard
- Accessibility Settings
- Medications list and medication detail
- Care team list and care member detail
- Messages list and message detail

The list and detail workflows use fictional repositories and pass selected immutable models through typed GoRouter route arguments. Provider supplies the shared `AccessibilityController`, while `SharedPreferences` stores only accessibility preferences. Local `setState` remains limited to forms, short feedback, and screen-local sample data. Visual feedback is static by default, with no flashing, pulsing, autoplay, or animation-only status cues.

All visual feedback is static by default. The implementation intentionally avoids flashing, pulsing, autoplay, and animation-only status cues.

From this folder:

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```

For complete prerequisites and troubleshooting, see the repository's root `README.md` and `docs/DEVELOPER_SETUP.md`. Run the Week 4 gate with `./tool/verify_week4.sh`.

The September 8, 2026 gate passed with 41 tests, no analyzer issues, and 718/780 covered lines (92.05%). The responsive suite exercises all ten evidence screens at 100% and 200% text scale on phone and tablet surfaces. Generate the local HTML report with `genhtml coverage/lcov.info --output-directory coverage/html --legend`.

Run the repeatable security check with `./tool/security_audit.sh`. It performs static analysis, queries OSV for resolved hosted Pub packages, scans tracked files for common credential patterns, and checks Android and iOS transport exceptions.

## Week 4 evidence

- Current screen evidence: [`../docs/week4/SCREENSHOT_INDEX.md`](../docs/week4/SCREENSHOT_INDEX.md)
- Unit, widget, accessibility, responsive, and visual-regression tests: [`test/`](test/)
- Generated coverage data: [`coverage/lcov.info`](coverage/lcov.info)
- Final verification record and device-only limitations: [`../docs/week4/VERIFICATION.md`](../docs/week4/VERIFICATION.md)
- Submission package checklist: [`../docs/week4/SUBMISSION_PACKAGE_2026-09-06.md`](../docs/week4/SUBMISSION_PACKAGE_2026-09-06.md)
