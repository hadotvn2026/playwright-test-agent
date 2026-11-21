import { type Page, type Locator } from '@playwright/test';

export class DropdownPage {
    private readonly page: Page;
    readonly dropdown: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.dropdown = page.getByRole('combobox');
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/dropdown');
    }

    async selectOptionByLabel(label: string): Promise<void> {
        await this.dropdown.selectOption({ label });
    }

    async clearSelection(): Promise<void> {
        await this.dropdown.selectOption([]);
    }
}
