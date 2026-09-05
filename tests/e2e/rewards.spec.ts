import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const learnerSession = {
  id: "test-learner",
  name: "Test Learner",
  email: "learner@test.local",
  role: "learner",
};

function rewardEvent(id: string, event: string, points: number) {
  return { id, event, points, metadata: null, created_at: new Date().toISOString() };
}

/**
 * All rewards data flows through the browser-facing `/api/rewards/*` Next.js
 * routes, which are mockable with page.route() regardless of whether a real
 * PHP bridge is configured server-side (the mock short-circuits the request
 * before it ever reaches the route handler) — unlike server-component role
 * checks during navigation, which call the bridge outside the browser and
 * can't be intercepted this way (see vowhumans.spec.ts).
 */
async function mockSession(page: Page) {
  await page.route("**/api/auth/session", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: learnerSession }) });
  });
}

async function mockBalance(page: Page, balance: number, recentEvents: ReturnType<typeof rewardEvent>[]) {
  await page.route("**/api/rewards/balance", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: { balance, recentEvents } }) });
  });
}

async function mockHistory(page: Page, events: ReturnType<typeof rewardEvent>[], hasMore = false) {
  await page.route("**/api/rewards/history**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ ok: true, data: { balance: 0, events, page: 1, limit: 10, total: events.length, hasMore } }),
    });
  });
}

test.describe("VOWR wallet", () => {
  test("header shows the wallet balance pill with recent transactions", async ({ page }) => {
    await mockSession(page);
    await mockBalance(page, 305, [
      rewardEvent("r1", "certificate_issued", 200),
      rewardEvent("r2", "assessment_pass", 100),
      rewardEvent("r3", "lesson_complete", 5),
    ]);

    await page.goto("/");

    // aria-label (not the visible text, which is a bare number on the compact
    // mobile pill) so this resolves identically across every project viewport.
    const pill = page.getByRole("button", { name: "VOWR balance: 305" });
    await expect(pill).toBeVisible();

    await pill.click();
    await expect(page.getByText("Your VOWR balance")).toBeVisible();
    await expect(page.getByText("305 VOWR", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Certificate issued")).toBeVisible();
    await expect(page.getByText("Lesson completed")).toBeVisible();
    await expect(page.getByRole("link", { name: "View Full Wallet" })).toHaveAttribute("href", "/rewards");
  });

  test("/rewards renders the wallet hero, ways to earn, history, and redemption catalog", async ({ page }) => {
    await mockSession(page);
    await mockBalance(page, 600, [rewardEvent("r1", "lesson_complete", 5)]);
    await mockHistory(page, [rewardEvent("h1", "lesson_complete", 5), rewardEvent("h2", "certificate_issued", 200)]);

    await page.goto("/rewards");

    await expect(page.getByRole("heading", { name: "Your VOWR wallet" })).toBeVisible();
    await expect(page.getByText("600 VOWR", { exact: false }).first()).toBeVisible();

    await expect(page.getByRole("heading", { name: "Real milestones, real VOWR" })).toBeVisible();
    await expect(page.getByText("First lesson completion")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Every VOWR event on your account" })).toBeVisible();
    // Scoped to #history: "Certificate issued" also appears as a ways-to-earn heading elsewhere on the page.
    await expect(page.locator("#history").getByText("Certificate issued")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Spend your VOWR" })).toBeVisible();
    await expect(page.getByText("Course enrolment credit")).toBeVisible();
    await expect(page.getByText("Donate to another learner")).toBeVisible();
    await expect(page.getByText("SkillsShop credit")).toBeVisible();

    await expect(page.getByRole("link", { name: "Open Wallet Portal →" })).toHaveAttribute(
      "href",
      "https://wallet.vowrewards.co.za",
    );
  });

  test("balance pill reflects a new award and celebrates without a page reload", async ({ page }) => {
    await mockSession(page);
    let call = 0;
    await page.route("**/api/rewards/balance", async (route) => {
      call += 1;
      const balance = call === 1 ? 100 : 105;
      const recentEvents = call === 1 ? [rewardEvent("r1", "lesson_complete", 5)] : [rewardEvent("r2", "lesson_complete", 5), rewardEvent("r1", "lesson_complete", 5)];
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: { balance, recentEvents } }) });
    });

    await page.goto("/");
    await expect(page.getByRole("button", { name: "VOWR balance: 100" })).toBeVisible();

    // Simulate the same mechanism a real lesson completion elsewhere in the
    // app triggers — a window focus event, which the shared wallet hook
    // listens for to revalidate without any manual page refresh.
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));

    await expect(page.getByRole("button", { name: "VOWR balance: 105" })).toBeVisible();
    await expect(page.getByText("🎉 You just earned 5 VOWR!")).toBeVisible();
  });

  test("submitting a redemption request debits the balance and appears in history", async ({ page }) => {
    await mockSession(page);
    await mockBalance(page, 600, []);
    await mockHistory(page, [rewardEvent("h1", "lesson_complete", 5)]);

    await page.route("**/api/rewards/redeem", async (route) => {
      await mockBalance(page, 100, []);
      await mockHistory(page, [rewardEvent("h2", "redemption:mentorship_session", -250), rewardEvent("h1", "lesson_complete", 5)]);
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          data: { status: "pending", requestId: "req1", redemptionType: "mentorship_session", amount: 250, balance: 100, message: "Request submitted — reviewed within 24 hours." },
        }),
      });
    });

    await page.goto("/rewards");
    await expect(page.getByText("600 VOWR", { exact: false }).first()).toBeVisible();

    const card = page.locator("article", { hasText: "1:1 mentorship session" });
    await card.getByRole("button", { name: "Redeem" }).click();

    await expect(page.getByText("Request submitted — reviewed within 24 hours.")).toBeVisible();
    // Scoped to #history: "Mentorship Session" is also a case-insensitive substring of the
    // "1:1 mentorship session" catalog card heading elsewhere on the page.
    await expect(page.locator("#history").getByText("Mentorship Session")).toBeVisible();
  });
});
