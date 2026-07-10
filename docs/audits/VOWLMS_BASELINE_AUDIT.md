# VowLMS Baseline Audit

Audit date: 10 July 2026  
Repository: `C:\Users\sydwe\Desktop\vowlms`  
Initial Git state: clean `main` branch tracking `origin/main`

## Architecture Baseline

- Next.js 16.2.9 App Router with React 19.2.4 and strict TypeScript.
- Tailwind CSS 4 with local layout and UI components.
- Next.js route handlers proxy an Afrihost PHP API and MySQL database.
- Development-only seed data is available when the bridge is absent.
- GoalVow Moodle migration tooling covers six academy installations.
- PWA manifest and service worker are present.
- No unit-test command existed at baseline.

## Baseline Checks

| Check | Baseline result | Root cause | Status |
|---|---|---|---|
| Git status | Pass | Clean worktree | Verified |
| ESLint | Pass with 13 warnings | Unused migration and UI variables | Corrected during implementation |
| TypeScript | Initial fail | Truncated generated `.next/dev/types/validator.ts` | Passed after clearing generated cache |
| Production build | Initial fail at type gate | Same corrupted generated validator | Passed after clean rebuild |
| PHP syntax | Not available | PHP CLI is not installed locally | Must run on Afrihost/staging |
| Moodle connectivity | Transport fail under bundled Node CAs | GoalVow TLS chain is not self-contained | Passed securely with OS CA; host chain still needs repair |

## Findings

### Critical

1. **Committed server credentials**
   - Location: `public/php/config/env.local.php` and the tracked PHP archive.
   - Impact: database, bridge, and signing credentials must be treated as compromised.
   - Root cause: a host-specific environment file was committed inside `public`.
   - Correction: removed the file, added a safe template and ignore rules, and excluded deployment packages from Vercel.
   - Verification: repository credential-literal scan passes. Credential rotation remains a manual release blocker.

2. **Hard-coded Moodle tokens and disabled TLS**
   - Location: Moodle migration scripts.
   - Impact: token disclosure and man-in-the-middle risk.
   - Correction: moved tokens to environment variables, restored TLS verification, and added a connectivity gate.
   - Verification: six academies return valid site information and course visibility counts when using the trusted system CA store.

3. **PHP and SQL artifacts could be served by Vercel**
   - Location: `public/php`, `public/sql`, and `public/php.zip`.
   - Impact: source, schema, and deployment detail disclosure.
   - Correction: `.vercelignore` plus application-level 404 blocking in `src/proxy.ts`.
   - Verification: automated security tests and production browser checks cover these paths.

4. **Payment completion lacked full integrity controls**
   - Location: PayFast create and ITN handlers.
   - Impact: incorrect enrolment activation, duplicate processing, and amount mismatch risk.
   - Correction: signature order, merchant, source, PayFast server validation, stored-amount matching, row locking, transition checks, and idempotent enrolment creation.
   - Verification: security tests assert all required checks. No live payment was made.

5. **Private learner data exposed to employer scope**
   - Location: employer dashboard PHP endpoint.
   - Impact: unauthorised disclosure of learner names, emails, certificates, and scores.
   - Correction: learner-level employer data is withheld until organisation assignment and consent tables exist.
   - Verification: endpoint now returns restricted indicators and empty learner collections.

### High

- Public registration accepted facilitator/employer roles from the browser. It now creates learner accounts only.
- Enrolment was simulated in `localStorage`. The course action now uses authenticated enrolment and PayFast APIs.
- The service worker cached API and authenticated GET responses. It now excludes private routes and APIs.
- Lesson resources were publicly proxyable with disabled cURL TLS checks. Links are now short-lived HMAC URLs and TLS is verified.
- Lesson and assessment rewards could be repeated. Backend transactions now reward only first valid state transitions.
- Certificate identifiers could collide across learners. Certificate IDs now include a cryptographic suffix.
- Dashboards and impact/investor pages displayed invented operational figures. They now use authorised APIs, factual catalogue counts, or explicit empty states.

### Medium

- Root loading, error, robots, sitemap, skip navigation, and reduced-motion handling were missing.
- Canonical metadata was hard-coded instead of environment-aware.
- Assignment, discussion, admin settings, and export controls simulated success without a backend.
- The Sports Academy was absent from the ecosystem navigation and data model.

### Enhancements

- Generated imagery is consistently placed and served through `next/image`.
- Source PNG files are large; responsive Next.js delivery limits the user transfer, while source WebP/AVIF conversion remains useful for repository/deployment weight.
- A shared rate-limit store is required if the PHP API is scaled beyond one host.

## Baseline Conclusion

The visual foundation was strong, but launch readiness was blocked by secret exposure, public deployment artifacts, payment and role integrity issues, private-data scope, and simulated operational data. Those items drove the implementation priority.
