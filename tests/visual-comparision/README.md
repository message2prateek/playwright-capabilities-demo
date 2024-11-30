# Visual Comparision

We can perform the visual comparision of a page by adding below code to our test
```ts
await expect(page).toHaveScreenshot('page-descriptor.png');
```
The firt time we run the test we are going to get an error 