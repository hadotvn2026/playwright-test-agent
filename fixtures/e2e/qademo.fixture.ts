import { test as base } from '@playwright/test';
import { DatePickerPage } from '../../pages/date-picker.page';
import { DemoDropdownPage } from '../../pages/demo-dropdown.page';

type QaDemoFixtures = {
    datePickerPage: DatePickerPage,
    demoDropdownPage: DemoDropdownPage,
}

export const test = base.extend<QaDemoFixtures>({
    datePickerPage: async ({ page }, use) => {
        await use(new DatePickerPage(page));
    },
    demoDropdownPage: async ({ page }, use) => {
        await use(new DemoDropdownPage(page));
    },
});

export { expect } from '@playwright/test';
