# Final approved-plan execution ledger

Updated September 22, 2026. Branch: `feature/week6-final-testing-evidence`.

## Result

The original approved plan contains 26 unique case IDs. Many of its navigation labels, screen names, and golden filenames describe the earlier Week 3 prototype rather than the current care-recipient applications.

- **Approved current-equivalent result:** 19 of 26 established passes, or **73.08%**. This exceeds 60%.
- **Historical unchanged-wording comparison:** 10 of 26 established passes, or **38.46%**. This is retained only to show how the Week 3 prototype wording differed from the implemented product.
- If all 26 remain the denominator, 16 passes are required to exceed 60%.

On September 22, 2026, Team 9's test-plan owners approved the nine counted current-app replacements for HP-001, HP-002, HP-003, HP-005, HP-006, HP-009, HP-010, HP-011, and ACC-001. The approval applies to the team-maintained test-plan scope; it is not represented as separate instructor approval. The result does not hide removed features: media-gate cases, obsolete Week 3 golden filenames, full manual screen-reader order, and the former multi-column expectation remain excluded or partial as shown below.

## Current verification

| Check | Result | Scope |
| --- | --- | --- |
| Flutter analyzer | Pass, no issues | Current branch source |
| Flutter unit, widget, accessibility, responsive, and golden suite | 54 of 54 passed | Current branch source; normal run after reviewed golden refresh |
| Flutter line coverage | 945 of 1,116 lines, 84.68% | Full passing Flutter suite and generated LCOV report |
| Flutter Android Maestro | 3 of 3 passed in 1 minute 28 seconds | Pixel 10, Android 17 API 37, rebuilt current Flutter app |
| React Native typecheck and lint | Pass | Main-derived source |
| React Native Jest | 48 of 48 passed in 9 suites | Main-derived source |
| React Native line coverage | 190 of 191 lines, 99.47% | Main-derived source |
| React Native branch coverage | 172 of 193 branches, 89.11% | Main-derived source |

The attempted fresh React Native Android native build did not complete on this host because Gradle CMake configuration failed for Expo Modules Core and React Native Screens. The generated native directory and automatic package-script changes were removed. Previously saved Android and iOS Maestro results remain historical evidence and are not relabeled as a final-branch native run.

## Case ledger

`Pass equivalent` means the current application provides and verifies the same user purpose with approved changed labels or screens. `Pass exact` and `Pass equivalent` count in the 73.08% result. `Partial`, `Not met`, and `Out of current scope` do not count.

| ID | Final status | Current evidence and disposition |
| --- | --- | --- |
| HP-001 | Pass equivalent | Current Sign in entry screen is verified and workspace tabs are hidden before authentication; the obsolete Welcome heading is not present. |
| HP-002 | Pass equivalent | Create a new account is visible, keyboard reachable, and exercised; the obsolete Get started label is not present. |
| HP-003 | Pass equivalent | Five current destinations are verified: Today, Medications, Care, Messages, and Settings. |
| HP-004 | Not met | Calm action-first home is not current product copy. Do not count without an approved replacement. |
| HP-005 | Pass equivalent | Accessibility Settings exposes Visual preferences, Safety and motion, Alerts and touch, and saved-state behavior. |
| HP-006 | Pass equivalent | Successful sign-in opens Today, the current Home equivalent. |
| HP-007 | Out of current scope | The current care-recipient app has no message-media playback gate. |
| HP-008 | Not met | The obsolete `00-first-time-landing.png` reference is not part of the current ten-screen golden set. |
| HP-009 | Pass equivalent | The current Today dashboard golden passes exact comparison after visual review. |
| HP-010 | Pass equivalent | The current appointments golden passes exact comparison after visual review. |
| HP-011 | Pass equivalent | All ten current golden references pass exact comparison in a normal test run. |
| SP-001 | Pass exact | Save appointment and Send remain disabled while their prototype operations are unavailable. |
| SP-002 | Out of current scope | No media playback feature or media gate is present. |
| SP-003 | Pass exact | Authentication and persistence failures show recovery feedback; automated failure tests pass. |
| ACC-001 | Pass equivalent | Current Flutter guideline tests and React Native rendered-style checks meet applicable contrast thresholds; the original numeric color pairs changed. |
| ACC-002 | Pass exact | Flutter buttons use at least 48 by 52 logical pixels; React Native controls meet their separate 44-point requirement. |
| ACC-003 | Partial | Reduced-motion support exists, but a complete cross-platform native transition record is not saved. |
| ACC-004 | Pass exact | Reduced motion is persisted, applied to Flutter media settings and React Native stack transitions, and covered by automated tests. |
| ACC-005 | Pass exact | Flutter responsive tests verify 100% and 200% text on phone and tablet portrait and landscape; React Native text components cap at 200%. Native RN reflow remains a manual follow-up. |
| ACC-006 | Partial | Flutter automated reading-order and modal traversal checks pass, and partial VoiceOver evidence exists. Complete product-wide VoiceOver and TalkBack order is still required. |
| RES-001 | Pass exact | Flutter responsive suites complete without clipping or overflow across tested sizes and orientations. |
| RES-002 | Pass exact | Tested Flutter layouts reflow at 200% while controls remain reachable; React Native responsive containers and scrolling are covered by component tests. |
| RES-003 | Not met | The current product uses bounded single-column mobile layouts; no approved replacement for the former multi-column requirement exists. |
| CODE-001 | Pass exact | Flutter analyzer, React Native TypeScript, and ESLint pass. |
| CODE-002 | Pass exact | Flutter passes 54 tests and React Native passes 48 tests with no failures or skipped tests. |
| CODE-003 | Pass exact | All ten current Flutter golden files pass rendered comparison. |

## Approval record

Team 9's test-plan owners approved the revised expectations for HP-001, HP-002, HP-003, HP-005, HP-006, HP-009, HP-010, HP-011, and ACC-001 on September 22, 2026. The original expectation, approved replacement, rationale, result, and evidence for each case are recorded in `REVISED_TEST_PLAN_2026-09-21.csv`.

Report the approved-plan execution result as **19/26 (73.08%)**. Continue to report code coverage, Maestro flow success, manual accessibility evidence, and approved-case completion as separate measurements.
