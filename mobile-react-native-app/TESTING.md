# React Native testing

This branch, `feature/assignment5-tests-only`, starts from main commit
`5d288311917167d7caf624fb6c80f08cf6686e6a`. It adds tests, a snapshot, test tools,
and this guide. It does not change app source or runtime package versions.
The prior improvements branch and saved work were not merged or applied.

## Run the checks

From the repository root:

```sh
cd mobile-react-native-app
npm ci
npm run typecheck
npm run lint
npm run test:coverage
```

Open `coverage/index.html` in a browser (on macOS, `open coverage/index.html`).
Coverage files are generated locally and ignored by Git. Run `npm test -- --runInBand`
for tests without coverage. Review a changed snapshot before using
`npm test -- --runInBand --updateSnapshot`.

## Verified results, September 13, 2026

- Four suites passed: 24 tests and one snapshot passed.
- Three TODO entries track known app gaps; they are not executed tests or passes.
- Statements: 95.93%; branches: 89.34%; functions: 95.76%; lines: 100%.
- Type and lint checks passed.

Coverage includes App.tsx and all runtime TypeScript source. Test files and
model types are excluded. Many screen functions fit on one source line, so
100% line coverage does not mean every path works. Branch coverage is a better
check of the paths covered here. Global gates are 75% statements, lines and
functions, and 65% branches.

## What the tests check

- Sign-in errors, duplicate signup, onboarding, and logout confirmation.
- Health and medication log validation, failed saves, and successful saves.
- Settings controls, text-size bounds, reset, and persistence calls.
- Screen routes, plus real navigator travel from sign-in to medication detail.
- Account-scoped storage queries, record mapping, and corrupt settings data.
- Database setup and migration calls, password hashing, and password comparison.
- Disabled appointment/message actions and a shared UI accessibility snapshot.

SQLite and native storage APIs are mocked. These tests check database calls,
not a real device database. Screen tests inject fake repositories. Password
hash tests use the real hash code. Native navigation uses the Jest environment.
Device scrolling, screen-reader use, motion, actual disk persistence, and
Android/iOS builds still need separate checks.

## Known app gaps left unchanged

1. Settings shows saved status without waiting for a successful save. Storage
   failures need a visible error and retry path.
2. Reduced motion is stored but is not connected to navigation transitions.
3. Emergency assistance displays a claim that services were called without
   placing a call. This screen must not be relied on to summon help.

These are recorded as TODO tests, not accepted behavior. New appointment and
message sending are also disabled placeholders. App fixes belong in a separate
reviewed change. High coverage alone does not establish full rubric compliance.

## Before merging

Review the diff against the latest main. Only test files, test configuration,
this guide, the coverage ignore rule, and package files should change. Do not
resolve a conflict by replacing a teammate's app file with an older copy.
Fetch main and rerun checks after any upstream change. This branch has not
been pushed or merged.
