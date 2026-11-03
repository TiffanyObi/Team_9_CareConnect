# Week 12 review status

Prepared November 3 2026 from main `518683b482999653dcf21358c6d892cb2323967b`. This is a review package, not a course submission or all-platform accessibility certification.

## Fresh checks

| Platform | Tests rerun | Line coverage | Status |
| --- | --- | --- | --- |
| Flutter | 54 tests attempted | 948/1129 = 83.97% | 44 passed; 10 golden-image comparisons failed |
| React Native | 50 tests; 1 snapshot | 195/197 = 98.98% | Passed |
| Electron | 31 Jest tests | 521/544 = 95.77% | Passed; full native integration not rerun |
| React web | 32 Jest tests | 2612/2908 = 89.82% | Passed; full browser suite not rerun |

[HTML reports and ledger](coverage/) are retained in this repository under docs to meet the original assignment storage requirement. App source was not changed. Generated binaries stay in SharePoint. HTML archives downloaded from the original final folder had older Flutter and web figures, so fresh outputs were generated instead of relabelling old files.

A fresh axe-core run scanned 12 live routes/states with zero confirmed violations and no page errors. Messages, logout, mobile dashboard and mobile menu include incomplete rules that require manual review; zero violations is not a full conformance finding. This is NOT the axe DevTools extension check.

Tiffany's eighteen-minute speaker notes were found in the SharePoint root. Corrections are listed separately; a final recorded team video remains unverified.

The live web index, manifest, primary JS assets and CSS returned HTTP 200; hashes are in the evidence package. This does not establish instructor access to SharePoint. Earlier manual results remain team-reported and were not newly performed.

Fresh Lighthouse Accessibility reruns scored 100 on Dashboard, New appointment, Settings and Messages. The saved reports are in the review evidence archive.

## Review items

- Resolve Flutter golden comparisons; do not approve baseline changes without inspecting them.
- Confirm web axe DevTools extension evidence; axe-core and Electron extension screenshots do not establish that separate check.
- Review corrected mobile VPAT coverage, AI disclosure, architecture and reproducible commands.
- Confirm final instructor feedback, other AI tool names, final team video, roles and runtime.
- Clarify original 15–20 versus 30–45 minute video instructions and 6+ platform top-band wording. The professor update confirms November 3 at 11:59 PM EST but does not explicitly cancel the original rubric.
- Confirm instructor access, team approval and course receipt. These remain pending.

No claim is made that 85% coverage is met on every platform, or that the educational local-data apps are production clinical software. This PR must not close the final audit or submission issues automatically.
