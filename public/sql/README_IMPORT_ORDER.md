# VowLMS MySQL Import Order

This is a phpMyAdmin/Afrihost migration package. It must never be served by Vercel.

## Before Import

1. Export a full database backup with routines and triggers.
2. Run `000_schema_audit.sql` and save the result.
3. Confirm the selected database name before every import.
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

`005_admin_user_setup.sql` is not part of the automatic production order. Review and replace it with an approved admin provisioning procedure before use. Never deploy a known default password.

## Existing Database

Do not re-import `001_schema.sql` blindly. Run the audit, compare the live schema, apply only required incremental patches in order (`007`, `009`, `011`), then run `verify_schema.sql`.

## Rollback

- Restore the full pre-migration database backup for a complete rollback.
- For migration 011 only, review `rollback/011_integrity_hardening_rollback.sql` and confirm there are no `cancelled` payment rows before contracting the enum.
- Retaining additive timestamp columns is safer than dropping them.
- Never delete payment, enrolment, progress, assessment, or certificate records to force a rollback.
