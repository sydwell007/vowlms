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
  test("course count matches the real dataset", async ({ page }) => {
    const expectedCount = getCourses().length;
    await page.goto("/courses");
    await expect(page.getByText(new RegExp(`${expectedCount.toLocaleString()} courses across`))).toBeVisible();
  });

  test("each filter individually never yields an unexpected empty state", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForSelector("text=Browse by academy");

    // Academy select
    const academySelect = page.locator("select");
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

    // Level buttons (All levels already implied 0-filter; check each real level)
    for (const level of ["Foundation", "Intermediate", "Advanced"]) {
      await page.getByRole("button", { name: level, exact: true }).click();
      const summary = page.getByText(/Showing \d+ of \d+ courses/);
      await expect(summary).toBeVisible();
      const match = (await summary.innerText()).match(/of (\d+) courses/i);
      expect(Number(match?.[1] ?? 0)).toBeGreaterThan(0);
    }
    await page.getByRole("button", { name: "All levels", exact: true }).click();
  });

  test("combining filters narrows results without erroring", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForSelector("text=Browse by academy");

    await page.locator("select").selectOption("chef-academy");
    await page.getByRole("button", { name: "Foundation", exact: true }).click();
    await page.getByRole("button", { name: "Free", exact: true }).click();

    // Chef Academy courses are all paid in the real dataset, so Foundation+Free is a
    // deliberately-empty combination — confirm the app shows the empty state gracefully
    // rather than erroring (the "Showing 0 of 0 courses" count and this heading both render).
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
