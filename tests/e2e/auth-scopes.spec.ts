import { test, expect } from "@playwright/test";
import { getUniqueEmail } from "./utils";

const getRandomString = (length: number) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

test.describe("Auth Scopes", () => {
  test("regular user cannot delete all todos", async ({ page }) => {
    // Register a regular user
    await page.goto("http://docker.localhost/auth/register");
    const regularEmail = getUniqueEmail();
    await page
      .getByRole("textbox", { name: "Email address" })
      .fill(regularEmail);
    await page
      .getByRole("textbox", { name: "Enter your password" })
      .fill("asdfasdf");
    await page
      .getByRole("textbox", { name: "Confirm your password" })
      .fill("asdfasdf");
    await page.getByRole("button", { name: "Register" }).click();

    // Verify we're on the todo list page
    await expect(
      page.getByRole("heading", { name: "Todo List" }),
    ).toBeVisible();

    // Add a todo
    const todoText = getRandomString(10);
    await page.getByRole("textbox", { name: "New Todo New Todo" }).click();
    await page
      .getByRole("textbox", { name: "New Todo New Todo" })
      .fill(todoText);
    await page.locator("form").getByRole("button").click();
    await expect(page.getByText(todoText)).toBeVisible();

    // Verify delete all button doesn't work for regular users
    await page.getByRole("button", { name: "Delete All Todos" }).click();
    await expect(page.getByText(todoText)).toBeVisible();
  });

  test("an unverified admin user cannot delete all todos", async ({
    page,
  }, workerInfo) => {
    // Register an admin user (using admin.*@email.com pattern)
    await page.goto("http://docker.localhost/auth/register");
    const adminEmail = `admin-${workerInfo.project.name}@example.com`;
    await page.getByRole("textbox", { name: "Email address" }).fill(adminEmail);
    await page
      .getByRole("textbox", { name: "Enter your password" })
      .fill("asdfasdf");
    await page
      .getByRole("textbox", { name: "Confirm your password" })
      .fill("asdfasdf");
    await page.getByRole("button", { name: "Register" }).click();

    // Verify we're on the todo list page
    await expect(
      page.getByRole("heading", { name: "Todo List" }),
    ).toBeVisible();

    // Add a todo
    const todoText = getRandomString(10);
    await page.getByRole("textbox", { name: "New Todo New Todo" }).click();
    await page
      .getByRole("textbox", { name: "New Todo New Todo" })
      .fill(todoText);
    await page.locator("form").getByRole("button").click();
    await expect(page.getByText(todoText)).toBeVisible();

    // Verify delete all button is visible for admin users
    await expect(
      page.getByRole("button", { name: "Delete All Todos" }),
    ).toBeVisible();

    // Test the delete all functionality
    await page.getByRole("button", { name: "Delete All Todos" }).click();

    // Verify todos are deleted (assuming there's a message or empty state)
    await expect(page.getByText(todoText)).toBeVisible();
  });

  // TODO: Make sure a verified admin user can delete all todos
});
