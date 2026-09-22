# Test evidence

Historical evidence captured September 20, 2026 (Eastern Time), with a current-branch verification summary added September 21.

These files record the branch checks. Versioned text logs have trailing spaces and empty end lines removed; test results are unchanged. Full build logs and earlier failed-run artifacts are saved with the local course output package. LCOV and Jest summary files are generated reports, not estimates.

`tested_source_sha256.json` pins the source and tests used for the run. `rn-build-source-check.json` verifies the native build copy used the same React Native app source. `flutter-apk.json` gives the built APK hash. The goldens retain exact comparison; see the handoff note for why their references changed.

These versioned files remain historical September 20 results and must not be relabeled as final-branch output. On the main-derived `feature/week6-final-testing-evidence` branch, the September 21 verification produced the following newer results:

- Flutter analyzer: no issues.
- Flutter automated suite: 54 of 54 passed; 84.68% line coverage.
- Flutter Android Maestro: 3 of 3 flows passed on Pixel 10, Android 17 API 37, after rebuilding and installing the current application.
- React Native TypeScript and ESLint: passed.
- React Native Jest: 48 of 48 passed in 9 suites; 99.47% line coverage and 89.11% branch coverage.

The newly reviewed Flutter golden references are source-controlled test baselines, not screenshots of the Maestro run. A fresh React Native Android native build was attempted but stopped in Gradle CMake configuration for Expo Modules Core and React Native Screens, so historical RN Maestro artifacts remain clearly identified as historical.

See [the current guide](../INTEGRATION_E2E_TESTING.md), [final execution ledger](../FINAL_TEST_PLAN_EXECUTION.md), and [plan mapping](../TEST_PLAN_MAPPING.md) for commands, limitations, and case-level traceability.
