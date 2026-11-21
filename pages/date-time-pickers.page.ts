import { type Page, type Locator } from '@playwright/test';

/** The native inputs on the page, in the order the page reports their values. */
export const NATIVE_PICKER_FIELDS = ['date', 'time', 'datetime', 'month', 'week'] as const;
export type NativePickerField = (typeof NATIVE_PICKER_FIELDS)[number];
export type NativePickerValues = Partial<Record<NativePickerField, string>>;

const FIELD_LABELS: Record<NativePickerField, string> = {
    date: 'Date',
    time: 'Time',
    datetime: 'Date and time',
    month: 'Month',
    week: 'Week',
};

export class DateTimePickersPage {
    private readonly page: Page;
    private readonly inputs: Record<NativePickerField, Locator>;
    readonly selectedValues: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.inputs = {
            date: page.getByRole('textbox', { name: FIELD_LABELS.date, exact: true }),
            time: page.getByRole('textbox', { name: FIELD_LABELS.time, exact: true }),
            datetime: page.getByRole('textbox', { name: FIELD_LABELS.datetime, exact: true }),
            month: page.getByRole('textbox', { name: FIELD_LABELS.month, exact: true }),
            week: page.getByRole('textbox', { name: FIELD_LABELS.week, exact: true }),
        };
        // Summary line under the native inputs: "No values yet" or "date: ..., time: ..."
        this.selectedValues = page
            .getByRole('paragraph')
            .filter({ hasText: /^(No values yet|(date|time|datetime|month|week): )/ });
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/date_pickers');
    }

    /** Sets the given native pickers using their standard value formats (e.g. date 2026-04-15, week 2026-W16). */
    async setNativeValues(values: NativePickerValues): Promise<void> {
        for (const field of NATIVE_PICKER_FIELDS) {
            const value = values[field];
            if (value !== undefined) {
                await this.inputs[field].fill(value);
            }
        }
    }

    async clearNativeValues(fields: readonly NativePickerField[]): Promise<void> {
        for (const field of fields) {
            await this.inputs[field].clear();
        }
    }
}

/** Builds the summary text the page shows for the given values ("No values yet" when empty). */
export function expectedSummary(values: NativePickerValues): string {
    const parts = NATIVE_PICKER_FIELDS
        .filter(field => values[field] !== undefined && values[field] !== '')
        .map(field => `${field}: ${values[field]}`);
    return parts.length > 0 ? parts.join(', ') : 'No values yet';
}
