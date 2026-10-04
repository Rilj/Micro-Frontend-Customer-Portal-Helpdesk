import { test, expect, Page } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should navigate to login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Login|Sign In/i);
  });

  test("should show validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=required").first()).toBeVisible();
  });

  test("should allow switching to register page", async ({ page }) => {
    await page.goto("/login");
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/\/register/);
  });

  test("should register a new account", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/profile/);
  });
});

test.describe("Dashboard & Navigation", () => {
  test.beforeEach(async ({ page, browser }) => {
    const context = await browser.newContext();
    await context.addCookies([{
      name: "access_token",
      value: "test-token",
      domain: "localhost",
      path: "/"
    }]);
    await page.goto("/");
  });

  test("should display dashboard with stats", async ({ page }) => {
    await expect(page.locator("text=Dashboard")).toBeVisible();
    await expect(page.locator("text=Total Tickets")).toBeVisible();
  });

  test("should navigate to tickets page", async ({ page }) => {
    await page.click('a[href="/tickets"]');
    await expect(page).toHaveURL(/\/tickets/);
    await expect(page.locator("text=Support Tickets")).toBeVisible();
  });

  test("should navigate to knowledge base", async ({ page }) => {
    await page.click('a[href="/knowledge"]');
    await expect(page).toHaveURL(/\/knowledge/);
  });
});

test.describe("Theme Switching", () => {
  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/");
    const darkButton = page.locator("button[aria-label='Toggle theme']");
    await darkButton.click();
    await expect(document.documentElement).toHaveClass(/dark/);
  });
});

test.describe("Chat Widget", () => {
  test("should open chat widget", async ({ page }) => {
    await page.goto("/");
    const chatButton = page.locator("button").filter({ has: page.locator("svg") }).last();
    await chatButton.click();
    await expect(page.locator("text=Live Chat")).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should render correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("text=Helpdesk Portal")).toBeVisible();
  });
});
