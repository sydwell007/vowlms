import { expect, test } from "@playwright/test";

test("VR Practice Studio exposes all modules and requires an action after finding a station", async ({ page }) => {
  await page.goto("http://localhost:3100/studio/upskilling");
  await expect(page.getByRole("heading", { name: "Upskilling module practice library" })).toBeVisible();
  await expect(page.getByText("118 of 118 practices")).toBeVisible();
  await page.screenshot({ path: "test-results/vr-studio-library.png", fullPage: true });

  await page.evaluate(() => {
    localStorage.setItem("goalvow-vr-platform-tour-complete", "true");
    localStorage.removeItem("goalvow-simulation-guide-business-ethics-module-1-vr-practice-desktop");
  });

  await page.goto("http://localhost:3100/studio/upskilling/business-ethics-module-1-vr-practice");
  await expect(page.locator("header").getByRole("heading", { name: "Business Ethics Fundamentals: Immersive Module Practice", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Simulation guide tour" })).toBeVisible();
  await page.screenshot({ path: "test-results/vr-studio-tour.png" });
  await page.getByRole("button", { name: "Close simulation guide" }).click();

  await expect(page.getByText("0%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Select Observe Defining Business Ethics" }).click();
  await expect(page.getByText("Ready for action")).toBeVisible();

  await page.getByRole("button", { name: "Move ahead quickly without checking how \"Defining Business Ethics\" applies." }).click();
  await expect(page.getByText("0%", { exact: true })).toBeVisible();
  await expect(page.getByText(/That choice skips an important part/)).toBeVisible();

  await page.getByRole("button", { name: "Observe with purpose: check the facts, apply the code of conduct, and document a fair response." }).click();
  await expect(page.getByText("20%", { exact: true })).toBeVisible();
  await expect(page.getByText("Action complete")).toBeVisible();
  await page.screenshot({ path: "test-results/vr-studio-action-complete.png", fullPage: true });
});

test("VowLMS publishes the generated Upskilling practice catalogue", async ({ page }) => {
  await page.goto("http://localhost:3101/vr-practice?academy=upskilling-academy&course=business-ethics");
  await expect(page.getByRole("heading", { name: "Business Ethics", exact: true })).toBeVisible();
  await expect(page.getByText("3 guided practice scenarios for this course.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Business Ethics Fundamentals: Immersive Module Practice", exact: true })).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  await page.screenshot({ path: "test-results/vowlms-vr-course-catalogue.png", fullPage: true });
});
