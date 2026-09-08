import { expect, test } from "@playwright/test";

test.describe("Homepage — AI-guided learning & ecosystem sections", () => {
  test("Talk to Thandi button opens the real, live Thandi panel", async ({ page }) => {
    await page.route("**/api/vowhumans/context-token/**", async (route) => {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ token: "x" }) });
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Talk to Thandi now →" }).click();
    await expect(page.getByRole("region", { name: "Thandi, VowLMS AI tutor" })).toBeVisible();
  });

  test("VowRewards spotlight links to the real wallet", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Real rewards for real progress").scrollIntoViewIfNeeded();
    await page.getByRole("link", { name: "See your VOWR wallet →" }).click();
    await expect(page).toHaveURL(/\/rewards$/);
  });

  test("ecosystem showcase cards link to real, live VowLMS pages", async ({ page }) => {
    await page.goto("/");
    await page.getByText("One account. A whole ecosystem.").scrollIntoViewIfNeeded();
    // /certificates is a real, auth-gated page — signed out, it correctly
    // redirects to sign-in rather than 404ing, which is what this checks for.
    await page.getByRole("link", { name: /^Certificates/ }).click();
    await expect(page).toHaveURL(/\/auth\/signin\?returnTo=%2Fcertificates$/);
  });

  test("new homepage sections render on mobile without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByText("Learn with a 24/7 AI tutor")).toBeVisible();
    await expect(page.getByText("One account. A whole ecosystem.")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
