import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=common/home');
  await page.getByRole('button', { name: ' My account' }).click();
  await page.getByRole('link', { name: ' Register' }).click();
  await page.getByPlaceholder('First Name').click();
  await page.getByPlaceholder('First Name').fill('uty');
  await page.getByPlaceholder('Last Name').click();
  await page.getByPlaceholder('Last Name').fill('kju');
  await page.getByPlaceholder('E-Mail').click();
  await page.getByPlaceholder('E-Mail').fill('yutyytf@gmail.com');
  await page.getByPlaceholder('Telephone').fill('5646546574');
  await page.getByPlaceholder('Password', { exact: true }).click();
  await page.getByPlaceholder('Password', { exact: true }).fill('123456');
  await page.getByPlaceholder('Password Confirm').click();
  await page.getByPlaceholder('Password Confirm').fill('123456');
  await page.getByText('I have read and agree to the').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('h1')).toContainText('Your Account Has Been Created!');
});