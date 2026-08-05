import { test, expect } from "@playwright/test";
import { goalTiles } from "../../src/data/goal-tiles";

test.describe("Goal-first onboarding flow", () => {
  for (const tile of goalTiles) {
    test(`goal tile: ${tile.question}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: tile.question }).click();

      if (tile.roles.length === 0) {
        // Tiles 5 & 6 ("certificate" / "unsure") route into the Path Finder Quiz instead of a role list.
        await expect(page.getByText(/Question 1 of 4/i)).toBeVisible();
        return;
      }

      await expect(page.getByText("Great — now tell us more:")).toBeVisible();

      const firstRole = tile.roles[0];
      await page.getByRole("button", { name: new RegExp(firstRole.label) }).first().click();

      await expect(page.getByText(`Your path to becoming a ${firstRole.label}`)).toBeVisible();

      const courseCards = page.locator("article", { hasText: "Open course" });
      await expect(courseCards.first()).toBeVisible();
      expect(await courseCards.count()).toBeGreaterThan(0);

      const seeAllLink = page.getByRole("link", { name: /See all .* courses/i });
      await expect(seeAllLink).toBeVisible();
      const href = await seeAllLink.getAttribute("href");
      expect(href).toContain("/courses?academy=");

      await seeAllLink.click();
      // A fresh /courses?academy=... load under concurrent test-worker load on a single local
      // `next start` process can legitimately take longer than the 5s default — this is a
      // server-response-time margin, not app behavior under test, hence the generous timeout.
      await expect(page.getByText(/Showing \d+ of \d+ courses/)).toBeVisible({ timeout: 20_000 });
      const shownMatch = (await page.getByText(/Showing \d+ of \d+ courses/).innerText()).match(/of (\d+) courses/i);
      expect(Number(shownMatch?.[1] ?? 0)).toBeGreaterThan(0);
    });
  }

  test("Start over resets the flow back to goal tiles", async ({ page }) => {
    await page.goto("/");
    const firstLiveTile = goalTiles.find((t) => t.roles.length > 0)!;
    await page.getByRole("button", { name: firstLiveTile.question }).click();
    await page.getByRole("button", { name: new RegExp(firstLiveTile.roles[0].label) }).first().click();
    await page.getByRole("button", { name: /Not what you were looking for\? Start over/i }).click();
    await expect(page.getByRole("button", { name: firstLiveTile.question })).toBeVisible();
  });
});
