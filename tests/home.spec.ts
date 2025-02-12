import { test, expect } from "@playwright/test";

test("Has title", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page).toHaveTitle(/Volt Riders/);
});

test("Home page has welcome message", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.locator("h2")).toContainText(
    /Bienvenidos a más que un club, una familia|Welcome to more than a club, a family/,
  );
});

test("Carousel images are visible", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const images = page.locator("img");
  await expect(images).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    await expect(images.nth(i)).toBeVisible();
  }
});

test("Get sign up link", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("link", { name: /Registrate|Sign up/ }).click();
});
