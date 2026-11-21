import { type Page, type Locator } from '@playwright/test';

export class FileUploadPage {
    private readonly page: Page;
    private readonly fileInput: Locator;
    private readonly uploadButton: Locator;
    readonly uploadResult: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.fileInput = page.getByRole('button', { name: 'Choose File' });
        this.uploadButton = page.getByRole('button', { name: 'Upload' });
        this.uploadResult = page.getByRole('main');
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/upload');
    }

    async uploadFile(filePath: string): Promise<void> {
        await this.fileInput.setInputFiles(filePath);
        await this.uploadButton.click();
    }
}
