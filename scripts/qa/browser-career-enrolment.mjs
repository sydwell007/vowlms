import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.VOWLMS_TEST_URL ?? "http://localhost:3011";
const courses = JSON.parse(
  await readFile(path.join(process.cwd(), "src/data/savva-career-manifest.json"), "utf8"),
);
const screenshotDir = path.join(process.cwd(), "qa-reports", "screenshots");
await mkdir(screenshotDir, { recursive: true });

const admin = {
  id: "browser-admin",
  name: "VowLMS QA Admin",
  email: "qa-admin@localhost",
  role: "admin",
};
const token = `dev.${Buffer.from(JSON.stringify(admin)).toString("base64")}`;
const browser = await chromium.launch({ headless: true });

async function newAdminPage(viewport) {
  const context = await browser.newContext({ viewport });
  await context.addCookies([{ name: "vowlms_token", value: token, url: baseUrl }]);
  return { context, page: await context.newPage() };
}

try {
  const { context, page } = await newAdminPage({ width: 1440, height: 1000 });

  for (const course of courses) {
    const response = await page.goto(`${baseUrl}/courses/${course.slug}`, { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `${course.slug} did not render`);
    await page.getByRole("heading", { name: course.title, level: 1 }).waitFor();
    await page.getByText(`Admin preview — ${course.title} is not visible to learners yet.`).waitFor();
    await page.locator("#course-enrol-card").getByText(/R\s*999/, { exact: true }).waitFor();
    assert.equal(await page.getByRole("link", { name: "Preview course" }).count(), 1, `${course.slug} needs one preview action`);
    assert.equal(await page.getByText("Unlock the full course", { exact: false }).count(), 0, `${course.slug} still shows module checkout`);
    assert.equal(await page.getByText("R299", { exact: true }).count(), 0, `${course.slug} still shows the old module price`);
  }

  await page.goto(`${baseUrl}/courses/adobe-photoshop`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(screenshotDir, "career-course-pricing-desktop.png"),
    fullPage: false,
  });
  await page.getByRole("link", { name: "Preview course" }).click();
  await page.waitForURL(/\/lesson\/adobe-photoshop-m0-/);
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => document.body.innerText.includes("Introduction, Purpose and Objectives"));
  assert.match(page.url(), /\/lesson\/adobe-photoshop-m0-/);
  await page.screenshot({
    path: path.join(screenshotDir, "career-course-preview-lesson.png"),
    fullPage: false,
  });
  await context.close();

  const { context: mobileContext, page: mobilePage } = await newAdminPage({ width: 390, height: 844 });
  await mobilePage.goto(`${baseUrl}/courses/adobe-photoshop`, { waitUntil: "networkidle" });
  await mobilePage.locator("#course-enrol-card").getByText(/R\s*999/, { exact: true }).waitFor();
  await mobilePage.screenshot({
    path: path.join(screenshotDir, "career-course-pricing-mobile.png"),
    fullPage: false,
  });
  await mobileContext.close();

  console.log(`Browser verified ${courses.length} career course pages at R999 with one checkout model.`);
  console.log("Admin preview opened Module 0 successfully; desktop and mobile screenshots saved.");
} finally {
  await browser.close();
}
