# Test evidence

September 20, 2026 (Eastern Time).

These files record the branch checks. Versioned text logs have trailing spaces and empty end lines removed; test results are unchanged. Full build logs and earlier failed-run artifacts are saved with the local course output package. LCOV and Jest summary files are generated reports, not estimates.

`tested_source_sha256.json` pins the source and tests used for the run. `rn-build-source-check.json` verifies the native build copy used the same React Native app source. `flutter-apk.json` gives the built APK hash. The goldens retain exact comparison; see the handoff note for why their references changed.

September 21 audit: PRs #15 and #16 are merged at main `2cab927`. These logs remain September 20 results. Of the 96 manifest paths, Flutter `pubspec.yaml` and `pubspec.lock` differ on that main commit; later Flutter tests are also present. See [the current guide](../INTEGRATION_E2E_TESTING.md) for blockers and [plan mapping](../TEST_PLAN_MAPPING.md) for case-level limits.
