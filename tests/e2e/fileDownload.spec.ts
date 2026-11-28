import { test, expect } from '../../fixtures/e2e/heroku.fixture';
import * as fs from 'node:fs';

test('verify able to download a file', async ({ fileDownloadPage }) => {
    await fileDownloadPage.open();

    const { suggestedFilename, savedPath } = await fileDownloadPage.downloadFile('sample.json', 'downloads');

    expect(suggestedFilename).toBe('sample.json');
    expect(fs.existsSync(savedPath)).toBeTruthy();
});
