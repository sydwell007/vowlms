# VowLMS Baseline Audit

Audit date: 31 August 2026
Repository: `C:\Users\sydwe\Desktop\vowlms`
Baseline revision: `1f5c66d` on `main`
Initial worktree: clean

## Scope and Safety

This audit was completed before application changes for the production-readiness upgrade. The public deployment was inspected read-only. No live account, enrolment, payment, Moodle, VowHumans, Afrihost, or database mutation was performed.

## Verified Architecture

- Next.js 16.2.9 App Router and React 19.2.4, deployed to Vercel.
- Strict TypeScript, Tailwind CSS 4, Next.js metadata routes, PWA manifest, and service worker.
- Next.js route handlers form a server-side facade over an Afrihost PHP API.
- Afrihost PHP uses a shared bridge key, JWT authentication, PDO/MySQL, and environment-only credentials.
- GoalVow Moodle is the approved course-content source used by migration tooling and lesson resources.
- VowHumans is embedded only from approved `https://vowhumans.com/embed/...` URLs and receives signed lesson context through VowLMS.
- PayFast initiation and server notification handlers are present; completion is not trusted from a browser redirect.
- `public/php` and `public/sql` are deployment packages, excluded by `.vercelignore` and blocked by `src/proxy.ts`.

## Baseline Commands

| Check | Result | Evidence |
|---|---|---|
| `git status --short` | Pass | No output; clean worktree |
| `npm run typecheck` | Pass | TypeScript completed with no diagnostics |
| `npm run lint` | Pass | ESLint completed with no diagnostics |
| `npm run test` | Pass | 19 tests passed, 0 failed |
| `npm run build` | Pass | Next.js production build completed; 87 page outputs |
| Live home page | Pass | HTTP 200 and expected VowLMS title/H1 |
| Live `/contact`, `/vowsupport`, `/catalogue` | Pass | Permanent 308 redirects to `/support`, `/support`, `/courses` |
| Live `/php`, `/sql` | Pass | HTTP 404 |

The build reports that the Edge runtime used by the generated Open Graph route disables static generation for that route. This is informational and not a release blocker.

## Working Product Strengths

- Premium GoalVow visual identity, responsive navigation, homepage, catalogue, academy, course, pathway, legal, support, and corporate pages are implemented.
- The homepage currently presents six featured courses in a responsive three-column, two-row layout.
- Course cards show real aggregate enrolment totals, week-based duration, lesson/reward facts, and a course presenter.
- Course discovery includes academy, goal, level, duration, price, certificate, rewards, sorting, grid/list, and incremental-loading controls.
- Authentication, protected-route return paths, learner progress, assessments, certificates, enrolment, reviews, rewards, and VowHumans routes have automated security coverage.
- Public registration is learner-only; role and ownership checks are enforced by server endpoints.
- Security headers include CSP, HSTS, frame protection, referrer policy, permissions policy, and content-type protection.
- VowHumans iframe sources and lesson-context URLs are allowlisted and validated.

## Findings at Baseline

### Priority 1

1. **Duplicate academy detail URLs**
   `/academies/upskilling` and `/academies/upskilling-academy` both return 200. The equivalent Skills Training URLs also both return 200. The short category slug is already used by internal navigation and should be canonical; long legacy slugs need 308 redirects.

2. **Canonical metadata is absent**
   Representative live public pages do not emit `rel="canonical"`. Dynamic academy and course metadata is title/description-only.

3. **Course structured data is absent**
   Course detail pages do not emit accurate Course and BreadcrumbList JSON-LD or route-specific social metadata.

### Priority 2

4. **Sitemap contains a redirected route and legacy academy slugs**
   `/contact` is emitted despite redirecting to `/support`, and academy entries use the long data slug. Several useful public routes are omitted.

5. **Account form semantics are incomplete**
   Visible labels are present, but auth inputs lack `name` attributes and signup/reset fields have incomplete autocomplete metadata. Auth pages also need an explicit noindex policy.

6. **Find My Path is not fully explainable or semantically progressive**
   The four questions work and the outcome is persisted after completion, but progress is text-only, there is no Back action, in-progress answers are lost on refresh, and the result does not explain the recommendation rule.

7. **Search state is not written back to the URL while typing**
   `/search?q=...` can initialise the client, but subsequent query changes are not shareable. Catalogue filters are richer but primarily client state; a later server/hybrid catalogue phase is advisable for a much larger data set.

8. **Operational documents are stale or incomplete**
   Existing July documentation does not reflect the 31 August route count, current test suite, VowHumans context flow, or complete deployment/operations responsibilities.

## Risks and Constraints

- No live credentials are available or required for this repository upgrade. Authenticated role journeys and external integration writes must be smoke-tested in an approved staging environment.
- PHP CLI is not installed locally, so PHP syntax and host extension checks require Afrihost staging or an approved PHP environment.
- The browser automation connector was unavailable during one metadata probe; production status and redirect evidence was collected through read-only HTTP checks, with full browser verification scheduled against the local production server.
- The repository contains large source images. `next/image` provides responsive delivery, but source-asset conversion remains a deployment-weight optimisation.
- Legal, accreditation, employment, partner, investor, and impact claims require named business owners and supporting evidence before publication.

## Baseline Decision

No Priority 0 regression was found: the clean codebase builds and its security controls remain intact. Implementation will therefore be incremental and focused on canonical routing/SEO, form and path-finder accessibility, test coverage, and current production/deployment documentation. Moodle, PayFast, VowHumans, Afrihost contracts, and the database schema will not be changed without a demonstrated defect.
