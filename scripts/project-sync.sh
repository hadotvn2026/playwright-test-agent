#!/usr/bin/env bash
# Puts an issue on the project board, so every issue the agent works lands in the
# right milestone and sprint:
#   - assigns the nearest open milestone (earliest due date) if the issue has none
#   - adds the issue to the project (no-op if it is already there)
#   - sets the Sprint field to the iteration that contains today
#   - sets the Status field (default "In Progress")
# "Done" needs no call: the project's built-in "Item closed" workflow sets it.
#
# Usage: scripts/project-sync.sh <issue-number> [status]
# Env:   PROJECT_OWNER (hadotvn2026), PROJECT_NUMBER (1), SPRINT_FIELD (Sprint),
#        TODAY (YYYY-MM-DD, default today UTC), DRY_RUN=1 to print without changing anything
set -euo pipefail

ISSUE="${1:?usage: scripts/project-sync.sh <issue-number> [status]}"
STATUS="${2:-In Progress}"
PROJECT_OWNER="${PROJECT_OWNER:-hadotvn2026}"
PROJECT_NUMBER="${PROJECT_NUMBER:-1}"
SPRINT_FIELD="${SPRINT_FIELD:-Sprint}"
export TODAY="${TODAY:-$(date -u +%F)}"
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
ISSUE_URL="https://github.com/$REPO/issues/$ISSUE"

run() { if [ "${DRY_RUN:-}" = "1" ]; then echo "[dry-run] $*"; else "$@" >/dev/null; fi; }

# 1. Milestone: keep an existing one; otherwise take the open milestone due soonest.
MILESTONE=$(gh issue view "$ISSUE" --repo "$REPO" --json milestone -q '.milestone.title // ""')
if [ -z "$MILESTONE" ]; then
  MILESTONE=$(gh api "repos/$REPO/milestones?state=open&per_page=100" \
    --jq '([.[] | select(.due_on != null)] | sort_by(.due_on)) + [.[] | select(.due_on == null)] | .[0].title // ""')
  if [ -n "$MILESTONE" ]; then
    run gh issue edit "$ISSUE" --repo "$REPO" --milestone "$MILESTONE"
  else
    echo "warning: no open milestone - issue #$ISSUE left without one" >&2
  fi
fi

# 2. Project item (item-add returns the existing item when the issue is already on the board).
PROJECT_ID=$(gh project view "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json --jq .id)
if [ "${DRY_RUN:-}" = "1" ]; then
  echo "[dry-run] gh project item-add $PROJECT_NUMBER --owner $PROJECT_OWNER --url $ISSUE_URL"
  ITEM_ID="<item>"
else
  ITEM_ID=$(gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$ISSUE_URL" --format json --jq .id)
fi

# 3. Field ids, the iteration containing TODAY, and the status option.
FIELDS=$(gh api graphql -f query='
  query($id: ID!, $sprint: String!) {
    node(id: $id) {
      ... on ProjectV2 {
        sprint: field(name: $sprint) {
          ... on ProjectV2IterationField { id configuration { iterations { id title startDate duration } } }
        }
        status: field(name: "Status") {
          ... on ProjectV2SingleSelectField { id options { id name } }
        }
      }
    }
  }' -f id="$PROJECT_ID" -f sprint="$SPRINT_FIELD")

SPRINT_FIELD_ID=$(jq -r '.data.node.sprint.id // ""' <<<"$FIELDS")
read -r SPRINT_ID SPRINT_TITLE < <(jq -r '
  .data.node.sprint.configuration.iterations[]?
  | select(env.TODAY >= .startDate
           and env.TODAY < (((.startDate + "T00:00:00Z") | fromdate) + .duration * 86400 | strftime("%Y-%m-%d")))
  | "\(.id) \(.title)"' <<<"$FIELDS" | head -n1) || true
STATUS_FIELD_ID=$(jq -r '.data.node.status.id // ""' <<<"$FIELDS")
STATUS_ID=$(jq -r --arg s "$STATUS" '.data.node.status.options[]? | select(.name == $s) | .id' <<<"$FIELDS")

if [ -n "${SPRINT_ID:-}" ]; then
  run gh project item-edit --project-id "$PROJECT_ID" --id "$ITEM_ID" --field-id "$SPRINT_FIELD_ID" --iteration-id "$SPRINT_ID"
else
  echo "warning: no '$SPRINT_FIELD' iteration contains $TODAY - add upcoming iterations in the project settings" >&2
fi

if [ -n "$STATUS_ID" ]; then
  run gh project item-edit --project-id "$PROJECT_ID" --id "$ITEM_ID" --field-id "$STATUS_FIELD_ID" --single-select-option-id "$STATUS_ID"
else
  echo "warning: Status option '$STATUS' not found" >&2
fi

echo "#$ISSUE -> milestone: ${MILESTONE:-none} | sprint: ${SPRINT_TITLE:-none} | status: ${STATUS_ID:+$STATUS}"
