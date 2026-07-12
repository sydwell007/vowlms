# Schema Changelog

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
