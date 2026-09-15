import { expect, test } from "@playwright/test";

const practiceSlug = "organizational-culture-module-1-vr-practice";

test.beforeEach(async ({ context, page }) => {
  await context.addCookies([{
    name: "vowlms_token",
    value: "local-vr-preview",
    domain: "localhost",
    path: "/",
  }]);
  await page.addInitScript((slug) => {
    localStorage.setItem(`vowlms:vr-tour:${slug}:v1`, "complete");
  }, practiceSlug);
});

test("labels every station and requires its action before progress advances", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto(`http://localhost:3101/vr-practice/${practiceSlug}`);
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  const viewportLabel = page.viewportSize()?.width ?? "unknown";

  await expect(page.getByText("Labelled station map")).toBeVisible();
  await expect.poll(() => runtimeErrors).toEqual([]);
  await expect(page.getByRole("button", { name: "Select station 1: Observe Fostering psychological safety in" })).toBeVisible();
  await expect(page.getByText("0%", { exact: true })).toBeVisible();
  await page.waitForTimeout(1_000);
  await page.locator("[data-vr-studio='true']").screenshot({ path: `test-results/vowlms-vr-labelled-stations-${viewportLabel}.png` });

  await page.getByRole("button", { name: "Select station 2: Diagnose Creating an inclusive remote" }).click();
  await expect(page.getByRole("status")).toContainText("That is not the Observe Fostering psychological safety in station");
  await expect(page.getByText("0%", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Select station 1: Observe Fostering psychological safety in" }).click();
  const actionDialog = page.getByRole("dialog", { name: "Action for Observe Fostering psychological safety in" });
  await expect(actionDialog).toBeVisible();
  await expect(actionDialog.getByRole("heading", { name: "Step 2: Complete the action" })).toBeVisible();
  await expect(page.getByText("0%", { exact: true })).toBeVisible();
  await actionDialog.screenshot({ path: `test-results/vowlms-vr-action-panel-${viewportLabel}.png` });

  await actionDialog.getByRole("button", { name: "Move ahead quickly without checking how \"Fostering psychological safety in the workplace\" applies." }).click();
  await expect(actionDialog).toContainText("That choice skips an important part");
  await expect(page.getByText("0%", { exact: true })).toBeVisible();

  await actionDialog.getByRole("button", { name: "Observe with purpose: invite overlooked perspectives, use inclusive language, and agree a respectful next step." }).click();
  await expect(actionDialog).toContainText("Correct. You applied Fostering psychological safety");
  await expect(page.getByText("20%", { exact: true })).toBeVisible();
  await expect(actionDialog.getByRole("button", { name: "Continue to station 2" })).toBeVisible();
});
