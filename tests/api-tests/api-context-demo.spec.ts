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

test('can create a booking using API call', async ({ }) => {
    const response = await apiRequestContext.post("/booking", {
        data: bookingDetails
    });

    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

});


test.afterAll(async ({ }) => {
    await apiRequestContext.dispose();
})