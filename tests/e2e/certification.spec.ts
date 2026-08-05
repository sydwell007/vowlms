import { test, expect } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";

/**
 * @destructive — writes a real certificate row via the live bridge. Skipped unless
 * RUN_DESTRUCTIVE_TESTS=1. See tests/e2e/README.md.
 *
 * IMPORTANT FINDING (verified by tracing the code, not assumption): no UI component in this
 * codebase ever calls `POST /api/certificates/generate` (src/app/api/certificates/generate/route.ts:65-80)
 * — the only wired-up call is the `GET` in CertificateRouteClient.tsx:20, which *reads* an
 * existing certificate (bridgeGet("/certificates?courseSlug=...")) and 404s if one doesn't
 * exist yet. There is currently no learner-reachable button/flow that ever creates the row in
 * the first place, so a real learner visiting /certificates/{slug} after completing a course
 * will always see "Certificate unavailable" today. This test calls the POST endpoint directly
 * (the way a "Generate certificate" action presumably should) to verify the backend half of the
 * flow works, then confirms the read-back/PDF/dashboard steps — but the missing UI trigger
 * itself is the actual pre-launch blocker and is called out in the generated report.
 */
const COURSE_SLUG = "improving-your-mental-health";

test.describe("Certification @destructive", () => {
  test("certificate generates via the backend, reads back, downloads as PDF, and lists on dashboard", async ({ page }) => {
    await signUpTestUser(page, "cert");

    // "Force-complete" the course: enroll, then mark both lessons complete.
    await page.goto(`/courses/${COURSE_SLUG}`);
    await page.getByRole("button", { name: "Enrol free" }).click();
    await expect(page.getByRole("button", { name: "Continue learning" })).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "Continue learning" }).click();
    await page.waitForURL(/\/lesson\//, { timeout: 10_000 });

    await page.getByRole("button", { name: /Mark complete/i }).click();
    await page.waitForTimeout(800); // auto-advance to lesson 2
    await page.getByRole("button", { name: /Mark complete|Completed/i }).click().catch(() => {});

    // The UI never calls this — invoking it directly to test the backend generation path itself.
    const genResponse = await page.request.post("/api/certificates/generate", {
      data: { courseSlug: COURSE_SLUG },
    });

    if (genResponse.status() === 503) {
      test.skip(true, "Bridge not configured in this environment — cannot verify real certificate generation.");
    }

    expect(genResponse.ok()).toBe(true);
    const genBody = await genResponse.json();
    expect(genBody.ok).toBe(true);
    expect(genBody.data?.certificateId).toBeTruthy();

    // Read-back through the actual learner-facing page.
    await page.goto(`/certificates/${COURSE_SLUG}`);
    await expect(page.getByText(genBody.data.certificateId)).toBeVisible({ timeout: 10_000 });
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
    await expect(page.getByText("Improving your Mental Health")).toBeVisible({ timeout: 10_000 });
  });
});
