import { test, expect } from '../fixtures/heroku.fixture';

test('upload a file', async ({ fileUploadPage }) => {
    await fileUploadPage.open();

    await fileUploadPage.uploadFile('uploadFiles/demo.txt');

    await expect(fileUploadPage.uploadResult).toContainText('demo.txt');
});
