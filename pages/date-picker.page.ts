import { type Page, type Locator } from '@playwright/test';
import { formatDateWithOrdinalDay } from '../utils/date.utils';

export class DatePickerPage {
    private readonly page: Page;
    readonly customDateTrigger: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.customDateTrigger = page.getByTestId('date-custom-trigger');
    }

    async open(): Promise<void> {
        await this.page.goto('https://qa-demo-site-ten.vercel.app/elements/date-picker');
    }

    /** Opens the custom date picker and picks the given day from the calendar. */
    async selectCustomDate(date: Date): Promise<void> {
        await this.customDateTrigger.click();
        const dayButtonName = `${formatDateWithOrdinalDay(date, { weekday: 'long', month: 'long', day: 'numeric' })},`;
        await this.page.getByRole('button', { name: dayButtonName }).click();
    }
}
