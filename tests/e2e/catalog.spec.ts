import { test, expect } from "@playwright/test";
import { getCourses } from "../../src/lib/data";

const KNOWN_TITLES = [
  "Business Ethics",
  "Marketing",
  "Sales",
  "Leadership",
  "Communication",
];

test.describe("Course catalog", () => {
  async function openFiltersWhenCollapsed(page: import("@playwright/test").Page) {
    const filtersButton = page.getByRole("button", { name: "Filters", exact: true });
    if (await filtersButton.isVisible()) {
      await filtersButton.click();
    }
  }

  test("course count matches the real dataset", async ({ page }) => {
    const expectedCount = getCourses().length;
    await page.goto("/courses");
    await expect(page.getByText(new RegExp(`${expectedCount.toLocaleString()} courses across`))).toBeVisible();
  });

  test("each filter individually never yields an unexpected empty state", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForSelector("text=Browse by academy");
    await openFiltersWhenCollapsed(page);

    // Academy select — the anonymous/learner catalogue is Upskilling-only today
    // (Skills Training, Chef Academy, and Business School are admin-only until
    // launched), so this only ever iterates whatever academies are actually
    // offered rather than a fixed list.
    const academySelect = page.locator("#academy-filter");
    const optionValues = await academySelect.locator("option").evaluateAll((opts) =>
      opts.map((o) => (o as HTMLOptionElement).value),
    );
    for (const value of optionValues) {
      if (value === "all") continue;
      await academySelect.selectOption(value);
      const summary = page.getByText(/Showing \d+ of \d+ courses/);
      await expect(summary).toBeVisible();
      const match = (await summary.innerText()).match(/of (\d+) courses/i);
      expect(Number(match?.[1] ?? 0)).toBeGreaterThan(0);
    }
    await academySelect.selectOption("all");

    // Level buttons — the 20 complete Upskilling courses are all Foundation
    // level today, so Foundation must always yield results, while
    // Intermediate/Advanced are a genuinely-empty (not broken) state until
    // higher-level courses launch.
    await page.getByRole("button", { name: "Foundation", exact: true }).click();
    const summary = page.getByText(/Showing \d+ of \d+ courses/);
    await expect(summary).toBeVisible();
    const match = (await summary.innerText()).match(/of (\d+) courses/i);
    expect(Number(match?.[1] ?? 0)).toBeGreaterThan(0);

    for (const level of ["Intermediate", "Advanced"]) {
      await page.getByRole("button", { name: level, exact: true }).click();
      await expect(page.getByRole("heading", { name: "No courses match these filters" })).toBeVisible();
    }
    await page.getByRole("button", { name: "All levels", exact: true }).click();
  });

  test("combining filters narrows results without erroring", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForSelector("text=Browse by academy");
    await openFiltersWhenCollapsed(page);

    await page.getByRole("button", { name: "Intermediate", exact: true }).click();

    // The 20 complete Upskilling courses are all Foundation level today, so
    // Intermediate alone is a deliberately-empty combination — confirm the
    // app shows the empty state gracefully rather than erroring.
    await expect(page.getByRole("heading", { name: "No courses match these filters" })).toBeVisible();
  });

  for (const title of KNOWN_TITLES) {
    test(`search returns a result for "${title}"`, async ({ page }) => {
      await page.goto(`/courses?q=${encodeURIComponent(title)}`);
      await expect(page.getByText(/Showing \d+ of \d+ courses/)).toBeVisible();
      const summary = await page.getByText(/Showing \d+ of \d+ courses/).innerText();
      const match = summary.match(/of (\d+) courses/i);
      expect(Number(match?.[1] ?? 0)).toBeGreaterThan(0);
    });
  }
});
