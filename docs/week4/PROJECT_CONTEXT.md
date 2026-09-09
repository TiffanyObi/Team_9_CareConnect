# Week 4 Project Context

> Current update: Provider and GoRouter were implemented on September 8, 2026. The current app has ten evidence screens plus authentication and onboarding flows. See `ROUTING_AND_STATE_2026-09-08.md` and `FINAL_LOCAL_EVIDENCE_2026-09-08.md`. The September 4 sections below are retained as historical context.

## Historical implementation snapshot - September 4, 2026

- The canonical `mobile-flutter-app/` now contains eight functional screens: Today, Accessibility Settings, Medications, Medication detail, Care team, Care member detail, Messages, and Message detail.
- The three former placeholders are replaced by list/detail workflows backed by fictional immutable models and deterministic repositories.
- Each list passes its selected model through `Navigator` to the matching detail screen; Back navigation returns to the originating list.
- Shared accessibility preferences continue to use `AccessibilityController` (`ChangeNotifier`) with persistent storage. Remaining `setState` usage is local and transient.
- Unit, widget, accessibility-guideline, four-surface 100%/200% reflow, and screenshot-regression tests are present.
- Current screenshots and their review record are indexed in `SCREENSHOT_INDEX.md`.
- TalkBack/VoiceOver, external-keyboard, and physical-device checks remain user/device verification items and are not inferred from automated tests.

## Historical verified baseline before Week 4 implementation

- Canonical repository: `TiffanyObi/Team_9_CareConnect`.
- Canonical Flutter application: `mobile-flutter-app/` on `main`.
- Existing functional screens: Today and Accessibility Settings.
- Existing placeholders that must not be counted: Medications, Care, and Messages.
- Existing architecture separates app shell, theme, accessibility controller/settings/store, reusable widgets, and feature screens.
- Shared accessibility state uses `AccessibilityController` (`ChangeNotifier`) and `SharedPreferencesAccessibilitySettingsStore`.
- Existing navigation uses a `NavigationBar` and `Navigator.push` for Accessibility Settings.
- Existing widget tests cover Today rendering, persisted accessibility settings, and 200% text scaling.
- Existing photosensitive-epilepsy safeguards include reduced-motion settings, static alerts, text/semantic feedback, and avoidance of flashing/autoplay.

## Historical Week 4 gaps at baseline

- Replace three placeholder destinations with meaningful workflows.
- Reach 7-10 functional screens; target eight rather than counting placeholders.
- Demonstrate forward/back navigation and pass a selected model to detail screens.
- Add meaningful unit tests for models, validation, controllers, and repositories plus widget tests for interactions and navigation.
- Generate current `coverage/lcov.info` and demonstrate at least 60% line coverage.
- Record screenshots and manual TalkBack/VoiceOver, keyboard, contrast, phone/tablet, orientation, and text-scale evidence.
- Update README content to describe the actual final screens, state management, and navigation.

## Proposed eight-screen target

1. Today dashboard.
2. Accessibility Settings.
3. Medications list.
4. Medication detail.
5. Care recipients list.
6. Care recipient detail.
7. Messages list.
8. Message detail.

This is a planning target for team review. If the team chooses different CareConnect workflows, update the plan and acceptance criteria before implementation.
