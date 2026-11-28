import { test as base } from '@playwright/test';
import { BrokenImagesPage } from '../../pages/broken-images.page';
import { DateTimePickersPage } from '../../pages/date-time-pickers.page';
import { DropdownPage } from '../../pages/dropdown.page';
import { FileDownloadPage } from '../../pages/file-download.page';
import { FileUploadPage } from '../../pages/file-upload.page';
import { LoginPage } from '../../pages/login.page';
import { StatusCodesPage } from '../../pages/status-codes.page';
import { TablePage } from '../../pages/table.page';

type HerokuFixtures = {
    brokenImagesPage: BrokenImagesPage,
    dateTimePickersPage: DateTimePickersPage,
    dropdownPage: DropdownPage,
    fileDownloadPage: FileDownloadPage,
    fileUploadPage: FileUploadPage,
    loginPage: LoginPage,
    statusCodesPage: StatusCodesPage,
    tablePage: TablePage,
}

export const test = base.extend<HerokuFixtures>({
    brokenImagesPage: async ({ page }, use) => {
        await use(new BrokenImagesPage(page));
    },
    dateTimePickersPage: async ({ page }, use) => {
        await use(new DateTimePickersPage(page));
    },
    dropdownPage: async ({ page }, use) => {
        await use(new DropdownPage(page));
    },
    fileDownloadPage: async ({ page }, use) => {
        await use(new FileDownloadPage(page));
    },
    fileUploadPage: async ({ page }, use) => {
        await use(new FileUploadPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    statusCodesPage: async ({ page }, use) => {
        await use(new StatusCodesPage(page));
    },
    tablePage: async ({ page }, use) => {
        await use(new TablePage(page));
    },
});

export { expect } from '@playwright/test';
