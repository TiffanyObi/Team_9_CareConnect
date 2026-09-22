# Approved test-plan and E2E result summary

Finalized September 22, 2026.

## Approved test-plan execution

Team 9's test-plan owners approved the nine current-application equivalent expectations recorded in `REVISED_TEST_PLAN_2026-09-21.csv`.

| Result category | Cases | Count |
| --- | --- | ---: |
| Pass — original expectation | SP-001, SP-003, ACC-002, ACC-004, ACC-005, RES-001, RES-002, CODE-001, CODE-002, CODE-003 | 10 |
| Pass — approved current equivalent | HP-001, HP-002, HP-003, HP-005, HP-006, HP-009, HP-010, HP-011, ACC-001 | 9 |
| Partial, not met, or outside current scope | HP-004, HP-007, HP-008, SP-002, ACC-003, ACC-006, RES-003 | 7 |
| **Approved passing total** | **19 of 26** | **73.08%** |

The denominator includes every detailed ID in the submitted plan. No blocked, partial, changed, or out-of-scope case was removed from the denominator. The approved result exceeds the assignment's 60% threshold.

## Installed-app E2E results

| Application | Platform/device | Result | Evidence |
| --- | --- | ---: | --- |
| Flutter | Pixel 10 Android emulator, Android 17 / API 37, September 22 | **3/3 passed; 0 failures** | `flutter-maestro-final.xml` and `flutter-maestro-final.txt` |
| React Native | iPhone 17 iOS simulator, iOS 26.5, September 20 | **5/5 passed; 0 failures** | `rn-maestro-verified.xml`, `rn-maestro-verified.txt`, and `screenshots/` |

These are separate measurements: 73.08% is approved-plan case completion, while 3/3 and 5/5 are Maestro flow results. Code coverage is reported separately.
