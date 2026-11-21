import { test, expect } from '../fixtures/pages.fixture';

test.describe('Playwright.dev home page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('displays the correct page title', async ({ page, homePage }) => {
    await expect(page).toHaveTitle(/Playwright/);
    await expect(homePage.heroHeading).toContainText('Playwright');
  });

  test('displays the Get Started button and navigates to the intro docs', async ({ page, homePage }) => {
    await expect(homePage.getStartedLink).toBeVisible();

    await homePage.startGettingStarted();

    await expect(page).toHaveURL(/\/docs\/intro$/);
  });
});
