import { test, expect } from "@playwright/test";
import { executionAsyncId } from "async_hooks";

test('Should add item to cart', async ({ page }) => {
    const Url = 'https://ecommerce-playground.lambdatest.io/index.php/'; 
    await page.goto(Url);
    
    const response = await page.request.post(Url, {
        params: {
            route: "checkout/cart/add"
        },
        form: {
            product_id: 28,
            quantity: 1
        }
    })
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    await page.goto(`${Url}?route=checkout/cart`)
    await expect(page.locator("td.text-left", { hasText: 'HTC Touch HD' })).toBeVisible()
    await expect(page.locator("div[class$='flex-nowrap'] > input")).toHaveValue("1")
})