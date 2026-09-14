import { test, expect } from "@playwright/test";
import { signUpTestUser } from "./helpers/auth";

test.describe("PayFast live checkout diagnostic @destructive", () => {
  test("click Pay with PayFast on a real course page", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

    let checkoutCreateStatus: number | null = null;
    let checkoutCreateBody: string | null = null;
    page.on("response", async (res) => {
      if (res.url().includes("/api/payments/course-unlock-create")) {
        checkoutCreateStatus = res.status();
        checkoutCreateBody = await res.text().catch(() => "(unreadable)");
      }
    });

    await signUpTestUser(page, "payfastqa");
    await page.goto("/courses/business-ethics");
    await page.waitForLoadState("networkidle");

    const cspHeader = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return meta ? meta.getAttribute("content") : "(no meta CSP tag — check response header separately)";
    });
    console.log("PAGE_CSP_META:", cspHeader);

    const swState = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return "unsupported";
      const reg = await navigator.serviceWorker.getRegistration();
      return reg ? { scope: reg.scope, active: reg.active?.scriptURL, waiting: !!reg.waiting } : "none";
    });
    console.log("SW_STATE:", JSON.stringify(swState));

    const payButton = page.getByRole("button", { name: /Pay.*via PayFast/i });
    await expect(payButton).toBeVisible({ timeout: 15_000 });
    await payButton.click();

    await page.waitForTimeout(4000);

    console.log("CHECKOUT_CREATE_STATUS:", checkoutCreateStatus);
    console.log("CHECKOUT_CREATE_BODY:", checkoutCreateBody);
    console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors, null, 2));
    console.log("FINAL_URL:", page.url());
  });
});
