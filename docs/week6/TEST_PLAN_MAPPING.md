# Approved test plan to Week 6 evidence

Updated September 22, 2026 (ET). Current execution branch: `feature/week6-final-testing-evidence`.

The original-to-current mapping remains below. The [final execution ledger](FINAL_TEST_PLAN_EXECUTION.md) records the approved 73.08% current-equivalent result and retains the strict 38.46% unchanged-wording comparison for transparency.

## Submitted source

The team-provided `CareConnect_Test_Plan.docx`, version 1.0, dated August 31, 2026, was reviewed on September 21. It contains the same 26 detailed case IDs used by this mapping: 11 HP, 3 SP, 6 ACC, 3 RES, and 3 CODE cases. Its source-file SHA-256 is `66e22b0392ef6f9714f64de76fb65cebf8bb9a6b5f3d542bb0c1cccf4ce141ee`.

The document's summary reports 19/20, but its detailed tables contain 26 IDs. This ledger preserves all 26 detailed IDs rather than silently adopting the inconsistent summary denominator. Team 9's test-plan owners approved the nine counted current-app replacements on September 22, 2026.

The [mapping CSV](TEST_PLAN_MAPPING.csv) contains all 26 unique case IDs and their original expected results: 11 HP, 3 SP, 6 ACC, 3 RES, and 3 CODE cases. Each row gives the related Week 6 evidence, its limits, and the next check. Repository evidence paths start at the repo root. SharePoint references name the external files and are not claimed as repository files.

## How to read the mapping

- **Changed workflow / visual or suite baseline:** newer tests exist, but the original screen, image, or suite expectation differs. A related pass does not silently replace the approved case.
- **Partial related evidence:** saved tests support part of the requirement. Complete the remaining expected result before marking the case Pass.
- **Partial manual evidence:** the reviewed report has some device evidence but has coverage or result conflicts.
- **No matching result:** no reviewed result establishes the original expectation.
- **Saved check passed:** a directly related historical check passed. This is not a final-build result or necessarily an E2E case.

These labels describe the historical mapping, not VPAT conformance levels. Current dispositions are maintained in the final execution ledger rather than overwriting the original mapping CSV.

## Coverage calculation

**The approved-plan execution result is 19 of 26 passes, or 73.08%.** Team 9 approved the nine counted revised expectations on September 22, 2026. The strict unchanged-wording comparison is 10 of 26, or 38.46%, and remains documented only for traceability.

The original plan's summary says 19/20, while its detailed tables contain 26 cases. All 26 detailed IDs remain the denominator. At least 16 distinct cases are required to exceed 60% (16/26 = 61.54%); the approved result contains 19 qualifying passes. No blocked, changed, or out-of-scope case was silently dropped.

Count each approved case once. A case passes only when the required steps and expected result are covered for the agreed app/platform scope, with an identifiable build and evidence. Partial tests, source-only checks and a flow that touches a screen are not full-case E2E passes. Keep Flutter and RN results separate before deciding any combined claim.

The saved RN XML proves 5 successful flows out of 5 in that historical run. It does not prove 5 approved-plan cases. The current branch separately passes 54 Flutter tests with 84.68% line coverage and 48 React Native tests with 99.47% line coverage. Those remain different measurements from approved-case completion.

## Saved E2E result index

All five records below are in `docs/week6/evidence/rn-maestro-verified.xml`, September 20, iPhone 17 / iOS 26.5, tested source associated with `ae51f39`. They passed before the final merge. Screenshots are in `docs/week6/evidence/screenshots/` with matching flow filenames.

| Flow | Saved result | Possible approved-case link | Limit |
| --- | --- | --- | --- |
| 01 sign-in and medication | Pass | HP-006 | Current sign-in differs from the original direct account-entry action |
| 02 settings and logout | Pass | HP-005; ACC-005 | New settings route; large app text does not cover every original expectation |
| 03 care and emergency | Pass | No exact case | Useful Week 6 flow; not one of the original explicit cases |
| 04 health log | Pass | No exact case | Does not substitute for SP-001 appointment validation |
| 05 messages | Pass | No exact case | Does not establish HP-007/SP-002 media warning/transcript behavior |

Flutter's four native integration results are in `docs/week6/evidence/integration-ios-integration.txt`. The sign-in and settings cases provide related HP-006/HP-005/ACC-005 evidence. Native account-isolation and migration cases are additional regression coverage, not replacement approved-case IDs.

Tiffany's tests and historical report remain described in the [combined guide](INTEGRATION_E2E_TESTING.md). Her SharePoint results were reviewed separately; they do not contain a source commit or approved-plan IDs and are not added to this numerator by inference.

Zack's shared report supplies limited Flutter iOS focus evidence for ACC-006. His tracker and detailed notes conflict for several screens. Missing RN/device/Android scope must remain open. Do not duplicate completed screen checks without a scope or build reason.

## Approval and remaining evidence

1. Team 9's test-plan owners approved the nine counted replacements on September 22, 2026.
2. After the branch is committed, associate final logs with that commit SHA.
3. Complete the remaining VoiceOver, TalkBack, and native checks without converting partial evidence into passes.
4. Keep line coverage, test-run success, Maestro flow success, manual accessibility evidence, and approved-case completion as separate measurements.

The original mapping CSV and September 20 logs remain unchanged for traceability. Current execution results are recorded in the final execution ledger.
