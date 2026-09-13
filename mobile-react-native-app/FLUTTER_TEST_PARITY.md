# Flutter test alignment

Reviewed all eight test files in mobile-flutter-app/test at main 5d28831.
The design-samples Flutter app is not the application baseline.
Flutter Dart tests do not execute in Jest. Matching behavior is tested using
React Native APIs and the current React Native app. Source files remain unchanged.

## Results on September 13, 2026

- React Native: 30 tests and one snapshot passed; three TODO tests remain.
  Typecheck and lint passed. Statement coverage 95.93%, branch coverage 89.34%.
- Flutter: `flutter test` completed with 36 passes and nine failures, all in
  visual_evidence_test.dart. The medication-list image passed; Today, Settings,
  medication detail, appointments, appointment detail, messages, message detail,
  health log, and emergency screenshot comparisons failed. No golden files were
  replaced. Generated image comparisons were saved in the task outputs folder.
- A matching test goal does not prove full screen or feature parity.

## Source checklist

| Flutter test file | React Native coverage | Remaining difference or check |
| --- | --- | --- |
| medication_test.dart | flutter-parity.test.tsx checks the two fictional medications and expected first record | Complete for this data assertion |
| domain_and_state_test.dart | flutter-parity.test.tsx checks required medication/message fields; screens and repositories tests check settings load, changes, save calls and reset | No CareRecipient repository or runtime isValid model API exists in React Native. Preview-only settings semantics differ; save success handling remains a TODO |
| provider_repository_test.dart | flutter-parity.test.tsx checks signup, onboarding, logout, re-login, wrong-password rejection, newest medication logs, and health logs after provider recreation | Uses memory test repositories; real-device storage still needs a check |
| auth_screen_test.dart | screens.test.tsx checks signup fields, errors and onboarding; navigation tests check valid sign-in; flutter-parity checks re-login | React Native has no confirm-password field or matching Privacy section. Large-text reflow remains a device check |
| widget_test.dart | screens tests check detail contents, settings, logout confirmation, care/message routes, log saves and disabled forms; navigation tests check labeled tabs and dose logging followed by Back | Empty medication-list recovery is missing. Full appointment-to-log-to-Back-to-message journey and logout Cancel still need integrated checks. Flutter's emergency test accepts a misleading call message; this is kept as an app defect, not a passed safety check |
| responsive_accessibility_test.dart | Settings tests cover text-size bounds only | The eight-screen matrix at 100% and 200%, phone/tablet portrait/landscape, needs native layout checks. Jest does not lay out native views |
| accessibility_guidelines_test.dart | Shared UI snapshot and role/label queries provide partial checks | Real contrast, touch size, screen-reader grouping and focus must be checked on devices; no equivalent guideline pass is claimed |
| visual_evidence_test.dart | Shared UI tree snapshot only | No matching ten-screen React Native image comparison suite. A Jest tree snapshot is not a rendered image comparison |

## Device checklist still to run

Use the Flutter scenarios for Today, Medications, Medication detail, Care,
Appointment detail, Health log, Messages, and Message detail. Use 100% and 200%
text at 412x915, 915x412, 800x1280, and 1280x800 logical sizes where supported.
Verify no clipped content, scroll to the last item, and check Back retains state.
Check labeled controls, actual touch areas, contrast, and screen-reader focus.
Capture the same ten screens as visual_evidence_test.dart with stable sample
data and dates. Review and approve new platform-specific baselines before
using them for regression checks. These checks have not yet been run.
