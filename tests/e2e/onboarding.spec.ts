import { test, expect } from "@playwright/test";
import { goalTiles } from "../../src/data/goal-tiles";
import { isHiddenAcademyCategory } from "../../src/lib/academy-launch";

// The anonymous/learner view only ever shows goal tiles whose academy is
// currently live for learners (today, just Upskilling — Skills Training,
// Chef Academy, and Business School are admin-only until launched). Tiles
// with no academyCategory ("certificate"/"unsure") route into the quiz and
// are always shown.
const visibleTiles = goalTiles.filter((tile) => !tile.academyCategory || !isHiddenAcademyCategory(tile.academyCategory));
const hiddenTiles = goalTiles.filter((tile) => tile.academyCategory && isHiddenAcademyCategory(tile.academyCategory));

test.describe("Goal-first onboarding flow", () => {
  for (const tile of visibleTiles) {
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

      const courseCards = page.locator("article", { hasText: "View course" });
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
    const firstLiveTile = visibleTiles.find((t) => t.roles.length > 0)!;
    await page.getByRole("button", { name: firstLiveTile.question }).click();
    await page.getByRole("button", { name: new RegExp(firstLiveTile.roles[0].label) }).first().click();
    await page.getByRole("button", { name: /Not what you were looking for\? Start over/i }).click();
    await expect(page.getByRole("button", { name: firstLiveTile.question })).toBeVisible();
  });

  test("goal tiles for admin-only academies are not offered to learners", async ({ page }) => {
    test.skip(hiddenTiles.length === 0, "No admin-only goal tiles today");
    await page.goto("/");
    for (const tile of hiddenTiles) {
      await expect(page.getByRole("button", { name: tile.question })).not.toBeVisible();
    }
  });
});
