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

## Manual Android external-keyboard session

Tested September 22, 2026 using the Pixel 10 Android emulator, Android 17 / API 37, and keyboard events supplied from the macOS host. The installed Flutter debug APK has SHA-256 `f86ace7fe1e34608ed06ab7070007cc6e9f9dae6368a7c6182a96c873f8ad7c3`. The source HEAD at the time of the session was `3b40830fd2ca9dd1e456b5c48db59157b2408327`; uncommitted test-evidence and golden-reference changes were also present, but no uncommitted Flutter runtime source change affected this session.

The hierarchy was captured after each key event with Android UI Automator. A passing Maestro flow established the fictional Olivia Martinez session before authenticated traversal. This is emulator evidence, not a claim about every physical keyboard or tablet.

| Check | Actual result | Status |
| --- | --- | --- |
| Sign-in forward Tab order | Help → Email → Password → Show password → Forgot password? → Sign in → Create a new account | Pass |
| Enter activation | Enter on Create a new account opened account creation; Enter on Back returned from Medication details; Enter on Settings opened Settings | Pass |
| Medication-list order | Levetiracetam → Vitamin D3 → Today → Meds → Care → Messages → Settings | Pass |
| Disabled-control behavior | The disabled Taken button was omitted from traversal; Back remained available on Medication details | Pass |
| No forward keyboard trap | Focus could leave fields, cards, detail screens, and navigation; the tested paths retained a reachable Back or navigation control | Pass for tested paths |
| Settings controls | From the focused Settings tab, forward Tab reached Reset to recommended safe settings and then the bottom navigation. It did not reach the text-size slider, Light/Dark/Device controls, or four switches during the tested forward cycle. | Fail / remediation required |
| Visible keyboard focus | Text-field focus was visible through the field border and caret. A distinct keyboard-focus indicator was not visible on the focused bottom Settings tab; the visible highlight continued to indicate the selected Meds tab. | Partial / remediation required |
| Reverse Shift+Tab | Android `input keycombination` did not reproduce a reliable reverse traversal on this emulator. The Flutter widget test verifies reverse traversal on authentication, but the native manual result remains unverified. | Not verified manually |
| Space activation | Could not be established for the unreachable Settings switches in this session. | Not verified |
| Dialog focus and restoration | Automated Flutter coverage verifies Escape dismissal and resumed traversal for the message dialog. A reliable native dialog-restoration sequence was not established in this emulator session. | Automated pass; native manual follow-up |

### Manual conclusion

Flutter external-keyboard support is **partially conformant in the tested Android-emulator scope**. Core forward traversal and Enter activation work, and no trap was observed in the tested authentication, medication, detail, or navigation paths. Do not claim full keyboard support until the Settings controls are reachable in a logical order, a visible focus indicator distinguishes keyboard focus from selected-tab state, and native reverse traversal, Space activation, and modal focus restoration are manually confirmed.

For the VPAT, use these findings as evidence for partial support of WCAG 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, and 2.4.7 Focus Visible. Reassess after remediation and before changing any criterion to Supports.

## Current automated verification note

The Flutter functional, accessibility, responsive, keyboard, and golden suites pass. All ten reviewed golden references pass on the current branch. Automated checks remain supporting evidence and do not override the native manual limitations above.
