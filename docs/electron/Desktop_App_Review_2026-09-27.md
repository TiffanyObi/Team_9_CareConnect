# Desktop app review

September 27, 2026, Eastern Time

## Change for review

The Electron starter now opens a React desktop app with local demo login and sign-up, Olivia Reed's sample workspace, Dashboard, Appointments, Settings, native menus, and keyboard shortcuts. Visits and notes save on the device. Each local account has its own data. Logout offers choices for unsaved work.

More actions → Copy appointment details now uses Electron's native clipboard. It copies the selected title, date, time, and location. The bridge checks the sender and text before writing. Errors are shown, and a successful retry clears the old error.

This is a local demo. It has no live clinic connection, email verification, or password reset service. The design documents may describe planned features beyond this early implementation.

## Verification

A fresh checkout of main and `npm ci` were used on macOS with Node 22.14.0 and Electron 43.4.0. The install reported no known vulnerabilities at the time of the run.

| Command, run in desktop-electron-app | Result |
| --- | --- |
| npm ci | Pass |
| npm test | 14 checks passed |
| npm run test:auth | 17 checks passed |
| npm run test:clipboard | Exact clipboard text, changed selection, failure/retry, and invalid payload checks passed |
| node tests/capture.cjs | Dashboard and Appointments at 1024, 1440, and 1920 px, plus Settings, captured |
| git diff --check | Pass |

Tests used fresh temporary profiles. No normal app account data was used. Test evidence paths are printed by the scripts and do not overwrite earlier reports. The clipboard test restores prior clipboard contents. Unset ELECTRON_RUN_AS_NODE when running Electron if that variable is present.

The test scripts now use the operating system's temporary folder. The capture script opens the sample workspace before taking screenshots. Runtime dependencies, generated bundles, local profiles, and old backup files are excluded from the PR.

## Remaining checks

Windows and Linux execution, VoiceOver and NVDA, OS contrast settings, full keyboard traversal, physical native-menu selection, and 400 percent zoom still need manual checks. The clipboard test opens the real context menu and calls its actual copy callback; it does not use physical mouse input inside the OS menu. Automated tests passed on macOS only.

## Review steps

1. Run npm ci and npm start in desktop-electron-app.
2. Choose Open sample workspace, or create a made-up local demo account.
3. Open Appointments, choose a visit, and use More actions → Copy appointment details. Paste into a text editor to inspect the result.
4. Check note saving, Settings, keyboard shortcuts, and logout with unsaved work.
5. Review the app README and run the three test commands above.
