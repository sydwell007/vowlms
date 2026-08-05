import { test, expect } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";

/**
 * @destructive — not because assessment submission writes anything (it doesn't: submit() in
 * AssessmentPlayer.tsx only writes to localStorage, vowlms_assessments/vowlms_progress, with no
 * backend call), but because `/assessment` is in the Next.js middleware's protectedPrefixes list
 * (src/proxy.ts:15) and redirects unauthenticated visitors to sign-in — even though the page
 * component itself (src/app/assessment/[slug]/page.tsx) has no auth check of its own. Reaching
 * the page at all requires a real signed-in test account, hence the signup call below.
 *
 * Worth flagging in the QA report regardless: once past that route gate, assessment scoring has
 * no server-side validation — a learner's pass/fail is never recorded or verifiable server-side.
 */
const ASSESSMENT_SLUG = "improving-your-mental-health-assessment";
const CORRECT_ANSWERS = [
  "To build practical skills and apply them",
  "Progress, attempts, and certificates",
  "Rewards, certificates, and opportunity matches",
];
const WRONG_ANSWERS = [
  "To complete the certificate quickly",
  "Only time spent online",
  "A social profile only",
];

async function answerAll(page: import("@playwright/test").Page, answers: string[]) {
  for (let i = 0; i < answers.length; i++) {
    await page.getByRole("radio", { name: answers[i] }).check();
    if (i < answers.length - 1) {
      await page.getByRole("button", { name: "Next question →" }).click();
    }
  }
}

test.describe("Assessments @destructive", () => {
  test("a passing score shows the pass state and a next-step CTA", async ({ page }) => {
    await signUpTestUser(page, "assess-pass");
    await page.goto(`/assessment/${ASSESSMENT_SLUG}`);
    await page.getByRole("button", { name: "Start assessment" }).click();

    await answerAll(page, CORRECT_ANSWERS);
    await page.getByRole("button", { name: "Submit assessment" }).click();

    await expect(page.getByRole("heading", { name: "100%", exact: true })).toBeVisible();
    await expect(page.getByText("Congratulations — you passed!")).toBeVisible();
    await expect(page.getByRole("link", { name: "View results & certificate" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry assessment" })).not.toBeVisible();
  });

  test("a failing score shows the retry option", async ({ page }) => {
    await signUpTestUser(page, "assess-fail");
    await page.goto(`/assessment/${ASSESSMENT_SLUG}`);
    await page.getByRole("button", { name: "Start assessment" }).click();

    await answerAll(page, WRONG_ANSWERS);
    await page.getByRole("button", { name: "Submit assessment" }).click();

    await expect(page.getByRole("heading", { name: "0%", exact: true })).toBeVisible();
    await expect(page.getByText("Not quite — try again")).toBeVisible();
    const retryButton = page.getByRole("button", { name: "Retry assessment" });
    await expect(retryButton).toBeVisible();
    await expect(page.getByRole("link", { name: "View results & certificate" })).not.toBeVisible();

    // Retry actually resets the flow back to question 1.
    await retryButton.click();
    await expect(page.getByRole("button", { name: "Start assessment" })).toBeVisible();
  });

  test("submit is disabled until every question is answered", async ({ page }) => {
    await signUpTestUser(page, "assess-partial");
    await page.goto(`/assessment/${ASSESSMENT_SLUG}`);
    await page.getByRole("button", { name: "Start assessment" }).click();

    // Answer only the first question, jump to the last via the question navigator.
    await page.getByRole("radio", { name: CORRECT_ANSWERS[0] }).check();
    await page.getByRole("button", { name: "3" }).click();

    await expect(page.getByRole("button", { name: "Submit assessment" })).toBeDisabled();
  });
});
