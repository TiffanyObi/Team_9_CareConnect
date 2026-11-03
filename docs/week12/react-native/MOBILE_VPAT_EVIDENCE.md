# React Native evidence for the combined Mobile VPAT

This document is an evidence handoff for the team member assembling the combined Flutter and React Native Mobile VPAT. It is not a replacement for the final VPAT and does not claim results for Flutter.

| WCAG 2.1 criterion | Suggested React Native status | Evidence and qualification |
| --- | --- | --- |
| 1.1.1 Non-text Content | Supports | Interactive icons and controls use meaningful accessibility labels; automated role/name tests pass. Confirm final spoken labels manually. |
| 1.3.1 Info and Relationships | Supports | Persistent form labels, headings, roles, states, and semantic grouping are implemented and tested. |
| 1.3.2 Meaningful Sequence | Partially Supports pending manual confirmation | Visual and component order is logical; final TalkBack/VoiceOver reading-order test is required. |
| 1.3.3 Sensory Characteristics | Supports | Instructions and actions do not rely only on position, shape, sound, or color. |
| 1.4.1 Use of Color | Supports | Selected, error, and logged states include text, icon, role, or state information in addition to color. |
| 1.4.3 Contrast (Minimum) | Supports | Automated contrast tests cover rendered text and control states in light and dark themes. |
| 1.4.4 Resize Text | Partially Supports pending manual confirmation | The UI permits text scaling and components avoid fixed text heights; final 200% native reflow inspection is required. |
| 1.4.10 Reflow | Partially Supports pending manual confirmation | Screens use responsive layouts and scroll containers; final 200% and landscape checks are required. |
| 1.4.11 Non-text Contrast | Supports | Automated checks cover field boundaries, selected tabs, pressed states, and focus styling. |
| 1.4.13 Content on Hover or Focus | Supports | Core mobile workflows do not depend on hover-only or focus-triggered popup content. |
| 2.1.1 Keyboard | Partially Supports pending manual confirmation | Controls are focusable and automated focus-style tests pass; full external-keyboard traversal remains manual. |
| 2.1.2 No Keyboard Trap | Partially Supports pending manual confirmation | No trap is designed; dialogs and navigation require manual external-keyboard confirmation. |
| 2.2.1 Timing Adjustable | Supports | No user task has an enforced time limit. |
| 2.2.2 Pause, Stop, Hide | Supports | The app has no autoplay, carousel, or continuously moving content. Reduced motion is available. |
| 2.3.1 Three Flashes or Below Threshold | Supports | No flashing, pulsing, or strobing content is used; alerts are static and optionally haptic. |
| 2.4.3 Focus Order | Partially Supports pending manual confirmation | Component order is logical; final screen-reader and keyboard traversal evidence is required. |
| 2.4.6 Headings and Labels | Supports | Screens, history sections, fields, and actions use descriptive labels and headings. |
| 2.4.7 Focus Visible | Partially Supports pending manual confirmation | Shared buttons and fields implement a three-pixel focus border and automated tests pass; verify native hardware-keyboard rendering. |
| 2.5.3 Label in Name | Supports | Visible form and action text is included in the accessible name. |
| 2.5.5 Target Size (Enhanced) | Supports for the course requirement | Shared interactive controls use at least 48 logical pixels; automated target tests pass. |
| 3.1.1 Language of Page | Supports through platform metadata | Application language is configured as English in the platform build. |
| 3.2.1 On Focus | Supports | Moving focus does not initiate navigation or change data. |
| 3.2.2 On Input | Supports | Settings and forms use explicit save or action controls for consequential changes. |
| 3.3.1 Error Identification | Supports | Authentication, health-log, and medication validation errors are displayed as text and exposed through status semantics. |
| 3.3.2 Labels or Instructions | Supports | Form controls have persistent visible labels and purpose-specific hints or supporting text where needed. |
| 3.3.3 Error Suggestion | Supports | Validation messages identify missing or invalid information and indicate how to correct it. |
| 3.3.4 Error Prevention | Supports for current scope | Logout and emergency demonstration actions use confirmation or clear non-calling feedback; the app performs no legal or financial transaction. |
| 4.1.2 Name, Role, Value | Supports | Automated tests and Android accessibility-tree inspection verify names, roles, states, and selected values for core controls. |
| 4.1.3 Status Messages | Supports | Save, validation, medication, and workflow feedback use live/status semantics without requiring focus movement. |

## Photosensitive-epilepsy safeguards

The application uses static alerts, provides reduced-motion preferences, does not autoplay media, does not flash or pulse content, and never uses animation as the only status cue. These safeguards directly support WCAG 2.2.2 and 2.3.1 and the CareConnect Safeview user requirements.

## Evidence to attach to the final VPAT package

- `FINAL_VERIFICATION.md`
- `MANUAL_ACCESSIBILITY_CHECKLIST.md` after human sign-off
- HTML coverage report
- Five reviewed Android screenshots
- TalkBack or VoiceOver evidence from the final build
- Existing Flutter evidence maintained by the Flutter owner
