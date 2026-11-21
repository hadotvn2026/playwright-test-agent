import { type Page, type Locator } from '@playwright/test';

export class DemoDropdownPage {
    private readonly page: Page;
    private readonly shadcnSelectTrigger: Locator;
    readonly languagesSelect: Locator; // Exposed solely for web-first assertion in tests/
    readonly frameworkSelection: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.shadcnSelectTrigger = page.getByTestId('dropdown-shadcn-trigger');
        this.languagesSelect = page.getByTestId('dropdown-multiple');
        this.frameworkSelection = page.getByText(/^Selected:/);
    }

    async open(): Promise<void> {
        await this.page.goto('https://qa-demo-site-ten.vercel.app/elements/dropdown');
    }

    async selectLanguages(labels: string[]): Promise<void> {
        await this.languagesSelect.selectOption(labels);
    }

    async clearLanguages(): Promise<void> {
        await this.languagesSelect.selectOption([]);
    }

    /** Opens the custom (shadcn) select and picks a framework from its list. */
    async chooseFramework(name: string): Promise<void> {
        await this.shadcnSelectTrigger.click();
        await this.page.getByRole('option', { name }).click();
    }
}
