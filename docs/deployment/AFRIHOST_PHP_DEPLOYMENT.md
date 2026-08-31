# Afrihost PHP Deployment

This guide is the repository-level release checklist. Detailed host structure and endpoint checks also live in `public/php/README_DEPLOYMENT.md`.

## Ownership Boundary

- Upload the contents of `public/php` to the document root serving `BRIDGE_BASE_URL`.
- Never upload `public/php` or `public/sql` to Vercel.
- Never place SQL files, ZIP backups, logs, or `config/env.local.php` in a downloadable public location.
- Configure RunPod/VowHumans worker variables on that worker/template, not in this PHP package.

## Runtime

- PHP 8.1 minimum; PHP 8.2+ recommended.
- PDO MySQL, cURL, OpenSSL, JSON, mbstring, and fileinfo.
- Apache rewrite and `.htaccess` overrides enabled.
- Valid HTTPS certificate with complete chain.

## Before Upload

1. Export a complete MySQL backup and retain the current PHP directory as a dated rollback package.
2. Run `public/sql/000_schema_audit.sql` on staging.
3. Compare the schema with `public/sql/SCHEMA_CHANGELOG.md`; import only missing additive migrations in numeric order.
4. Run `public/sql/verify_schema.sql` and save the result.
5. Run `php -l` on every PHP file in an approved PHP environment.
6. Confirm `.htaccess` precedes generic course rewrites with enrolment-count and review routes.

No database migration is introduced by the 31 August 2026 frontend/SEO upgrade.

## Upload Order

1. Put the API into the approved maintenance window if files cannot be swapped atomically.
2. Upload to a versioned/staging directory first.
3. Include `.htaccess`, `api`, `config/env.php`, `config/env.example.php`, `lib`, and protected upload rules.
4. Create `config/env.local.php` on Afrihost only, from the example, or use true host environment variables.
5. Apply least-privilege permissions: files `0644`, directories `0755`, host secret file `0600` when supported.
6. Point/swap the API document root only after health and protected-file checks pass.

## Host-Only Variables

Database: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`

Trust boundary: `BRIDGE_API_KEY`, `JWT_SECRET`, `RESOURCE_SIGNING_SECRET`

Origins: `APP_URL`, `FRONTEND_ORIGIN`, `API_BASE_URL`, `APP_TIMEZONE`

Payments: `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_SANDBOX`

Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
Moodle: the six academy-specific base URL/token pairs from `.env.example` where PHP consumes them.

Matching values for bridge/JWT/resource signing must be coordinated with Vercel server variables. Never prefix a secret with `NEXT_PUBLIC_`.

## Mandatory Smoke Tests

1. `/health` returns sanitised JSON and a healthy database result.
2. `/config/env.local.php`, `/config/env.php`, `/lib/auth.php`, directory listings, backups, and logs return 403/404.
3. `/courses` without the bridge key is rejected; with the matching key it returns JSON.
4. Invalid login returns a generic 401 without SQL/PHP details.
5. Registration cannot request admin, facilitator, or employer.
6. Free enrolment is idempotent and updates the aggregate count.
7. PayFast sandbox valid, invalid-signature, amount-mismatch, and replay cases behave correctly.
8. Signed lesson resources load; tampered/expired signatures return 403.
9. Review writes reject anonymous/non-enrolled users.
10. Admin lesson presenter reads/writes enforce admin role and VowHumans URL allowlisting.

## Rollback

- Restore the previous PHP directory as one unit.
- Restore the prior secure environment file only if variable changes were part of the incident.
- Restore the database backup only when an applied migration/data operation requires it; never delete enrolment/payment/progress records to simulate rollback.
- Roll Vercel back to the matching frontend contract if PHP contract compatibility changed.
- Record incident times, affected release IDs, and verification results without secrets or personal data.
