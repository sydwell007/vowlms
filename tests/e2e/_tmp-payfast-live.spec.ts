import { test } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";

test.describe("PayFast live checkout diagnostic @destructive", () => {
  test("click Pay with PayFast on a real course page", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Test the hypothesis that Google Tag Manager's enhanced-measurement
    // form tracking is intercepting the submission and is the real source
    // of the CSP conflict — block gtm.js/analytics entirely and see if the
    // real PayFast redirect then succeeds.
    await page.route("**/googletagmanager.com/**", (route) => route.abort());
    await page.route("**/google-analytics.com/**", (route) => route.abort());
    await page.route("**/analytics.google.com/**", (route) => route.abort());

    await signUpTestUser(page, "payfastqa");
    await page.goto("/courses/business-ethics");
    await page.waitForLoadState("networkidle");

    const payButton = page.getByRole("button", { name: /Pay.*via PayFast/i });
    await payButton.click();

    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1000).catch(() => {});
      try {
        console.log(`tick ${i}: url=${page.url()}`);
      } catch {
        console.log(`tick ${i}: context destroyed — navigated away`);
        break;
      }
    }

    let finalUrl = "(context destroyed by navigation — reached an external page)";
    try {
      finalUrl = page.url();
    } catch {
      // navigated
    }

    console.log("FINAL_RESULT_URL:", finalUrl);
    console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors, null, 2));
  });
});
