# Coding Standards: Page Object Model (Playwright TypeScript)

Detailed rules for `pages/`, `tests/` and `fixtures/`. ESLint (`eslint.config.mjs`) already fails `npm run gate:static` on raw CSS/XPath locators, element handles (`page.$()`), `waitForTimeout`, and any `page.locator()` / `page.getBy*()` / `page.click()`-style call in `tests/`; the rules below cover what the linter cannot see.

## Page Objects (`pages/*.page.ts`)

### Locators
- Declare every locator as a `private readonly` property and initialise it in the constructor.
- Expose a locator as `readonly` (public) only when a spec asserts on it, e.g. `await expect(loginPage.errorMessage).toContainText(...)`. Mark it with a trailing comment: `// Exposed solely for web-first assertion in tests/`.
- Pick the most resilient locator available, in this order:
  1. `page.getByRole(...)` with an accessible `name`
  2. `page.getByLabel(...)` / `page.getByPlaceholder(...)`
  3. `page.getByText(...)`, exact match preferred
  4. `page.getByTestId(...)`, only when no semantic role or label exists

### Behaviour methods
- Each public method is one complete user behaviour or business intent: `login(username, password)`, `uploadFile(filePath)`, `selectLanguages(labels)`, `downloadFile(fileName, targetDir)`. A method that only fills one field or clicks one button (`enterUsername()`, `clickLoginButton()`) belongs inside a larger behaviour instead.
- Navigation to the page is its own method (`open()` in most pages).
- Assertions (`expect(...)`) live in `tests/*.spec.ts`. Inside a page object, wait only to confirm a state transition before the method returns (e.g. `await this.page.waitForURL('**/status_codes')`).

### Reference implementation
`pages/login.page.ts` is the canonical example: role-based locators, two assertion-only `readonly` locators, `open()`, and one behaviour method `login(username, password)`. Read it before writing a new page object, and follow it rather than any example remembered from elsewhere.

## Specs (`tests/*.spec.ts`)
- Get page objects from a fixture (`fixtures/heroku.fixture.ts`, `fixtures/qademo.fixture.ts`, `fixtures/pages.fixture.ts`) and import `test`/`expect` from that fixture file.
- A spec only orchestrates page-object methods and asserts with web-first assertions.
- Read credentials with `requireEnv('NAME')` from `utils/env.utils.ts`, as `tests/login.spec.ts` does: `loginPage.login(requireEnv('LOGIN_USERNAME'), requireEnv('LOGIN_PASSWORD'))`.

## Fixtures (`fixtures/*.fixture.ts`)
- Register each new page object in the fixture file for its site, so specs receive it by injection.
