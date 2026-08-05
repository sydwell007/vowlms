// Step 1 — static & build checks: build/lint output, hardcoded-secret grep, .gitignore
// coverage, and a best-effort broken-internal-link check against the real route tree.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..", "..");

function runCommand(cmd, args) {
  try {
    const output = execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: "pipe", shell: true });
    return { ok: true, output };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}\n${error.stderr ?? ""}`.trim() || String(error.message) };
  }
}

function walk(dir, filterExt, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, filterExt, out);
    else if (filterExt.some((ext) => entry.endsWith(ext))) out.push(full);
  }
  return out;
}

// ── 1-2. Build / lint ──────────────────────────────────────────────────────
function checkBuild() {
  const result = runCommand("npm", ["run", "build"]);
  return { name: "npm run build", ...result };
}

function checkLint() {
  const result = runCommand("npm", ["run", "lint"]);
  return { name: "npm run lint", ...result };
}

function checkTypecheck() {
  const result = runCommand("npm", ["run", "typecheck"]);
  return { name: "npm run typecheck", ...result };
}

// ── 3. Hardcoded secrets ────────────────────────────────────────────────────
const SECRET_PATTERNS = [
  { name: "AWS Access Key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "Generic OpenAI-style key", re: /sk-[A-Za-z0-9]{20,}/ },
  { name: "Stripe live key", re: /sk_live_[0-9a-zA-Z]{20,}/ },
  { name: "Slack token", re: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: "Private key block", re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  // Assigned literal secret-shaped strings (long base64/hex) next to a suspicious variable name —
  // intentionally conservative to avoid false positives on hashes, ids, and CSS.
  { name: "Suspicious inline credential assignment", re: /(API_KEY|SECRET|PASSWORD|TOKEN)\s*[:=]\s*["'][A-Za-z0-9+/=_-]{20,}["']/ },
];

function checkHardcodedSecrets() {
  const files = walk(path.join(ROOT, "src"), [".ts", ".tsx", ".js", ".jsx"]);
  const findings = [];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.re.test(lines[i])) {
          findings.push({ file: path.relative(ROOT, file), line: i + 1, pattern: pattern.name, snippet: lines[i].trim().slice(0, 120) });
        }
      }
    }
  }
  return findings;
}

// ── 4. .env gitignore coverage ──────────────────────────────────────────────
function checkEnvGitignored() {
  const gitignore = readFileSync(path.join(ROOT, ".gitignore"), "utf8");
  const envIgnored = /^\.env\*?$|^\/?\.env(\.local)?$/m.test(gitignore) || gitignore.includes(".env*");
  // A bare `.env*` pattern (no `!.env.example` negation below it) silently swallows the
  // template file too — real gap this session found: it left .env.example untracked with
  // nothing to point new developers at which vars are needed.
  const exampleUnignored = /^!\.env\.example$/m.test(gitignore);

  let tracked = [];
  let exampleTracked = false;
  try {
    const lsFiles = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
    const files = lsFiles.split("\n");
    tracked = files.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".env.example"));
    exampleTracked = files.includes(".env.example");
  } catch {
    tracked = ["<could not run git ls-files>"];
  }

  return {
    envIgnored,
    trackedEnvFiles: tracked,
    envExampleTemplateTracked: exampleTracked || exampleUnignored,
  };
}

// ── 5. Broken internal links (best-effort static analysis) ─────────────────
function collectRealRoutes() {
  const appDir = path.join(ROOT, "src", "app");
  // Both page.tsx (navigable pages) and route.ts (API endpoints, e.g. /api/health) define real
  // routes in the App Router — hrefs pointing at either are valid.
  const routeFiles = walk(appDir, ["page.tsx", "page.ts", "route.ts", "route.tsx"]).filter((f) =>
    /^(page|route)\./.test(path.basename(f)),
  );
  const patterns = [];

  for (const file of routeFiles) {
    let rel = path.relative(appDir, path.dirname(file)).split(path.sep).join("/");
    if (rel === ".") rel = "";
    // Strip route groups like (marketing).
    const segments = rel
      .split("/")
      .filter((seg) => seg && !(seg.startsWith("(") && seg.endsWith(")")))
      .map((seg) => {
        if (seg.startsWith("[...")) return ".*"; // catch-all
        if (seg.startsWith("[")) return "[^/]+"; // dynamic segment
        return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      });
    const routeRegex = new RegExp(`^/${segments.join("/")}/?$`);
    patterns.push(routeRegex);
  }

  return patterns;
}

function collectHrefs() {
  const files = walk(path.join(ROOT, "src"), [".tsx", ".ts"]);
  const hrefRe = /href=(?:\{`([^`]*)`\}|\{"([^"]*)"\}|"([^"]*)")/g;
  const found = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    let match;
    hrefRe.lastIndex = 0;
    while ((match = hrefRe.exec(content))) {
      const href = match[1] ?? match[2] ?? match[3];
      if (!href) continue;
      if (!href.startsWith("/")) continue; // external, mailto:, tel:, #anchor, etc.
      if (href.includes("${") || href.includes("[")) continue; // template literal with a variable — can't statically verify
      const lineNo = content.slice(0, match.index).split("\n").length;
      found.push({ file: path.relative(ROOT, file), line: lineNo, href, source: lines[lineNo - 1]?.trim().slice(0, 140) });
    }
  }
  return found;
}

function checkBrokenLinks() {
  const routes = collectRealRoutes();
  const hrefs = collectHrefs();
  const broken = [];

  for (const entry of hrefs) {
    const [pathname] = entry.href.split(/[?#]/);
    const normalized = pathname === "" ? "/" : pathname;
    const matches = routes.some((re) => re.test(normalized));
    if (!matches) broken.push(entry);
  }

  return { totalHrefsChecked: hrefs.length, totalRoutes: routes.length, broken };
}

function main() {
  const report = {
    build: checkBuild(),
    lint: checkLint(),
    typecheck: checkTypecheck(),
    hardcodedSecrets: checkHardcodedSecrets(),
    envGitignore: checkEnvGitignored(),
    brokenLinks: checkBrokenLinks(),
  };

  const buildFail = !report.build.ok;
  const lintFail = !report.lint.ok;
  const typecheckFail = !report.typecheck.ok;
  const secretsFail = report.hardcodedSecrets.length > 0;
  const envFail = !report.envGitignore.envIgnored || report.envGitignore.trackedEnvFiles.length > 0;
  const linksFail = report.brokenLinks.broken.length > 0;

  report.overallStatus = buildFail || lintFail || typecheckFail || secretsFail || envFail || linksFail ? "FAIL" : "PASS";

  return report;
}

const result = main();

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(result, null, 2));
  if (result.overallStatus !== "PASS") process.exitCode = 1;
}

export { main };
