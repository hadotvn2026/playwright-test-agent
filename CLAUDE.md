# Project Context & Engineering Standards (Playwright TypeScript)

## 1. Tech Stack & Architecture Overview
- **Framework:** Playwright Test (`@playwright/test`) with TypeScript (`strict: true`).
- **Design Pattern:** Strict Page Object Model (POM) focused on **complete user behaviors**.
- **Directory Structure:**
  - `pages/` — Page Object classes encapsulating UI locators and user workflows (`*.page.ts`).
  - `fixtures/` — Custom Playwright test fixtures for dependency injection (`*.fixture.ts`).
  - `tests/` — End-to-end test specifications (`*.spec.ts`). Contains ONLY test orchestration and assertions.
  - `utils/` — Pure helper functions, test data builders, and API clients.

---

## 2. Page Object Model (POM) Rules (`pages/*.page.ts`)

### A. Locator Encapsulation (Strict `private readonly`)
- **ALL locators MUST be declared as `private readonly` properties** inside the Page Object class and initialized in the `constructor`.
- **NEVER expose raw `Locator` properties publicly** for external `.click()` or `.fill()` calls.
  - *Exception:* A read-only locator getter or `public readonly` status element MAY be exposed ONLY if `tests/` needs to assert on it via `await expect(pageObj.banner).toBeVisible()`.
- **Locator Priority Order (Resilient Locators):**
  1. `page.getByRole(...)` (with accessible `name`)
  2. `page.getByLabel(...)` / `page.getByPlaceholder(...)`
  3. `page.getByText(...)` (exact match preferred)
  4. `page.getByTestId(...)` (when semantic roles are unavailable)
  - **BANNED:** XPath selectors, brittle CSS chains (`div > span:nth-child(2)`), and legacy `page.$()` / `page.$$()`.

### B. Business Behavior Methods (No 1-to-1 UI Wrappers)
- Methods in `pages/` MUST represent **complete, meaningful user behaviors or business intents**, NOT low-level single UI interactions.
- **PROHIBITED (1-to-1 Wrappers):**
  - `enterEmail(email)`, `enterPassword(pass)`, `clickLoginButton()`
  - Chaining granular UI steps in test files.
- **REQUIRED (Complete User Flows):**
  - `loginAs(email: string, password: string): Promise<void>`
  - `searchAndSelectFlight(origin: string, destination: string, departDate: string): Promise<void>`
  - `applyPromoCodeAndCheckout(code: string): Promise<void>`
- **NO Assertions Inside Page Objects:** Keep `expect(...)` calls inside `tests/*.spec.ts` (except internal synchronization waits required to confirm a state transition before returning from a method).

### C. Reference Implementation (`pages/login.page.ts`)
```typescript
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  readonly errorAlert: Locator; // Exposed solely for web-first assertion in tests/

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorAlert = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  // Complete business behavior method
  async loginAs(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}