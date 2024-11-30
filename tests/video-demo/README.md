# Screenshots and Videos on Test Failures

Playwright offers robust features for capturing screenshots and recording videos of test execution, providing invaluable insights into test failures and overall test behavior.

## Screenshots

### 1. Capture Screenshots Manually
```ts
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'fullpage.png', fullPage: true });
await page.getByRole('link').screenshot({ animations: 'disabled', path: 'link.png' }); //screenshot of a particular element
await page.screenshot({
  path: 'screenshot.png',
  fullPage: false, // Capture only the visible viewport
  clip: {
    x: 100,
    y: 100,
    width: 800,
    height: 600
  }
});
// see `PageScreenshotOptoins`
```
- options for screenshots
    - `path`: Specify the file path where the screenshot will be saved.
    - `fullPage`: Set to `true` to capture the entire page (default is false for the visible viewport).
    - `type`: Specify the image format (`png` or `jpeg`).
    - `quality`: For JPEG, set image quality (0-100).
    - `clicp` : For providing the 

### 2. Automatic Screenshot on Failure
You can configure Playwright to take a screenshot automatically if a test fails. Add this to your `playwright.config.ts`:

```ts
export default {
  use: {
    screenshot: 'only-on-failure', // Options: 'on', 'off', 'only-on-failure', 'on-first-failure'
  },
};
```

Full-Page Screenshots: Capture entire web pages, including areas that are not currently visible.
Element Screenshots: Capture specific elements within a page.
Custom Dimensions: Specify the desired dimensions for screenshots.
File Formats: Save screenshots in various formats like PNG, JPEG, and PDF.

## Video Recording

### 1. You can enable video recording for your tests globally in the configuration

```ts
export default {
  use: {
    video: 'on', // Options: 'on', 'off', 'retain-on-failure', 'on-first-retry'
    outputDir: 'test-results/videos', // Directory for saving videos
    size: { width: 640, height: 480 }
  },
};
```
- Options for video:
    - `on`: Record video for all tests.
    - `off`: Disable video recording.
    - `retain-on-failure`: Record videos only for failing tests.
    - `on-first-retry`: Record videos only during the first retry of a failing test.

### 2. Enable video for a specific test dynamically
```ts
test('Test with video recording', async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  await page.goto('https://example.com');
  // Perform actions...
  await context.tracing.stop();
```
