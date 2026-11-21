#!/usr/bin/env bash
# Protects main so every change - human or agent - goes through a PR whose
# `gate-static` and `test` checks are green. Re-running updates the existing ruleset.
set -euo pipefail
REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
NAME="main: PR + green checks"

PAYLOAD=$(cat <<JSON
{
  "name": "$NAME",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true
    } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [ { "context": "gate-static" }, { "context": "test" } ]
    } }
  ]
}
JSON
)

EXISTING=$(gh api "repos/$REPO/rulesets" -q ".[] | select(.name == \"$NAME\") | .id")
if [ -n "$EXISTING" ]; then
  echo "$PAYLOAD" | gh api -X PUT "repos/$REPO/rulesets/$EXISTING" --input - >/dev/null
  echo "Updated ruleset $EXISTING on $REPO"
else
  echo "$PAYLOAD" | gh api -X POST "repos/$REPO/rulesets" --input - >/dev/null
  echo "Created ruleset on $REPO"
fi

# Agent branches are disposable: delete them automatically after merge.
gh api -X PATCH "repos/$REPO" -F delete_branch_on_merge=true >/dev/null
echo "Enabled delete_branch_on_merge"
