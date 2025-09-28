#!/usr/bin/env bash
# Simple pre-commit check for leaked API keys / x-api-key patterns in staged files
# Exits non-zero to block commit if a likely secret is found

set -euo pipefail

# Patterns to check (case-insensitive): x-api-key, api_key, apikey, bearer tokens, basic auth, private key headers
PATTERNS=(
  "x-api-key"
  "x_api_key"
  "api[_-]?key"
  "apikey"
  "Bearer [A-Za-z0-9\-\._~\+/]+=*"
)

# Get staged files (names)
STAGED=$(git diff --cached --name-only --diff-filter=ACM || true)
if [ -z "$STAGED" ]; then
  exit 0
fi

FAIL=0
for file in $STAGED; do
  # only check text files
  if file --mime-type "$file" | grep -q "text/\|application/json\|application/javascript\|text/x"; then
    for pat in "${PATTERNS[@]}"; do
      if git show :"$file" | grep -i -E "$pat" >/dev/null; then
        echo "[pre-commit] Potential secret pattern '$pat' found in staged file: $file"
        FAIL=1
      fi
    done
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo "\nCommit blocked: remove or replace secrets (use placeholders) or unstage the offending files."
  exit 1
fi

exit 0
