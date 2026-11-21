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

const PAGE_URL = 'https://the-internet.herokuapp.com/date_pickers';

export class DateTimePickersPage {
    private readonly page: Page;
    private readonly inputs: Record<NativePickerField, Locator>;
    private readonly openCalendarButton: Locator;
    private readonly previousMonthButton: Locator;
    private readonly nextMonthButton: Locator;
    readonly selectedValues: Locator; // Exposed solely for web-first assertion in tests/
    readonly appointmentInput: Locator; // Exposed solely for web-first assertion in tests/
    readonly calendar: Locator; // Exposed solely for web-first assertion in tests/
    readonly calendarMonth: Locator; // Exposed solely for web-first assertion in tests/

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

        // Calendar widget ("Appointment"): read-only field + toggle button + month grid
        this.appointmentInput = page.getByRole('textbox', { name: 'Appointment', exact: true });
        this.openCalendarButton = page.getByRole('button', { name: 'Open calendar', exact: true });
        this.previousMonthButton = page.getByRole('button', { name: 'Previous month', exact: true });
        this.nextMonthButton = page.getByRole('button', { name: 'Next month', exact: true });
        this.calendar = page.getByRole('table');
        this.calendarMonth = page.getByRole('strong').filter({ hasText: /^[A-Z][a-z]+ \d{4}$/ });
    }

    async open(): Promise<void> {
        await this.page.goto(PAGE_URL);
    }

    /**
     * Opens the page with the calendar starting on a fixed month (`YYYY-MM`) and opens the calendar.
     * Use this instead of the default (current month) so tests do not depend on the run date.
     */
    async openCalendarAt(month: string): Promise<void> {
        await this.page.goto(`${PAGE_URL}?month=${encodeURIComponent(month)}`);
        await this.openCalendarButton.click();
    }

    /** Moves the open calendar forward (positive) or back (negative) by the given number of months. */
    async moveCalendar(months: number): Promise<void> {
        const button = months >= 0 ? this.nextMonthButton : this.previousMonthButton;
        for (let i = 0; i < Math.abs(months); i++) {
            await button.click();
        }
    }

    /** Picks a day of the month currently shown in the open calendar. */
    async pickAppointmentDay(day: number): Promise<void> {
        await this.calendar.getByRole('button', { name: String(day), exact: true }).click();
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
