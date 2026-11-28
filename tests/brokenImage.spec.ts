import { test, expect } from '../fixtures/heroku.fixture';

const KNOWN_BROKEN_IMAGES = ['asdf.jpg', 'hjkl.jpg'];

test('detects exactly the known broken images', async ({ brokenImagesPage }) => {
    test.slow();
    await brokenImagesPage.open();

    const images = await brokenImagesPage.getImageStatuses();

    expect(images.length).toBeGreaterThan(KNOWN_BROKEN_IMAGES.length);
    const brokenImages = images.filter(({ status }) => status !== 200).map(({ src }) => src);
    expect(brokenImages).toEqual(KNOWN_BROKEN_IMAGES);
});
