# Flutter golden review — November 3, 2026

Status: local fix verified; teammate review and merge pending. This follows issues #50 and #80. Base: `6ad1f95` from latest main. No app source, font assets, test Dart files, dependency lockfile, comparator, skips, or tolerance changed.

## What failed

A clean run reproduced all 10 screenshot failures. The full earlier run had 44 passes and 10 failures. Each image is 412 × 915 pixels at device pixel ratio 1. Fonts are loaded explicitly by the existing test. The old references were last refreshed on September 22; that run did not record its exact SDK/host. The current profile is Flutter 3.47.7, Dart 3.13.5, macOS 27.2, arm64. Full engine and font hashes are in `test-profile.json`.

Each new render matched the earlier November 3 failed render exactly, pixel for pixel. Only 156–434 pixels per image differed from the old references (0.0414%–0.1151% of 376,980 pixels). All ten reference/current pairs and amplified differences were opened and reviewed. No change in content, wrapping, spacing, or control positions was seen; the changes were sparse glyph-edge colors. The evidence is consistent with render drift, but the exact engine/host cause is not proven. This is a reviewed baseline refresh, not a runtime app bug fix.

## What changed

Refreshed the ten reviewed references under `mobile-flutter-app/test/goldens/week4/`. Old references remain recoverable in Git at base `6ad1f95` and are included with current renders and difference images in the SharePoint evidence ZIP. `baseline-review.json` gives per-screen pixel counts and hashes. No pass threshold was loosened. The test still uses Flutter's exact `LocalFileComparator`.

## Verification

| Check | Result |
| --- | --- |
| Clean baseline visual run before refresh | 10 failed, same images as earlier run |
| Reference generation (`--update-goldens`) | 10 generated; not counted as validation |
| Fresh normal full test run (`flutter test --coverage --reporter expanded`) | **54 passed, 0 failed**, including all 10 exact golden comparisons |
| `flutter analyze` | **No issues found** |
| Line coverage | **945/1129 = 83.70%** |
| HTML report | [coverage/index.html](coverage/index.html), complete supporting assets included |

The responsive and accessibility suites are part of the 54-test run. This does not establish a new APK build, native integration test, or manual screen-reader pass. The 83.70% result is below the rubric's 85% stretch goal. Earlier reports from the failed run remain historical; use this report for the refreshed references after review/merge.

Coverage is three lines lower than the earlier failed run (948/1,129). The differences are constructor declarations at `care_screen.dart:9`, `emergency_assistance_screen.dart:7`, and `messages_screen.dart:11`; no Dart source changed. This report uses the fresh passing run, not the earlier higher figure.

## Reproduce

Use the profile above and the checked-in fonts and lockfile. From `mobile-flutter-app`:

```sh
flutter --version
flutter pub get
flutter analyze
flutter test --coverage --reporter expanded
genhtml coverage/lcov.info --output-directory coverage/html --legend
```

For routine verification, do **not** use `--update-goldens`. If a screenshot changes, inspect the old/current/difference images first. A baseline refresh needs an explained visual review; a passing test after regeneration alone is not evidence of a correct screen. Compare engine, host and font hashes before changing references on another machine.

## Team review

Tiffany or Zack should inspect all ten image pairs and confirm the reference refresh. Then merge the PR, rerun the tests on the merged version, and close #50. #80 still needs the broader release/integration decision; this change resolves only its Flutter golden-test blocker. No deployment or course submission was performed.
