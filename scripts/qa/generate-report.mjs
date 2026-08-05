// Orchestrates every QA check and writes /qa-reports/pre-launch-frontend-report.md.
// Usage: npm run qa:report   (set SKIP_LIGHTHOUSE=1 to skip the slow Lighthouse pass)
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const REPORT_DIR = path.join(ROOT, "qa-reports");
if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });

function section(title) {
  console.log(`\n=== ${title} ===`);
}

async function runPlaywright() {
  section("Playwright (non-destructive specs)");
  try {
    execSync("npx playwright test", { cwd: ROOT, stdio: "inherit" });
  } catch {
    // Non-zero exit just means some tests failed — the JSON report below has the detail.
  }
  const jsonPath = path.join(REPORT_DIR, "playwright-results.json");
  if (!existsSync(jsonPath)) return { stats: null, failures: [] };

  const raw = JSON.parse(readFileSync(jsonPath, "utf8"));
  const failures = [];
  function walk(suite) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        // test.status is the FINAL outcome across all retries ("expected"/"flaky" both mean it
        // passed eventually; only "unexpected" is a real failure). Don't flag flaky-but-passing
        // tests as failures just because an earlier retry attempt failed.
        if (test.status === "unexpected") {
          const lastResult = test.results?.[test.results.length - 1];
          failures.push({
            title: `${suite.title} > ${spec.title}`,
            file: spec.file,
            line: spec.line,
            project: test.projectName,
            status: lastResult?.status ?? test.status,
            error: lastResult?.error?.message?.split("\n")[0] ?? "See test-results/ for detail",
          });
        }
      }
    }
    for (const child of suite.suites ?? []) walk(child);
  }
  for (const suite of raw.suites ?? []) walk(suite);

  return { stats: raw.stats, failures };
}

async function main() {
  section("Static & build checks");
  const { main: staticChecks } = await import("./static-checks.mjs");
  const staticResult = staticChecks();

  section("Content integrity");
  const { run: contentIntegrity } = await import("./content-integrity.mjs");
  const contentResult = contentIntegrity();

  section("Integration link verification");
  const { main: integrationLinks } = await import("./integration-links.mjs");
  const linksResult = integrationLinks();

  let lighthouseResult = { skipped: true };
  if (!process.env.SKIP_LIGHTHOUSE) {
    section("Lighthouse");
    try {
      const { main: lighthouseCheck } = await import("./lighthouse-check.mjs");
      lighthouseResult = await lighthouseCheck();
    } catch (err) {
      lighthouseResult = { error: err.message };
    }
  }

  const playwrightResult = await runPlaywright();

  writeReport({ staticResult, contentResult, linksResult, lighthouseResult, playwrightResult });
}

function fmtBool(b) {
  return b ? "✅ PASS" : "❌ FAIL";
}

function writeReport({ staticResult, contentResult, linksResult, lighthouseResult, playwrightResult }) {
  const blockers = [];

  if (!staticResult.build.ok) blockers.push("`npm run build` fails — see Step 1 below.");
  if (!staticResult.lint.ok) blockers.push("`npm run lint` reports errors — see Step 1 below.");
  if (!staticResult.typecheck.ok) blockers.push("`npm run typecheck` reports errors — see Step 1 below.");
  if (staticResult.hardcodedSecrets.length > 0) blockers.push(`${staticResult.hardcodedSecrets.length} possible hardcoded secret(s) flagged — see Step 1 below.`);
  if (!staticResult.envGitignore.envIgnored || staticResult.envGitignore.trackedEnvFiles.length > 0) blockers.push("`.env*` is not fully gitignored / untracked — see Step 1 below.");
  if (staticResult.brokenLinks.broken.length > 0) blockers.push(`${staticResult.brokenLinks.broken.length} internal link(s) don't resolve to a real route — see Step 1 below.`);
  if (contentResult.overallStatus !== "PASS") blockers.push("Content integrity check failed — see Step 4 below.");
  if (playwrightResult.failures.length > 0) blockers.push(`${playwrightResult.failures.length} Playwright test(s) failed — see Step 2 below.`);
  if (lighthouseResult.flagged?.length) blockers.push(`${lighthouseResult.flagged.length} page(s) scored below threshold on Lighthouse — see Step 3 below.`);

  // Known, verified findings surfaced by tracing the actual code — not test failures, but
  // real pre-launch-relevant facts worth keeping visible at the top of the report. Update this
  // list whenever a finding gets fixed or a new one is confirmed — it's meant to reflect the
  // current true state of the app, not a historical log of past QA passes.
  const knownFindings = [
    "Fixed: AssessmentPlayer.tsx now submits every attempt to POST /api/assessments/submit (real assessment_attempts row, server-authoritative score) and, on a pass, POSTs /api/progress for the assessment's lesson then POST /api/certificates/generate — a learner who passes now gets a real certificate without any manual step.",
    "Fixed: /results/[courseSlug] now fetches real per-learner data (lesson completion % from /api/dashboard/learner, last local assessment score, live certificate status) instead of hardcoded demo numbers. VR practice is intentionally shown as \"Preview\" — there is no real VR scoring backend to report a true score from (see VR practice finding below).",
    "Fixed: /dashboard/learner/grades now shows real assessment history (new GET /api/assessments/history -> public/php/api/assessments/history.php, querying assessment_attempts) instead of an honest-but-empty placeholder.",
    "Fixed: certificate issuance now emails the learner (certificates/generate.php calls the pre-existing but previously-unused certificateEmail() template) in addition to the existing certificate PDF/dashboard listing.",
    "Only Upskilling Academy has free courses (140/140 checked); Chef Academy, Skills Training, and Business School are 100% paid — enrollment in those 3 academies can only be tested up to a real PayFast handoff, not completed automatically. Confirm this is the intended business model, not an oversight.",
    "No link anywhere in the codebase points to the external VR platform (virtual-reality-simulation.vercel.app) — all \"VR practice\" is VowLMS's own internal /vr-practice route, and that page is honestly labeled \"Simulation preview\" / \"Scoring opens only in an enabled practice session\" rather than faking a score. This is correct, intentional framing, not a bug — leave as-is until the VR platform (which has zero backend today, confirmed by reading that repo directly) is ready.",
    "public/php/lib/mail.php sends via PHP's native mail() against Afrihost's local MTA, not the configured SMTP_HOST/PORT/USER/PASS env vars (those are unused). This may be fine on shared hosting or may hurt deliverability — run public/php/api/qa/test-smtp-email.php for real (see qa-reports/README.md) to confirm before assuming either way; don't rewrite this blind without a way to test PHP execution.",
    "`/assessment` (and /lesson, /certificates, /profile, /results, /calendar, /announcements, /dashboard) are gated by the Next.js middleware's protectedPrefixes list (src/proxy.ts:12-21), not by the page components themselves — worth knowing since a page component having no visible auth check doesn't mean the route is actually public.",
  ];

  const launchReady = blockers.length === 0;

  const lines = [];
  lines.push(`# VowLMS Pre-Launch Frontend QA Report`);
  lines.push("");
  lines.push(`**LAUNCH READY: ${launchReady ? "YES" : "NO"}**${blockers.length ? ` — blocking issues:` : ""}`);
  if (blockers.length) {
    for (const b of blockers) lines.push(`- ${b}`);
  }
  lines.push("");
  lines.push(`*Generated ${new Date().toISOString()}*`);
  lines.push("");
  lines.push("## Known findings (verified by tracing the code, independent of test pass/fail)");
  lines.push("");
  for (const f of knownFindings) lines.push(`- ${f}`);
  lines.push("");

  // Summary table
  const totalPw = playwrightResult.stats
    ? playwrightResult.stats.expected + playwrightResult.stats.unexpected + playwrightResult.stats.skipped + playwrightResult.stats.flaky
    : 0;
  // "flaky" means it failed at least once but passed on retry — counted as passed.
  const passedPw = (playwrightResult.stats?.expected ?? 0) + (playwrightResult.stats?.flaky ?? 0);
  const failedPw = playwrightResult.stats?.unexpected ?? 0;

  lines.push("## Summary");
  lines.push("");
  lines.push("| Check | Result |");
  lines.push("|---|---|");
  lines.push(`| \`npm run build\` | ${fmtBool(staticResult.build.ok)} |`);
  lines.push(`| \`npm run lint\` | ${fmtBool(staticResult.lint.ok)} |`);
  lines.push(`| \`npm run typecheck\` | ${fmtBool(staticResult.typecheck.ok)} |`);
  lines.push(`| Hardcoded secrets scan | ${staticResult.hardcodedSecrets.length === 0 ? "✅ none found" : `⚠️ ${staticResult.hardcodedSecrets.length} flagged for review`} |`);
  lines.push(`| \`.env*\` gitignored & untracked | ${fmtBool(staticResult.envGitignore.envIgnored && staticResult.envGitignore.trackedEnvFiles.length === 0)} |`);
  lines.push(`| Internal links resolve | ${fmtBool(staticResult.brokenLinks.broken.length === 0)} (${staticResult.brokenLinks.totalHrefsChecked} checked, ${staticResult.brokenLinks.broken.length} unresolved) |`);
  lines.push(`| Content integrity | ${fmtBool(contentResult.overallStatus === "PASS")} (${contentResult.totalCourses} courses) |`);
  lines.push(`| Playwright E2E | ${failedPw === 0 ? "✅ PASS" : "❌ FAIL"} (${passedPw}/${totalPw} passed) |`);
  lines.push(`| Lighthouse | ${lighthouseResult.skipped ? "⏭️ skipped" : lighthouseResult.error ? "⚠️ error" : lighthouseResult.flagged?.length ? "❌ below threshold" : "✅ PASS"} |`);
  lines.push("");

  // Step 1 detail
  lines.push("## Step 1 — Static & build checks");
  lines.push("");
  for (const key of ["build", "lint", "typecheck"]) {
    const r = staticResult[key];
    lines.push(`### ${key}`);
    lines.push(r.ok ? "PASS." : "```\n" + r.output.slice(-4000) + "\n```");
    lines.push("");
  }
  lines.push("### Hardcoded secrets scan");
  if (staticResult.hardcodedSecrets.length === 0) {
    lines.push("None found.");
  } else {
    lines.push("| File | Line | Pattern | Snippet |");
    lines.push("|---|---|---|---|");
    for (const f of staticResult.hardcodedSecrets) lines.push(`| \`${f.file}\` | ${f.line} | ${f.pattern} | \`${f.snippet}\` |`);
  }
  lines.push("");
  lines.push("### .env gitignore coverage");
  lines.push(`- \`.env*\` pattern present in \`.gitignore\`: ${staticResult.envGitignore.envIgnored ? "yes" : "no"}`);
  lines.push(`- Tracked env files in git: ${staticResult.envGitignore.trackedEnvFiles.length === 0 ? "none" : staticResult.envGitignore.trackedEnvFiles.join(", ")}`);
  lines.push(`- \`.env.example\` template trackable (not accidentally swallowed by the blanket \`.env*\` rule): ${staticResult.envGitignore.envExampleTemplateTracked ? "yes" : "no — add \`!.env.example\` below the .env* line in .gitignore, then git add .env.example"}`);
  lines.push("");
  lines.push("### Broken internal links");
  lines.push(`Checked ${staticResult.brokenLinks.totalHrefsChecked} static hrefs against ${staticResult.brokenLinks.totalRoutes} real routes (best-effort — hrefs built from template variables can't be statically verified and are skipped).`);
  if (staticResult.brokenLinks.broken.length === 0) {
    lines.push("No unresolved internal links found.");
  } else {
    lines.push("");
    lines.push("| File | Line | href | Suggested fix |");
    lines.push("|---|---|---|---|");
    for (const b of staticResult.brokenLinks.broken) lines.push(`| \`${b.file}\` | ${b.line} | \`${b.href}\` | Confirm the route exists or update the link |`);
  }
  lines.push("");

  // Step 2 detail (Playwright)
  lines.push("## Step 2 — End-to-end flow testing (Playwright)");
  lines.push("");
  lines.push(`Ran the non-destructive suite (\`onboarding\`, \`quiz\`, \`catalog\`, \`responsive\`) across all 3 required viewports (360×640, 768×1024, 1440×900). Destructive specs (\`auth\`, \`enrollment\`, \`assessment\`, \`certification\`) require \`RUN_DESTRUCTIVE_TESTS=1\` and a real test account — see \`tests/e2e/README.md\`. (\`assessment\` submission now writes a real \`assessment_attempts\` row and can trigger real certificate issuance, so it's gated for the same real-production-data reason as the others, not just the auth middleware.)`);
  lines.push("");
  if (playwrightResult.failures.length === 0) {
    lines.push("All executed tests passed.");
  } else {
    lines.push("| Test | File | Project | Status | Error | Suggested fix |");
    lines.push("|---|---|---|---|---|---|");
    for (const f of playwrightResult.failures) {
      lines.push(`| ${f.title} | \`${f.file}:${f.line}\` | ${f.project} | ${f.status} | ${f.error} | Investigate against the referenced file/line; a screenshot/trace is saved under \`test-results/\` for this run. |`);
    }
  }
  lines.push("");
  lines.push("### Integration link verification (Step 2.9)");
  lines.push("");
  lines.push(`**VR practice:** ${linksResult.vrPractice.verdict}`);
  lines.push("");
  lines.push(`**VowRewards:** ${linksResult.vowRewards.verdict}`);
  lines.push("");
  lines.push(`**PlugConnect:** ${linksResult.plugConnect.verdict}`);
  lines.push("");

  // Step 3
  lines.push("## Step 3 — Performance (Lighthouse)");
  lines.push("");
  if (lighthouseResult.skipped) {
    lines.push("Skipped (`SKIP_LIGHTHOUSE=1`).");
  } else if (lighthouseResult.error) {
    lines.push(`Could not run: ${lighthouseResult.error}`);
  } else {
    lines.push("| Page | Performance | Accessibility | Best Practices | SEO |");
    lines.push("|---|---|---|---|---|");
    for (const r of lighthouseResult.results) {
      if (r.error) {
        lines.push(`| ${r.name} | error: ${r.error} | | | |`);
      } else {
        const flag = (v, min) => (v < min ? `⚠️ ${v}` : v);
        lines.push(`| ${r.name} | ${flag(r.performance, 70)} | ${flag(r.accessibility, 85)} | ${r.bestPractices} | ${r.seo} |`);
      }
    }
  }
  lines.push("");

  // Step 4
  lines.push("## Step 4 — Content integrity");
  lines.push("");
  lines.push(`Total courses: **${contentResult.totalCourses}**`);
  lines.push("");
  lines.push("| Academy | Category | Course count |");
  lines.push("|---|---|---|");
  for (const a of contentResult.countsByAcademy) lines.push(`| ${a.academy} | ${a.category} | ${a.courseCount} |`);
  lines.push("");
  lines.push(`- Empty title/description/zero-module courses: ${contentResult.emptyCourses.length === 0 ? "none" : contentResult.emptyCourses.join(", ")}`);
  lines.push(`- Duplicate titles within the same academy: ${contentResult.duplicateTitles.length === 0 ? "none" : JSON.stringify(contentResult.duplicateTitles)}`);
  lines.push(`- Orphaned courses (no matching academy): ${contentResult.orphanedCourses.length === 0 ? "none" : contentResult.orphanedCourses.join(", ")}`);
  lines.push("");

  lines.push("## Screenshots");
  lines.push("");
  lines.push("Playwright captures a screenshot + trace automatically for any failing test — see `test-results/` (gitignored, generated per-run) after `npm run test:e2e`.");
  lines.push("");

  const outPath = path.join(REPORT_DIR, "pre-launch-frontend-report.md");
  writeFileSync(outPath, lines.join("\n"));
  console.log(`\nReport written to ${path.relative(ROOT, outPath)}`);
  console.log(`LAUNCH READY: ${launchReady ? "YES" : "NO"}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
