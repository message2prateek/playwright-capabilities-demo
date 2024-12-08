import test, { expect } from "@playwright/test"

[
    { name: "Alice", fullName: "Hello, Alice!" },
    { name: "Bob", fullName: "Hello, Bob!" },
    { name: "Charlie", fullName: "Hello, Charlie!" },
].forEach(({ name, fullName }) => {
    test(`testing with ${name}`, async ({ page }) => {
        expect(fullName).toContain(name);
    })
})
