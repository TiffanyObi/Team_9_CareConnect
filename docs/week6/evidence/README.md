# Test evidence

September 20, 2026 (Eastern Time).

These files record the branch checks. Versioned text logs have trailing spaces and empty end lines removed; test results are unchanged. Full build logs and earlier failed-run artifacts are saved with the local course output package. LCOV and Jest summary files are generated reports, not estimates.

`tested_source_sha256.json` pins the source and tests used for the run. `rn-build-source-check.json` verifies the native build copy used the same React Native app source. `flutter-apk.json` gives the built APK hash. The goldens retain exact comparison; see the handoff note for why their references changed.
