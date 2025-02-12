import { test, expect } from "@playwright/test";

test("logging in with a user that doesn't exist", async ({ page }) => {
  await page.goto("http://docker.localhost/");
  await expect(
    page.getByRole("heading", { name: "Your Amazing Product" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByText("Account")).toBeVisible();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("test@gmail.com");
  await page.getByRole("textbox", { name: "Enter your password" }).click();
  await page
    .getByRole("textbox", { name: "Enter your password" })
    .fill("asdfasdf");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("User not found.")).toBeVisible();
});
