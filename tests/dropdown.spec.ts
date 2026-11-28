import { mergeTests } from '@playwright/test';
import { test as herokuTest } from '../fixtures/heroku.fixture';
import { test as qaDemoTest, expect } from '../fixtures/qademo.fixture';

const test = mergeTests(herokuTest, qaDemoTest);

test('verify select a option success', async ({ dropdownPage }) => {
    await dropdownPage.open();

    await dropdownPage.selectOptionByLabel('Option 1');
    await expect(dropdownPage.dropdown).toHaveValue('1');

    await dropdownPage.clearSelection();
});

test('verify selecting multiple options success', async ({ demoDropdownPage }) => {
    await demoDropdownPage.open();

    await demoDropdownPage.selectLanguages(['Java', 'Go']);
    await expect(demoDropdownPage.languagesSelect).toHaveValues(['java', 'go']);

    await demoDropdownPage.clearLanguages();
    await expect(demoDropdownPage.languagesSelect).toHaveValues([]);
});

test('verify standard select', async ({ demoDropdownPage }) => {
    await demoDropdownPage.open();

    await demoDropdownPage.chooseFramework('Next.js');

    await expect(demoDropdownPage.frameworkSelection).toHaveText('Selected: next');
});
