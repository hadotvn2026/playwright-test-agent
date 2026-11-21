import {test, expect} from '@playwright/test';

function getOrdinalSuffix(day: number): string {
    const lastTwoDigits = day % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return 'th';
    }

    return ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th');
}

function formatDateWithOrdinalDay(
    date: Date,
    options: Intl.DateTimeFormatOptions,
): string {
    return new Intl.DateTimeFormat('en-US', options)
        .formatToParts(date)
        .map(({ type, value }) =>
            type === 'day' ? `${value}${getOrdinalSuffix(Number(value))}` : value,
        )
        .join('');
}

test('verify able to select date from datepicker', async ({page}) => {
    await page.goto('https://qa-demo-site-ten.vercel.app/elements/date-picker')

    await page.getByTestId('date-custom-trigger').click()
    // chon ngay cach ngay hom nay 1 tuan
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const dateButtonName =
        `${formatDateWithOrdinalDay(date, { weekday: 'long', month: 'long', day: 'numeric' })},`;
    const formattedDate = formatDateWithOrdinalDay(date, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    await page.getByRole('button', { name: dateButtonName }).click();

    expect(await page.getByTestId('date-custom-trigger').textContent()).toBe(formattedDate)
})