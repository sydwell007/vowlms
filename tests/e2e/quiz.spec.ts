import { test, expect } from "@playwright/test";

type Answer = { q1: string; q2: string; q3: string; q4: string };

const Q1 = {
  unemployed: "I'm unemployed and looking for work",
  employed: "I'm employed and want to grow",
  business: "I want to start my own business",
  student: "I'm a student looking for skills",
};
const Q2 = {
  light: "1-2 hours a week",
  moderate: "A few hours a day",
  fulltime: "I want to finish fast, full time",
  flexible: "Flexible, whenever I can",
};
const Q3 = {
  handsOn: "Hands-on / practical work",
  office: "Office / desk / admin work",
  mixed: "A mix of both",
  people: "I work with people / customers",
};
const Q4 = {
  getJob: "Getting a job as fast as possible",
  certificate: "Earning a formal certificate",
  career: "Building long-term career skills",
  income: "Starting my own income stream",
};

// 5 representative combinations spanning every academy the scoring matrix can route to.
const combinations: Answer[] = [
  { q1: Q1.unemployed, q2: Q2.flexible, q3: Q3.handsOn, q4: Q4.getJob }, // -> Skills Training
  { q1: Q1.employed, q2: Q2.light, q3: Q3.office, q4: Q4.career }, // -> Upskilling
  { q1: Q1.business, q2: Q2.fulltime, q3: Q3.people, q4: Q4.income }, // -> Business School
  { q1: Q1.student, q2: Q2.moderate, q3: Q3.mixed, q4: Q4.certificate }, // -> Upskilling (all +1 tiebreak)
  { q1: Q1.unemployed, q2: Q2.light, q3: Q3.handsOn, q4: Q4.getJob }, // -> Skills Training / Chef Academy tie
];

test.describe("Path Finder Quiz", () => {
  for (const [index, combo] of combinations.entries()) {
    test(`combination ${index + 1} always renders a recommendation`, async ({ page }) => {
      await page.goto("/quiz");
      await expect(page.getByText(/Question 1 of 4/i)).toBeVisible();

      await page.getByRole("button", { name: combo.q1 }).click();
      await page.getByRole("button", { name: combo.q2 }).click();
      await page.getByRole("button", { name: combo.q3 }).click();
      await page.getByRole("button", { name: combo.q4 }).click();

      await expect(page.getByText(/Based on your answers, we recommend/i)).toBeVisible();

      const courseCards = page.locator("article", { hasText: "View course" });
      expect(await courseCards.count()).toBeGreaterThan(0);

      await expect(page.getByRole("link", { name: /Start my recommended path/i })).toBeVisible();
    });
  }
});
