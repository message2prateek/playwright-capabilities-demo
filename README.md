# Playwright Capabilities Demo 🎭

## How to run the tests

### 1. Run all the tests
```bash
npx playwright test
```

### 2. Run a specefic test file 
```bash
npx playwright test path/to/your-test-file.spec.ts
```

### 3. Run test using a pattern
```bash
npx playwright test test/**/*.spec.ts
```

### 4. Run a Specific Test by Its Name

```bash
npx playwright test -g "should load the homepage"
```
### 5. Combine with a specific project
```bash
npx playwright test -g "should load the homepage" --project=firefox
```
### 6. Tagging Tests
```ts
// In your test file
test.describe('Smoke tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('https://example.com');
  });
});

// Add a tag to this test
test('should login successfully', { tags: ['smoke'] }, async ({ page }) => {
  // Test code here
});
```
Run tets with the `smoke` tag
```bash
npx playwright test --grep @smoke
```

## Parallel Execution

### 1. Default behaviour
Playwright runs tests in parallel by default, utilizing multiple worker processes to speed up execution.
Tests in Playwright are parallelised at the file level and also across projects if you have multiple browsers or configurations defined.

To run tests in parallel, simply execute the tests:
```bash
npx playwright test
```
Playwright will automatically detect the number of available CPU cores and run tests across them.

### 2. Control Parallelism with workers
You can specify the number of worker processes (parallel threads) directly in the Playwright configuration file (`playwright.config.ts`) or via the command line.

In Configuration File:
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 4, // Set the desired number of parallel workers
});
```
On the Command Line:
Override the number of workers dynamically:

```bash
npx playwright test --workers=4
```
Set `--workers=1` to run tests sequentially if needed.

### 3. Parallelise Tests within a File
By default, tests within a single file run sequentially. If you have independent tests in a single file that can run in parallel, you can use the `test.describe.configure()` method:

```ts
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('Test 1', async ({ page }) => {
  await page.goto('https://example.com');
});

test('Test 2', async ({ page }) => {
  await page.goto('https://example.org');
});
```
This will run the tests in the file concurrently.

### 4. Parallelise Across Projects aka. cross browser testing
If your `playwright.config.ts` defines multiple projects (e.g., for different browsers or devices), tests will run in parallel across those projects:

```ts
export default defineConfig({
  projects: [
    { name: 'Chrome', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
  ],
});
```
Run them with:

```bash
npx playwright test
```
### 5. Set Test-Level Parallelism with Sharding
You can shard tests across workers using the `--shard` flag or configure it in the `playwright.config.ts`. For example:

```ts
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'shard-1',
      testDir: './tests',
      shard: { total: 2, current: 1 }, // First half
    },
    {
      name: 'shard-2',
      testDir: './tests',
      shard: { total: 2, current: 2 }, // Second half
    },
  ],
});
```
Run specific shards using:
```bash
npx playwright test --project=shard-1
```
## Retry failed tests

### 1. Global config
You can define the number of retries globally in your `playwright.config.ts` file:

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2, // Number of retries for failed tests
  use: {
    headless: true,
  },
});
```
`retries`: Sets the number of retries for all tests. In this example, failed tests will retry up to 2 times.

### 2. Set Retries for Specific Tests
If you want to override retries for a specific test or group of tests, use the `test` or `test.describe` configuration:

```ts
import { test } from '@playwright/test';

test('This test retries up to 3 times', async ({ page }) => {
  test.info().config({ retries: 3 }); // Set retries dynamically
  await page.goto('https://example.com');
  // Test logic...
});
```
Or for a group of tests:

```ts
test.describe('Group with custom retries', () => {
  test.describe.configure({ retries: 1 }); // Retry once for this group
  test('Test in this group', async ({ page }) => {
    await page.goto('https://example.com');
  });
});
```

### 3. Run with Retries from the Command Line
You can override the retries configuration from the command line when running tests:

```bash
npx playwright test --retries=3
```
This will apply the specified number of retries to all tests for this run.

### 4. Debugging Flaky Tests with Retries
Example Configuration for Retries with Debug Artifacts

```ts
export default defineConfig({
  retries: 2,
  use: {
    video: 'on-first-retry', // Video only on retry
    trace: 'on-first-retry', // Trace only on retry
    screenshot: 'only-on-failure', // Screenshot for failures
  },
});
```

## Topics to cover
- ~~Parallel run~~
- ~~codegen~~
- Pipeline intergration
- Multiple tabs
- POM
- Fixtures
- API testing
- Accessibility testing
- Performance testing
- Mobile Web
- Parameterised tests
- ~~Retries~~
- Sharing of auths
- Mocking and changing responses (Network)
- Visual comparision
- ``Video``
- retry failed tests
- ~~cross browser testing~~
