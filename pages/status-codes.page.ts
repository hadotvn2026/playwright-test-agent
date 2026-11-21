import { type Page, type Locator } from '@playwright/test';

export class StatusCodesPage {
    private readonly page: Page;
    private readonly backLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backLink = page.getByRole('link', { name: 'here', exact: true });
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/status_codes');
    }

    async openStatusCode(code: string): Promise<void> {
        await this.page.getByRole('link', { name: code, exact: true }).click();
    }

    async returnToStatusCodes(): Promise<void> {
        await this.backLink.click();
        await this.page.waitForURL('**/status_codes');
    }
}
