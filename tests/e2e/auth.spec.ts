import { test, expect } from "@playwright/test";
import { signUpTestUser, signIn, signOut } from "./helpers/auth";

/**
 * @destructive — creates a real user via the live bridge (BRIDGE_BASE_URL). See tests/e2e/README.md.
 * Skipped unless RUN_DESTRUCTIVE_TESTS=1. Each test creates its own disposable account so tests
 * remain independent under Playwright's fullyParallel execution (no shared-state ordering).
 */
test.describe("Authentication @destructive", () => {
  test("sign up redirects to the learner dashboard", async ({ page }) => {
    await signUpTestUser(page, "signup");
    await expect(page).toHaveURL(/\/dashboard\/learner/);
  });

  test("log out then log back in with the same credentials", async ({ page }) => {
    const creds = await signUpTestUser(page, "relogin");
    await signOut(page);
    await signIn(page, creds);
    await expect(page).toHaveURL(/\/dashboard\/learner/);
  });

  test("a non-admin learner is blocked from the admin dashboard", async ({ page }) => {
    await signUpTestUser(page, "adminblock");

    await page.goto("/dashboard/admin");
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10_000 });
    // Real admin totals should never render for a blocked request.
    await expect(page.getByText(/Active accounts/)).not.toBeVisible();
  });

  test("password reset request succeeds", async ({ page }) => {
    const { email } = await signUpTestUser(page, "reset");
    await signOut(page);

    await page.goto("/auth/forgot-password");
    await page.getByLabel("Email address").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByText("Check your inbox")).toBeVisible({ timeout: 10_000 });
  });
});
