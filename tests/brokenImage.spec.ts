import { test, expect } from '../fixtures/heroku.fixture';

test('verify broken image', async ({ brokenImagesPage }) => {
    test.slow();
    await brokenImagesPage.open();

    const images = await brokenImagesPage.getImageStatuses();

    for (const { src, status } of images) {
        expect(src.length).toBeGreaterThan(1); // Ensure src attribute exists
        expect.soft(status, `image "${src}" should load`).toBe(200);
    }
});
