import type { Page } from "@playwright/test";

export type TestCredentials = { email: string; password: string };

/** Creates a fresh disposable learner account via the real signup flow and lands on the dashboard. */
export async function signUpTestUser(page: Page, label: string): Promise<TestCredentials> {
  const domain = process.env.QA_TEST_EMAIL_DOMAIN ?? "vowlms-qa.invalid";
  const email = `qa-test-${label}-${Date.now()}@${domain}`;
  const password = "Qa-Test-Pass-2026!";

  await page.goto("/auth/signup");
  await page.getByLabel("Full name").fill(`QA ${label}`);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Continue to profile →" }).click();
  await page.locator('input[type="checkbox"]').check();
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard/learner", { timeout: 20_000 });

  return { email, password };
}

export async function signIn(page: Page, { email, password }: TestCredentials) {
  await page.goto("/auth/signin");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard/learner", { timeout: 20_000 });
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/auth/signin", { timeout: 10_000 });
}
