import { test, expect } from "@playwright/test";

const PAGES = ["/", "/courses", "/learn/pathways", "/quiz"];

test.describe("Responsive layout", () => {
  for (const path of PAGES) {
    test(`no horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      // Allow a 1px rounding tolerance.
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test(`primary nav and hero CTAs stay tappable on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const tappable = page.locator("header a, header button, main a, main button").first();
      await expect(tappable).toBeVisible();
      const box = await tappable.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        // Loosely check the element has a real hit area rather than a collapsed 0x0 box.
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    });
  }

  test("goal tiles remain individually clickable on mobile width", async ({ page }) => {
    await page.goto("/");
    const tiles = page.locator('[aria-label="Learning goals"] button');
    await tiles.first().waitFor({ state: "visible" }); // OnboardingFlow renders nothing until mounted
    const count = await tiles.count();
    expect(count).toBe(6);

    const boxes = [];
    for (let i = 0; i < count; i++) {
      const box = await tiles.nth(i).boundingBox();
      expect(box).not.toBeNull();
      if (box) boxes.push(box);
    }

    // No two tiles should overlap — sanity check against a squashed/overlapping grid.
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const overlap =
          a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
        expect(overlap).toBe(false);
      }
    }
  });
});
