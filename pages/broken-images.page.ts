import { type Page, type Locator } from '@playwright/test';

export type ImageStatus = {
    src: string;
    status: number;
};

export class BrokenImagesPage {
    private readonly page: Page;
    private readonly images: Locator;

    constructor(page: Page) {
        this.page = page;
        this.images = page.getByRole('img', { includeHidden: true });
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/broken_images');
    }

    async getImageStatuses(): Promise<ImageStatus[]> {
        const statuses: ImageStatus[] = [];
        for (const image of await this.images.all()) {
            const src = (await image.getAttribute('src')) ?? '';
            const response = await this.page.request.get(new URL(src, this.page.url()).href);
            statuses.push({ src, status: response.status() });
        }
        return statuses;
    }
}
