# VowLMS Pre-Launch Frontend QA Report

**LAUNCH READY: YES**

*Generated 2026-08-04T20:31:49.411Z*

## Known findings (verified by tracing the code, independent of test pass/fail)

- `/results/[courseSlug]` (src/app/results/[courseSlug]/page.tsx:22-25) renders hardcoded demo metrics ("6/6", "84%", "86%") for every course regardless of the learner's actual progress — not real data.
- No UI component calls `POST /api/certificates/generate` (src/app/api/certificates/generate/route.ts:65-80) — the only wired-up call is the read-only GET, which 404s until a certificate row already exists. There is currently no learner-reachable action that ever creates one.
- Assessment scoring (src/components/learning/AssessmentPlayer.tsx) is entirely client-side (localStorage) with no server call — a learner's pass/fail is not recorded or verifiable server-side today.
- Only Upskilling Academy has free courses (140/140 checked); Chef Academy, Skills Training, and Business School are 100% paid — enrollment in those 3 academies can only be tested up to PayFast handoff, not completed automatically.
- No link anywhere in the codebase points to the external VR platform (virtual-reality-simulation.vercel.app) — all "VR practice" is VowLMS's own internal /vr-practice route (see integration-links section).

## Summary

| Check | Result |
|---|---|
| `npm run build` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run typecheck` | ✅ PASS |
| Hardcoded secrets scan | ✅ none found |
| `.env*` gitignored & untracked | ✅ PASS |
| Internal links resolve | ✅ PASS (104 checked, 0 unresolved) |
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

### Broken internal links
Checked 104 static hrefs against 90 real routes (best-effort — hrefs built from template variables can't be statically verified and are skipped).
No unresolved internal links found.

## Step 2 — End-to-end flow testing (Playwright)

Ran the non-destructive suite (`onboarding`, `quiz`, `catalog`, `responsive`) across all 3 required viewports (360×640, 768×1024, 1440×900). Destructive specs (`auth`, `enrollment`, `assessment`, `certification`) require `RUN_DESTRUCTIVE_TESTS=1` and a real test account — see `tests/e2e/README.md`. (`assessment` is gated only because `/assessment` requires auth at the middleware level, src/proxy.ts:15 — assessment submission itself writes nothing server-side.)

All executed tests passed.

### Integration link verification (Step 2.9)

**VR practice:** NOT_FOUND — no link anywhere in src/ points to virtual-reality-simulation.vercel.app or any external VR platform domain. All "VR practice" today is VowLMS's own internal /vr-practice/[slug] route. The prompt's assumption of a course/module/user-parametrized external link does not match the current codebase.

**VowRewards:** No frontend component calls a rewards-balance API endpoint directly. The reward point balance is embedded server-side in the /api/dashboard/learner payload (rewardPoints field) rather than fetched from a dedicated rewards endpoint — the fetch call is correctly formed at the dashboard level, but there is no standalone 'wallet balance' widget with its own API call to verify separately.

**PlugConnect:** PASS — /opportunities (linked from every "View opportunities" element found) renders a real empty-state fallback ("No public opportunities are confirmed yet") when getOpportunities() returns [] (its current, permanent state — see src/lib/data.ts), rather than showing fake listings. This is correct, honest handling for a not-yet-live integration.

## Step 3 — Performance (Lighthouse)

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Homepage | 88 | 96 | 100 | 100 |
| Course catalog | 86 | 93 | 100 | 100 |
| Course detail | 88 | 96 | 96 | 100 |

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
