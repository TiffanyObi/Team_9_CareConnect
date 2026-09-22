# Terence's Week 6 testing handoff

> Historical record from September 20. PRs #15 and #16 are now merged. Use [the combined guide](INTEGRATION_E2E_TESTING.md) and [plan mapping](TEST_PLAN_MAPPING.md) for September 21 status. The results and dated open items below are preserved as run history.

September 20, 2026 (Eastern Time).

Branch: `feature/terence-week6-testing`. Based on Tiffany's `feature/integration-e2e-testing` at `9ee78072d61450758beb74a2613dbc496278ceff`. Main was `88ec2a7e6887225bbc3c6c4cf97b61f3b45b3c3d` when work began. No merge into main is part of this work.

## Changes

- Flutter medication and health logs now use the signed-in account ID. Switching accounts clears visible logs and rejects late results from the old account. Signed-out controllers cannot save.
- Flutter database version 3 adds log ownership. Old rows stay in storage with an unknown owner and are hidden from all accounts. They are not deleted or assigned to the next person who signs in. Any recovery needs a trusted owner mapping.
- Flutter dose and health-log screens wait for storage before showing success. A failed write keeps the entry available for retry.
- React Native previews settings, then saves on the Save action. Success appears only after the write succeeds; a failed write shows an error and allows retry.
- Reduced motion now disables React Native native-stack transitions. Light and dark action text have explicit contrast colors. Input fields and custom text sizes follow the app's text-size choice.
- Flutter theme choices wrap at 200%, and the private-note label stays short with a separate “Optional” hint. The saved-settings card has a dark foreground in either theme.
- Both apps now state that the emergency demo places no call, shares no location, and records no response. No real call feature was added.
- Added account isolation, late-result, failed-save, motion, and contrast regression tests. The three React Native TODOs are replaced by real checks.
- Added Flutter device integration tests and the missing E2E setup guide. Retained Tiffany's E2E commit and added health-log/message flows.

## Golden and snapshot review

The original Flutter suite had nine golden failures: 8–55 pixels each. Before changing the references, all nine old/current pairs were reviewed side by side. No visible layout difference was found in that first comparison. The exact cause of that small render drift is not proven. The old comparisons are retained in the local evidence package; `evidence/golden-review-before.png` shows the reviewed pairs.

References were refreshed for the current renderer and the new emergency copy. The new emergency image was also opened and checked. The comparator still requires an exact match: no tolerance, skipped cases, or changed pass threshold was added. A fresh normal run (without `--update-goldens`) passed all ten images.

The React Native snapshot adds the final font-size and line-height style used to apply custom text scaling. That four-line snapshot change was reviewed. A fresh strict run passed.

## Fresh results

| Check | Result |
|---|---|
| Flutter format / analyzer | Passed |
| Flutter unit, widget, access, responsive, and golden suite | 48 passed |
| Flutter native iPhone integration | 4 passed |
| Flutter line coverage | 941 / 1,114 = 84.47% |
| React Native typecheck / lint | Passed |
| React Native Jest | 6 suites; 35 passed; 0 TODO; 1 snapshot passed |
| React Native line coverage | 182 / 182 = 100% |
| React Native statement / function / branch coverage | 96.03% / 96.66% / 90.96% |
| React Native native iOS Release build | Passed |
| React Native Maestro on iPhone, dark theme and 200% app text | 5 / 5 passed in 3m 20s |
| Flutter ARM64 debug APK build | Passed; saved with local evidence |

The complete final Maestro run passed all five cases together. Its JUnit report, console log, and five screenshots are in `evidence/`. The E2E count is for these five flows; it is not a claim about the missing approved test plan.

The test device was iPhone 17, iOS 26.5, with Xcode 27.0. The earlier live tests applied to main; they are not evidence that every fix in this branch passed a manual screen-reader review. See the saved run logs for commands and times.

## Team items still open

1. Tiffany's VPAT file and her device/screen-reader evidence have not yet been received in this branch. Review them against the final app commit before using compliance claims.
2. Android live flows, VoiceOver and TalkBack speech, focus, keyboard checks, and the two required screen-reader videos remain unverified here. Simulator touch tests do not close that gap.
3. Match the E2E results to the team's previously approved plan before claiming the rubric's 60% E2E target. No approved plan was available during this run.
4. A fresh Flutter ARM64 debug APK was built from this branch. It must be kept with the final submission. The 10–15 minute build/test/document-review video is still needed. No narrated or screen-reader video was made in this work.
5. Appointment creation, message sending, and caregiver alerts remain disabled prototype features. Flutter preferences remain device-wide. Do not list these as fully implemented or claim full WCAG conformance.

Earlier Maestro attempts are retained in the local evidence package. They found test-flow issues at 200%: a heading was tapped instead of its button, targets fell behind the tab bar, iOS needed its native Back button, and a final heading needed scrolling back into view. The flow fixes preserve the assertions and use centered scrolling. No app assertion was disabled to pass those checks.

Use [INTEGRATION_E2E_TESTING.md](INTEGRATION_E2E_TESTING.md) to repeat the checks. Use the evidence in this folder to update the written test report. Leave untested VPAT criteria marked as untested.
