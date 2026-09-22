# Approved test plan to Week 6 evidence

Updated September 21, 2026 (ET). Repository reviewed: main `2cab927`.

## Approved source

Terence confirmed on September 21 that `Assignment3_CareConnect_Test_Plan.docx`, version 1.0, August 31, 2026, is the submitted and approved plan. Approval status here is based on his confirmation; no instructor approval record was independently reviewed.

Source: course output `CODEX_TEMPLATE2/assignment3_submission/Assignment3_CareConnect_Test_Plan.docx`.
SHA-256: `232f93a78349dcc7dd7862460ee7926f5db8dcebad9656ee86db9e604d647425`.

The [mapping CSV](TEST_PLAN_MAPPING.csv) contains all 26 unique case IDs and their original expected results: 11 HP, 3 SP, 6 ACC, 3 RES, and 3 CODE cases. Each row gives the related Week 6 evidence, its limits, and the next check. Repository evidence paths start at the repo root. SharePoint references name the external files and are not claimed as repository files.

## How to read the mapping

- **Changed workflow / visual or suite baseline:** newer tests exist, but the original screen, image, or suite expectation differs. A related pass does not silently replace the approved case.
- **Partial related evidence:** saved tests support part of the requirement. Complete the remaining expected result before marking the case Pass.
- **Partial manual evidence:** the reviewed report has some device evidence but has coverage or result conflicts.
- **No matching result:** no reviewed result establishes the original expectation.
- **Saved check passed:** a directly related historical check passed. This is not a final-build result or necessarily an E2E case.

These labels describe the mapping, not VPAT conformance levels. The final-build result is `Not established` for every row because no complete approved-case run for the merged build was supplied. This means evidence is missing, not that all cases failed.

## Coverage calculation

**Do not claim that the approved-plan 60% threshold is met yet.** The mapping is complete, but the case-level result set is not.

The original plan's summary says 19/20, while its detailed tables contain 26 cases. That summary describes an older prototype and is not the Week 6 denominator. Preserve all 26 IDs until the team/instructor approves any scope changes or E2E subset. If all 26 are the agreed denominator, at least 16 distinct cases must have qualifying passes to meet 60% (16/26 = 61.54%). If a different subset is approved, record the decision and compute against that set. Do not silently drop blocked or changed cases.

Count each approved case once. A case passes only when the required steps and expected result are covered for the agreed app/platform scope, with an identifiable build and evidence. Partial tests, source-only checks and a flow that touches a screen are not full-case E2E passes. Keep Flutter and RN results separate before deciding any combined claim.

The saved RN XML proves 5 successful flows out of 5 in that run. It does not prove 5 approved-plan cases. Likewise, 48 Flutter tests, 35 RN tests, 84.47% Flutter line coverage and 100% RN line coverage measure different things.

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

## Finish the case results

1. Resolve the Flutter duplicate dependency and old emergency assertion noted in the combined guide.
2. Confirm how each changed prototype case applies to the current apps. Preserve the original ID and record any approved change beside it.
3. Run the relevant cases on a named final build. For each app/platform save device/OS, reader settings when relevant, exact steps, expected/actual result, tester/date and artifact filename.
4. Record Pass, Fail, Blocked or Not Run in a per-app execution ledger. Link the exact test/result entry and screenshot or recording. Review partial evidence before promoting a case to Pass.
5. Calculate the approved-case fraction only after the denominator and qualifying passes are established. Keep line coverage, test-run success and manual conformance as separate measures.

No app tests were run to create this mapping. The original source plan and September 20 logs are unchanged.
