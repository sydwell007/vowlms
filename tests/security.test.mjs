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

test("profile updates preserve the PUT method through the bridge", async () => {
  const profileRoute = await read("src/app/api/user/profile/route.ts");
  const bridge = await read("src/lib/bridge.ts");

  assert.match(profileRoute, /bridgePut\("\/user\/profile", payload\)/);
  assert.match(bridge, /export async function bridgePut/);
  assert.match(bridge, /method:\s*"PUT"/);
});

test("client components do not import the multi-megabyte seed data layer", async () => {
  const clientFiles = [
    "src/components/courses/CourseCatalogueClient.tsx",
    "src/components/courses/CourseCard.tsx",
    "src/components/search/SearchClient.tsx",
    "src/components/academies/AcademyCourseGrid.tsx",
    "src/app/dashboard/admin/page.tsx",
  ];

  for (const file of clientFiles) {
    const source = await read(file);
    assert.doesNotMatch(source, /@\/lib\/data/);
    assert.doesNotMatch(source, /@\/data\/seed-data/);
  }
});

test("course filters use URL parameters and VR scenarios are paginated", async () => {
  const coursesPage = await read("src/app/courses/page.tsx");
  const vrPage = await read("src/app/vr-practice/page.tsx");

  assert.match(coursesPage, /searchParams:\s*Promise/);
  assert.match(coursesPage, /params\.academy/);
  assert.match(coursesPage, /params\.q/);
  assert.match(vrPage, /const PAGE_SIZE\s*=\s*18/);
  assert.match(vrPage, /\.slice\(pageStart,\s*pageStart \+ PAGE_SIZE\)/);
});

test("bridge corrects upstream authentication status wrappers", async () => {
  const bridge = await read("src/lib/bridge.ts");

  assert.match(bridge, /export function normalizeBridgeStatus/);
  assert.match(bridge, /return 401/);
  assert.match(bridge, /return 403/);
  assert.match(bridge, /throw toBridgeError\(json,\s*res\.status\)/);
});

test("course reviews require a verified learner enrollment", async () => {
  const endpoint = await read("public/php/api/course-reviews/index.php");
  const route = await read("src/app/api/courses/[slug]/reviews/route.ts");

  assert.match(endpoint, /requireBridgeKey\(\)/);
  assert.match(endpoint, /requireAuth\(\)/);
  assert.match(endpoint, /requireRole\(\$payload, 'learner'\)/);
  assert.match(endpoint, /status IN \(\"active\", \"completed\"\)/);
  assert.match(endpoint, /Only enrolled learners can review this course/);
  assert.match(route, /bridgePost\(`\/courses\/\$\{encodeURIComponent\(slug\)\}\/reviews`/);
});

test("course-card enrolment totals are aggregate and bridge protected", async () => {
  const endpoint = await read("public/php/api/course-enrollment-counts/index.php");
  const route = await read("src/app/api/courses/enrollment-counts/route.ts");
  const enrollButton = await read("src/components/courses/EnrollButton.tsx");
  const rewrites = await read("public/php/.htaccess");

  assert.match(endpoint, /requireBridgeKey\(\)/);
  assert.match(endpoint, /COUNT\(e\.id\) AS enrollment_count/);
  assert.match(endpoint, /e\.status IN \(\"active\", \"completed\"\)/);
  assert.doesNotMatch(endpoint, /u\.name|u\.email|user_id/);
  assert.match(route, /allGroupings/);
  assert.match(route, /Math\.min\(\.\.\.childCounts\)/);
  assert.match(enrollButton, /invalidateCourseEnrollmentCounts\(course\.slug\)/);
  assert.ok(
    rewrites.indexOf("^courses/enrollment-counts") < rewrites.indexOf("^courses/([^/]+)/?$"),
    "aggregate route must precede the generic course-slug route",
  );
});
