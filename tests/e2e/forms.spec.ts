import { expect, test } from "@playwright/test";

test.describe("Public account forms", () => {
  test("sign-in reports an API rejection without navigating away", async ({ page }) => {
    await page.route("**/api/auth/login", (route) => route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "Invalid email or password." }),
    }));

    await page.goto("/auth/signin");
    await page.getByLabel("Email address").fill("learner@example.com");
    await page.getByLabel("Password").fill("incorrect-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.locator("#signin-error")).toHaveText("Invalid email or password.");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("sign-up validates passwords and offers only the live academy", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.getByLabel("Full name").fill("QA Learner");
    await page.getByLabel("Email address").fill("learner@example.com");
    await page.getByLabel("Password", { exact: true }).fill("password-one");
    await page.getByLabel("Confirm password").fill("password-two");
    await page.getByRole("button", { name: /Continue to profile/ }).click();
    await expect(page.locator("#signup-error")).toHaveText("Passwords do not match.");

    await page.getByLabel("Confirm password").fill("password-one");
    await page.getByRole("button", { name: /Continue to profile/ }).click();
    const academy = page.getByLabel("Primary academy of interest");
    await expect(academy).toHaveValue("Upskilling Academy");
    await expect(academy.locator("option")).toHaveCount(2);
    await expect(page.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms");
    await expect(page.locator("main").getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
    await page.getByRole("button", { name: /Back/ }).click();
    await expect(page.getByLabel("Full name")).toHaveValue("QA Learner");
  });

  test("forgot-password success state uses the real request contract", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      expect(route.request().postDataJSON()).toEqual({ email: "learner@example.com" });
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });

    await page.goto("/auth/forgot-password");
    await page.getByLabel("Email address").fill("learner@example.com");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
  });
});

test.describe("Authenticated profile settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([{
      name: "vowlms_token",
      value: "qa-browser-token",
      url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    }]);
    await page.route("**/api/auth/session", (route) => route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        data: { id: "learner-1", name: "QA Learner", email: "learner@example.com", role: "learner" },
      }),
    }));
    await page.route("**/api/dashboard/learner", (route) => route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        data: {
          metrics: [
            { label: "Courses enrolled", value: "7" },
            { label: "Completed", value: "3" },
            { label: "Certificates", value: "2" },
            { label: "VOWR balance", value: "480" },
          ],
          enrolledCourses: [],
        },
      }),
    }));
    await page.route("**/api/user/profile", async (route) => {
      if (route.request().method() === "PUT") {
        await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: {} }) });
        return;
      }
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          data: {
            name: "QA Learner",
            email: "learner@example.com",
            phone: "+27 82 000 0000",
            city: "Johannesburg",
            country: "South Africa",
            preferred_academy: "Upskilling Academy",
            email_notifications: true,
            sms_notifications: false,
            language: "English",
            timezone: "Africa/Johannesburg",
          },
        }),
      });
    });
  });

  test("profile exposes account-owned data and accessible settings", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("7", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Email address")).toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Primary academy").locator("option")).toHaveCount(1);

    await page.getByRole("tab", { name: "Notifications" }).click();
    const emailNotifications = page.getByRole("checkbox", { name: /Email notifications/ });
    await expect(emailNotifications).toBeChecked();
    await page.getByText("Email notifications", { exact: true }).click();
    await expect(emailNotifications).not.toBeChecked();

    await page.getByRole("tab", { name: "Preferences" }).click();
    await page.getByLabel("Language").selectOption("Zulu");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("button", { name: /Saved/ })).toBeVisible();
  });

  test("security tab sends a reset link instead of presenting inactive controls", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) => route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }));
    await page.goto("/profile");
    await page.getByRole("tab", { name: "Security" }).click();
    await page.getByRole("button", { name: "Send password reset link" }).click();
    await expect(page.getByRole("status")).toContainText("Check your inbox");
    await expect(page.getByRole("button", { name: "Save changes" })).toHaveCount(0);
  });
});

test("academy catalogue search and filters expose their state", async ({ page }) => {
  await page.goto("/academies/upskilling");
  const search = page.getByRole("searchbox", { name: "Search courses in this academy" });
  await search.fill("Cybersecurity");
  await expect(page.getByText("Showing 1 of 1 courses")).toBeVisible();
  await expect(page.getByRole("button", { name: "All levels" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Clear academy course search" }).click();
  await expect(search).toHaveValue("");
});
