# Week 4 Incremental Implementation Plan

Implement one phase at a time. Before each phase, state the intended files, risks, acceptance criteria, and focused tests. Stop and diagnose failures before expanding scope.

## Phase 0 - Baseline and protect the foundation (complete)

- Run the existing analyzer and test suite with coverage.
- Record screen count, placeholders, architecture, branch, and working-tree state.
- Add automated accessibility guidelines without changing product behavior.
- Checkpoint: baseline results and limitations are recorded.

## Phase 1 - Medication list/detail slice (complete)

- Add a fictional medication model and deterministic repository.
- Replace the Medications placeholder with a functional list.
- Add a medication detail screen receiving the selected model.
- Add unit and widget tests for normal, empty, selection, data-passing, and Back behavior.
- Checkpoint: four functional screens exist and the full gate passes.

## Phase 2 - Care recipient list/detail slice (complete)

- Add a fictional care-recipient model and repository.
- Replace the Care placeholder with list and detail screens.
- Preserve relevant selection/state through navigation.
- Add focused unit and widget tests.
- Checkpoint: six functional screens exist and the full gate passes.

## Phase 3 - Messages list/detail slice (complete)

- Add fictional static message data; do not use real health information.
- Replace the Messages placeholder with list and detail screens.
- Keep media static by default and place unverified animation behind explicit warning/control.
- Add tests for list/detail, non-autoplay behavior, transcript/static alternatives, and Back navigation.
- Checkpoint: eight functional screens exist and the full gate passes.

## Phase 4 - Responsive and accessibility hardening (local automated checks complete; device checks pending)

- Test phone/tablet portrait and landscape layouts at 100% and 200% text scale.
- Run automated guidelines and manual TalkBack/VoiceOver, keyboard, reading-order, status-announcement, target-size, and contrast checks.
- Repair confirmed defects without weakening seizure-safety defaults.
- Checkpoint: automated checks pass and manual evidence/limitations are recorded.

## Phase 5 - Final documentation and evidence (local artifacts complete; external delivery excluded)

- Run the complete verification script and record test/coverage totals.
- Update the README to match the implemented architecture and screen inventory.
- Capture and inspect current screenshots of major screens and interactions.
- Reconcile every acceptance criterion and review `git diff`/`git status`.
- Checkpoint: locally verifiable requirements pass; remaining remote or submission actions are explicit.

After each phase, propose a single-purpose commit message. Do not commit or push until the team reviews the changes.
