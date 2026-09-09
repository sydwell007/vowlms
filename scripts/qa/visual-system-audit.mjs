import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL ?? "http://localhost:3000";
const outputDir = "artifacts/visual-system-audit";
const routes = [
  ["home", "/"],
  ["courses", "/courses"],
  ["academy", "/academies/upskilling"],
  ["course", "/courses/business-ethics"],
  ["pathways", "/find-my-path"],
  ["learning", "/learn"],
  ["opportunities", "/opportunities"],
  ["support", "/support"],
  ["investors", "/investors"],
  ["signin", "/auth/signin"],
];
const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];

for (const [viewportName, viewport] of viewports) {
  for (const [name, route] of routes) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    const errors = [];
    const failedRequests = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? "Request failed" });
    });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 45_000 });
    const audit = await page.evaluate(() => {
      const hero = document.querySelector(".visual-hero");
      const heroStyle = hero ? getComputedStyle(hero, "::before") : null;
      const brokenImages = Array.from(document.images)
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src);

      return {
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() ?? null,
        hasHero: Boolean(hero),
        heroImage: heroStyle?.backgroundImage ?? null,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        brokenImages,
        errorOverlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")),
      };
    });

    await page.screenshot({ path: `${outputDir}/${name}-${viewportName}.png`, fullPage: false });
    report.push({
      route,
      viewport: viewportName,
      status: response?.status() ?? null,
      finalUrl: page.url(),
      errors,
      failedRequests,
      ...audit,
    });
    await page.close();
  }
}

await browser.close();
await writeFile(`${outputDir}/report.json`, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.filter(
  (item) =>
    (item.status !== 200 && item.status !== 304) ||
    item.errors.filter((error) => !error.includes("Failed to load resource")).length > 0 ||
    item.failedRequests.filter(
      (request) =>
        request.error !== "net::ERR_ABORTED" &&
        !request.url.startsWith("https://localhost:") &&
        !request.url.includes("api.goalvow.com"),
    ).length > 0 ||
    item.brokenImages.length > 0 ||
    item.errorOverlay ||
    item.overflowX,
);

console.log(`Audited ${report.length} page and viewport combinations.`);
console.log(failures.length ? JSON.stringify(failures, null, 2) : "No visual-system audit failures detected.");
process.exitCode = failures.length ? 1 : 0;
