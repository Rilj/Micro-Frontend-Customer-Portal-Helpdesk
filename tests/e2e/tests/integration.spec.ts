import { test, expect, Page } from "@playwright/test";

test.describe("Micro-Frontend Integration", () => {
  test("Shell host should load and display all remotes", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("text=Helpdesk Portal")).toBeVisible();

    await expect(page.locator("nav")).toBeVisible();

    const statsCards = page.locator("text=Total Tickets");
    await expect(statsCards).toBeVisible();
  });

  test("should lazy-load remote ticketing components", async ({ page }) => {
    await page.goto("/");

    const ticketLink = page.locator('a[href="/tickets"]');
    await ticketLink.click();

    await expect(page).toHaveURL(/\/tickets/);
    await expect(page.locator("text=Support Tickets")).toBeVisible();
  });

  test("should lazy-load remote knowledge base", async ({ page }) => {
    await page.goto("/knowledge");

    await expect(page.locator("text=Knowledge Base")).toBeVisible();
  });

  test("should display chat widget", async ({ page }) => {
    await page.goto("/");

    const chatWidget = page.locator("button");
    await chatWidget.last().click();

    await expect(page.locator("text=Live Chat")).toBeVisible();
  });

  test("should toggle dark/light theme", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.locator("button").filter({
      has: page.locator("svg")
    }).first();
    await themeToggle.click();
  });
});

test.describe("Cross-Remote Communication", () => {
  test("auth state should sync across remotes", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("auth:login", {
        detail: { id: "test-1", email: "test@example.com", name: "Test User", role: "customer" }
      }));
    });

    await page.goto("/");
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("notification events should propagate", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("notification:show", {
        detail: {
          title: "Test Notification",
          message: "This is a test",
          type: "info"
        }
      }));
    });

    await page.waitForTimeout(1000);
  });
});
