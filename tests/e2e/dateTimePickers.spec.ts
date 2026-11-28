import { test, expect } from '../../fixtures/e2e/heroku.fixture';
import { expectedSummary, type NativePickerValues } from '../../pages/date-time-pickers.page';

const SPECIFIC_VALUES = {
    date: '2026-04-15',
    time: '13:45',
    datetime: '2026-04-15T13:45',
    month: '2026-04',
    week: '2026-W16',
} as const satisfies NativePickerValues;

test.describe('Date & Time Pickers - native inputs', () => {
    test.beforeEach(async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.open();
    });

    test('shows "No values yet" before anything is selected', async ({ dateTimePickersPage }) => {
        await expect(dateTimePickersPage.selectedValues).toHaveText('No values yet');
    });

    for (const [field, value] of Object.entries(SPECIFIC_VALUES)) {
        test(`shows the selected ${field} value`, async ({ dateTimePickersPage }) => {
            await dateTimePickersPage.setNativeValues({ [field]: value });

            await expect(dateTimePickersPage.selectedValues).toHaveText(`${field}: ${value}`);
        });
    }

    test('shows every selected value together, in page order', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.setNativeValues(SPECIFIC_VALUES);

        await expect(dateTimePickersPage.selectedValues).toHaveText(expectedSummary(SPECIFIC_VALUES));
    });

    test('updates the shown values when the user changes or clears a picker', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.setNativeValues(SPECIFIC_VALUES);
        await dateTimePickersPage.setNativeValues({ date: '2026-12-31' });
        await dateTimePickersPage.clearNativeValues(['time', 'week']);

        await expect(dateTimePickersPage.selectedValues).toHaveText(
            expectedSummary({ date: '2026-12-31', datetime: SPECIFIC_VALUES.datetime, month: SPECIFIC_VALUES.month }),
        );
    });
});
