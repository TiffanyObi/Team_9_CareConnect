# React Native testing

This guide describes the current CareConnect React Native checks on the Week 6 main-derived source.

## Automated checks

From `mobile-react-native-app`:

```sh
npm ci
npm run typecheck
npm run lint
npm run test:coverage -- --runInBand
```

Current verified result on September 21, 2026:

- 9 suites passed.
- 48 tests passed with no failures or TODO tests.
- One reviewed snapshot passed.
- Lines: 99.47%.
- Statements: 95.21%.
- Functions: 95.96%.
- Branches: 89.11%.
- TypeScript and ESLint passed.

Open `coverage/index.html` for the local HTML report. A high line percentage does not replace native screen-reader, focus, reflow, or E2E testing.

## Test scope

The Jest and React Native Testing Library suites cover:

- Authentication errors, account creation, first-use accessibility setup, and logout confirmation.
- Medication and health-log success, validation, failure, and account isolation.
- Settings preview, persistence success and failure, reduced-motion behavior, and user-scoped preferences.
- Navigation between tabs and detail screens.
- Accessible names, roles, states, hints, live regions, modal background hiding, and focus requests.
- Minimum control dimensions and focusability.
- Rendered text, placeholder, field-boundary, selected-tab, and pressed-state contrast in light and dark themes.
- Database setup, repositories, password hashing, and corrupt-settings recovery.

Native SQLite and storage APIs are mocked in Jest. Native device integration and Maestro checks remain separate.

## Maestro E2E

Five flows are stored in `.maestro/`:

1. Sign in and medication logging.
2. Accessibility settings and logout confirmation.
3. Care and emergency demo behavior.
4. Health-log validation and saving.
5. Message detail and draft cancellation.

Use the repository [Week 6 integration and E2E guide](../docs/week6/INTEGRATION_E2E_TESTING.md) for native build, device, and JUnit commands. Historical five-flow iOS results and three-flow Android/iOS results exist, but a new React Native Android build on this host stopped during Gradle CMake configuration for Expo Modules Core and React Native Screens. Do not label an older installed application as a final-branch native run.

## Manual accessibility checks

Automated tests verify application requests and rendered properties, not the speech or focus behavior produced by VoiceOver and TalkBack. The final build still requires:

- VoiceOver and TalkBack names, roles, values, states, reading order, errors, and status announcements.
- Modal focus containment and restoration.
- Visible external-keyboard focus in light and dark themes.
- Native 200% text, rotation, reflow, and target-size checks.
- Native switches, system alerts, and stack Back controls.

Record the build commit, device, OS, reader settings, tester, date, expected and actual results, exact speech, and evidence filename.

## Approved-plan percentage

Line coverage, Jest success, and Maestro flow success are separate from approved-plan case completion. See the [final execution ledger](../docs/week6/FINAL_TEST_PLAN_EXECUTION.md) before reporting a 60% approved-case percentage.
