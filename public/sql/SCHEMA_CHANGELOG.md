# Schema Changelog

## 019 - VOWR wallet redemption requests

- Adds `redemption_requests`, tracking learner requests to spend VOWR balance
  (`reward_events.points`) on catalogue items needing real-world or admin
  fulfilment (course credit, data bundle, electricity token, mentorship
  session, assessment retake waiver, VR practice credit).
- No changes to `reward_events` itself — the existing `lesson_complete`
  (5 pts), `assessment_pass` (100 pts), and `certificate_issued` (200 pts)
  triggers in `progress/index.php`, `assessments/submit.php`, and
  `certificates/generate.php` already write real, idempotent reward events
  today; this patch only adds the new `/rewards/balance`, `/rewards/history`,
  and `/rewards/redeem` endpoints that read/write against that existing ledger.
- Peer-to-peer donation between learners (`donate_to_learner`) does not use
  this table — it resolves instantly as a paired debit/credit in
  `reward_events` and needs no fulfilment step.

## 018 - VowHumans lesson presenters

- Adds structured, optional VowHumans fields to `lessons`; no lesson, course, or
  learner data is recreated.
- Supports presenter, mentor, tutor, and field-expert roles, three lesson
  placements, expertise copy, and per-presenter camera/microphone delegation.
- Seeds the approved Business Ethics presenter only when that lesson has no
  existing presenter URL, so a re-import does not overwrite admin changes.
- Adds the admin-only `/admin/lessons` PHP endpoint. All URLs are validated as
  exact HTTPS `vowhumans.com/embed/{id}/{slug}` URLs and raw iframe HTML is rejected.
- Future ordered content blocks remain the preferred architecture when VowLMS
  gains a full authoring system; this patch is the smallest safe current change.

## 014-017 - Pre-launch QA diagnostic suite

- `014_vr_sessions.sql` — tracks VR-platform completion callbacks received by
  the new `POST public/php/api/qa/test-vr-callback.php` (distinct from the
  existing `vr_attempts`/`vr_practices` tables — this logs the raw external
  callback and whether it synced onward to `progress`/`reward_events`).
- `015_course_evaluations.sql` — learner course/instructor ratings and
  feedback, one row per user per course.
- `016_opportunity_matches.sql` — records a PlugConnect opportunity match
  against a learner's certificate.
- `017_integration_health_log.sql` — every diagnostic run (`public/php/api/qa/*`)
  logs here: endpoint, latency, success, error, and which authenticated
  identity triggered it.
- All four corrected from the original spec's `INT AUTO_INCREMENT` ids to
  `VARCHAR(36)` UUIDs, matching every existing table in `001_schema.sql`
  (`users.id`, `courses.id`, `modules.id`, `certificates.id` are all
  `VARCHAR(36)` — an `INT` FK would never match them).
- New PHP endpoints under `public/php/api/qa/`: `test-db-connection.php`,
  `test-vowrewards-integration.php`, `test-plugconnect-integration.php`,
  `test-vr-callback.php` + `test-vr-callback-simulator.php`,
  `test-payfast-itn-simulator.php` (opt-in only via `ALLOW_QA_SIMULATORS=true`
  — disabled by default), `test-smtp-email.php`, `verify-seed-integrity.php`,
  `run-all-diagnostics.php`. `public/php/api/health.php` gained a rate limit
  (1 req / 5s / IP) via the existing `requireRateLimit()` helper.
- **Known gap, not fixed by this migration:** `test-vowrewards-integration.php`
  and `test-plugconnect-integration.php` will report `NOT_CONFIGURED` /
  connection failures today — neither `vowrewards-school` nor `plugconnect`
  has a real endpoint on their side to receive these calls yet (verified by
  reading both repos directly). These two diagnostics are intentionally honest
  rather than faked — see `qa-reports/launch-readiness-recommendations.md`.

## 013 - Learner goals

- Adds `learner_goals` (one row per user, `UNIQUE KEY uq_user`) recording which
  goal tile / role / academy a learner chose via the new "Find My Path" flow,
  plus their most recent Path Finder Quiz answers and recommendation.
- Course matching itself runs client-side in the Next.js app against the
  existing static course data — this table only persists the learner's own
  choice so it follows them across devices when logged in. No `courses`
  schema change and no new course-tagging tables were needed.
- New PHP endpoints: `POST public/php/api/learner-goals/save.php` (upsert),
  `GET public/php/api/learner-goals/index.php` (read own profile).

## 012 - Module preview metadata

- Adds nullable `description` and `outcome` columns to `modules`, populated
  optionally to override the auto-generated course-preview copy shown on the
  redesigned course landing page curriculum accordion.
- No PHP change required — `public/php/api/courses/index.php` already selects
  `SELECT * FROM modules`, so these columns are returned automatically.

## Legacy ecosystem bundle

- `vowlms_ecosystem_upgrade.sql` is excluded from the current import order.
- Existing legacy ecosystem tables may remain, but the old seed bundle must not
  be rerun without a separately reviewed migration and approved content.
- `005_admin_user_setup.sql` now promotes an existing normally registered user;
  it no longer creates placeholder users, passwords, test learners, or rewards.

## 011 - Integrity hardening

- Adds `updated_at` to enrolments and lesson progress.
- Adds `cancelled` to payment status.
- Adds a unique non-null PayFast provider-reference index.
- Provides verification and rollback guidance.

## 009-010 - Lesson resources

- Adds learning-resource records and imported Moodle resource metadata.

## 007 - API alignment

- Adds profile/notification fields, facilitator course assignment, and employer opportunity ownership fields used by PHP endpoints.

## 001-004 - Core baseline

- Creates core users, academy, course, learning, assessment, certificate, reward, payment, opportunity, and hub tables plus initial reference data.

All production imports require a backup, staging verification, and an authorised operator.
