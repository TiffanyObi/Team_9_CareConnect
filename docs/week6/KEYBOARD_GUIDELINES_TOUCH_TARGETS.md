# Keyboard, guideline, and touch-target verification

This record covers Team 9's Week 6 work for external-keyboard behavior, expanded Flutter accessibility-guideline checks, and minimum touch targets. It distinguishes repeatable automated checks from the final manual device review.

## Implemented behavior

- Flutter wraps the routed application in a reading-order focus traversal group. Native Material fields, buttons, switches, dialogs, tabs, and Back controls remain keyboard focusable.
- React Native shared buttons explicitly participate in focus traversal when enabled and leave traversal when disabled.
- React Native shared buttons have a minimum width of 44 points and a preferred minimum height of 48 points.
- React Native settings switches have an explicit 44 by 44 point minimum target.
- React Native authentication and health-log fields use the shared 48-point preferred minimum height; the multiline message field exceeds it.
- React Native tab items have a minimum width of 44 points and minimum height of 48 points. Their visible icon targets are 48 by 48 points.

## Automated verification

Flutter `keyboard_accessibility_test.dart` verifies forward and reverse traversal between authentication fields and verifies that Escape closes the message modal without trapping focus. A subsequent Tab operation establishes that traversal resumes after dismissal.

Flutter `accessibility_guidelines_test.dart` applies the Android 48-pixel tap-target, labeled-control, and text-contrast guidelines to:

- Today and Accessibility Settings
- Medication, appointment, health-log, and message list/detail screens
- Sign-in, invalid sign-in feedback, and account-creation modes
- First-time accessibility onboarding
- Emergency Assistance and its confirmation dialog
- Message composer and logout dialogs

React Native `touch-targets.test.tsx` verifies the computed minimum dimensions and focusability of shared buttons, settings switches, and authentication fields. The full Jest suite also preserves the shared accessibility snapshot.

## Commands

From `mobile-flutter-app`:

```sh
flutter test test/accessibility_guidelines_test.dart test/keyboard_accessibility_test.dart
```

From `mobile-react-native-app`:

```sh
npm test -- --runInBand src/__tests__/touch-targets.test.tsx
```

## Manual tablet check

Automated widget tests do not prove hardware behavior on every tablet and operating-system version. Before submission, run the final Flutter and React Native builds with an external keyboard and record:

1. Forward Tab order and reverse Shift+Tab order on sign-in, Today, each bottom tab, forms, and Settings.
2. Enter and Space activation for buttons, tabs, and switches.
3. Escape or platform Back dismissal for dialogs, followed by focus restoration to the opening control.
4. A visible focus indicator in light and dark themes.
5. No keyboard trap in fields, dialogs, lists, or scrollable regions.

Record the device, OS, build commit, expected order, actual order, result, tester, date, and evidence filename. Keep this manual result separate from the automated pass until the physical or simulated external-keyboard session is complete.

## Known verification note

On this development host, the functional and accessibility Flutter suite passes. The existing golden suite reports the same 8-to-55-pixel renderer drift documented in `TERENCE_TESTING_HANDOFF.md` on nine images. The medication-list golden passes. No golden references were changed for this work because these accessibility changes do not intentionally alter the Flutter screen designs.
