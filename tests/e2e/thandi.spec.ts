import { expect, test } from "@playwright/test";
import { THANDI_EMBED_URL } from "../../src/lib/thandi/config";
import { THANDI_LANGUAGES } from "../../src/lib/thandi/languages";

test.describe("Thandi sidebar tutor", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/vowhumans/context-token/**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ token: "thandi-ui-test-token" }),
      });
    });
  });

  test("opens from the ecosystem sidebar, requests the site-guide context, and closes cleanly", async ({ page }) => {
    await page.goto("/");

    // Open the desktop ecosystem sidebar panel.
    await page.getByRole("button", { name: "Expand ecosystem sidebar" }).click();
    await expect(page.getByRole("button", { name: "Talk to Thandi" })).toBeVisible();

    const tokenRequest = page.waitForRequest("**/api/vowhumans/context-token/vowlms-guide**");
    await page.getByRole("button", { name: "Talk to Thandi" }).click();
    await tokenRequest;

    const dialog = page.getByRole("dialog", { name: "Thandi, VowLMS AI tutor" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Helping with:")).toBeVisible();
    await expect(dialog.getByText("VowLMS", { exact: true })).toBeVisible();

    const frame = dialog.locator("iframe");
    await expect(frame).toHaveAttribute(
      "src",
      `${THANDI_EMBED_URL}#lesson_context_token=thandi-ui-test-token`,
    );

    // All 11 South African official languages are selectable.
    const languageSelect = dialog.getByLabel("Thandi's response language");
    const optionCount = await languageSelect.locator("option").count();
    expect(optionCount).toBe(THANDI_LANGUAGES.length);

    await dialog.getByRole("button", { name: "Close Thandi" }).click();
    await expect(dialog).toBeHidden();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("requests the real course's context on a course page", async ({ page }) => {
    await page.goto("/courses");
    const firstCourseLink = page.locator('a[href^="/courses/"]').first();
    const href = await firstCourseLink.getAttribute("href");
    const slug = href?.split("/courses/")[1]?.split(/[/?]/)[0];
    test.skip(!slug, "No course link found on the catalogue page");

    await page.goto(`/courses/${slug}`);
    await page.getByRole("button", { name: "Expand ecosystem sidebar" }).click();

    const tokenRequest = page.waitForRequest(`**/api/vowhumans/context-token/${slug}**`);
    await page.getByRole("button", { name: "Talk to Thandi" }).click();
    await tokenRequest;

    await expect(page.getByRole("dialog", { name: "Thandi, VowLMS AI tutor" })).toBeVisible();
  });
});
