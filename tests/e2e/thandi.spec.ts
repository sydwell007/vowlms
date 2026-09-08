import { expect, test } from "@playwright/test";
import { THANDI_EMBED_URL } from "../../src/lib/thandi/config";
import { THANDI_LANGUAGES } from "../../src/lib/thandi/languages";

test.describe("Thandi sidebar tutor", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/vowhumans/context-token/**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ token: "thandi-ui-test-token" }),
      });
    });
  });

  test.describe("desktop", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("opens as a compact docked panel, not a centred modal, and closes cleanly", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Expand ecosystem sidebar" }).click();
      await expect(page.getByRole("button", { name: "Talk to Thandi" })).toBeVisible();

      const tokenRequest = page.waitForRequest("**/api/vowhumans/context-token/vowlms-guide**");
      await page.getByRole("button", { name: "Talk to Thandi" }).click();
      await tokenRequest;

      const panel = page.getByRole("region", { name: "Thandi, VowLMS AI tutor" });
      await expect(panel).toBeVisible();
      await expect(panel.getByText("Helping with")).toBeVisible();
      await expect(panel.getByText("VowLMS", { exact: true })).toBeVisible();

      // Docked to the bottom-right corner, compact — not a full-screen
      // takeover, and the page behind it stays reachable (no modal backdrop).
      const box = await panel.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      if (box && viewport) {
        expect(box.x + box.width).toBeGreaterThan(viewport.width - 40);
        expect(box.y + box.height).toBeGreaterThan(viewport.height - 40);
        expect(box.width).toBeLessThan(viewport.width * 0.4);
        expect(box.height).toBeLessThan(viewport.height * 0.7);
      }

      const frame = panel.locator("iframe");
      await expect(frame).toHaveAttribute(
        "src",
        `${THANDI_EMBED_URL}#lesson_context_token=thandi-ui-test-token`,
      );

      // All 11 South African official languages are selectable.
      const languageSelect = panel.getByLabel("Thandi's response language");
      const optionCount = await languageSelect.locator("option").count();
      expect(optionCount).toBe(THANDI_LANGUAGES.length);

      await panel.getByRole("button", { name: "Close Thandi" }).click();
      await expect(panel).toBeHidden();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });

    test("minimizing collapses to a portrait bubble without ending the call, and the rest of the page stays usable", async ({ page }) => {
      await page.goto("/courses");
      await page.getByRole("button", { name: "Expand ecosystem sidebar" }).click();
      await page.getByRole("button", { name: "Talk to Thandi" }).click();

      const panel = page.getByRole("region", { name: "Thandi, VowLMS AI tutor" });
      await expect(panel).toBeVisible();
      await expect(panel.locator("iframe")).toHaveCount(1);

      await page.getByRole("button", { name: "Minimize Thandi" }).click();
      await expect(panel).toBeHidden();

      // The call iframe is still mounted (not destroyed) while minimised.
      await expect(page.locator("iframe")).toHaveCount(1);

      // The rest of the page — e.g. the course catalogue behind it — stays
      // fully usable; there is no modal backdrop blocking it.
      await expect(page.getByText(/courses across/)).toBeVisible();

      await page.getByRole("button", { name: "Reopen Thandi" }).click();
      await expect(panel).toBeVisible();
      await expect(panel.locator("iframe")).toHaveCount(1);
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

      await expect(page.getByRole("region", { name: "Thandi, VowLMS AI tutor" })).toBeVisible();
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("opens from the mobile ecosystem bar, fits without horizontal overflow, and minimizes/restores", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "GoalVow Ecosystem" }).click();
      await page.getByRole("button", { name: "Talk to Thandi" }).click();

      const panel = page.getByRole("region", { name: "Thandi, VowLMS AI tutor" });
      await expect(panel).toBeVisible();

      const box = await panel.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      if (box && viewport) {
        // Compact — leaves clear margin either side, never edge-to-edge.
        expect(box.width).toBeLessThan(viewport.width * 0.9);
      }

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);

      await page.getByRole("button", { name: "Minimize Thandi" }).click();
      await expect(panel).toBeHidden();
      await expect(page.locator("iframe")).toHaveCount(1);

      await page.getByRole("button", { name: "Reopen Thandi" }).click();
      await expect(panel).toBeVisible();
    });
  });
});
