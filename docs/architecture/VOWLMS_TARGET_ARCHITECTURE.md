# VowLMS Target Architecture

The target is an incremental evolution of the working Vercel, Afrihost, Moodle, and VowHumans system. It is not a rewrite.

## Principles

- Keep the browser on same-origin VowLMS routes; keep secrets and identity authority server-side.
- Keep PHP/MySQL as the transactional system until a measured migration case exists.
- Separate verified live capability from planned ecosystem services.
- Prefer versioned contracts, additive migrations, idempotent mutations, and reversible deployments.
- Optimise for South African mobile networks, low-memory devices, and intermittent connectivity.

## Target Layers

| Layer | Target state |
|---|---|
| Experience | Shared page shells, canonical metadata, accessible controls, stable mobile layouts, honest loading/error/empty states |
| Discovery | Server or hybrid search/filter API with URL-backed state and bounded payloads |
| Learning | Account-synced progress with offline-safe queued completion where security permits |
| API facade | Typed, versioned Next.js adapters with correlation IDs and contract tests |
| Transactional API | PHP service modules with consistent validation, ownership, rate limits, audit events, and health checks |
| Data | Additive MySQL migrations, organisation/consent model, immutable payment/reward/audit events |
| Integrations | Circuit-breaker style timeouts, explicit availability states, and per-integration telemetry |
| Operations | Preview/staging parity, automated smoke gates, central sanitised logs, alert ownership, documented recovery |

## Delivery Phases

### Phase 1: launch hardening

- Deploy this canonical SEO, form, path-finder, test, and documentation upgrade.
- Complete an approved staging test for auth, free enrolment, PayFast sandbox ITN, progress, certificates, Moodle resources, and VowHumans.
- Confirm all environment variables and rotate any historically exposed credentials.
- Assign support, incident, legal, accreditation, data, and release owners.

### Phase 2: operational control

- Add privacy-conscious analytics with a reviewed event dictionary and consent policy.
- Send structured server logs to an approved drain; alert on health, auth, payment, presenter, and Moodle failures.
- Implement shared rate limiting if PHP runs on multiple instances.
- Add email verification, account lifecycle, and support-case workflows once SMTP and owners are approved.

### Phase 3: organisation learning

- Add organisations, memberships, learner consent, cohorts, facilitator assignment, and scoped reporting through additive schema changes.
- Keep employer reporting aggregate until both relationship and consent are verifiable.
- Add group enrolment and invoicing only after finance rules and payment reconciliation are signed off.

### Phase 4: scale and evidence

- Move catalogue search/filtering to bounded server queries with cache/revalidation strategy.
- Add course versioning and content publication workflow where Moodle/source governance requires it.
- Publish impact, accreditation, employment, and investor metrics only from governed evidence with definitions and dates.

## Target Quality Gates

- Lint, type check, unit/contract tests, production build, and non-destructive Playwright tests pass in CI.
- Preview smoke tests validate canonicals, blocked deployment artifacts, role redirects, API health, and integration fallbacks.
- Paid release requires PayFast sandbox replay/tamper tests and finance sign-off.
- Database release requires backup, schema audit, additive migration verification, and rollback decision.
- Accessibility target is WCAG 2.2 AA for registration, discovery, enrolment, learning, assessment, certificates, and support.
