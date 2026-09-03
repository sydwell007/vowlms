import { expect, test } from "@playwright/test";

const lesson = {
  id: "lesson-presenter-test",
  slug: "module-1-business-ethics-fundamentals-module-reading-material",
  title: "Module Reading Material",
  type: "reading",
  duration_minutes: 8,
  academy_name: "Upskilling Academy",
  course_slug: "business-ethics-fundamentals",
  course_title: "Business Ethics Fundamentals",
  module_title: "Module 1: Foundation",
  vowhuman_enabled: true,
  vowhuman_embed_url:
    "https://vowhumans.com/embed/c81cca0d-866f-466c-a60d-c343dcdab9c4/goalvow-academies",
  vowhuman_presenter_name: "GoalVow Academies Presenter",
  vowhuman_intro: "Ask questions and explore this lesson with your AI learning guide.",
  vowhuman_placement: "before-content",
  vowhuman_role: "presenter",
  vowhuman_expertise: "Business ethics learning guide",
  vowhuman_camera_enabled: true,
  vowhuman_microphone_enabled: true,
};

// `/dashboard/admin/*` now checks the token's actual role (previously any
// cookie value was enough), so the test session needs a real dev-mode admin
// token rather than an arbitrary placeholder string.
const devAdminToken =
  "dev." +
  Buffer.from(
    JSON.stringify({ id: "test-admin", name: "Test Admin", email: "admin@test.local", role: "admin" }),
  ).toString("base64");

test.describe("VowHumans presenter", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: "vowlms_token",
        value: devAdminToken,
        url: test.info().project.use.baseURL as string,
      },
    ]);
    await page.route("**/api/admin/lessons**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: { lessons: [lesson] } }),
      });
    });
    await page.route("**/api/vowhumans/context-token/**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ token: "presenter-ui-test-token" }),
      });
    });
  });

  test("requires learner consent and cleanly removes the iframe", async ({ page }, testInfo) => {
    // /dashboard/admin/* now verifies the session's real role via
    // getServerRole() (previously any cookie was enough to reach the page).
    // When BRIDGE_BASE_URL is configured — as it is in this environment —
    // that check calls the real Afrihost bridge server-side, which
    // Playwright's page.route() mocking cannot intercept (it only sees
    // browser-initiated requests). A fake dev-mode token only works when the
    // bridge is unset, so this needs a real bridge-issued admin session to
    // pass here.
    test.skip(true, "Needs a real bridge-issued admin session — the dev-mode fake-admin-cookie trick only works when BRIDGE_BASE_URL is unset.");
    await page.goto(`/dashboard/admin/lessons?lesson=${lesson.slug}`);

    await expect(page.getByRole("heading", { name: lesson.title })).toBeVisible();
    await page.getByRole("button", { name: "Preview presenter" }).click();

    const presenter = page.getByRole("region", {
      name: "AI Course Presenter",
    });
    await expect(presenter).toBeVisible();
    await expect(presenter.locator("iframe")).toHaveCount(0);
    await expect(
      presenter.getByText(
        "Your browser may ask for camera or microphone access after you start. VowLMS does not record or store that media.",
      ),
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("presenter-preview.png"),
      fullPage: true,
    });

    await presenter.getByRole("button", { name: "Start AI Course Presenter" }).click();
    const frame = presenter.locator("iframe");
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveAttribute("allow", "camera; microphone; fullscreen");
    await expect(frame).toHaveAttribute(
      "src",
      `${lesson.vowhuman_embed_url}#lesson_context_token=presenter-ui-test-token`,
    );

    await presenter.getByRole("button", { name: "Close presenter" }).click();
    await expect(presenter.locator("iframe")).toHaveCount(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
