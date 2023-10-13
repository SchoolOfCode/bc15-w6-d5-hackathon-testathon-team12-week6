// @ts-check
import { test, expect } from "@playwright/test";
import { resetAllTables } from "../db/helpers.js";


test("Testing to see if page is visible", async function ({ page }) {
    // User visits the todo app website
    await page.goto("http://localhost:3001");

    // Checks to see if all the form elements are visible
    await expect(page.getByPlaceholder("Enter a task...")).toBeVisible();
    await expect(page.getByLabel("Completion date")).toBeVisible();
    await expect(
        page.getByRole("button", { name: "➕ Create!" })
    ).toBeVisible();

    // User adds a couple todos to the list

    // Wash Dog Task
    await page.getByPlaceholder("Enter a task...").click();
    await page.getByPlaceholder("Enter a task...").fill("Wash the dog");
    await page.getByLabel("Completion date").fill("2023-10-05");
    await page.getByRole("button", { name: "➕ Create!" }).click();

    // Go For Run Task
    await page.getByPlaceholder("Enter a task...").click();
    await page.getByPlaceholder("Enter a task...").fill("Go for a run");
    await page.getByLabel("Completion date").fill("2023-10-06");
    await page.getByRole("button", { name: "➕ Create!" }).click();

    // Check to see if new todo is visible on refreshed page
    await page.reload();
    await expect(page.getByText("Wash the dog")).toBeVisible();

    // User deletes the Wash the Dog task
    await expect(
        page
            .locator("li")
            .filter({ hasText: "Wash the dog2023-10-05🗑️" })
            .getByLabel("Delete this todo")
    ).toBeVisible();
    await page
        .locator("li")
        .filter({ hasText: "Wash the dog2023-10-05🗑️" })
        .getByLabel("Delete this todo")
        .click();

    // The remaining todos are still visible on the page

    // User refreshes the page, sees that the Wash the Dog task has been deleted.
    await page.reload();
    await expect(page.getByText("Wash the dog")).not.toBeVisible();

    // User deletes the Go for a run task
    await expect(
        page
            .locator("li")
            .filter({ hasText: "Go for a run2023-10-06🗑️" })
            .getByLabel("Delete this todo")
    ).toBeVisible();
    await page
        .locator("li")
        .filter({ hasText: "Go for a run2023-10-06🗑️" })
        .getByLabel("Delete this todo")
        .click();

    // User refreshes the page, sees that the Go for run task has been deleted.
    await page.reload();
    await expect(page.getByText("Go for a run")).not.toBeVisible();

    
});

