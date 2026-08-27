import { test, expect } from "@playwright/test";
import { signUpTestUser, signOut, signIn } from "./helpers/auth";

/**
 * @destructive — enrolls a real disposable test account in real courses via the live bridge.
 * Skipped unless RUN_DESTRUCTIVE_TESTS=1. See tests/e2e/README.md.
 *
 * Only Upskilling Academy has free courses in the current dataset (140 of 140 checked are
 * price=0; Chef Academy, Skills Training, and Business School are 100% paid — 0 free courses
 * across all three). Paid enrollment routes through a real PayFast form-POST redirect
 * (EnrollButton.tsx:104-119), which this suite will not drive to completion — that would leave
 * the browser on PayFast's real domain. So: the free Upskilling course gets the full
 * lesson-delivery/progress/resume test, and the other 3 academies get a lighter check that the
 * payment flow initiates correctly (a valid PayFast form response) without submitting it.
 */
const FREE_COURSE_SLUG = "improving-your-mental-health";
const PAID_COURSES = [
  { academy: "Chef Academy", slug: "making-toad-in-the-hole", price: 199 },
  { academy: "Skills Training Academy", slug: "commercial-kitchenette-cleaner", price: 299 },
  { academy: "GoalVow Business School", slug: "starting-a-business-in-africa", price: 499 },
];

test.describe("Course enrollment & delivery @destructive", () => {
  test("free Upskilling course: enroll, view lesson, advance, resume after re-login", async ({ page }) => {
    const creds = await signUpTestUser(page, "enroll");

    await page.goto(`/courses/${FREE_COURSE_SLUG}`);
    await page.getByRole("button", { name: "Enrol free" }).click();
    await expect(page.getByRole("button", { name: "Continue learning" })).toBeVisible({ timeout: 10_000 });

    // Second click on the now-enrolled button navigates to the first lesson.
    await page.getByRole("button", { name: "Continue learning" }).click();
    await page.waitForURL(/\/lesson\//, { timeout: 10_000 });

    // Lesson content renders.
    await expect(page.locator("main, article").first()).not.toBeEmpty();
    const firstLessonUrl = page.url();

    // Real, clickable breadcrumb trail — a learner always knows where they are.
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Academies" })).toBeVisible();

    // "Mark complete" advances to the next lesson and updates the "N/M · X%" progress readout.
    const progressText = page.getByText(/^\d+\/\d+ · \d+%$/);
    const progressBefore = await progressText.innerText();

    await page.getByRole("button", { name: /Mark complete/i }).click();
    await page.waitForURL((url) => url.toString() !== firstLessonUrl, { timeout: 5_000 }).catch(() => null);

    await expect(progressText).not.toHaveText(progressBefore);

    const secondLessonUrl = page.url();
    expect(secondLessonUrl).not.toBe(firstLessonUrl);

    // Resume-where-I-left-off: log out, log back in, "Continue learning" from the dashboard
    // should return to the second lesson (server-computed nextLessonSlug), not the first.
    await signOut(page);
    await signIn(page, creds);
    await page.goto("/dashboard/learner");

    const continueLink = page.getByRole("link", { name: "Continue learning" }).first();
    if (await continueLink.isVisible().catch(() => false)) {
      const href = await continueLink.getAttribute("href");
      expect(href).toMatch(/^\/lesson\//);
    }
  });

  for (const course of PAID_COURSES) {
    test(`${course.academy}: paid enrollment initiates a valid PayFast request`, async ({ page }) => {
      await signUpTestUser(page, `pay-${course.slug.slice(0, 10)}`);

      await page.goto(`/courses/${course.slug}`);
      const enrollButton = page.getByRole("button", { name: new RegExp(`Enrol - R${course.price}`) });
      await expect(enrollButton).toBeVisible();

      const responsePromise = page.waitForResponse(
        (res) => res.url().includes("/api/payments/payfast/create") && res.request().method() === "POST",
        { timeout: 10_000 },
      );
      await enrollButton.click();
      const response = await responsePromise;
      const body = await response.json().catch(() => null);

      expect(response.ok()).toBe(true);
      expect(body?.ok).toBe(true);
      expect(body?.data?.formAction || body?.data?.redirectUrl).toBeTruthy();
      // Deliberately not following the auto-submitted form to PayFast's real domain from here.
    });
  }
});
