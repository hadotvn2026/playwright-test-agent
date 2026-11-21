#!/usr/bin/env bash
# Creates (or updates) the labels that drive the agent issue lifecycle:
#   agent-ready -> agent-in-progress -> agent-review -> agent-done
#                                    \-> agent-blocked (needs a human)
set -euo pipefail
REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"

create() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force; }

create agent-ready       fbca04 "Spec complete - ready for /agent-implement"
create agent-in-progress 1d76db "Claude is implementing this issue"
create agent-review      8250df "PR opened - waiting for human review"
create agent-done        0e8a16 "PR merged - issue closed with evidence"
create agent-blocked     d93f0b "Needs human input (spec unclear or agent run failed)"
