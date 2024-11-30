import { test, expect } from '@playwright/test';

test('Playwright homepage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveScreenshot('playwright-homepage.png');
});

