import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("academy aliases permanently redirect to short canonical slugs", async () => {
  const proxy = await read("src/proxy.ts");

  assert.match(proxy, /"\/academies\/upskilling-academy": "\/academies\/upskilling"/);
  assert.match(proxy, /"\/academies\/skills-training-academy": "\/academies\/skills-training"/);
  assert.match(proxy, /NextResponse\.redirect\(destination, 308\)/);
  assert.match(proxy, /destination\.search = search/);
});

test("sitemap emits canonical academy slugs and excludes redirected contact", async () => {
  const sitemap = await read("src/app/sitemap.ts");

  assert.match(sitemap, /academies\/\$\{academy\.category\}/);
  assert.doesNotMatch(sitemap, /"\/contact"/);
  assert.match(sitemap, /getSkillPathways/);
  assert.match(sitemap, /"\/find-my-path"/);
});

test("home, academy, and course pages expose canonical and structured metadata", async () => {
  const home = await read("src/app/page.tsx");
  const academy = await read("src/app/academies/[slug]/page.tsx");
  const course = await read("src/app/courses/[slug]/page.tsx");
  const jsonLd = await read("src/components/seo/JsonLd.tsx");

  assert.match(home, /alternates: \{ canonical: "\/" \}/);
  assert.match(home, /"@type": "Organization"/);
  assert.match(academy, /alternates: \{ canonical: canonicalPath \}/);
  assert.match(academy, /"@type": "BreadcrumbList"/);
  assert.match(course, /alternates: \{ canonical: canonicalPath \}/);
  assert.match(course, /"@type": "Course"/);
  assert.match(course, /"@type": "BreadcrumbList"/);
  assert.match(jsonLd, /replace\(\/<\/g, "\\\\u003c"\)/);
});

test("course detail pages contain only the selected course", async () => {
  const course = await read("src/app/courses/[slug]/page.tsx");

  assert.doesNotMatch(course, /More courses in/);
  assert.doesNotMatch(course, /getCourseSummariesByAcademy/);
});

test("authentication forms provide names and complete autocomplete semantics", async () => {
  const signIn = await read("src/app/auth/signin/page.tsx");
  const signUp = await read("src/app/auth/signup/page.tsx");
  const forgot = await read("src/app/auth/forgot-password/page.tsx");
  const authLayout = await read("src/app/auth/layout.tsx");

  assert.match(signIn, /name="email"[\s\S]*autoComplete="email"/);
  assert.match(signIn, /name="password"[\s\S]*autoComplete="current-password"/);
  assert.match(signUp, /name="name"[\s\S]*autoComplete="name"/);
  assert.match(signUp, /name="password"[\s\S]*autoComplete="new-password"/);
  assert.match(signUp, /name="confirmPassword"[\s\S]*autoComplete="new-password"/);
  assert.match(forgot, /name="email"[\s\S]*autoComplete="email"/);
  assert.match(authLayout, /index: false/);
});

test("Find My Path has semantic progress, recovery, navigation, and rationale", async () => {
  const quiz = await read("src/components/onboarding/PathFinderQuiz.tsx");
  const routing = await read("src/lib/goal-routing.ts");

  assert.match(quiz, /<progress/);
  assert.match(quiz, /vowlms_path_finder_draft/);
  assert.match(quiz, />\s*Back\s*</);
  assert.match(quiz, />\s*Restart\s*</);
  assert.match(quiz, /Why this path/);
  assert.match(routing, /strongest rules-based match/);
  assert.match(routing, /study-time answer is saved for planning/);
});

test("lesson, assessment, practice, and presenter context re-check enrolment", async () => {
  const access = await read("src/lib/course-access.ts");
  const lesson = await read("src/app/lesson/[slug]/page.tsx");
  const assessment = await read("src/app/assessment/[slug]/page.tsx");
  const practice = await read("src/app/vr-practice/[slug]/page.tsx");
  const contextToken = await read("src/app/api/vowhumans/context-token/[slug]/route.ts");

  assert.match(access, /bridgeGet<EnrollmentRecord\[\]>\("\/enrollments"\)/);
  assert.match(access, /\["active", "completed"\]/);
  assert.match(lesson, /hasActiveCourseEnrollment/);
  assert.match(assessment, /hasActiveCourseEnrollment/);
  assert.match(practice, /hasActiveCourseEnrollment/);
  assert.match(contextToken, /An active course enrolment is required/);
});
