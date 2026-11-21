import { test, expect } from '../fixtures/qademo.fixture';
import { daysFromToday, formatDateWithOrdinalDay } from '../utils/date.utils';

test('verify able to select date from datepicker', async ({ datePickerPage }) => {
    // chon ngay cach ngay hom nay 1 tuan
    const date = daysFromToday(7);
    const expectedText = formatDateWithOrdinalDay(date, { month: 'long', day: 'numeric', year: 'numeric' });

    await datePickerPage.open();
    await datePickerPage.selectCustomDate(date);

    await expect(datePickerPage.customDateTrigger).toHaveText(expectedText);
});
