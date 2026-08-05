import { defineConfig, devices } from "@playwright/test";

/**
 * Pre-launch QA suite. Defaults to a local dev server; point PLAYWRIGHT_BASE_URL
 * at the deployed preview/production URL to run the same suite against it.
 *
 * Specs tagged "destructive" (auth/enrollment/assessment/certification — they
 * create real users/enrollments/certificates through the live PHP bridge) only
 * run when RUN_DESTRUCTIVE_TESTS=1 is set. See tests/e2e/README.md.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const runDestructive = process.env.RUN_DESTRUCTIVE_TESTS === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 2,
  // A single local `next start` process serving many concurrent full page loads reliably
  // degrades over a long run — a 3-project x 2-worker pass measured 63/87 failing after ~30min,
  // while three separate --workers=1 passes (one per project) were 87/87 clean at 1-5s per test.
  // This is resource contention in this sandbox, not app behavior — a real CI runner or Vercel's
  // serverless functions don't share this constraint. Default to 1 locally; raise it in CI.
  workers: process.env.CI ? undefined : 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "qa-reports/playwright-results.json" }],
  ],
  grepInvert: runDestructive ? undefined : /@destructive/,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    navigationTimeout: 30_000,
  },
  projects: [
    { name: "mobile-360x640", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 640 } } },
    { name: "tablet-768x1024", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1440x900", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  // A dev server cold-compiles each route on first request via Turbopack — under this suite's
  // full parallel worker count hitting many distinct routes at once, that reliably causes
  // page.goto timeouts that have nothing to do with the app itself. A production build has no
  // per-route compile latency and is also more representative of what's actually launching.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
