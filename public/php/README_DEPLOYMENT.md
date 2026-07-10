# VowLMS Afrihost PHP Deployment

This directory is an Afrihost deployment package. It must not be served by Vercel.

## Runtime

- PHP 8.1 or later; PHP 8.2+ recommended.
- Extensions: PDO MySQL, cURL, OpenSSL, JSON, mbstring, fileinfo.
- Apache rewrite support and `.htaccess` overrides enabled.
- HTTPS with a complete public certificate chain.

## Safe Deployment Order

1. Back up the current API files and MySQL database.
2. Apply the SQL files described in `public/sql/README_IMPORT_ORDER.md` on staging.
3. Copy `config/env.example.php` to `config/env.local.php` on the host only.
4. Fill the host copy with new, rotated values. Keep it outside the public web root where hosting permits.
5. Upload this package to the API document root without `config/env.local.php`.
6. Confirm `.htaccess` is active and direct `/config` and `/lib` requests return 403.
7. Run the post-upload checks below.

## Required Host Environment

`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `BRIDGE_API_KEY`, `JWT_SECRET`, `RESOURCE_SIGNING_SECRET`, `MOODLE_TOKEN`, `APP_URL`, `FRONTEND_ORIGIN`, `API_BASE_URL`, `APP_TIMEZONE`, PayFast variables, and SMTP variables where email is enabled.

Use different random values for bridge, JWT, and resource-signing secrets. Never reuse a database password as an application secret.

## File Permissions

- PHP source: `0644`.
- Directories: `0755`.
- Host-only environment file: `0600` where supported.
- Do not grant write permission to the web user except the system temporary directory used by rate limiting and approved upload directories.

## Smoke Tests

Use placeholder secrets in documentation and provide real values only through a secure shell or host environment.

```bash
curl -i https://api.example.com/health
curl -i -H "X-Bridge-Key: REPLACE_AT_RUNTIME" https://api.example.com/courses
curl -i -X POST -H "Content-Type: application/json" -H "X-Bridge-Key: REPLACE_AT_RUNTIME" \
  -d '{"email":"test@example.com","password":"not-a-real-password"}' \
  https://api.example.com/auth/login
```

Expected: health returns JSON without PHP version or credentials; unauthorised calls return 401/403; API errors do not expose SQL details.

## Post-Upload Verification

- Health reports `healthy` only when the database probe succeeds.
- Login, logout, session restoration, and password reset work.
- Learner registration cannot request an elevated role.
- Free enrolment works; paid enrolment activates only after a valid PayFast sandbox ITN.
- Replayed ITNs return success without duplicate enrolment or rewards.
- Tampered or expired lesson-resource signatures return 403.
- Employer responses contain no unassigned learner personal data.
- `config`, `lib`, directory listings, and backup files are inaccessible.

## Rollback

Restore the previous API directory, restore the database backup if a migration changed data, and restore the previous environment file from the host's secure backup. Do not roll back by weakening TLS, signature, role, or amount checks.
