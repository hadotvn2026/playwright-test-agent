import { test, expect } from '@playwright/test';

test('login successfully with valid credentials', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login')
    await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith')
    await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!')
    await page.getByRole('button', { name: ' Login' }).click()

    await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure')
    await expect(page.getByRole('heading', { name: 'Welcome to the Secure Area.' })).toBeVisible()
});

//data driven test for login failure with invalid credentials
[
    { username: 'tomsmit', password: 'SuperSecretPassword!', expectedErrorMessage: 'Your username is invalid!\n×' },
    { username: '', password: 'SuperSecretPassword!', expectedErrorMessage: 'Your username is invalid!\n×' },
    { username: '', password: '', expectedErrorMessage: 'Your username is invalid!\n×' },
    { username: 'tomsmith', password: 'wrongpassword', expectedErrorMessage: 'Your password is invalid!\n×' },
    { username: 'tomsmith', password: '', expectedErrorMessage: 'Your password is invalid!\n×' },
].forEach(({ username, password, expectedErrorMessage }) => {
    test(`login fail with invalid ${username} and ${password} should display error message ${expectedErrorMessage}`, async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/login')
        await page.getByRole('textbox', { name: 'Username' }).fill(username)
        await page.getByRole('textbox', { name: 'Password' }).fill(password)
        await page.getByRole('button', { name: ' Login' }).click()

        await expect(page.locator('.error')).toHaveText(expectedErrorMessage)
    })
})