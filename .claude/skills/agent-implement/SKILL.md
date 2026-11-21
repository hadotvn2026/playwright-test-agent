---
name: agent-implement
description: End-to-end autonomous workflow to implement a GitHub Issue in Playwright TypeScript following strict POM rules in CLAUDE.md, pass static quality gates, record video/trace verification proof, and open a Pull Request.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# Skill: Autonomous Issue-to-PR Implementation (`agent-implement`)

You are executing an automated Software Factory run for repository `pw2610`. Follow every phase strictly in order. Do not skip verification gates or merge your own Pull Request.

---

## Phase 1: Issue Intake, Validation & State Locking

1. **Fetch Issue Details:**
   - Extract the target `<ISSUE_NUMBER>` from the user prompt or environment context.
   - Run `gh issue view <ISSUE_NUMBER> --json number,title,body,labels` to inspect the full specification and Acceptance Criteria.
2. **Spec Completeness Check (Pushback Gate):**
   - Verify that the issue contains clear **Target URL / Feature Scope** and **Acceptance Criteria**.
   - If the specification is ambiguous or missing critical test data/selectors that cannot be inferred from the codebase:
     - Comment specific clarifying questions on the issue via `gh issue comment <ISSUE_NUMBER> --body "..."`.
     - Swap labels: `gh issue edit <ISSUE_NUMBER> --remove-label "agent-ready" --remove-label "agent-in-progress" --add-label "agent-blocked"`.
     - **Terminate immediately.**
3. **Lock Issue & Create Branch:**
   - Ensure the issue is locked to prevent duplicate runs:
     `gh issue edit <ISSUE_NUMBER> --remove-label "agent-ready" --add-label "agent-in-progress"`
   - Sync `main` and create a clean feature branch:
     `git checkout main && git pull origin main && git checkout -b feat/issue-<ISSUE_NUMBER>`

---

## Phase 2: Architecture-Compliant Implementation (`CLAUDE.md`)

1. **Read Project Standards:**
   - Read `CLAUDE.md` and inspect existing files in `pages/`, `fixtures/`, and `tests/` to match naming conventions and patterns.
2. **Build / Update Page Objects (`pages/*.page.ts`):**
   - Declare ALL locators as `private readonly` properties initialized in the `constructor` (prefer `getByRole`, `getByLabel`, `getByTestId`).
   - Expose ONLY complete **business behavior methods** (e.g., `loginAs()`, `submitCheckout()`). Never write 1-to-1 UI wrappers (`clickSubmitButton()`).
   - Expose a `readonly` Locator property ONLY when `tests/` needs to assert visibility/state on it.
3. **Write Test Specifications (`tests/*.spec.ts`):**
   - Orchestrate flows exclusively through Page Object methods.
   - **NEVER** call `page.locator()`, `page.getByRole()`, `page.click()`, or `page.fill()` inside `tests/`.
   - **NEVER** use `page.waitForTimeout()`. Use web-first assertions (`await expect(...).toBeVisible()`).

---

## Phase 3: Static Quality Gate (`npm run gate:static`)

1. Run the mandatory static analysis gate:
   ```bash
   npm run gate:static