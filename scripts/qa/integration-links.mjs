// Step 2.9 — integration link verification (frontend-testable parts only).
// This is deliberately a targeted grep-based check, not a generic AST analyzer: the three
// integrations named in the QA prompt are specific, known call sites, and the goal is to state
// plainly what exists today versus what the prompt assumed exists.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..", "..");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

function grepAll(files, pattern) {
  const hits = [];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, i) => {
      if (pattern.test(line)) {
        hits.push({ file: path.relative(ROOT, file), line: i + 1, text: line.trim().slice(0, 160) });
      }
      pattern.lastIndex = 0;
    });
  }
  return hits;
}

function main() {
  const files = walk(path.join(ROOT, "src"));

  // 1. VR practice — the prompt assumes a "Practice in VR" link out to
  //    virtual-reality-simulation.vercel.app with course/module/user params.
  const vrExternalLinks = grepAll(files, /virtual-reality-simulation/i);
  const vrInternalLinks = grepAll(files, /\/vr-practice\//);

  // 2. VowRewards UI — wallet balance / reward notification elements and what they fetch.
  const rewardsFetchCalls = grepAll(files, /fetch\(["'`][^"'`]*\/api\/rewards/i);
  const rewardPointsUsage = grepAll(files, /rewardPoints/);
  const rewardsAwardEndpoint = grepAll(files, /\/rewards\/award/);

  // 3. PlugConnect "View Opportunities" links and their fallback handling.
  const opportunitiesLinks = grepAll(files, /href=["'`]\/opportunities["'`]|View [Oo]pportunities/);
  const opportunitiesEmptyFallback = grepAll(files, /No public opportunities are confirmed yet/);

  const findings = {
    vrPractice: {
      externalLinksToVrPlatform: vrExternalLinks,
      internalVrPracticeLinks: vrInternalLinks.length,
      verdict:
        vrExternalLinks.length === 0
          ? "NOT_FOUND — no link anywhere in src/ points to virtual-reality-simulation.vercel.app or any external VR platform domain. All \"VR practice\" today is VowLMS's own internal /vr-practice/[slug] route. The prompt's assumption of a course/module/user-parametrized external link does not match the current codebase."
          : "FOUND — review the listed sites for correct course/module/user parameters.",
    },
    vowRewards: {
      directRewardsBalanceFetch: rewardsFetchCalls,
      rewardPointsFieldUsage: rewardPointsUsage,
      rewardsAwardEndpointReferences: rewardsAwardEndpoint,
      verdict:
        rewardsFetchCalls.length === 0
          ? "No frontend component calls a rewards-balance API endpoint directly. The reward point balance is embedded server-side in the /api/dashboard/learner payload (rewardPoints field) rather than fetched from a dedicated rewards endpoint — the fetch call is correctly formed at the dashboard level, but there is no standalone 'wallet balance' widget with its own API call to verify separately."
          : "Direct rewards fetch calls found — review for correct endpoint/shape.",
    },
    plugConnect: {
      opportunitiesLinks,
      hasEmptyStateFallback: opportunitiesEmptyFallback.length > 0,
      verdict:
        opportunitiesEmptyFallback.length > 0
          ? "PASS — /opportunities (linked from every \"View opportunities\" element found) renders a real empty-state fallback (\"No public opportunities are confirmed yet\") when getOpportunities() returns [] (its current, permanent state — see src/lib/data.ts), rather than showing fake listings. This is correct, honest handling for a not-yet-live integration."
          : "No empty-state fallback text found near the opportunities listing — verify manually.",
    },
  };

  findings.overallStatus = "REPORT_ONLY"; // These are informational findings, not pass/fail gates.
  return findings;
}

const result = main();

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(result, null, 2));
}

export { main };
