# VowLMS Test Plan

## Automated Gates

Run in this order:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Current static suite: 25 passing Node tests. It covers deployment-artifact blocking, auth role safety, payment integrity, Moodle resource signing, bridge status handling, reviews, aggregate enrolment counts, VowHumans restrictions, canonical redirects, sitemap canonicalisation, JSON-LD, auth field semantics, Find My Path recovery/accessibility, and protected learning enrolment checks.

Current non-destructive browser suite: 99 passing Playwright cases across 360x640, 768x1024, and 1440x900. The verified 31 August 2026 run covered catalogue filtering/search, onboarding, pathfinder recommendations, responsive layout, canonical SEO, redirects, and the VowHumans consent/token/close lifecycle.

Current local Lighthouse evidence meets the repository thresholds: homepage 82 performance/85 accessibility, catalogue 74/86, and course detail 85/90; all measured pages scored 96 for best practices and 100 for SEO.

PHP syntax must also be checked on a host with PHP installed:

```bash
find public/php -name '*.php' -print0 | xargs -0 -n1 php -l
```

## Role-Based End-to-End Matrix

| Journey | Visitor | Learner | Facilitator | Employer | Admin |
|---|---:|---:|---:|---:|---:|
| Browse academies/courses | Allow | Allow | Allow | Allow | Allow |
| Register | Allow as learner | N/A | N/A | N/A | N/A |
| Sign in/out and restore session | Test | Test | Test | Test | Test |
| Enrol free course | Redirect to sign-in | Allow | Deny unless learner flow | Deny | Deny unless test learner |
| Start paid checkout | Redirect | Allow sandbox only | Deny | Deny | Deny unless test learner |
| Complete lesson | Deny | Own active enrolment | Deny | Deny | Test with authorised account |
| Submit assessment | Deny | Own active enrolment | Review only when implemented | Deny | Authorised audit only |
| View learner dashboard | Deny | Own data | Deny | Deny | Admin policy decision |
| Facilitator dashboard | Deny | Deny | Assigned scope | Deny | Allow |
| Employer dashboard | Deny | Deny | Deny | Own listings; no unassigned learner data | Allow |
| Admin dashboard | Deny | Deny | Deny | Deny | Allow |
| Generate certificate | Deny | Own completed course | Deny | Deny | Authorised support only |
| Award rewards | Deny | Deny | Allow within approved scope | Deny | Allow |

## Core Scenarios

1. Register with valid data; verify role is learner regardless of tampered role field.
2. Submit invalid, weak, duplicate, and malformed registration data.
3. Sign in with valid/invalid credentials; confirm generic error and rate limit.
4. Restore and clear the HttpOnly session across refresh and sign-out.
5. Search and filter courses; verify empty and pagination states on mobile.
6. Open course details and verify CTA states: signed out, free, paid, enrolled, completed, unavailable.
7. Enrol in a free course twice; verify one enrolment and one enrol reward.
8. Create a PayFast sandbox payment; do not activate from browser return.
9. Send valid, invalid-signature, wrong-merchant, wrong-amount, duplicate, and conflicting PayFast ITNs.
10. Mark a lesson complete twice; verify progress and reward idempotency.
11. Submit an assessment twice; verify reward occurs only on the first pass.
12. Attempt progress, assessment, practice, and certificate actions without course ownership.
13. Verify certificate eligibility and unique certificate IDs.
14. Verify signed resource URL success, tamper failure, and expiry failure.
15. Verify `/php`, `/sql`, and archive paths return 404 in production.
16. Verify legacy academy URLs return 308, preserve query strings, and land on the short canonical URL.
17. Verify every sitemap entry is 200, canonical, indexable, and absent from redirect/noindex route families.
18. Verify course title/description/social metadata and valid factual Course/Breadcrumb JSON-LD.
19. Verify Find My Path exposes semantic progress, Back/Restart, refresh recovery, and recommendation rationale.
20. Verify auth fields have stable labels/names/autocomplete and errors announce through `role="alert"`.
21. Verify public search submits/updates `?q=`, supports keyboard entry, announces result count, and handles no results.
22. Verify course-card enrolment count changes after an approved enrolment and never exposes learner identity.
23. Verify presenter start/load/single-audio/retry/close while lesson content stays available.

## Playwright Suites

- Non-destructive by default: responsive layout, catalogue, onboarding, quiz, auth page semantics, VowHumans shell, and canonical SEO.
- Destructive specs are tagged and run only when `RUN_DESTRUCTIVE_TESTS=1` against an approved disposable/staging environment.
- Set `PLAYWRIGHT_BASE_URL` to a Preview/staging origin to test a deployment without starting the local server.

```bash
npm run test:e2e -- --project=desktop-1440x900
PLAYWRIGHT_BASE_URL=https://APPROVED-PREVIEW.example npm run test:e2e
```

Never enable destructive tests against Production.

## Browser Matrix

- Desktop: 1440 x 900 and 1920 x 1080.
- Tablet: 768 x 1024.
- Mobile: 390 x 844 and 360 x 800.
- Keyboard-only navigation and visible focus.
- 200% zoom and reflow.
- Reduced-motion preference.
- Slow network/offline shell; confirm private/API content is not cached.

## Route-Archetype Coverage

Test one page from every archetype on each release: home, academy list/detail, catalogue, course detail, pathway detail, Find My Path, support/legal/corporate, auth, learner lesson/assessment/result/certificate, each dashboard role, API error, 404, offline, and VowHumans lesson. The sitemap crawl covers all canonical public URLs at a rate that does not flood Production.

## Accessibility Pass

- One H1 and logical heading order.
- Skip link, landmarks, breadcrumb labels, keyboard focus, and mobile navigation.
- Form labels, names, autocomplete, required state, error association, and status announcements.
- Native progress semantics for Find My Path and assessments.
- Accordion/tab/drawer expanded-selected relationships.
- Touch targets, 200% zoom/reflow, contrast, reduced motion, image alternatives, and long lesson readability.

## Data Safety

Use dedicated test accounts and PayFast sandbox. Do not create real payments, production certificates, learner results, or employer records during diagnostics. Restore or remove approved test data after verification.
