# Week 4 Acceptance Criteria

## Continuity and structure

- [ ] The existing `mobile-flutter-app/` is extended; no replacement Flutter application is added.
- [ ] UI, models, repositories/services, shared state/controllers, reusable widgets, and routes remain clearly separated.
- [ ] `setState` is limited to local transient UI state; cross-screen data uses the documented shared-state approach.

## Screens and navigation

- [ ] Seven to ten meaningful functional screens are reachable; the planned target is eight.
- [ ] The Medications, Care, and Messages placeholders are replaced or excluded from the count.
- [ ] Selecting an item opens its matching detail screen with the selected model's information.
- [ ] Back navigation returns to the originating screen while preserving relevant state.
- [ ] Bottom navigation opens the correct destinations and remains operable.

## Accessibility and seizure safety

- [ ] Interactive and informative elements expose meaningful labels, roles, values/status, and logical reading order.
- [ ] Primary touch targets are approximately 48 x 48 logical pixels or larger.
- [ ] Measured text and essential UI contrast meet the team's documented WCAG thresholds.
- [ ] Core flows remain usable at 200% text scaling on representative phone/tablet portrait and landscape layouts without clipping, overlap, lost content, or unreachable controls.
- [ ] TalkBack or VoiceOver and external-keyboard results are recorded; code inspection alone cannot satisfy this criterion.
- [ ] No intentional flashing, strobing, unsafe autoplay, looping decorative motion, or motion-only feedback is introduced.
- [ ] Reduced-motion and static-alert preferences remain effective throughout new screens.

## Tests and coverage

- [ ] Unit tests cover meaningful model, validation, controller/state, and repository behavior, including invalid or empty cases.
- [ ] Widget tests cover rendering, interaction, navigation, data passing, state retention, and at least one disabled/empty/recovery behavior.
- [ ] Automated accessibility guideline tests pass.
- [ ] `flutter analyze --no-pub` succeeds.
- [ ] `flutter test --coverage --no-pub` succeeds with all tests passing.
- [ ] `coverage/lcov.info` demonstrates at least 60% aggregate line coverage.
- [ ] Tests use behavior-based assertions and are not written only to increase coverage.

## Documentation and evidence

- [ ] The README accurately explains the app, setup/run steps, major screens, state-management approach, navigation, and important configuration.
- [ ] Current screenshots show major screens and key navigation/interactions using fictional data.
- [ ] Test and coverage evidence records the command, date, test count, lines hit/found, percentage, and failures.
- [ ] Manual accessibility evidence records device/target, OS, orientation, text scale, assistive technology, result, and limitations.
- [ ] Local completion, branch/commit state, remote push, and course submission are reported separately.
