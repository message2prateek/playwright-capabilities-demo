import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
  await page.getByRole('button', { name: 'Shop by Category' }).click();
  await page.getByRole('link', { name: 'Software' }).click();
  await page.getByRole('link', { name: 'HTC Touch HD HTC Touch HD HTC' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'View Cart ' }).click();
  await expect(page.getByRole('link', { name: 'Checkout' })).toBeVisible();
});