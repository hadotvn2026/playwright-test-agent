import { type Page } from '@playwright/test';
import * as path from 'node:path';

export type DownloadResult = {
    suggestedFilename: string;
    savedPath: string;
};

export class FileDownloadPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/download');
    }

    async downloadFile(fileName: string, targetDir: string): Promise<DownloadResult> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.getByRole('link', { name: fileName }).click();
        const download = await downloadPromise;

        const suggestedFilename = download.suggestedFilename();
        const savedPath = path.join(targetDir, suggestedFilename);
        await download.saveAs(savedPath);
        return { suggestedFilename, savedPath };
    }
}
