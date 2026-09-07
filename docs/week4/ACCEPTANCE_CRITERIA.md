# Week 4 Acceptance Criteria

Checked items have current local evidence. Unchecked items require hardware, assistive technology, or an external system and are not represented as complete.

## Continuity and structure

- [x] The existing `mobile-flutter-app/` is extended; no replacement Flutter application is added.
- [x] UI, models, repositories, shared state/controllers, reusable widgets, and routes are separated.
- [x] `setState` is limited to transient shell selection; cross-screen preferences use `AccessibilityController`.

## Screens and navigation

- [x] Eight meaningful functional screens are reachable.
- [x] Medications, Care, and Messages contain list and detail workflows rather than placeholders.
- [x] Selecting an item opens the matching immutable model data.
- [x] Back navigation returns to the originating screen while shared state remains available.
- [x] Bottom navigation opens the correct destinations and remains operable.

## Accessibility and seizure safety

- [x] Automated semantics checks and the live browser accessibility tree expose meaningful labels, roles, selected states, and reading order.
- [x] Primary touch targets pass Flutter's Android tap-target guideline.
- [x] Text and essential controls pass Flutter's named automated text-contrast guideline.
- [x] All eight screens pass phone/tablet portrait/landscape reflow tests at 100% and 200% text scale.
- [ ] TalkBack or VoiceOver results. **User/device verification pending.**
- [ ] External-keyboard focus-order results. **User/device verification pending.**
- [x] No intentional flashing, strobing, unsafe autoplay, looping decorative motion, or motion-only feedback is introduced.
- [x] Reduced-motion and static-alert preferences remain effective and are controller-tested.

## Tests and coverage

- [x] Unit tests cover models, validation, repositories, and shared accessibility state, including invalid values.
- [x] Widget tests cover rendering, interaction, navigation, selected-data passing, state retention, and empty-state recovery.
- [x] Automated accessibility guideline tests pass.
- [x] `flutter analyze --no-pub` succeeds with no issues.
- [x] `flutter test --coverage --no-pub` succeeds: 31 passed, 0 failed.
- [x] The September 6 `coverage/lcov.info` records 365/407 lines, or 89.68%, above the 60% minimum.
- [x] Tests use behavior-based assertions and exercise visible workflows.

## Documentation and evidence

- [x] The Flutter README explains the app, commands, screens, state, navigation, and evidence locations.
- [x] Eight current screenshots show every major screen using fictional data.
- [x] Verification records the command, date, test count, lines hit/found, percentage, and failures.
- [x] The verification record names the untested device, assistive-technology, and keyboard limitations.
- [x] Local completion, branch/commit state, remote push, and course submission are reported separately.
