// Step 3 — performance. Runs Lighthouse against homepage / /courses / a course detail page.
// Defaults to a local `next start` production build; set QA_TARGET_URL to point at a deployed
// preview/production URL instead (skips the local server spin-up).
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import net from "node:net";

const PAGES = [
  { name: "Homepage", path: "/" },
  { name: "Course catalog", path: "/courses" },
  { name: "Course detail", path: "/courses/improving-your-mental-health" },
];

const THRESHOLDS = { performance: 70, accessibility: 85 };

function waitForPort(port, timeoutMs = 60_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.connect(port, "127.0.0.1");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) reject(new Error(`Timed out waiting for port ${port}`));
        else setTimeout(tryConnect, 1000);
      });
    };
    tryConnect();
  });
}

async function runLighthouse(url) {
  const lighthouse = (await import("lighthouse")).default;
  const chromeLauncher = await import("chrome-launcher").catch(() => null);

  let chrome;
  try {
    if (chromeLauncher) {
      chrome = await chromeLauncher.launch({ chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"] });
    }
  } catch (err) {
    return { error: `Could not launch Chrome for Lighthouse: ${err.message}` };
  }

  if (!chrome) return { error: "chrome-launcher unavailable in this environment" };

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      logLevel: "error",
    });

    const categories = result.lhr.categories;
    return {
      performance: Math.round((categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((categories.seo?.score ?? 0) * 100),
    };
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const target = process.env.QA_TARGET_URL;
  let devServer = null;
  let baseUrl = target;

  if (!baseUrl) {
    baseUrl = "http://localhost:3100";
    devServer = spawn("npm", ["run", "start", "--", "-p", "3100"], {
      cwd: process.cwd(),
      shell: true,
      stdio: "ignore",
      detached: true,
    });
    try {
      await waitForPort(3100);
    } catch (err) {
      if (devServer.pid) process.kill(-devServer.pid);
      return { error: `Local production server did not start: ${err.message}`, results: [] };
    }
  }

  const results = [];
  for (const page of PAGES) {
    const url = `${baseUrl}${page.path}`;
    try {
      const scores = await runLighthouse(url);
      results.push({ ...page, url, ...scores });
    } catch (err) {
      results.push({ ...page, url, error: err.message });
    }
  }

  if (devServer?.pid) {
    try {
      process.kill(-devServer.pid);
    } catch {
      /* already exited */
    }
  }

  const flagged = results.filter(
    (r) => !r.error && (r.performance < THRESHOLDS.performance || r.accessibility < THRESHOLDS.accessibility),
  );

  return { results, flagged, thresholds: THRESHOLDS };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      if (result.error || result.flagged?.length) process.exitCode = 1;
    })
    .catch((err) => {
      console.error(JSON.stringify({ error: err.message }, null, 2));
      process.exitCode = 1;
    });
}

export { main };
