# VowLMS Release Audit

Date: 2026-09-09

## Automated Release Gate

Status: PASS

The audit covered the signed-out application, protected-route entry behavior, responsive layouts, account forms, learner profile settings, homepage interactions, path finding, course discovery, rewards, accessibility, SEO, and production build integrity.

## Results

| Check | Result |
| --- | --- |
| Next.js production build | PASS - 92 application routes compiled |
| TypeScript | PASS |
| ESLint | PASS |
| Static regression tests | PASS - 28/28 |
| Full non-destructive Playwright baseline | PASS - 156 passed, 3 configuration-dependent VowHumans checks skipped |
| Final visual release Playwright suite | PASS - 156 passed, 3 configuration-dependent VowHumans checks skipped |
| Visual-system browser audit | PASS - 20 representative page/viewport combinations |
| Browser route crawl | PASS - 79/79, no failures or integration warnings |
| Content integrity | PASS - 20 learner-visible Upskilling courses |
| Broken images | PASS - none detected |
| Horizontal overflow | PASS - none detected at 390 px, including all 20 course pages |
| Production Vercel app health | PASS - app, bridge, and PWA healthy |

The local gitignored bridge configuration was normalised during the audit. Direct Node access from this Windows environment still reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE` for `api.goalvow.com`; TLS verification was deliberately not disabled. The deployed Vercel health check reported the bridge healthy and its live public course-stat endpoints returned HTTP 200 at the time of audit. Confirm the API host serves a complete certificate chain to every intended runtime.

## Lighthouse

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 88 | 100 | 100 | 100 |
| Course catalogue | 88 | 100 | 100 | 100 |
| Business Ethics course | 92 | 100 | 100 | 100 |

All three pages recorded a cumulative layout shift of 0.

## Corrections Made

- Removed a hydration race that could discard the first path-finder selection.
- Replaced fabricated profile totals with account-owned dashboard metrics.
- Connected profile security to the real password-reset workflow and removed inactive security controls.
- Added complete labels, names, autocomplete metadata, tab semantics, checkbox semantics, touch targets, and filter states.
- Restricted learner registration and preferences to the currently live Upskilling Academy while preserving the full Academy Network for admins.
- Removed speculative prefetches to protected course activities for signed-out visitors.
- Prevented signed-out pathway and rewards pages from calling private APIs.
- Made optional public enrolment and rating totals degrade cleanly during bridge maintenance.
- Corrected mobile course-detail overflow across the full catalogue.
- Restored the homepage hero media layer so the real learning scene is visible behind its contrast overlays.
- Converted the hero asset from a 1.97 MB PNG to a 170 KB WebP.
- Removed the 3.4 MB curriculum seed from homepage, lesson, and assessment client dependencies. The homepage entry payload fell from about 2.68 MB to about 164 KB.
- Deferred Google Analytics until browser idle and explicitly prioritised the hero image.
- Added repeatable route-crawl, form, profile, and responsive regression coverage.
- Added six human-centred, production-optimised WebP banner scenes for discovery, pathways, learning, achievement, opportunity, and support page families.
- Replaced repeated patterned hero backgrounds and redundant framed hero previews with readable image-overlay banners across public, learner, and role-dashboard destinations.
- Added subtle hero and section-entry motion with a complete `prefers-reduced-motion` fallback.
- Upgraded sign-in, sign-up, and password-reset surfaces with a consistent human-centred visual treatment.
- Added a reusable `qa:visual` browser gate for banner rendering, broken images, error overlays, and horizontal overflow on desktop and mobile.

## Staging Gates

The following checks intentionally remain manual or opt-in because they create real records or depend on external media and payment systems:

1. Create and verify a fresh learner account using a dedicated staging address.
2. Complete a real enrolment, lesson, assessment, certificate, and certificate-email journey.
3. Validate PayFast handoff and webhook reconciliation in the PayFast sandbox.
4. Validate VowHumans speech, interruption, audio exclusivity, and lip sync on a real device with the deployed realtime services and GPU worker.
5. Confirm transactional-email delivery and sender reputation from the production mail host.
6. Confirm the bridge certificate chain from the Render/Vercel runtime and the local development trust store; do not use `NODE_TLS_REJECT_UNAUTHORIZED=0` as a workaround.

Destructive browser specifications remain guarded by `RUN_DESTRUCTIVE_TESTS=1`.
