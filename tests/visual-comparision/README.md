# Visual Comparision

## 1. Page comparision
We can perform the visual comparision of a page by adding below code to our test
```ts
await expect(page).toHaveScreenshot('page-descriptor.png');
```
The firt time we run the test we are going to get an error 
"Error: A snapshot doesn't exist at tests\visual-comparision\screenshot-comparison-demo.spec.ts-snapshots\playwright-homepage-chromium-win32.png, writing actual."

This is expected. This means that there isn't an existing screenshot for Playwright to compare with and playwright takes a base screenshot for furture comparision. On subsequent run, playwright is going to take a new screenshot and compare with already saves snapshot.

## 2. Element Comparision
Playwright allows us to visual test an element.

```ts
test('Input element is rendered correctly', async ({ page }) => {
    const inputElement = await page.locator('.new-todo');
    await expect(inputElement).toHaveScreenshot('inputElement.png');
});
```
