# React Native evidence for the combined Mobile VPAT

This document records the finalized React Native evidence used in the combined Flutter and React Native Mobile VPAT. Automated evidence and the final human accessibility review were complete as of November 3, 2026. All required manual screen-reader, keyboard, focus, display, orientation, target-size, reduced-motion, native-control, and platform-behavior checks passed on the reviewed build. This file does not claim results for Flutter; Flutter evidence is evaluated separately in the combined report.

| WCAG 2.1 criterion | Suggested React Native status | Evidence and qualification |
| --- | --- | --- |
| 1.1.1 Non-text Content | Supports | Interactive icons and controls use meaningful accessibility labels; automated role/name tests and final TalkBack and VoiceOver spoken-label checks passed. |
| 1.3.1 Info and Relationships | Supports | Persistent form labels, headings, roles, states, and semantic grouping are implemented and tested. |
| 1.3.2 Meaningful Sequence | Supports | Final TalkBack, VoiceOver, and keyboard traversal confirmed a logical reading and focus sequence matching the visual task order. |
| 1.3.3 Sensory Characteristics | Supports | Instructions and actions do not rely only on position, shape, sound, or color. |
| 1.4.1 Use of Color | Supports | Selected, error, and logged states include text, icon, role, or state information in addition to color. |
| 1.4.3 Contrast (Minimum) | Supports | Automated contrast tests cover rendered text and control states in light and dark themes. |
| 1.4.4 Resize Text | Supports | Final native inspection confirmed that the application remains readable and usable at 200% text scaling without losing essential content or controls. |
| 1.4.10 Reflow | Supports | Final 200% text, portrait, landscape, phone, and tablet checks confirmed readable, scrollable task flows without two-dimensional scrolling. |
| 1.4.11 Non-text Contrast | Supports | Automated checks cover field boundaries, selected tabs, pressed states, and focus styling. |
| 1.4.13 Content on Hover or Focus | Supports | Core mobile workflows do not depend on hover-only or focus-triggered popup content. |
| 2.1.1 Keyboard | Supports | Final external-keyboard review passed forward and reverse traversal and Enter, Space, Escape, and native Back activation across core workflows. |
| 2.1.2 No Keyboard Trap | Supports | No keyboard trap was found; dialogs contain focus and return it to the invoking control after dismissal. |
| 2.2.1 Timing Adjustable | Supports | No user task has an enforced time limit. |
| 2.2.2 Pause, Stop, Hide | Supports | The app has no autoplay, carousel, or continuously moving content. Reduced motion is available. |
| 2.3.1 Three Flashes or Below Threshold | Supports | No flashing, pulsing, or strobing content is used; alerts are static and optionally haptic. |
| 2.4.3 Focus Order | Supports | Final screen-reader and external-keyboard testing confirmed logical focus order, modal containment, and focus restoration. |
| 2.4.6 Headings and Labels | Supports | Screens, history sections, fields, and actions use descriptive labels and headings. |
| 2.4.7 Focus Visible | Supports | Shared buttons and fields implement a three-pixel focus border; automated checks and final native hardware-keyboard inspection confirmed visible focus in light and dark themes. |
| 2.5.3 Label in Name | Supports | Visible form and action text is included in the accessible name. |
| 2.5.5 Target Size (Enhanced) | Supports for the course requirement | Shared interactive controls use at least 48 logical pixels; automated target tests pass. |
| 3.1.1 Language of Page | Supports through platform metadata | Application language is configured as English in the platform build. |
| 3.2.1 On Focus | Supports | Moving focus does not initiate navigation or change data. |
| 3.2.2 On Input | Supports | Settings and forms use explicit save or action controls for consequential changes. |
| 3.3.1 Error Identification | Supports | Authentication, health-log, and medication validation errors are displayed as text and exposed through status semantics. |
| 3.3.2 Labels or Instructions | Supports | Form controls have persistent visible labels and purpose-specific hints or supporting text where needed. |
| 3.3.3 Error Suggestion | Supports | Validation messages identify missing or invalid information and indicate how to correct it. |
| 3.3.4 Error Prevention | Partially Supports | Confirmation and validation protect major actions, but every stored medication or health-history record does not yet provide a complete review, edit, or reversal path. This product limitation is separate from the passing manual accessibility checks. |
| 4.1.2 Name, Role, Value | Supports | Automated tests and Android accessibility-tree inspection verify names, roles, states, and selected values for core controls. |
| 4.1.3 Status Messages | Supports | Save, validation, medication, and workflow feedback use live/status semantics without requiring focus movement. |

## Photosensitive-epilepsy safeguards

The application uses static alerts, provides reduced-motion preferences, does not autoplay media, does not flash or pulse content, and never uses animation as the only status cue. These safeguards directly support WCAG 2.2.2 and 2.3.1 and the CareConnect Safeview user requirements.

## Final manual confirmation

Team 9 confirmed on November 3, 2026 that the reviewed React Native build passed the required manual checks for TalkBack and VoiceOver announcements, logical reading order, external-keyboard traversal, visible focus, dialog containment and restoration, 200% text scaling and reflow, portrait and landscape orientation, target usability, high-contrast presentation, reduced motion, native switches, native Back behavior, system dialogs, and iOS and Android accessibility behavior. The application uses no flashing, pulsing, autoplay, or animation-only status cue.

## Evidence included in the final VPAT package

- `FINAL_VERIFICATION.md`
- `MANUAL_ACCESSIBILITY_CHECKLIST.md` and the November 3, 2026 team manual sign-off
- HTML coverage report
- Five reviewed Android screenshots
- TalkBack and VoiceOver evidence from the final reviewed builds
- Existing Flutter evidence maintained by the Flutter owner
- `../Team_9_Mobile_VPAT_WCAG_2_1_AA_Final_2026-11-03.docx`
