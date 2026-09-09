import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const EXTRA_ROUTES = [
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/search?q=ethics",
  "/quiz",
  "/offline",
  "/dashboard/learner",
  "/dashboard/facilitator",
  "/dashboard/employer",
  "/dashboard/admin",
  "/dashboard/admin/analytics",
  "/dashboard/admin/lessons",
  "/dashboard/admin/settings",
  "/dashboard/admin/users",
  "/dashboard/admin/visibility",
  "/dashboard/facilitator/courses",
  "/dashboard/learner/grades",
  "/profile",
  "/certificates",
  "/calendar",
  "/announcements",
];

function sitemapPaths(xml, baseUrl) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    const base = new URL(baseUrl);
    return `${url.pathname}${url.search}`.replace(base.pathname, "/");
  });
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const unnamedInteractive = [...document.querySelectorAll("a, button")]
      .filter((element) => {
        const name = element.getAttribute("aria-label") || element.textContent?.trim();
        return !name;
      }).length;
    const unlabeledFields = [...document.querySelectorAll("input:not([type=hidden]), select, textarea")]
      .filter((element) => {
        const id = element.getAttribute("id");
        return !element.getAttribute("aria-label") && !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) && !element.closest("label");
      }).length;
    const brokenImages = [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length;
    const main = document.querySelector("main");

    return {
      h1Count: document.querySelectorAll("h1").length,
      hasMainContent: Boolean(main && (main.textContent?.trim() || main.childElementCount > 0)),
      unnamedInteractive,
      unlabeledFields,
      brokenImages,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });
}

async function main() {
  const baseUrl = (process.env.QA_TARGET_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`Could not load sitemap: HTTP ${sitemapResponse.status}`);

  const routes = [...new Set([
    ...sitemapPaths(await sitemapResponse.text(), baseUrl),
    ...EXTRA_ROUTES,
  ])].sort();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const results = [];
  const strictIntegrations = process.env.QA_STRICT_API === "1";
  const targetOrigin = new URL(baseUrl).origin;

  try {
    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const responseErrors = [];
      const failedRequests = [];
      const onConsole = (message) => {
        if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) {
          consoleErrors.push(message.text());
        }
      };
      const onPageError = (error) => pageErrors.push(error.message);
      const onResponse = (response) => {
        const url = new URL(response.url());
        if (url.origin === targetOrigin && response.status() >= 400) {
          responseErrors.push({ url: response.url(), status: response.status() });
        }
      };
      const onRequestFailed = (request) => {
        const error = request.failure()?.errorText ?? "Request failed";
        const url = new URL(request.url());
        if (url.origin !== targetOrigin || error === "net::ERR_ABORTED" || url.searchParams.has("_rsc")) return;
        failedRequests.push({ url: request.url(), error });
      };
      page.on("console", onConsole);
      page.on("pageerror", onPageError);
      page.on("response", onResponse);
      page.on("requestfailed", onRequestFailed);

      try {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
        await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => undefined);
        results.push({
          route,
          finalUrl: page.url(),
          status: response?.status() ?? 0,
          ...(await inspectPage(page)),
          consoleErrors,
          pageErrors,
          responseErrors,
          failedRequests,
        });
      } catch (error) {
        results.push({ route, finalUrl: page.url(), navigationError: error.message, consoleErrors, pageErrors, responseErrors, failedRequests });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  const failures = results.filter((result) =>
    result.navigationError ||
    result.status >= 400 ||
    result.h1Count === 0 ||
    !result.hasMainContent ||
    result.unnamedInteractive > 0 ||
    result.unlabeledFields > 0 ||
    result.brokenImages > 0 ||
    result.horizontalOverflow ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    (strictIntegrations && (result.responseErrors.length > 0 || result.failedRequests.length > 0)),
  );
  const integrationWarnings = results
    .filter((result) => result.responseErrors?.length || result.failedRequests?.length)
    .map(({ route, responseErrors, failedRequests }) => ({ route, responseErrors, failedRequests }));
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    routesChecked: results.length,
    overallStatus: failures.length ? "FAIL" : "PASS",
    strictIntegrations,
    failures,
    integrationWarnings,
    results,
  };
  const reportDir = path.resolve("qa-reports");
  await mkdir(reportDir, { recursive: true });
  await writeFile(path.join(reportDir, "browser-route-audit.json"), JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((report) => {
      console.log(JSON.stringify({
        baseUrl: report.baseUrl,
        routesChecked: report.routesChecked,
        overallStatus: report.overallStatus,
        strictIntegrations: report.strictIntegrations,
        failures: report.failures,
        integrationWarningCount: report.integrationWarnings.length,
      }, null, 2));
      if (report.failures.length) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exitCode = 1;
    });
}

export { main };
