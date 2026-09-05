# CareConnect Safeview Flutter

This folder contains Team 9's Flutter implementation of the CareConnect Safeview mobile design system. It includes final light and dark themes, reusable accessible components, a responsive navigation shell, persistent returning-user accessibility preferences, and eight functional Week 4 screens.

The screen inventory is:

- Today dashboard
- Accessibility Settings
- Medications list and medication detail
- Care team list and care member detail
- Messages list and message detail

The list and detail workflows use fictional repositories and pass the selected immutable model through `Navigator`. Accessibility preferences remain shared through `AccessibilityController`; local widget state is limited to transient navigation-shell selection. Visual feedback is static by default, with no flashing, pulsing, autoplay, or animation-only status cues.

All visual feedback is static by default. The implementation intentionally avoids flashing, pulsing, autoplay, and animation-only status cues.

From this folder:

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```

For complete prerequisites and troubleshooting, see the repository's root `README.md` and `docs/DEVELOPER_SETUP.md`. Run the Week 4 gate with `./tool/verify_week4.sh`.

The September 4, 2026 gate passed with 31 tests, no analyzer issues, and 367/407 covered lines (90.17%). The responsive suite exercises all eight screens at 100% and 200% text scale on phone/tablet portrait and landscape surfaces.

## Week 4 evidence

- Current screen evidence: [`../docs/week4/SCREENSHOT_INDEX.md`](../docs/week4/SCREENSHOT_INDEX.md)
- Unit, widget, accessibility, responsive, and visual-regression tests: [`test/`](test/)
- Generated coverage data: [`coverage/lcov.info`](coverage/lcov.info)
- Final verification record and device-only limitations: [`../docs/week4/VERIFICATION.md`](../docs/week4/VERIFICATION.md)
