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

## Topics to cover
- Parallel run
- Pipeline intergration
- Multiple tabs
- POM
- Fixtures
- API testing
- Accessibility testing
- Performance testing
- Mobile Web
- Parameterised tests
- Retries
- Sharing of auths
- Mocking and changing responses (Network)
- Visual comparision
- Video
- retry failed tests
- cross browser testing
