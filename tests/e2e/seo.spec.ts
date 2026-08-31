import { expect, test } from "@playwright/test";

test.describe("canonical SEO", () => {
  test("home page exposes its canonical URL", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://vowlms.vercel.app");
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(schema).toContain('"@type":"Organization"');
  });

  test("course page has course metadata and structured data", async ({ page }) => {
    await page.goto("/courses/business-ethics");
    await expect(page).toHaveTitle(/Business Ethics Course \| VowLMS/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://vowlms.vercel.app/courses/business-ethics",
    );
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(schema).toContain('"@type":"Course"');
  });

  test("legacy academy slug redirects to the canonical short slug", async ({ page }) => {
    await page.goto("/academies/upskilling-academy");
    await expect(page).toHaveURL(/\/academies\/upskilling$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://vowlms.vercel.app/academies/upskilling",
    );
  });
});
