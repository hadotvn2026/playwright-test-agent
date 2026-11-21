import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TablePage } from '../pages/table.page';

type HerokuFixtures = {
    loginPage: LoginPage,
    tablePage: TablePage,
}

export const test = base.extend<HerokuFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    tablePage: async ({ page }, use) => {
        await use(new TablePage(page));
    }
});

export { expect } from '@playwright/test';