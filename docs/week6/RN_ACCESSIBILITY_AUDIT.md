# React Native accessibility audit — items 6, 7, and 8

September 21, 2026 (ET). Owner: Terence Boyce.

Scope: the React Native props audit, semantic tests, and rendered color checks from the team checklist. These are branch results based on main `b7f10cc966b9152c519d7891526a867556c6239f`. They are not final-main device results or a full conformance report.

## Result

- Props audit and fixes: complete for the app-owned controls listed below. Native reader behavior remains to be checked.
- Semantic tests: complete for names, roles, states, form labels, alert requests, save announcements, dialog background hiding, and tab controls.
- Contrast: 446 rendered-style observations across both themes, including 16 inactive-control observations marked exempt. All 430 non-exempt observations pass their thresholds. The lowest ratio is 4.548:1. Native focus indicators, switch graphics, alert windows, and Back controls still need device checks.
- Full React Native suite: **48 tests passed in 9 suites**, one snapshot passed, no failed tests. TypeScript and ESLint passed. See the saved logs and coverage summary for exact results.

## Control audit

| Screen/control | Name and role | State, hints, and result |
| --- | --- | --- |
| Shared buttons | Explicit button role and accessible name; visible label stays in the name | Disabled and selected states exposed. Enabled press feedback keeps text fully opaque. |
| Sign in / sign up | Email, Password, Full name, and Create password labels; native editable-field semantics; password field stays secure | Busy submit buttons are disabled. Validation and sign-in errors use native alerts. Help and account-mode buttons have clear names. |
| Accessibility setup / Settings | Theme and text-size buttons; four named switches | Selected theme, disabled text-size bounds, and switch checked values are exposed. Switch descriptions are hints. Save success is announced only after persistence succeeds. Failed saves keep the native error alert. |
| Today | Log out and Log medication buttons | Names match visible labels. Log out confirmation uses a native alert with Cancel and Log out actions. |
| Medication list / detail | Each repeated action says “View details for [medication]” | Saving disables Mark as taken. Dose status uses a polite Android live region and an iOS announcement when the status text changes. Failure remains a native alert. |
| Care / appointment detail | Each repeated action says “View appointment: [title]”; other buttons have clear names | Add appointment hints that saving is unavailable. Detail routes expose Check in and Message caregiver actions. |
| Appointment dialog | Named fields, heading, Save appointment, and Cancel | Save stays disabled because this is a draft form. Background descendants are hidden. Native modal opens without animation. Focus is requested for the heading and restored to the trigger after close. Cancel, native Back, and accessibility escape share close handling. Native containment and focus timing remain unverified. |
| Health log | Symptom and Private notes labels; named Save button | Missing input, success, and failure use native alerts. Saving disables the button. |
| Messages / detail | Each repeated action names its subject and sender | New message hints that sending is unavailable. Message detail is read-only. |
| Message dialog | Message caregiver field, heading, Send, and Cancel | Same modal handling as appointment dialog. Send stays disabled. Input supports app text scaling. |
| Emergency | Call emergency services and Alert caregiver | Call hint states that this demo shows an alert and places no call. Alert caregiver stays disabled. |
| Tab bar | Five named navigation controls supplied by React Navigation | RNTL confirms button roles and selected-state change when moving to Medications. Decorative icon text is not separately accessible. |
| Native stack Back and system alerts | Supplied by the native platform/navigation stack | Existing navigation test verifies return behavior. Native names, speech, target size, focus, and contrast still require device checks. |

There are no expandable controls in this scope, so no `expanded` state is claimed. Static containers are not made into single accessible groups, which would hide their child controls. Hints are used where they add useful detail.

## Changes

- Added specific names for repeated medication, appointment, and message actions.
- Added switch state and hints; added save and dose-status announcements.
- Added one shared modal wrapper, hidden background content, heading focus requests, close handling, and return-focus requests.
- Used theme colors for the two CareConnect wordmarks. Increased border and placeholder contrast. Kept enabled button text opaque while pressed.
- Added semantic and rendered-style tests; extended navigation assertions and refreshed the reviewed shared-component snapshot.

Android uses `accessibilityLiveRegion`; iOS uses `announceForAccessibility`. The tests verify the app's announcement request and alert content, not what a reader actually says. Native modal focus uses `sendAccessibilityEvent` as described in the [React Native AccessibilityInfo API](https://reactnative.dev/docs/accessibilityinfo). Platform behavior for modal/background props is described in the [React Native accessibility guide](https://reactnative.dev/docs/accessibility).

## Contrast evidence and limits

[Contrast summary](RN_CONTRAST_RESULTS.md) groups the measured combinations. [Raw rows](evidence/rn-accessibility-2026-09-21/rendered-contrast.json) name each screen, theme, text, color pair, threshold, and exemption.

The test resolves styles from RNTL host nodes and their ancestor backgrounds. It checks sign-in, sign-up, Today, lists and details, both dialogs, health log, emergency, Settings, onboarding, saved confirmation, shared button states, and selected/inactive tab icons. It excludes hidden content and zero-opacity duplicate icons. Enabled opacity changes fail the test instead of being ignored. Pressed-button rows use the rendered component's pressed-style callback.

Text uses the stricter 4.5:1 normal-text threshold, even for headings. Input borders use 3:1 against the input fill. Inactive controls are listed but exempt; their raw color ratios do not include disabled opacity and are not pass claims. Decorative card borders are not treated as required control boundaries. The selected-tab icon fill is checked. This is resolved-style evidence, not native screenshot pixel sampling.

**Still open:** native switch thumb/track, system alert/error colors, native Back controls, and actual visible keyboard focus indicators. The unused `focus` color token is not proof of a visible focus indicator. PR #18 (`feature/keyboard-guidelines-touch-targets`) merged while this audit was in progress. This branch was rebased onto main `b7f10cc`; all target-size constants, focusable controls, switch sizing, tab sizing, and incoming tests were retained. The full React Native checks were rerun after resolving the shared-file conflicts. Rerun device checks on the final submission commit.

VoiceOver/TalkBack speech, dialog containment, focus restoration, keyboard order, zoom/reflow, and touch targets are not certified by this suite. Use a final build on each target platform to check those items. Keep the VPAT partial until the remaining evidence is recorded.

## Reproduce

From `mobile-react-native-app` after installing the locked dependencies:

```sh
npm ci
npm run typecheck
npm run lint
CONTRAST_REPORT="$PWD/../docs/week6/evidence/rn-accessibility-2026-09-21/rendered-contrast.json" npm run test:coverage -- --json --outputFile="$PWD/../docs/week6/evidence/rn-accessibility-2026-09-21/jest-results.json"
```

The [checks manifest](evidence/rn-accessibility-2026-09-21/checks.json) records the base commit, run time, and exit codes. The [source manifest](evidence/rn-accessibility-2026-09-21/source-sha256.json) identifies the tested source and configuration. The checks manifest names the tested source commit. The later evidence-only commit does not change app or test source. These results must not be relabeled as a main-branch run.
