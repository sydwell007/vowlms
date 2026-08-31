# VowLMS Production Upgrade Implementation Report

Report date: 31 August 2026

Repository: `C:\Users\sydwe\Desktop\vowlms`

Baseline commit: `1f5c66d`

## Executive Outcome

The production-readiness prompt was applied as a requirements brief, then checked against the actual repository before implementation. This phase strengthens VowLMS in five areas: canonical SEO, protected-learning authorization, goal-first discovery, accessible form and search behavior, and operational documentation.

The repository is build-ready and suitable for a Vercel Preview deployment. It is not declared fully launched because production credentials, Afrihost PHP compatibility, approved role accounts, PayFast sandbox reconciliation, and the external VowHumans/RunPod media path still require controlled platform-side verification.

No production deployment, database mutation, payment, enrolment, certificate issue, Moodle write, or RunPod configuration change was performed during this phase.

## Baseline Findings

1. Public academy pages had two URL families for the same content, which could divide search authority.
2. Public metadata was uneven; many sitemap routes lacked explicit canonicals and course pages lacked factual structured data.
3. Search, pathfinder, and auth forms needed stronger browser semantics, URL state, recovery, and assistive-technology feedback.
4. Protected lesson, assessment, VR practice, and presenter-token flows trusted the presence of a session cookie without independently rechecking active course enrolment.
5. Academy totals and launch status were repeated in page copy instead of derived from one status source.
6. Architecture, route, content, deployment, and operations documentation did not fully describe the current system or the intended production boundary.

The detailed evidence is in `VOWLMS_BASELINE_AUDIT.md`, `VOWLMS_ROUTE_INVENTORY.md`, and `VOWLMS_CONTENT_AND_IMAGE_AUDIT.md`.

## Implemented Changes

### Canonical SEO and discovery

- Added permanent redirects from legacy academy slugs to short canonical slugs while preserving query strings.
- Updated the sitemap to emit canonical public URLs and exclude redirect-only routes.
- Added explicit canonical metadata to the home, academy, course, pathway, discovery, support, corporate, product, and legal route families.
- Added noindex rules to auth, dashboard, profile, calendar, results, assessment, certificate, lesson, offline, internal search, and private practice surfaces where indexing is inappropriate.
- Added safe JSON-LD rendering, Organization schema on the homepage, BreadcrumbList schema on academy/course pages, and factual Course schema with provider, offer, level, delivery mode, and outcomes.
- Added branded course titles and route-specific social metadata.

### Protected learning and VowHumans

- Added a server-side course-access helper that verifies active or completed enrolment through the trusted bridge.
- Rechecked enrolment before serving lessons, assessments, VR practice, and VowHumans lesson-context tokens.
- Changed production bridge failures for protected learning to fail closed instead of falling back to seed content.
- Added clear sign-in and enrolment-required redirects.
- Kept the VowHumans iframe opt-in and removable, and passed the short-lived lesson-context token in the URL fragment so it is not sent in ordinary HTTP request logs.
- Preserved the existing allowlist, sandbox, origin-scoped messaging, and minimal camera/microphone/fullscreen delegation.

### Goal-first learning and search

- Added semantic progress, Back and Restart controls, answer state, refresh recovery, and deterministic recommendation rationale to Find My Path.
- Explained why a route and course were selected while treating weekly availability as context rather than a hidden score.
- Corrected onboarding reset so saved goal state is actually cleared.
- Made public search a real GET search form with `?q=` state, debounced URL updates, result announcements, accessible tabs, and stable clear behavior.

### Forms, accessibility, and data consistency

- Added stable names, autocomplete tokens, input modes, error associations, and alert semantics to sign-in, sign-up, and password recovery.
- Added an explicit academy-filter label/control association and maintained the responsive filter drawer.
- Centralized connected and planned academy counts and reused them in the homepage, ecosystem page, about page, and Open Graph image.
- Preserved honest zero states for integrations that are not yet connected.

### Documentation and operations

- Added current and target architecture, API/data flow, route inventory, content/image audit, design system, Afrihost deployment, operations runbook, and outstanding business decisions.
- Updated the API contract, test plan, Vercel checklist, baseline audit, and repository README.
- Documented environment-variable ownership across Vercel, Afrihost PHP, migration tooling, VowHumans, and RunPod.

## Files Intentionally Not Changed

- No PHP endpoint or SQL schema was modified in this phase.
- No production `.env` value was printed, copied, or committed.
- No Moodle course content or live learner record was changed.
- No live partner, testimonial, accreditation, investor metric, enrolment total, or outcome claim was invented.
- No Vercel, Afrihost, Render, Moodle, VowHumans, RunPod, PayFast, SMTP, or database deployment was triggered.

## Verification Results

| Gate | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run test` | Pass, 26/26 |
| `npm run build` | Pass, 87 generated page outputs |
| `npm run qa:static` | Pass; build/lint/type, no hardcoded secrets, environment protection, 106 hrefs against 98 routes, no broken internal links |
| `npm run qa:content` | Pass; 427 courses, no empty courses, duplicate titles, or orphans |
| Playwright public E2E | Pass, 102/102 non-destructive cases across 360x640, 768x1024, and 1440x900 |
| Canonical/JSON-LD browser checks | Pass on home, course, and legacy academy redirect across all three viewports |
| VowHumans shell checks | Pass; consent, authorized context token, iframe permissions, fragment transport, and clean close |
| Visual overflow checks | Pass on homepage, catalogue, pathways, and pathfinder across all three viewports |

The 102 browser cases cover catalogue counts, individual and combined filters, searches, six onboarding goals, reset, five pathfinder combinations, responsive navigation/overflow, canonical SEO, academy redirects, selected-course focus across all connected academies, and presenter lifecycle.

## Performance Evidence

Lighthouse was run against the local production build. Scores below combine two runs because Windows temporarily locked one Lighthouse cleanup directory in each run; every page was successfully measured in the complementary run.

| Page | Performance | Accessibility | Best practices | SEO |
|---|---:|---:|---:|---:|
| Homepage | 82 | 85 | 96 | 100 |
| Course catalogue | 74 | 86 | 96 | 100 |
| Course detail | 85 | 90 | 96 | 100 |

All measured pages met the repository thresholds of 70 performance and 85 accessibility. The next optimization priority is the catalogue: reduce initial course/image work and measure real-user Core Web Vitals after Preview deployment.

## Visual Evidence

- `qa-reports/vowlms-home-desktop.png`
- `qa-reports/vowlms-courses-mobile.png`
- `qa-reports/vowlms-course-focused-desktop.png`
- Presenter preview screenshots are retained in Playwright test artifacts when the suite runs.

The screenshots confirm a stable desktop first viewport and a 390px catalogue without horizontal overflow. Course cards retain their existing premium hierarchy, presenter identity, lesson/reward facts, enrolment totals, and course-duration treatment.

## Required Manual Vercel Actions

1. Add or verify Production and Preview values for `NEXT_PUBLIC_APP_URL`, `BRIDGE_BASE_URL`, `BRIDGE_API_KEY`, `JWT_SECRET`, `RESOURCE_SIGNING_SECRET`, and `VOWHUMANS_LESSON_CONTEXT_SECRET`.
2. Add PayFast, SMTP, and ecosystem integration variables only where the deployed Next.js code actually consumes them.
3. Keep Moodle migration tokens out of browser-visible variables.
4. Deploy to Preview first, run the non-destructive Playwright suite against the Preview URL, and confirm canonicals use the intended Preview or production policy.
5. Verify `/php`, `/sql`, and archive paths remain unavailable in the Vercel artifact.
6. Promote only after Afrihost bridge compatibility and approved authenticated journeys pass.

## Required Manual Afrihost and phpMyAdmin Actions

1. Back up the production database and PHP directory before any separate backend release.
2. Verify PHP version, extensions, HTTPS, CORS origin, file permissions, health response, and generic error behavior.
3. Confirm the PHP environment contains the matching bridge, JWT, resource-signing, database, PayFast, SMTP, and frontend-origin values.
4. Run PHP syntax checks on the host because PHP CLI is not installed in this workspace.
5. Do not import or alter SQL for this frontend phase; no migration was created here.
6. For any future schema release, use the documented audit, import order, backup, verification, and rollback process before production import.

## Required Manual VowHumans and RunPod Actions

1. Vercel owns `VOWHUMANS_LESSON_CONTEXT_SECRET`; the avatar worker does not receive that value directly.
2. RunPod owns `ENABLE_MUSETALK=true`, `MUSETALK_BATCH_SIZE=16`, and `VOWHUMANS_INTERNAL_KEY=<matching existing internal key>` on the pod template or deployment overrides that start the avatar worker.
3. Render services retain only the variables consumed by the participant, realtime-agent, and gateway services; do not duplicate GPU-worker variables there without code that reads them.
4. Verify one audio owner per response, full-sentence buffering/interrupt behavior, LiveKit track cleanup, lip-sync latency, and pod GPU/CPU/network telemetry in staging.
5. Run an enrolled Business Ethics lesson session end to end after deployment: material context, lecture response, follow-up question, lip sync, interruption, retry, and close.

## Remaining Launch Dependencies

- Approved learner, facilitator, employer, and admin accounts for authenticated role E2E.
- PayFast sandbox return, cancel, valid/invalid ITN, amount mismatch, and replay testing.
- Afrihost PHP syntax/runtime verification and credential rotation.
- Staging validation of VowHumans audio ownership, lip sync, sentence completion, and RunPod capacity.
- Business approval for pricing, refunds, accreditation, certificate wording, outcomes, privacy retention, partner claims, investor metrics, and publication status.
- Production monitoring, alert recipients, incident ownership, backup restore rehearsal, and rollback sign-off.

## Recommended Next Phase

1. Create a Vercel Preview and attach a staging bridge/database with non-production PayFast credentials.
2. Complete the approved authenticated role matrix and destructive tests against disposable staging data.
3. Measure Preview Web Vitals and optimize the catalogue's initial image/data workload.
4. Complete VowHumans/RunPod media telemetry and single-audio-owner validation.
5. Resolve the decisions in `docs/VOWLMS_OUTSTANDING_BUSINESS_DECISIONS.md` before public claims or paid launch.
6. Promote frontend, backend, and configuration as one versioned release with recorded rollback points.

## Release Decision

The codebase passes its local production, security, content, responsive, SEO, presenter-shell, and performance gates. It is ready for Preview deployment and controlled staging acceptance. Production launch remains conditional on the external hosting, payment, authenticated-role, media, policy, and operational checks listed above.
