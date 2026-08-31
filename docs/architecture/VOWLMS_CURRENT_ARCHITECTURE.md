# VowLMS Current Architecture

Verified: 31 August 2026

## System Context

```text
Learner browser / installed PWA
        |
        | HTTPS, same-origin pages and /api requests
        v
Vercel: Next.js 16 App Router
  - React server and client components
  - route protection in src/proxy.ts
  - metadata, sitemap, robots, security headers
  - API facade and response normalisation
        |
        | HTTPS + X-Bridge-Key + optional learner JWT
        v
Afrihost: PHP 8.1+ API
  - validation, authentication, roles, ownership
  - PayFast notification verification
  - signed Moodle resource proxy
        |
        +--> MySQL (users, enrolments, progress, attempts, certificates, payments, rewards)
        +--> GoalVow Moodle sites (approved source content/resources)
        +--> SMTP and enabled ecosystem adapters

VowHumans embed <--- browser iframe restricted to vowhumans.com
        ^
        +--- short-lived signed lesson context from VowLMS
```

## Repository Ownership

| Area | Responsibility | Deployment |
|---|---|---|
| `src/app` | Pages, layouts, metadata, route handlers | Vercel |
| `src/components` | Shared product, learning, navigation, and UI components | Vercel |
| `src/lib` | Data normalisation, bridge client, auth helpers, status rules | Vercel |
| `src/data` | Reviewed build-time catalogue/pathway source data | Vercel bundle/server |
| `public/images` | Brand and product imagery | Vercel CDN through `next/image` |
| `public/php` | Afrihost API deployment package | Afrihost only |
| `public/sql` | Incremental MySQL/phpMyAdmin package | Database operator only |
| `scripts/moodle-migration` | Read-only source extraction and transformation | Trusted operator workstation |
| `tests` | Static security/contract tests and Playwright journeys | Local/CI |

## Route and Access Model

- Public discovery: home, academies, courses, pathways, Find My Path, support, legal, ecosystem, and corporate pages.
- Protected learning: lessons, assessments, results, certificates, discussion/assignments, and VR practice details.
- Protected account: profile, calendar, announcements, learner/facilitator/employer/admin dashboards.
- `src/proxy.ts` performs early cookie presence checks and safe `returnTo` redirects. PHP remains the authority for JWT validity, role, record ownership, and mutations.
- Auth, dashboard, lesson, assessment, result, certificate, and account surfaces are noindex/disallowed.

See `docs/audits/VOWLMS_ROUTE_INVENTORY.md` for archetype decisions.

## Data Sources

1. `src/lib/data.ts` normalises course, academy, pathway, lesson, assessment, and practice records for server-rendered discovery.
2. Browser mutations and account-owned reads call same-origin Next.js `/api` handlers.
3. `src/lib/bridge.ts` forwards server-side calls to Afrihost with `X-Bridge-Key`; an HttpOnly `vowlms_token` is forwarded as Bearer auth where required.
4. PHP uses PDO prepared statements and verified JWT claims. User IDs and roles are not accepted from browser identity fields.
5. Development may show explicit empty states. Production bridge-dependent operations fail closed when unavailable.

## Authentication and Session

- Registration is public but always creates the `learner` role.
- PHP authenticates credentials and returns a JWT to the Next.js auth route.
- Next.js stores the JWT in `vowlms_token` with `HttpOnly`, production `Secure`, `SameSite=Lax`, root path, and a 30-day maximum age.
- Client session restoration calls same-origin auth/session APIs; the cookie is not readable by client JavaScript.
- Elevated roles require a separate operator-controlled process.

## Core Learning Flows

- Free enrolment is idempotent and account-owned.
- Paid enrolment is pending until a verified PayFast ITN confirms merchant, signature, source, amount, and valid state transition.
- Lesson completion, assessment pass, certificate issue, and reward creation are enforced server-side and designed to avoid duplicate events.
- Aggregate course-card enrolment counts expose totals only, not learner identity.
- Reviews require an active/completed enrolment.
- VowHumans is optional lesson support and never replaces lesson content. The embed is origin restricted and receives only approved signed lesson context.

## Security Boundary

- CSP and permissions policy allow only approved VowHumans, GoalVow media/API, and YouTube needs.
- `.vercelignore` excludes `public/php/**`, `public/sql/**`, and `public/php.zip`; proxy defense returns 404 for those paths.
- Afrihost secrets live only in `config/env.local.php` or host environment variables.
- Moodle tokens are operator/migration secrets, not browser variables.
- Service-worker rules exclude API and authenticated learning routes from caching.

## Known Constraints

- The catalogue and path finder currently serialise build-time summary data to some client components. A server/hybrid search API is the next scaling step if the catalogue grows materially.
- Organisation-to-learner assignment and consent are not yet modelled, so employer learner detail is intentionally withheld.
- Shared distributed rate limiting and central log aggregation are not yet available on the single-host PHP design.
- Email verification, account deletion operations, and full support-case ownership need confirmed operating processes.
- Source PNG hero images are large in the repository even though responsive delivery is optimised by Next.js.
