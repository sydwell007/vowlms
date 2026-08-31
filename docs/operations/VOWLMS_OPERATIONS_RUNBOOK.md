# VowLMS Operations Runbook

## Service Owners to Assign

Before launch, record named primary and backup owners for: Vercel release, Afrihost/PHP, MySQL, Moodle content, VowHumans/RunPod, PayFast/finance, SMTP, learner support, privacy/security, and business communications.

## Routine Health Checks

| Signal | Check | Healthy result | Escalation |
|---|---|---|---|
| Public web | `/`, `/courses`, representative course | 200, expected title/canonical, no broken assets | Vercel owner |
| Security boundary | `/php`, `/sql`, child paths | 404 | Release + security owner; Priority 0 |
| PHP API | Afrihost `/health` | Sanitised healthy JSON and DB probe | Afrihost/database owner |
| Authentication | Staging login/session/logout | Correct cookies and role response | Auth/API owner |
| Moodle resource | Approved staging lesson file | Loads/seek works, no token in URL | Moodle/API owner |
| VowHumans | Approved presenter lesson | Opt-in load, single audio stream, close/retry work | VowHumans/RunPod owner |
| PayFast | Sandbox ITN suite | Valid activates once; tamper/replay safe | Finance/API owner |
| PWA | Manifest/service worker/offline page | Installs; private/API routes not cached | Frontend owner |

## Incident Severity

- **P0:** secret/source exposure, `/php` or `/sql` public, payment/enrolment corruption, auth bypass, widespread learner lockout, destructive data loss.
- **P1:** core learning unavailable, Moodle resources broadly failing, certificates/progress writes failing, presenter failure affecting required flow, severe mobile regression.
- **P2:** partial academy/search/support degradation, stale counts, isolated content/media issues.
- **P3:** cosmetic defects, copy errors, non-critical planned-service issues.

## First Response

1. Confirm user impact, start time, environment, release ID, route, and correlation/request ID.
2. Do not ask users to share passwords, tokens, signed URLs, payment details, or camera/microphone content.
3. Check Vercel deployment/runtime logs and Afrihost health/logs for the same time window.
4. Identify whether the fault is browser/Vercel, PHP/MySQL, Moodle, VowHumans/RunPod, PayFast, SMTP, or network/DNS.
5. Stop high-risk mutations or roll back the matching release if integrity is uncertain.
6. Preserve logs and evidence with personal data redacted.
7. Communicate confirmed facts, current workaround, owner, and next update time.

## Common Playbooks

### Vercel page or API failure

- Compare current and previous deployment, environment assignment, build output, and function logs.
- Verify `NEXT_PUBLIC_APP_URL`, `BRIDGE_BASE_URL`, and server secrets are assigned to the intended environment.
- Roll back to the last known-good deployment if the release caused the fault.

### Afrihost bridge failure

- Check `/health`, certificate expiry/chain, PHP error log, disk space, MySQL connection, and `.htaccess` rewriting.
- Confirm bridge key equality without printing it.
- Restore the previous versioned PHP directory if code upload is responsible.

### Moodle lesson/resource failure

- Confirm only the affected academy/lesson, source URL status, token validity, TLS chain, and range/stream response.
- Keep reading content available and show retry/support guidance.
- Do not disable TLS verification or expose Moodle tokens to work around the failure.

### VowHumans/RunPod failure

- Confirm iframe URL allowlist, lesson-context response, LiveKit/media errors, RunPod readiness, GPU memory/compute, and one-audio-source configuration.
- Keep the presenter optional; learners must continue the lesson without it.
- For duplicate audio, confirm the non-lip-synced audio path is muted/disabled before enabling the MuseTalk output. Do not increase GPU spend until telemetry shows compute saturation rather than queue/network/audio-pipeline overlap.

### PayFast discrepancy

- Freeze affected paid activation if integrity is uncertain.
- Compare payment row, expected amount/currency/course, merchant, ITN signature validation, PayFast server validation, and event history.
- Never activate from browser success, screenshots, or verbal confirmation. Finance must reconcile before manual correction.

## Backup and Recovery

- MySQL: scheduled encrypted backups plus a pre-migration export; test restore on staging.
- PHP: versioned deployment packages and prior host directory.
- Vercel: retain known-good deployment IDs for promotion/rollback.
- Moodle: source platform backup is owned by each academy operator.
- Recovery testing must document RPO/RTO targets once business owners approve them.

## Release Record

For every production release record: Git revision, Vercel deployment, PHP package revision, SQL migrations applied, environment changes by name only, test evidence, approvers, start/end time, rollback point, and post-release checks.
