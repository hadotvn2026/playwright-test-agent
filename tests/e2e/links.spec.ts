import { test, expect } from '../../fixtures/e2e/heroku.fixture';

test('verify hyperlink success', async ({ page, statusCodesPage }) => {
    await statusCodesPage.open();

    for (const code of ['200', '301', '404', '500']) {
        await statusCodesPage.openStatusCode(code);
        await expect(page).toHaveURL(`https://the-internet.herokuapp.com/status_codes/${code}`);

        await statusCodesPage.returnToStatusCodes();
    }
});
