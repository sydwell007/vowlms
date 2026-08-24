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

test.describe("VowHumans presenter", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: "vowlms_token",
        value: "non-production-presenter-ui-test",
        url: test.info().project.use.baseURL as string,
      },
    ]);
    await page.route("**/api/admin/lessons**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: { lessons: [lesson] } }),
      });
    });
  });

  test("requires learner consent and cleanly removes the iframe", async ({ page }, testInfo) => {
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
    await expect(frame).toHaveAttribute("src", lesson.vowhuman_embed_url);

    await presenter.getByRole("button", { name: "Close presenter" }).click();
    await expect(presenter.locator("iframe")).toHaveCount(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
