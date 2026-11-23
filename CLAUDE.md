# Project Context & Engineering Standards (Playwright TypeScript)

## 1. Tech Stack & Architecture Overview
- Playwright Test with TypeScript in strict mode, organised as a strict Page Object Model built around **complete user behaviours**.
- **Directory Structure:**
  - `pages/` — Page Object classes encapsulating UI locators and user workflows (`*.page.ts`).
  - `fixtures/` — Custom Playwright test fixtures for dependency injection (`*.fixture.ts`).
  - `tests/` — End-to-end test specifications (`*.spec.ts`): test orchestration and assertions only.
  - `utils/` — Pure helper functions, test data builders, and API clients.

## 2. Page Object Model (POM) Rules
- Locators are `private readonly` and live in `pages/`; expose one as `readonly` only when a spec asserts on it.
- Prefer `getByRole` > `getByLabel`/`getByPlaceholder` > `getByText` > `getByTestId`.
- Page-object methods are complete business behaviours (`login(username, password)`), never 1-to-1 UI wrappers.
- `expect(...)` belongs in `tests/`; page objects only wait to confirm a state transition.
- Before adding or changing files in `pages/`, `tests/` or `fixtures/`, read `CODING_STANDARDS.md` (full rules and the reference implementation).

## 3. Agentic Workflow (Issue → PR → merge → close)
- Claude Code runs locally via `/agent-implement [N]`; GitHub Actions only runs deterministic steps (CI, proof, close issue).
- Work for an issue happens on branch `agent/issue-<N>` and follows `.claude/skills/agent-implement/SKILL.md`.
- Every PR must keep `npm run gate:static` and `npx playwright test` green; these are required checks on `main`.
- Credentials come from env via `requireEnv()` (`utils/env.utils.ts`): `.dev.env` locally, repository secrets on CI.
- Leave recordings out of commits; `agent-proof.yml` publishes video/trace proof to the `pr-proof` branch.
- Full loop, labels and setup: `docs/agent-workflow.md`.
