import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("Vercel excludes Afrihost PHP and SQL deployment packages", async () => {
  const ignore = await read(".vercelignore");
  assert.match(ignore, /public\/php\/\*\*/);
  assert.match(ignore, /public\/sql\/\*\*/);
  assert.match(ignore, /public\/php\.zip/);
});

test("committed PHP environment file is absent", async () => {
  await assert.rejects(access("public/php/config/env.local.php", constants.F_OK));
  await access("public/php/config/env.example.php", constants.R_OK);
});

test("application proxy blocks deployment artifacts and protects LMS pages", async () => {
  const proxy = await read("src/proxy.ts");
  for (const route of ["/php", "/sql", "/php.zip", "/dashboard", "/lesson", "/assessment"]) {
    assert.ok(proxy.includes(route), `expected proxy protection for ${route}`);
  }
  assert.match(proxy, /status:\s*404/);
  assert.match(proxy, /vowlms_token/);
});

test("service worker never caches API or authenticated learning routes", async () => {
  const worker = await read("public/sw.js");
  for (const route of ["/api/", "/dashboard/", "/lesson/", "/assessment/", "/profile"]) {
    assert.ok(worker.includes(route), `expected service-worker exclusion for ${route}`);
  }
});

test("public registration cannot self-assign an elevated role", async () => {
  const php = await read("public/php/api/auth/register.php");
  const route = await read("src/app/api/auth/register/route.ts");
  assert.match(php, /\$role\s*=\s*'learner'/);
  assert.match(route, /role:\s*"learner"/);
  assert.doesNotMatch(php, /\$body\['role'\]/);
});

test("PayFast completion requires signature, server, merchant, and amount validation", async () => {
  const webhook = await read("public/php/api/payments/payfast-notify.php");
  assert.match(webhook, /invalid-signature/);
  assert.match(webhook, /eng\/query\/validate/);
  assert.match(webhook, /merchant-mismatch/);
  assert.match(webhook, /amount-mismatch/);
  assert.match(webhook, /FOR UPDATE/);
  assert.doesNotMatch(webhook, /function generateId/);
});

test("lesson resource proxy uses signed links and verifies TLS", async () => {
  const resourceProxy = await read("public/php/api/files/serve.php");
  const lessonPage = await read("src/app/lesson/[slug]/page.tsx");
  assert.match(resourceProxy, /RESOURCE_SIGNING_SECRET/);
  assert.match(resourceProxy, /hash_hmac\('sha256'/);
  assert.match(resourceProxy, /CURLOPT_SSL_VERIFYPEER\s*=>\s*true/);
  assert.match(lessonPage, /createHmac\("sha256"/);
});

test("Moodle migration scripts contain no token literals or disabled TLS", async () => {
  const files = [
    "scripts/moodle-migration/1-fetch-courses.mjs",
    "scripts/moodle-migration/2-fetch-structure.mjs",
    "scripts/moodle-migration/5-fetch-lesson-content.mjs",
    "scripts/moodle-migration/6-fetch-resources.mjs",
  ];
  for (const file of files) {
    const source = await read(file);
    assert.doesNotMatch(source, /token:\s*["'][a-f0-9]{20,}["']/i);
    assert.doesNotMatch(source, /rejectUnauthorized:\s*false/);
  }
});

test("account and ecosystem pages do not fall back to fabricated production records", async () => {
  const certificateRoute = await read("src/app/api/certificates/generate/route.ts");
  const certificatePage = await read("src/app/certificates/[courseSlug]/page.tsx");
  const dataLayer = await read("src/lib/data.ts");

  assert.doesNotMatch(certificateRoute, /mockCertificate|Amina Mokoena/);
  assert.match(certificateRoute, /bridgeUnavailable/);
  assert.match(certificatePage, /CertificateRouteClient/);
  assert.doesNotMatch(dataLayer, /\blearningHubs,|\bopportunities,/);
  assert.match(dataLayer, /return \[\] as Opportunity\[\]/);
  assert.match(dataLayer, /return \[\] as LearningHub\[\]/);
});
