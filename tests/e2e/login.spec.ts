import { test, expect } from '../../fixtures/e2e/heroku.fixture';
import { requireEnv } from '../../utils/e2eUtils/env.utils';

test('login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(requireEnv('LOGIN_USERNAME'), requireEnv('LOGIN_PASSWORD'));
    await expect(loginPage.secureAreaHeading).toBeVisible();
});

[
    { username: 'tomsmit', password: 'SuperSecretPassword!', expectedErrorMessage: 'Your username is invalid!\n×' },
    { username: '', password: 'SuperSecretPassword!', expectedErrorMessage: 'Your username is invalid!\n×' },
    { username: '', password: '', expectedErrorMessage: 'Your username is invalid!\n×' },
    { username: 'tomsmith', password: 'wrongpassword', expectedErrorMessage: 'Your password is invalid!\n×' },
    { username: 'tomsmith', password: '', expectedErrorMessage: 'Your password is invalid!\n×' },
].forEach(({ username, password, expectedErrorMessage }) => {
    test(`login fail with invalid ${username} and ${password} should display error message ${expectedErrorMessage}`, async ({ loginPage }) => {
        await loginPage.open();
        await loginPage.login(username, password);
        await expect(loginPage.errorMessage).toContainText(expectedErrorMessage);
    })
})