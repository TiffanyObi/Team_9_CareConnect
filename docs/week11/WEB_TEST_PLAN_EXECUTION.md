# Week 11 Web Test Plan Execution Map

The submitted Week 10 CareConnect Web Test Plan contains 25 cases. This map retains every case and distinguishes exact passes, related or partial evidence, and work that still requires a manual run. Automated test success and code coverage are separate measurements from test-plan completion.

## Execution summary

| Status | Count | Cases |
| --- | ---: | --- |
| Passed | 15 | H01, H02, H03, H04, H05, H06, H07, H08, H09, R01, S01, S02, S03, S06, P04 |
| Partial | 7 | S04, S05, A01, A02, P01, P02, P03 |
| Not run or superseded | 3 | R02, A03, A04 |

The exact-pass rate is **15 of 25, or 60%**. Counting partial evidence as a pass would overstate the approved-plan result. The result meets the submission threshold while retaining all partial, manual, and superseded cases in the denominator.

## Case mapping

| Case | Status | Evidence and remaining work |
| --- | --- | --- |
| H01 Dashboard | Passed | Account and medication E2E flows reach the personalized dashboard and verify dashboard dose totals. |
| H02 Appointments | Passed | Appointment E2E flow verifies upcoming appointments and opens a selected visit. |
| H03 Visit details | Passed | Appointment E2E flow opens details, uses related actions, and returns through the workflow. |
| H04 New appointment | Passed | Required-field rejection, valid creation, confirmation, and persistence are automated. |
| H05 Search visits | Passed | Search and clear behavior are covered in the appointment flow and interaction tests. |
| H06 Visit actions | Passed | Edit, check-in, and copy-details actions are exercised without duplicate saves. |
| H07 Settings | Passed | Care/settings E2E changes text and contrast preferences and verifies the saved state. |
| H08 Help and shortcuts | Passed | Playwright opens Help with F1, verifies shortcut content, returns to Appointments, and preserves the prior task. |
| H09 Confirmation | Passed | Appointment confirmation and next-action behavior are covered. |
| R01 Build and open | Passed | Production Vite build completed successfully and the local test server was reachable for Playwright. |
| R02 Welcome screen | Superseded | The early one-screen starter no longer represents the implemented app. Retain the case for traceability; do not count it as a pass without team approval of a replacement expectation. |
| S01 Required field | Passed | Appointment E2E verifies blocked submission and required-field feedback. |
| S02 Invalid date | Passed | Playwright submits a past date, verifies the future-date error, and confirms the form remains unsaved. |
| S03 No search match | Passed | Playwright verifies the no-results explanation, Clear filters recovery, and restored empty search field. |
| S04 Cancel change | Partial | Dialog cancel/focus behavior has related interaction coverage; record the approved visit-action Cancel and Escape sequence as a complete manual run. |
| S05 Network failure | Partial | Storage-failure and retry logic has automated coverage; the submitted plan names a simulated network/route failure and needs a matching browser record. |
| S06 Repeated submit | Passed | Playwright activates Save twice and confirms exactly one matching appointment exists in the current user's storage. |
| A01 Layout and reflow | Partial | Automated checks pass at 375, 768, and 1440 pixels. The plan also requires 320, 767, 1023, and 1024 pixels plus 200% and 400% zoom. |
| A02 Keyboard and focus | Partial | Care/settings E2E verifies keyboard focus. A complete keyboard-only run of every normal path, drawer, modal, reverse traversal, focus return, and trap check remains. |
| A03 Page and form names | Not run | Labels and landmarks have component coverage, but the approved screen-reader run has not been recorded. |
| A04 Contrast and cues | Not run | Run contrast measurements and a manual review of errors, selected states, focus, flashing, and reduced motion. |
| P01 Install and manifest | Partial | Manifest and icon assets pass automated checks. Record the real install experience from the final HTTPS deployment. |
| P02 Offline and update | Partial | Production offline automation passes in all three Playwright engines. Record deployed offline, reconnection, and two-build update behavior manually. |
| P03 Load and bundles | Partial | Bundle analysis reports 97,295 bytes gzip (about 95.0 KiB) of total initial JavaScript, below the 200 KiB budget, with route-level lazy chunks. The plan also requires three production measurements plus LCP, CLS, and initial-transfer evidence. |
| P04 Tags and sitemap | Passed | Production build includes title, description, canonical URL, OpenGraph metadata, `robots.txt`, and `sitemap.xml` without private care data. |

## Remaining plan work

The approved-plan threshold is met. Complete A01 through A04, P01 through P03, S04, and S05 where practical because they cover independently required accessibility, responsive, PWA, and performance evidence. R02 remains a traceable early-starter case unless the team formally approves a replacement expectation.
