# Coding Standards (Playwright TypeScript POM)

The single home of the rules for `pages/`, `tests/`, `fixtures/` and `utils/`.

**Done** when `npm run gate:static` passes and every spec you added or changed passes `npx playwright test <spec...> --project=chromium`. The static gate (`tsc` + `eslint.config.mjs`) enforces raw-locator, element-handle, `waitForTimeout`, missing-`await` and web-first-assertion rules, and rejects `page.locator()` / `page.getBy*()` / `page.click()`-style calls in `tests/`. The rules below are the ones no tool checks; apply every one to each file you add or change.

## Page objects (`pages/*.page.ts`)
- Every locator is a `private readonly` property initialised in the constructor. The one exception is a locator a spec asserts on: make it `readonly` (public) and mark it `// Exposed solely for web-first assertion in tests/`.
- Pick the most resilient locator, in this order:
  1. `page.getByRole(...)` with an accessible `name`
  2. `page.getByLabel(...)` / `page.getByPlaceholder(...)`
  3. `page.getByText(...)`, exact match preferred
  4. `page.getByTestId(...)`, only when no semantic role or label exists
- Public methods are *behaviour methods*: each performs one complete user behaviour or business intent, such as `login(username, password)`, `uploadFile(filePath)`, `selectLanguages(labels)`, `downloadFile(fileName, targetDir)`. Single fills and clicks happen inside a behaviour method.
- Navigation is its own method, `open()` (known exception: `pages/home.page.ts` uses `goto()`).
- Assertions live in specs. A page object waits only to confirm a state transition before returning, e.g. `await this.page.waitForURL('**/status_codes')`.
- `pages/login.page.ts` is the reference implementation: read it before writing a new page object, and match it rather than generic POM examples.

## Specs (`tests/*.spec.ts`)
- Get page objects from the site's fixture and import `test`/`expect` from that fixture file.
- A spec calls *behaviour methods* and asserts on their outcome.
- Read credentials with `requireEnv('NAME')` from `utils/env.utils.ts`, e.g. `loginPage.login(requireEnv('LOGIN_USERNAME'), requireEnv('LOGIN_PASSWORD'))`.

## Fixtures (`fixtures/*.fixture.ts`)
- Register each new page object in its site's fixture file, so specs receive it by injection.

## Helpers (`utils/*.utils.ts`)
- Keep helpers pure: plain functions with no `Page` or locators.
