import { test, expect } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";
import { getCourseBySlug } from "../../src/lib/data";

/**
 * @destructive — writes real progress, assessment, and certificate rows via the live bridge.
 * Skipped unless RUN_DESTRUCTIVE_TESTS=1. See tests/e2e/README.md.
 *
 * Drives the real learner-facing UI end to end: enroll -> complete lesson 1 -> pass the
 * assessment -> certificate is generated automatically (AssessmentPlayer.tsx now calls
 * POST /api/progress + POST /api/certificates/generate on a passing score) -> read back
 * through /results and /certificates.
 */
const COURSE_SLUG = "improving-your-mental-health";

test.describe("Certification @destructive", () => {
  test("passing the assessment auto-generates a certificate, visible on results, certificate page, and dashboard", async ({ page }) => {
    const course = getCourseBySlug(COURSE_SLUG)!;
    const assessment = course.assessments[0];

    await signUpTestUser(page, "cert");

    await page.goto(`/courses/${COURSE_SLUG}`);
    await page.getByRole("button", { name: "Enrol free" }).click();
    await expect(page.getByRole("button", { name: "Continue learning" })).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "Continue learning" }).click();
    await page.waitForURL(/\/lesson\//, { timeout: 10_000 });

    // Lesson 1 -> auto-advances to lesson 2 (the assessment's lesson) on completion.
    await page.getByRole("button", { name: /Mark complete/i }).click();
    await page.waitForURL(/knowledge-check/, { timeout: 5_000 });

    await page.getByRole("link", { name: /Take Assessment/i }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 10_000 });

    // Real, clickable breadcrumb trail (Academies -> Academy -> Course -> Assessment).
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Academies" })).toBeVisible();

    await page.getByRole("button", { name: "Start assessment" }).click();

    for (const question of assessment.questions) {
      // Clicking the option's label text toggles the radio it wraps (native label association).
      await page.getByText(question.answer, { exact: true }).click();
      const isLast = question === assessment.questions[assessment.questions.length - 1];
      await page.getByRole("button", { name: isLast ? "Submit assessment" : "Next question →" }).click();
    }

    await expect(page.getByText("Congratulations — you passed!")).toBeVisible();
    await expect(page.getByText("100%").first()).toBeVisible();

    // The certificate call happens in the background after submit — give it a moment, then
    // confirm the UI reflects real success rather than staying stuck on "Checking...".
    await expect(page.getByText(/Certificate ready|Complete the remaining lessons/)).toBeVisible({ timeout: 15_000 });

    // This 2-lesson course's assessment IS the last lesson, so passing it completes the whole
    // course — the celebration overlay (not just the small in-card caption) should appear,
    // since certificateState reaching "ready" means enrollments.progress hit 100%.
    await expect(page.getByText("Course complete!")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("link", { name: "View results & certificate" }).click();
    await page.waitForURL(/\/results\//, { timeout: 10_000 });
    await expect(page.getByRole("link", { name: "View certificate" })).toBeVisible({ timeout: 15_000 });

    await page.getByRole("link", { name: "View certificate" }).click();
    await page.waitForURL(/\/certificates\//, { timeout: 10_000 });
    const certificateIdText = await page.getByText(/VOWLMS-[A-Z0-9-]+/).first().innerText();
    await expect(page.getByRole("button", { name: /Download/i })).toBeVisible();

    // PDF download endpoint returns a real PDF.
    const pdfResponse = await page.request.get(
      `/api/certificates/generate?courseSlug=${encodeURIComponent(COURSE_SLUG)}&format=pdf`,
    );
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");
    const pdfBytes = await pdfResponse.body();
    expect(pdfBytes.length).toBeGreaterThan(500);
    expect(pdfBytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");

    // Appears on the learner's certificates list.
    await page.goto("/certificates");
    await expect(page.getByText(course.title)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(certificateIdText)).toBeVisible();
  });
});
