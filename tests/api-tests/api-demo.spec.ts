import { test, expect } from '@playwright/test'
import bookingDetails from './test-data/single-booking-details.json'
import { faker } from '@faker-js/faker'
import { DateTime } from "luxon"

test('can create a booking', async ({ request }) => {
    const response = await request.post("/booking", {
        data: bookingDetails
    });

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", "John")
    expect(responseBody.booking).toHaveProperty("lastname", "Doe")
    expect(responseBody.booking).toHaveProperty("totalprice", 123)
    expect(responseBody.booking).toHaveProperty("depositpaid", true)
});

test('can filter booking based on name', async ({ request }) => {
    const response = await request.get("/booking", {
        params: {
            firstname: 'Josh',
            lastname: 'Allen'
        }
    });

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

});

test('can create a booking with dynamic data', async ({ request }) => {
    const randomFirstName = faker.person.firstName()
    const randomLastName = faker.person.lastName()
    const randomNumber = faker.number.int(4)
    const currentDate = DateTime.now().toFormat('yyyy-MM-dd')
    const currentDatePlusTen = DateTime.now().plus({ days: 10 }).toFormat('yyyy-MM-dd')

    const response = await request.post("/booking", {
        data: {
            "firstname": randomFirstName,
            "lastname": randomLastName,
            "totalprice": randomNumber,
            "depositpaid": true,
            "bookingdates": {
                "checkin": currentDate,
                "checkout": currentDatePlusTen
            },
            "additionalneeds": "Sauna"
        }
    });
    console.log(await response.json())
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", randomFirstName)
    expect(responseBody.booking).toHaveProperty("lastname", randomLastName)
})
