# Playwright Capabilities Demo 🎭

## Why not Cypress
https://www.bigbinary.com/blog/why-we-switched-from-cypress-to-playwright
https://mtlynch.io/notes/cypress-vs-playwright/
https://www.21risk.com/blog/migration-from-cypress-to-playwright-hype-or-great

- Playwright supports running tests in parallel out of the box.
- Playwright executes tests faster than Cypress.
- Cypress's semantics aren't intutive to use. 
  - Cypress chains asynchronous calls into functions that return a value resembling a `Promise` but aren't actual `Promises`. 
    - This pattern is less common in JavaScript, requiring additional mental effort to adapt and switch between.
    - This means that we can't use `await` and have to resort to using a `aliase` and `closure` to get a dynamic value from the page e.g. inner text from an element. Each new value will require another nested loop. e.g. suppose our app takes two numbers and returns the sum. 
       ```javascript
        // Cypress
            cy.get('[data-cy="first-number"]').as("firstNumber");
            cy.get('[data-cy="second-number"]').as("secondNumber");
            cy.get('[data-cy="sum"]').as("sum");

            // Create aliases to store value and use later
            cy.get("@firstNumber").invoke("text").then(parseInt).as("num1");
            cy.get("@secondNumber").invoke("text").then(parseInt).as("num2");
            cy.get("@sum").invoke("text").then(parseInt).as("displayedSum");

            // Use the aliases to perform the assertion
            cy.get("@num1").then(num1 => {
                cy.get("@num2").then(num2 => {
                    cy.get("@displayedSum").then(displayedSum => {
                    const expectedSum = num1 + num2;
                    expect(displayedSum).to.equal(expectedSum);
                    });
                });
            });
            // using await on the then() will return undefined as it does not return a promise
        ```
        ```javascript
        // Playwright
            const firstNumber = await page.getByTestId("first-number").innerText();
            const secondNumber = await page.getByTestId("second-number").innerText();
            const sum = await page.getByTestId("sum").innerText();
            expect(parseInt(firstNumber) + parseInt(secondNumber)).toBe(parseInt(sum));
        ```
  - Playwright uses consistant assertions
    - In Cypress assertions are tied to commend like `cy.get()` or `cy.click()` and therefore limiting flexibility when mixing custom logic with assertions.
    - Playwright uses standard Jest inspired assertions which makes switching between different tests easy e.g. unit tests and UI tests. Cypress 
        ```javascript
        // Cypress
        cy.get('.button').should('be.visible').and('contain', 'Submit');
        
        // Playwright
        await expect(page.locator('.button')).toBeVisible();
        await expect(page.locator('.button')).toHaveText('Submit');
        ```
     - While Cypress offers more choices in how the assertions are written, it can introduce inconsistancy in code. 
        ```javascript
            // Example of different assertion styles in Cypress
            it('can add numbers', () => {
                expect(add(1, 2)).to.eq(3)
            })

            it('can subtract numbers', () => {
                assert.equal(subtract(5, 12), -7, 'these numbers are equal')
            })

            cy.wrap(add(1, 2)).should('equal', 3)
        ```
- Playwright offers role-based locators that prioritize user-facing attributes, making them intuitive, closely aligned with the UI, and highly resilient. These locators are less affected by minor DOM changes, as roles and labels are more stable compared to the structure of the DOM.
    ```JavaScript
    // Cypress
        cy.get('button[type="submit"]'); // CSS selector
        
    // Playwright
        page.getByRole('button', { name: 'Next' }); // Role-based locator
        ```
Rerefences

[Why we swithed from Cypress to Playwright](https://www.bigbinary.com/blog/why-we-switched-from-cypress-to-playwright)
[Cypress vs Playwright](https://mtlynch.io/notes/cypress-vs-playwright/)
[Migration from Cypress to Playwright Hype or Great](https://www.21risk.com/blog/migration-from-cypress-to-playwright-hype-or-great)

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
## Global setup and teardown

Refer Playwright documentation [here](https://playwright.dev/docs/test-global-setup-teardown) 

## Topics to cover
- ~~Parallel run~~
- ~~codegen~~
- Pipeline intergration
- Multiple tabs
- POM
- Fixtures
- ~~API testing~~
- Accessibility testing
- Performance testing
- Mobile Web
- ~~Parameterised tests~~
- ~~Retries~~
- Sharing of auths
- Mocking and changing responses (Network)
- ~~Visual comparision~~
- ``Video``
- ~~retry failed tests~~
- ~~cross browser testing~~
- Re-use authentication between tests and test files
- project dependencies
- CLI option
  - `--last-failed`
  - `--only-changed`
- Setup Github actions
- projects
- ~~Cypress VS Playwright~~

