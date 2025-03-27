import { test, expect } from "@playwright/test";
import { getUniqueEmail } from "./utils";

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
      page.getByRole("heading", { name: "Todo List" })
    ).toBeVisible();

    // Verify delete all button is not visible for regular users
    await expect(
      page.getByRole("button", { name: "Delete All Todos" })
    ).not.toBeVisible();
  });

  test("admin user can delete all todos", async ({ page }) => {
    // Register an admin user (using admin.*@email.com pattern)
    await page.goto("http://docker.localhost/auth/register");
    const adminEmail = `admin.${getUniqueEmail()}`;
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
      page.getByRole("heading", { name: "Todo List" })
    ).toBeVisible();

    // Verify delete all button is visible for admin users
    await expect(
      page.getByRole("button", { name: "Delete All Todos" })
    ).toBeVisible();

    // Test the delete all functionality
    await page.getByRole("button", { name: "Delete All Todos" }).click();

    // Verify confirmation dialog appears
    await expect(
      page.getByText("Are you sure you want to delete all todos?")
    ).toBeVisible();

    // Confirm deletion
    await page.getByRole("button", { name: "Confirm" }).click();

    // Verify todos are deleted (assuming there's a message or empty state)
    await expect(page.getByText("No todos found")).toBeVisible();
  });
});
