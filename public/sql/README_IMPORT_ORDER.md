# VowLMS MySQL Import Order

This is a phpMyAdmin/Afrihost migration package. It must never be served by Vercel.

## Before Import

1. Export a full database backup with routines and triggers.
2. Run `000_schema_audit.sql` and save the result.
3. Confirm the selected database name before every import.
   `verify_schema.sql` explicitly selects `goalvxiw_vowlms`; update its `USE`
   statement first if your target database has a different name.
4. Confirm `payments.payfast_payment_id` has no duplicate non-null values before migration 011.
5. Use a staging database first.

## New Database

1. `001_schema.sql`
2. `002_seed_academies.sql`
3. `003_seed_opportunities.sql`
4. `004_seed_learning_hubs.sql`
5. `007_schema_patch.sql`
6. `009_lesson_resources.sql`
7. Course content imports only after their source and licence are confirmed: `008_lesson_content.sql`, `010_resources_data.sql`
8. `011_integrity_hardening.sql`
9. `verify_schema.sql`

### Optional admin promotion (`005_admin_user_setup.sql`)

Do not import this with the numbered schema files. First create your own account
through the normal VowLMS sign-up flow so PHP securely hashes the password. Then:

1. Confirm that exact email exists in `users`.
2. Open `005_admin_user_setup.sql` and replace
   `REPLACE_WITH_YOUR_ADMIN_EMAIL` with your account email.
3. Import the edited file once.
4. Confirm `promoted_rows` is `1` and the final result shows only your intended
   account with `role = admin`.

The file never creates a password, test learner, or reward record. Keep admin
credentials out of SQL and never use an online password-hash generator.

### Legacy ecosystem bundle

Do **not** import `vowlms_ecosystem_upgrade.sql` in the current installation.
It is a legacy optional content/lead-table bundle, not migration 012. Its seed
copy predates the current evidence-safe content and can reintroduce unapproved
claims. The current Next.js public pages do not depend on it. Your phpMyAdmin
screenshot already shows its tables (`ecosystem_services`, `homepage_sections`,
`investor_sections`, `academy_pages`, `support_services`, `sidebar_services`,
`partner_leads`, `investor_leads`, and `service_interest_logs`), so leave those
tables in place and do not reseed them with this file.

## Existing Database

Do not re-import `001_schema.sql` blindly. Run the audit, compare the live schema, apply only required incremental patches in order (`007`, `009`, `011`), then run `verify_schema.sql`.

## Rollback

- Restore the full pre-migration database backup for a complete rollback.
- For migration 011 only, review `rollback/011_integrity_hardening_rollback.sql` and confirm there are no `cancelled` payment rows before contracting the enum.
- Retaining additive timestamp columns is safer than dropping them.
- Never delete payment, enrolment, progress, assessment, or certificate records to force a rollback.
