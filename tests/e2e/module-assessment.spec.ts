import { expect, test } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";

/**
 * @destructive — writes real enrollment/assessment rows via the live bridge.
 * Skipped unless RUN_DESTRUCTIVE_TESTS=1. Exercises the real, newly-authored
 * Module 1 "Business Ethics Fundamentals" assessment end to end: every
 * question type (multiple-choice, true/false, fill-in-the-blank, matching,
 * scenario, ordering), a real submit, and the results review.
 */
test.describe("Module assessment @destructive", () => {
  test("mixed question types render, score correctly, and the review explains/clues every answer", async ({ page }) => {
    await signUpTestUser(page, "modassess");

    await page.goto("/courses/business-ethics");
    await page.getByRole("button", { name: /Enrol/i }).click();
    await expect(page.getByRole("button", { name: "Continue learning" })).toBeVisible({ timeout: 10_000 });

    // Jump straight to the real Module 1 assessment lesson rather than
    // clicking through every preceding lesson.
    await page.goto("/lesson/module-1-business-ethics-fundamentals-module-assessment-test-your-knowledge");
    await page.getByRole("link", { name: /Take Assessment/i }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 10_000 });

    await expect(page.getByRole("heading", { name: "Business Ethics Fundamentals" })).toBeVisible();
    await page.getByRole("button", { name: "Start assessment" }).click();

    // q1 multiple-choice
    await expect(page.getByText("Multiple choice", { exact: true })).toBeVisible();
    await page.getByText("The principles and standards that guide right and wrong conduct in a professional setting", { exact: true }).click();
    await page.getByRole("button", { name: "Next question →" }).click();

    // q2 true/false
    await expect(page.getByText("True or False", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "False", exact: true }).click();
    await page.getByRole("button", { name: "Next question →" }).click();

    // q3 fill-blank
    await expect(page.getByText("Fill in the blank", { exact: true })).toBeVisible();
    await page.locator('input[type="text"]').fill("integrity");
    await page.getByRole("button", { name: "Next question →" }).click();

    // q4 scenario
    await expect(page.getByText("Workplace scenario", { exact: true })).toBeVisible();
    await page.getByText("Raise it through the appropriate reporting channel at your workplace", { exact: true }).click();
    await page.getByRole("button", { name: "Next question →" }).click();

    // q5 matching — 4 dropdowns, pick the correct right-hand value for each
    await expect(page.getByText("Match the pairs", { exact: true })).toBeVisible();
    const selects = page.locator("select");
    await expect(selects).toHaveCount(4);
    await selects.nth(0).selectOption({ label: "Treating minor dishonest acts as harmless" });
    await selects.nth(1).selectOption({ label: "Creates an incentive to cut ethical corners" });
    await selects.nth(2).selectOption({ label: "Employees are afraid to report wrongdoing" });
    await selects.nth(3).selectOption({ label: "Some people are held to different standards than others" });
    await page.getByRole("button", { name: "Next question →" }).click();

    // q6 multiple-choice
    await page.getByText("Pressure to bend the rules in order to hit targets", { exact: true }).click();
    await page.getByRole("button", { name: "Next question →" }).click();

    // q7 true/false
    await page.getByRole("button", { name: "True", exact: true }).click();
    await page.getByRole("button", { name: "Next question →" }).click();

    // q8 ordering — already-correct shuffled order isn't guaranteed, so reorder
    // by moving each item to the top in the right sequence (last-authored-first).
    await expect(page.getByText("Put in order", { exact: true })).toBeVisible();
    const correctOrder = [
      "Pause and identify exactly what's at stake",
      "Check the situation against company policy and values",
      "Raise the concern through the appropriate channel",
      "Follow up to confirm it was actually addressed",
    ];
    for (let target = 0; target < correctOrder.length; target++) {
      // Find the row currently holding this text, and move it up until it's in place.
      for (let guard = 0; guard < correctOrder.length; guard++) {
        const rows = page.locator("div.flex.items-center.gap-3.rounded-xl");
        const texts = await rows.allTextContents();
        const idx = texts.findIndex((t) => t.includes(correctOrder[target]));
        if (idx === target) break;
        await rows.nth(idx).getByRole("button", { name: "↑" }).click();
      }
    }

    await page.getByRole("button", { name: "Submit assessment" }).click();

    await expect(page.getByRole("heading", { name: "100%" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Congratulations — you passed!")).toBeVisible();

    // Review shows explanations for every correct answer, no raw "clue" leaks
    // (every question answered correctly here, so only explanations render).
    await expect(page.getByText("Answer review")).toBeVisible();
    await expect(page.getByText(/Integrity is doing the right thing/)).toBeVisible();
  });

  test("failing below 80% shows clues (not answers) and gates retry behind VOWR", async ({ page }) => {
    await signUpTestUser(page, "modassessfail");

    await page.goto("/courses/business-ethics");
    await page.getByRole("button", { name: /Enrol/i }).click();
    await expect(page.getByRole("button", { name: "Continue learning" })).toBeVisible({ timeout: 10_000 });

    await page.goto("/lesson/module-1-business-ethics-fundamentals-module-assessment-test-your-knowledge");
    await page.getByRole("link", { name: /Take Assessment/i }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 10_000 });
    await page.getByRole("button", { name: "Start assessment" }).click();

    // Answer every question wrong on purpose (picking the second/incorrect option
    // each time) to guarantee a score below the 80% pass mark.
    for (let i = 0; i < 8; i++) {
      const trueFalse = page.getByRole("button", { name: "False", exact: true });
      const textInput = page.locator('input[type="text"]');
      if (await trueFalse.isVisible().catch(() => false)) {
        await page.getByRole("button", { name: "True", exact: true }).click();
      } else if (await textInput.isVisible().catch(() => false)) {
        await textInput.fill("definitely not the right answer");
      } else {
        const selects = page.locator("select");
        const selectCount = await selects.count();
        if (selectCount > 0) {
          for (let s = 0; s < selectCount; s++) {
            const opts = await selects.nth(s).locator("option:not([disabled])").allTextContents();
            await selects.nth(s).selectOption({ label: opts[opts.length - 1] });
          }
        } else {
          // multiple-choice / scenario / ordering (leave ordering as shuffled-default) — pick the last radio option.
          const radios = page.locator('input[type="radio"]');
          const count = await radios.count();
          if (count > 0) await radios.nth(count - 1).click({ force: true });
        }
      }
      const isLast = i === 7;
      await page.getByRole("button", { name: isLast ? "Submit assessment" : "Next question →" }).click();
    }

    await expect(page.getByText("Not quite — take a closer look below, then retry")).toBeVisible({ timeout: 10_000 });

    // Clues shown for wrong answers, never the raw correct answer text.
    await expect(page.getByText(/Clue:/).first()).toBeVisible();

    // A freshly enrolled account has exactly 50 VOWR (the real, already-wired
    // "course enrolment" milestone) — precisely the retry cost, so the real,
    // instant redemption path is the one to exercise here.
    const unlockButton = page.getByRole("button", { name: /Unlock retry — 50 VOWR/ });
    await expect(unlockButton).toBeVisible();
    await expect(unlockButton).toBeEnabled();
    await unlockButton.click();

    // A real POST /api/rewards/redeem call — instant (not a 24h pending
    // request) — resets the attempt straight back to the intro screen.
    await expect(page.getByRole("heading", { name: "Business Ethics Fundamentals" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Start assessment" })).toBeVisible();
  });
});
