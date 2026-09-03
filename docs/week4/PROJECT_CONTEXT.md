# Week 4 Project Context

## Verified repository baseline

- Canonical repository: `TiffanyObi/Team_9_CareConnect`.
- Canonical Flutter application: `mobile-flutter-app/` on `main`.
- Existing functional screens: Today and Accessibility Settings.
- Existing placeholders that must not be counted: Medications, Care, and Messages.
- Existing architecture separates app shell, theme, accessibility controller/settings/store, reusable widgets, and feature screens.
- Shared accessibility state uses `AccessibilityController` (`ChangeNotifier`) and `SharedPreferencesAccessibilitySettingsStore`.
- Existing navigation uses a `NavigationBar` and `Navigator.push` for Accessibility Settings.
- Existing widget tests cover Today rendering, persisted accessibility settings, and 200% text scaling.
- Existing photosensitive-epilepsy safeguards include reduced-motion settings, static alerts, text/semantic feedback, and avoidance of flashing/autoplay.

## Week 4 gaps

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
