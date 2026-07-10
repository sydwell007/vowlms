# VowLMS

VowLMS is the GoalVow learning platform for academy discovery, courses, authenticated learning, assessment, Skills Practice, certificates, VowRewards, support, and opportunity pathways.

## Architecture

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4.
- Vercel frontend and same-origin Next.js route handlers.
- Afrihost PHP 8.1+ API bridge with PDO/MySQL.
- Six verified Moodle academy connections used by read-only migration tooling.
- Development data is available locally only; production fails closed when the bridge is missing.

## Local Setup

Requirements: Node.js 22.15 or later.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

PHP CLI is not installed by the Node project. Run `php -l` across `public/php` on staging/Afrihost before deployment.

## Moodle Connectivity

The connectivity command is read-only and must pass before migration:

```bash
npm run migrate:check-connectivity
```

Do not run `migrate:all` until every academy passes. Moodle tokens and base URLs come from `.env.local`; no token is stored in a migration script.

## Environment

Copy `.env.example` to `.env.local` and configure values locally or in Vercel. Never commit `.env.local` or `public/php/config/env.local.php`.

Key groups:

- App and bridge: `NEXT_PUBLIC_APP_URL`, `BRIDGE_BASE_URL`, `BRIDGE_API_KEY`.
- Security: `JWT_SECRET`, `RESOURCE_SIGNING_SECRET`.
- PayFast, SMTP, ecosystem integrations, and six Moodle URL/token pairs.

## Deployment Packages

- `public/php` is the Afrihost PHP package.
- `public/sql` is the phpMyAdmin/MySQL package.
- Both paths and `public/php.zip` are excluded from Vercel and blocked at runtime.
- Deploy SQL/PHP first, verify the API contract, then deploy Vercel.

Read:

- `docs/audits/VOWLMS_BASELINE_AUDIT.md`
- `docs/audits/VOWLMS_FINAL_IMPLEMENTATION_REPORT.md`
- `docs/api/VOWLMS_API_CONTRACT.md`
- `docs/testing/VOWLMS_TEST_PLAN.md`
- `docs/deployment/VERCEL_DEPLOYMENT_CHECKLIST.md`
- `public/php/README_DEPLOYMENT.md`
- `public/sql/README_IMPORT_ORDER.md`

## Security Notes

Credentials found in repository history must be rotated before launch. Paid enrolments activate only from validated PayFast ITNs. Public registration creates learners only. Employer learner-level reporting remains restricted until organisation assignment and consent are implemented.
