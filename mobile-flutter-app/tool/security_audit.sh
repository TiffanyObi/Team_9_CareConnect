#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
repository_dir="$(cd "$project_dir/.." && pwd)"
audit_tmp="$(mktemp -d)"
trap 'rm -rf "$audit_tmp"' EXIT

cd "$project_dir"

echo "CareConnect Week 4 security audit"
echo "1. Static analysis"
flutter analyze --no-pub

echo "2. Hosted Pub package inventory"
dart pub deps --json > "$audit_tmp/dependencies.json"
jq '{queries: [.packages[] | select(.source == "hosted") | {
  package: {ecosystem: "Pub", name: .name}, version: .version
}]}' "$audit_tmp/dependencies.json" > "$audit_tmp/osv-query.json"
package_count="$(jq '.queries | length' "$audit_tmp/osv-query.json")"
echo "Hosted packages checked: $package_count"

echo "3. OSV vulnerability query"
curl --fail --silent --show-error \
  --header 'Content-Type: application/json' \
  --data-binary "@$audit_tmp/osv-query.json" \
  'https://api.osv.dev/v1/querybatch' > "$audit_tmp/osv-response.json"
vulnerability_count="$(jq '[.results[]? | .vulns[]?] | length' "$audit_tmp/osv-response.json")"
echo "OSV vulnerability records: $vulnerability_count"
if [[ "$vulnerability_count" -ne 0 ]]; then
  jq -r '.results[]? | .vulns[]? | "- \(.id): \(.summary // "No summary")"' \
    "$audit_tmp/osv-response.json"
  exit 1
fi

echo "4. Tracked secret-pattern scan"
if git -C "$repository_dir" grep -nIE \
  -e '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----' \
  -e 'AKIA[0-9A-Z]{16}' \
  -e 'gh[pousr]_[A-Za-z0-9_]{20,}' \
  -e 'sk-[A-Za-z0-9]{20,}' \
  -- ':!*.png' ':!*.jpg' ':!*.jpeg'; then
  echo "Potential secret material was found in tracked files." >&2
  exit 1
fi
echo "No tracked private-key, AWS-key, GitHub-token, or OpenAI-key patterns found."

echo "5. Mobile transport configuration"
if rg -n 'usesCleartextTraffic[[:space:]]*=[[:space:]]*"true"' android; then
  echo "Android cleartext traffic is enabled." >&2
  exit 1
fi
if rg -n 'NSAllowsArbitraryLoads' ios/Runner/Info.plist; then
  echo "Review the iOS App Transport Security exception above." >&2
  exit 1
fi
echo "No Android cleartext override or iOS arbitrary-load exception found."

echo "Security audit passed. Manual limits remain documented in docs/week4."
