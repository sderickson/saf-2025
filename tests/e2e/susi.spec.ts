import { test, expect } from "@playwright/test";
import { getUniqueEmail } from "./utils";

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
    .fill(getUniqueEmail());
  await page.getByRole("textbox", { name: "Enter your password" }).click();
  await page
    .getByRole("textbox", { name: "Enter your password" })
    .fill("asdfasdf");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("User not found.")).toBeVisible();
});

test("registering a user", async ({ page }) => {
  await page.goto("http://docker.localhost/auth/register");
  await expect(page.getByText("Create Account")).toBeVisible();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill(getUniqueEmail());
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page
    .getByRole("textbox", { name: "Enter your password" })
    .fill("asdfasdf");
  await page.getByRole("textbox", { name: "Enter your password" }).press("Tab");
  await page.getByRole("button", { name: "appended action" }).press("Tab");
  await page
    .getByRole("textbox", { name: "Confirm your password" })
    .fill("asdfasdf");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("heading", { name: "Todo List" })).toBeVisible();
});
