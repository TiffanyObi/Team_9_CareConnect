# Test evidence

Historical evidence captured September 20, 2026 (Eastern Time), with current-branch verification completed September 22.

These files record the branch checks. Versioned text logs have trailing spaces and empty end lines removed; test results are unchanged. Full build logs and earlier failed-run artifacts are saved with the local course output package. LCOV and Jest summary files are generated reports, not estimates.

`tested_source_sha256.json` pins the source and tests used for the run. `rn-build-source-check.json` verifies the native build copy used the same React Native app source. `flutter-apk.json` gives the built APK hash. The goldens retain exact comparison; see the handoff note for why their references changed.

These versioned files remain historical September 20 results and must not be relabeled as final-branch output. On the main-derived `feature/week6-final-testing-evidence` branch, the September 21–22 verification produced the following newer results:

- Flutter analyzer: no issues.
- Flutter automated suite: 54 of 54 passed; 84.68% line coverage.
- Flutter Android Maestro: 3 of 3 flows passed on Pixel 10, Android 17 API 37, after rebuilding and installing the current application. Final JUnit and transcript evidence are saved as `flutter-maestro-final.xml` and `flutter-maestro-final.txt`.
- React Native TypeScript and ESLint: passed.
- React Native Jest: 48 of 48 passed in 9 suites; 99.47% line coverage and 89.11% branch coverage.

The approved-plan execution result is 19 of 26 cases, or 73.08%, after Team 9's test-plan owners approved nine current-application equivalent expectations on September 22. The professor-facing summary is available as `APPROVED_PLAN_E2E_SUMMARY.md` and `approved-plan-e2e-summary-73.08-percent.png`. This percentage is separate from code coverage and Maestro flow pass rates.

The newly reviewed Flutter golden references are source-controlled test baselines, not screenshots of the Maestro run. A fresh React Native Android native build was attempted but stopped in Gradle CMake configuration for Expo Modules Core and React Native Screens, so the passing RN Maestro evidence remains explicitly identified as the verified September 20 iOS simulator run.

See [the current guide](../INTEGRATION_E2E_TESTING.md), [final execution ledger](../FINAL_TEST_PLAN_EXECUTION.md), and [plan mapping](../TEST_PLAN_MAPPING.md) for commands, limitations, and case-level traceability.
