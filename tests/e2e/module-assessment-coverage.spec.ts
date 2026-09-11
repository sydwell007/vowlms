import { expect, test, type Page } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";
import { getCourseBySlug } from "../../src/lib/data";
import type { AssessmentQuestion } from "../../src/types/lms";

/**
 * @destructive — writes real enrollment/assessment rows via the live bridge.
 * Skipped unless RUN_DESTRUCTIVE_TESTS=1.
 *
 * Broad coverage smoke test across the newly-authored module assessments —
 * one course per parallel authoring batch, driven generically by reading the
 * REAL correct answers straight out of the data (via getAssessmentBySlug)
 * rather than hardcoding them, so this works for any assessment regardless
 * of its exact question mix. Confirms every question type renders and
 * scores correctly for content none of this session hand-authored directly.
 */
async function answerCorrectly(page: Page, question: AssessmentQuestion) {
  switch (question.type) {
    case "true-false":
      await page.getByRole("button", { name: question.answer, exact: true }).click();
      break;
    case "fill-blank":
      await page.locator('input[type="text"]').fill(question.answer);
      break;
    case "matching": {
      const selects = page.locator("select");
      for (let i = 0; i < question.pairs.length; i++) {
        await selects.nth(i).selectOption({ label: question.pairs[i].right });
      }
      break;
    }
    case "ordering": {
      for (let target = 0; target < question.items.length; target++) {
        for (let guard = 0; guard < question.items.length; guard++) {
          const rows = page.locator("div.flex.items-center.gap-3.rounded-xl");
          const texts = await rows.allTextContents();
          const idx = texts.findIndex((t) => t.includes(question.items[target]));
          if (idx === target) break;
          await rows.nth(idx).getByRole("button", { name: "↑" }).click();
        }
      }
      break;
    }
    case "scenario":
    case "multiple-choice":
    default:
      if ("answer" in question) {
        await page.getByText(question.answer, { exact: true }).click();
      }
      break;
  }
}

const COURSES_TO_SPOT_CHECK: { courseSlug: string; assessmentLessonSlug: string }[] = [
  { courseSlug: "cybersecurity", assessmentLessonSlug: "module-1-online-security-fundamentals-module-assessment-test-your-knowledge" },
  { courseSlug: "marketing", assessmentLessonSlug: "module-1-marketing-fundamentals-module-assessment-test-your-knowledge" },
  { courseSlug: "sales", assessmentLessonSlug: "module-1-sales-fundamentals-module-assessment-test-your-knowledge" },
  { courseSlug: "customer-service", assessmentLessonSlug: "module-1-customer-service-fundamentals-module-assessment-test-your-knowledge" },
  { courseSlug: "communication", assessmentLessonSlug: "module-1-communication-fundamentals-module-assessment-test-your-knowledge" },
];

for (const { courseSlug, assessmentLessonSlug } of COURSES_TO_SPOT_CHECK) {
  test(`@destructive ${courseSlug} module 1 assessment: every real answer scores 100%`, async ({ page }) => {
    const course = getCourseBySlug(courseSlug)!;
    const assessment = course.assessments.find((a) => a.lessonSlug === assessmentLessonSlug);
    test.skip(!assessment, `No assessment wired yet for ${assessmentLessonSlug}`);
    if (!assessment) return;

    await signUpTestUser(page, courseSlug.slice(0, 8));
    await page.goto(`/courses/${courseSlug}`);
    await page.getByRole("button", { name: /Enrol/i }).click();
    await expect(page.getByRole("button", { name: "Continue learning" })).toBeVisible({ timeout: 10_000 });

    await page.goto(`/lesson/${assessmentLessonSlug}`);
    await page.getByRole("link", { name: /Take Assessment/i }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 10_000 });
    await page.getByRole("button", { name: "Start assessment" }).click();

    for (let i = 0; i < assessment.questions.length; i++) {
      const q = assessment.questions[i];
      await answerCorrectly(page, q);
      const isLast = i === assessment.questions.length - 1;
      await page.getByRole("button", { name: isLast ? "Submit assessment" : "Next question →" }).click();
    }

    await expect(page.getByRole("heading", { name: "100%" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Congratulations — you passed!")).toBeVisible();
  });
}
