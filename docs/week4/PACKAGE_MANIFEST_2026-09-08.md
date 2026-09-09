# Week 4 Package Manifest - September 8, 2026

## Source and evidence

- `repository/` contains the current review copy of Team 9 source, tests, documentation, and screenshots.
- `.git`, `.dart_tool`, `build`, `coverage`, `.DS_Store`, and tool caches are excluded from `repository/`.
- `coverage/lcov.info` contains raw line coverage.
- `coverage/html/index.html` opens the browsable coverage report.

## Installable artifacts

- `artifacts/CareConnect-Week4-android-debug.apk`
  - Type: Android debug-signed APK
  - SHA-256: `bbe7e194fc3bbb06f7656cdc549b3f7763a860e765ccb5a538f76b83e26986fe`
- `artifacts/CareConnect-Week4-ios-simulator-unsigned.zip`
  - Type: unsigned iOS Simulator `.app` archive
  - SHA-256: `fa5464caf3c3456789def9fd6867342e5aa645570005ebd83d98702f9812da5e`

Neither artifact is a production store release. The iOS artifact cannot be installed on a physical iPhone.

## Verification summary

- 41 tests passed; 0 failed.
- Coverage: 718/780 lines, or 92.05%.
- Flutter analysis: pass.
- Ten golden screenshots: pass and visually reviewed.
- Security audit: pass; 47 hosted packages and 0 OSV vulnerability records.
