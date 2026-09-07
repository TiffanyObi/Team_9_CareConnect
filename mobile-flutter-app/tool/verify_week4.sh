#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

flutter doctor -v
dart format --output=none --set-exit-if-changed lib test
flutter analyze --no-pub

coverage_file="coverage/lcov.info"
set +e
flutter test --coverage --no-pub
test_status=$?
set -e

if [[ ! -s "$coverage_file" ]]; then
  echo "Coverage evidence is missing: $coverage_file" >&2
  exit 1
fi

awk -F: '
  /^LF:/ { found += $2 }
  /^LH:/ { hit += $2 }
  END {
    if (found == 0) {
      print "Coverage evidence contains no executable lines." > "/dev/stderr"
      exit 1
    }
    percent = (100 * hit) / found
    printf "Week 4 line coverage: %d/%d (%.2f%%)\n", hit, found, percent
    if (percent < 60) {
      print "Coverage is below the required 60%." > "/dev/stderr"
      exit 1
    }
  }
' "$coverage_file"

git -C "$project_dir/.." diff --check
git -C "$project_dir/.." status --short --branch

if [[ "$test_status" -ne 0 ]]; then
  echo "The Flutter test suite failed; see the output above." >&2
  exit "$test_status"
fi
