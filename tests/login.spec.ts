import { test, expect } from '../fixtures/heroku.fixture';

test('login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.open();
    const username = process.env.USERNAME!;
    const password = process.env.PASSWORD ?? 'defaultPassword';
    await loginPage.login(username, password);
    await expect(loginPage.secureAreaHeading).toBeVisible();
});

//data driven test for login failure with invalid credentials
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