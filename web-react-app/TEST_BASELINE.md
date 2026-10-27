# Web test baseline for PR #42

Baseline captured from commit `904f0a905db1f2c5c952df37f5bd0103f2cdc33f` before the Vitest-to-Jest migration.

## Existing Vitest baseline

Command: `npm run test:coverage`

- Test files: 8 passed
- Tests: 12 passed
- Statements: 69.12%
- Branches: 56.50%
- Functions: 69.00%
- Lines: 71.01%

## Jest migration verification

Commands: `npm test`, `npm run test:coverage`

- Test suites: 8 passed
- Tests: 12 passed
- Statements: 77.17%
- Branches: 78.17%
- Functions: 73.14%
- Lines: 77.17%

All 12 existing tests pass after the migration. Coverage percentages are recorded for comparison, but should not be interpreted as directly equivalent: Vitest and Jest instrument/transpile the same source differently.
