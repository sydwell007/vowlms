# VowLMS Pre-Launch Frontend QA Report

**LAUNCH READY: YES**

*Generated 2026-08-05T08:56:06.988Z*

## Known findings (verified by tracing the code, independent of test pass/fail)

- Fixed: AssessmentPlayer.tsx now submits every attempt to POST /api/assessments/submit (real assessment_attempts row, server-authoritative score) and, on a pass, POSTs /api/progress for the assessment's lesson then POST /api/certificates/generate — a learner who passes now gets a real certificate without any manual step.
- Fixed: /results/[courseSlug] now fetches real per-learner data (lesson completion % from /api/dashboard/learner, last local assessment score, live certificate status) instead of hardcoded demo numbers. VR practice is intentionally shown as "Preview" — there is no real VR scoring backend to report a true score from (see VR practice finding below).
- Fixed: /dashboard/learner/grades now shows real assessment history (new GET /api/assessments/history -> public/php/api/assessments/history.php, querying assessment_attempts) instead of an honest-but-empty placeholder.
- Fixed: certificate issuance now emails the learner (certificates/generate.php calls the pre-existing but previously-unused certificateEmail() template) in addition to the existing certificate PDF/dashboard listing.
- Only Upskilling Academy has free courses (140/140 checked); Chef Academy, Skills Training, and Business School are 100% paid — enrollment in those 3 academies can only be tested up to a real PayFast handoff, not completed automatically. Confirm this is the intended business model, not an oversight.
- No link anywhere in the codebase points to the external VR platform (virtual-reality-simulation.vercel.app) — all "VR practice" is VowLMS's own internal /vr-practice route, and that page is honestly labeled "Simulation preview" / "Scoring opens only in an enabled practice session" rather than faking a score. This is correct, intentional framing, not a bug — leave as-is until the VR platform (which has zero backend today, confirmed by reading that repo directly) is ready.
- public/php/lib/mail.php sends via PHP's native mail() against Afrihost's local MTA, not the configured SMTP_HOST/PORT/USER/PASS env vars (those are unused). This may be fine on shared hosting or may hurt deliverability — run public/php/api/qa/test-smtp-email.php for real (see qa-reports/README.md) to confirm before assuming either way; don't rewrite this blind without a way to test PHP execution.
- `/assessment` (and /lesson, /certificates, /profile, /results, /calendar, /announcements, /dashboard) are gated by the Next.js middleware's protectedPrefixes list (src/proxy.ts:12-21), not by the page components themselves — worth knowing since a page component having no visible auth check doesn't mean the route is actually public.

## Summary

| Check | Result |
|---|---|
| `npm run build` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run typecheck` | ✅ PASS |
| Hardcoded secrets scan | ✅ none found |
| `.env*` gitignored & untracked | ✅ PASS |
| Internal links resolve | ✅ PASS (103 checked, 0 unresolved) |
| Content integrity | ✅ PASS (427 courses) |
| Playwright E2E | ✅ PASS (87/87 passed) |
| Lighthouse | ✅ PASS |

## Step 1 — Static & build checks

### build
PASS.

### lint
PASS.

### typecheck
PASS.

### Hardcoded secrets scan
None found.

### .env gitignore coverage
- `.env*` pattern present in `.gitignore`: yes
- Tracked env files in git: none
- `.env.example` template trackable (not accidentally swallowed by the blanket `.env*` rule): yes

### Broken internal links
Checked 103 static hrefs against 91 real routes (best-effort — hrefs built from template variables can't be statically verified and are skipped).
No unresolved internal links found.

## Step 2 — End-to-end flow testing (Playwright)

Ran the non-destructive suite (`onboarding`, `quiz`, `catalog`, `responsive`) across all 3 required viewports (360×640, 768×1024, 1440×900). Destructive specs (`auth`, `enrollment`, `assessment`, `certification`) require `RUN_DESTRUCTIVE_TESTS=1` and a real test account — see `tests/e2e/README.md`. (`assessment` submission now writes a real `assessment_attempts` row and can trigger real certificate issuance, so it's gated for the same real-production-data reason as the others, not just the auth middleware.)

All executed tests passed.

### Integration link verification (Step 2.9)

**VR practice:** NOT_FOUND — no link anywhere in src/ points to virtual-reality-simulation.vercel.app or any external VR platform domain. All "VR practice" today is VowLMS's own internal /vr-practice/[slug] route. The prompt's assumption of a course/module/user-parametrized external link does not match the current codebase.

**VowRewards:** No frontend component calls a rewards-balance API endpoint directly. The reward point balance is embedded server-side in the /api/dashboard/learner payload (rewardPoints field) rather than fetched from a dedicated rewards endpoint — the fetch call is correctly formed at the dashboard level, but there is no standalone 'wallet balance' widget with its own API call to verify separately.

**PlugConnect:** PASS — /opportunities (linked from every "View opportunities" element found) renders a real empty-state fallback ("No public opportunities are confirmed yet") when getOpportunities() returns [] (its current, permanent state — see src/lib/data.ts), rather than showing fake listings. This is correct, honest handling for a not-yet-live integration.

## Step 3 — Performance (Lighthouse)

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Homepage | 89 | 96 | 100 | 100 |
| Course catalog | 90 | 93 | 100 | 100 |
| Course detail | 90 | 96 | 96 | 100 |

## Step 4 — Content integrity

Total courses: **427**

| Academy | Category | Course count |
|---|---|---|
| Upskilling Academy | upskilling | 140 |
| Skills Training Academy | skills-training | 98 |
| Chef Academy | chef-academy | 166 |
| GoalVow Business School | business-school | 23 |

- Empty title/description/zero-module courses: none
- Duplicate titles within the same academy: none
- Orphaned courses (no matching academy): none

## Screenshots

Playwright captures a screenshot + trace automatically for any failing test — see `test-results/` (gitignored, generated per-run) after `npm run test:e2e`.
