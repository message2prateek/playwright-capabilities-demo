import { test, expect } from '@playwright/test';

test('Can record video within a test', async ({ page }) => {
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
    await page.getByRole('button', { name: ' My account' }).click();
    await page.getByPlaceholder('E-Mail Address').click();
    await page.getByPlaceholder('E-Mail Address').fill('sd');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('1');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#account-login')).toContainText('Warning: match for E-Mail Address and/or Password.');
});
