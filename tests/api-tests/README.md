# API testing using Playwright

There are times when we want to interact with the server directly without going through the UI for example
- Testing the server API.
- Praparing the server side state i.e. test data setup, before running the test.
- Validate state on the sever post runing actions during a test through the browser.

Playwright allows us to interact and test the API withing requiring additional tooling.

## 1. Requirenments
- API to test. Exampels use API provided by https://restful-booker.herokuapp.com/
- Additional packages
    - faker-js : generate test data
    - luxon : to generate dates
    > npm install --save-dev @faker-js/faker luxon rimraf
## 2. Configuration

- We can optionally setup the `baseURL` within the `playwright.config.ts` file to simplify the tests.
    ```ts
    import { defineConfig } from '@playwright/test';
    export default defineConfig({
    use: {
        // All requests we send go to this API endpoint.
        baseURL: 'https://api.github.com',
        extraHTTPHeaders: {
        // We can setup headears for all requests
        'Accept': 'application/json',
        // Add authorization token to all requests.
        // Assuming personal access token available in the environment.
        'Authorization': `token ${process.env.API_TOKEN}`,
        },
    }
    });
    ```
## 3. Using setup and teardown in tests
```ts
test.beforeAll(async ({ request }) => {
  // Create a new repository
  const response = await request.post('/users', {
    data: {
      name: "John"
    }
  });
  expect(response.ok()).toBeTruthy();
});

test('should return valid user details', ({request})=> {
//  ....
});

test.afterAll(async ({ request }) => {
  // Delete the repository
  const response = await request.delete(`/users/${USER}`);
  expect(response.ok()).toBeTruthy();
});
```

## 4. Using request context
Let's first understand the classes involved.

### 4.1 APIRequestContext
- The `request` fixture passed to the tests is an instance of `APIRequestContext` class. 
 - This class contains methods which allow us to make API calls e.g. `get()`, `post()`, `put()` etc.
- Apart from API related methods this class also has a method called `storageState()` 
    - it returns the storage state for the request context. The response contains current cookies and local storage snapshot if it was passed to the constructor.
    ```ts
        await apiRequestContext.storageState();
        await apiRequestContext.storageState(options);
    ```
     

### 4.2 APIRequest
- This is the class which is used to create the `APIRequestContext` instance. 
- There is only one method in this class which is `newContext()`, which return an instance of `APIRequestContext`. The `request` fixture which is passed to a API test case is an instance of `APIRequestContext`.
- An instance of this class can be obtained from `playwright.request()` 
    ```ts
        await apiRequest.newContext();
        await apiRequest.newContext(options);
    ```
    - `options` which can be passed include
        - baseURL
        - clientCertificates
        - extraHTTPHeaders
        - httpCredentials 
            - username
            - password
        - proxy
        - storageState
            - cookies
            - origins

- See test `api-context-demo.spec.ts`

## 5. Combining API calls and UI steps in a test

```ts
import { test, APIRequestContext, expect, request } from '@playwright/test'
import bookingDetails from './test-data/single-booking-details.json'
let apiRequestContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
    // rather than using the default request` fixture, we create our own context in a test to set baseurl, cookies and headers etc.
    apiRequestContext = await playwright.request.newContext({
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
            'Accept': 'application/json',
            // 'Authorization': `token ${process.env.API_TOKEN}`,
        }
    });
    request.newContext()
});

test('can create a booking using UI and validate through API', async ({page}) => {
    await page.goto('https://booking.com/');
    // ...

    await response = apiRequestContext.get('/bookings/{$bookingId}');
    expect(response.ok().toBeTruthy());
    expect(response.booking).toHaveProperty("firstname", "John");
});


test.afterAll(async ({ }) => {
    await apiRequestContext.dispose();
});
```
## 6. Further reading

- https://playwright.dev/docs/api-testing
- https://www.lambdatest.com/learning-hub/playwright-api-testing

