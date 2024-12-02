import { test, expect } from "@playwright/test"

test('has title', async ({ page }) => {
    await page.goto('https://ecommerce-playground.lambdatest.io/')
    await expect(page).toHaveTitle('Your Store')
})