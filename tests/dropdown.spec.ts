import { test, expect } from '@playwright/test';

test('verify select a option success', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');

    await page.getByRole('combobox').selectOption({ label: 'Option 1' }); // select option by text
    await expect(page.locator('#dropdown')).toHaveValue('1'); // verify option 1 is selected

    await page.getByRole('combobox').selectOption([]); // unselect all options
})

test('verify selecting multiple options success', async ({ page }) => {
    await page.goto('https://qa-demo-site-ten.vercel.app/elements/dropdown')

    await page.getByTestId('dropdown-multiple')
        .selectOption(['Java', 'Go']); // select multiple options

    await expect(page.getByTestId('dropdown-multiple')).toHaveValues(['java', 'go']); // verify multiple options are selected

    await page.getByTestId('dropdown-multiple')
        .selectOption([]); // unselect all options
    await expect(page.getByTestId('dropdown-multiple')).toHaveValues([]); // verify multiple options are selected

})

test('verify standard select', async ({ page }) => {
    await page.goto('https://qa-demo-site-ten.vercel.app/elements/dropdown')

    await page.getByTestId('dropdown-shadcn-trigger').click();
    await page.getByRole('option', { name: 'Next.js' }).click();

    await expect(page.getByText('Selected: next')).toBeVisible(); // verify selected option is displayed

})