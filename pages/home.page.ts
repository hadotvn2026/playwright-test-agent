import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  readonly heroHeading: Locator;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroHeading = page.getByRole('heading', { level: 1 });
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://playwright.dev/');
  }

  async startGettingStarted(): Promise<void> {
    await this.getStartedLink.click();
    await this.page.waitForURL('**/docs/intro');
  }
}
