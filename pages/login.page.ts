import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    readonly errorMessage: Locator; // Exposed solely for web-first assertion in tests/
    readonly secureAreaHeading: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.getByRole('region', { name: 'Messages' });
        this.secureAreaHeading = page.getByRole('heading', { name: 'Welcome to the Secure Area.' });
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/login');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
