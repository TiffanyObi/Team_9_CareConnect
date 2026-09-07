# Week 4 Submission Package - September 6, 2026

## Readiness result

- The local source, README, test score, and screen shots are present.
- GitHub pull request 4 is the repo link. Check its head after this file is pushed.
- A clean ZIP is made from the same checked file set. It is checked on its own.
- TalkBack or VoiceOver, keyboard, real-device checks, team sign-off, merge, and course upload are not done here.

This submission package combines implementation, verification, accessibility, navigation, coverage, and visual records in one review set. Reviewers can compare each requirement with its source file, automated test, screenshot, or written result. The structure makes the application easier to install, inspect, test, and discuss with the course team. It also separates local verification from GitHub approval, merge status, device testing, and the final course submission. This separation prevents an unfinished external action from being reported as complete. The ZIP and repo use the same organized content, so reviewers can follow one evidence trail. A checksum protects file integrity, while the raw lcov report supports an independent coverage review. The documentation also names the architecture, state management, and route design used by the application. Clear organization, consistent terminology, and accurate percentages help instructors evaluate the package efficiently and independently.

## 1. Flutter source code

- The complete project is under `mobile-flutter-app/`.
- The package has `lib/`, `test/`, `tool/`, platform folders, `pubspec.yaml`, `pubspec.lock`, and project settings.
- Models, data files, shared state, storage, screens, widgets, themes, and routes are split by role.
- The ZIP leaves out `.git/`, `.dart_tool/`, `build/`, IDE caches, `.DS_Store`, and other files made by tools.
- The ZIP keeps `coverage/lcov.info` because it is proof of the test score, not a build product.

## 2. README

- The root README explains the repo and Flutter run steps.
- The Flutter README explains the CareConnect purpose and eight screens.
- It names `AccessibilityController`, `ChangeNotifier`, `ListenableBuilder`, and `SharedPreferences` as the state approach.
- It names `Navigator` and `MaterialPageRoute` as the route approach.
- It links to setup help, tests, the line score, screen shots, and final checks.

## 3. Test score and proof

- Command: `./tool/verify_week4.sh` from `mobile-flutter-app/`.
- The gate runs `flutter test --coverage --no-pub`.
- Result on September 6, 2026: 31 tests passed and 0 failed.
- Current line score: 365/407, or 89.68%.
- Course goal: at least 60%.
- Raw report: `mobile-flutter-app/coverage/lcov.info`.
- An HTML report is not needed because the raw file and this short note are in the pack.

## 4. Screen proof

- Eight current PNG screenshots are under `docs/week4/screenshots/`.
- They show Today, Accessibility Settings, three lists, and three selected-item detail screens.
- The list and detail pairs show the key route results.
- `SCREENSHOT_INDEX.md` lists each image and its screen check.
- The images use fictional data and contain no debug banner or private health data.

## Delivery files

- GitHub pull request: `https://github.com/TiffanyObi/Team_9_CareConnect/pull/4`
- ZIP file: `Team_9_CareConnect_Week4_Submission_2026-09-06.zip`
- ZIP file hash: saved in the matching `.sha256` file next to the ZIP.

## Final checks before course upload

- [x] Complete Flutter source is present.
- [x] The README covers each course topic.
- [x] The line score is more than 60%.
- [x] The raw file and a clear note are present.
- [x] Eight current screenshots are present.
- [x] Caches and build folders are not in the ZIP.
- [ ] Team sign-off is saved.
- [ ] Pull request 4 is merged into `main`.
- [ ] The final repo link or ZIP is sent to the course site.
- [ ] The course upload is checked.
