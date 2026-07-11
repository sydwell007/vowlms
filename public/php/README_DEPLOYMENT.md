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

### 3. Upload the PHP application files

In Afrihost File Manager, open the **document root for your API domain**. This is
the folder that serves the URL configured as `BRIDGE_BASE_URL`, for example
`https://api.goalvow.com`.

Upload the **contents** of `public/php` into that document root. The resulting
host structure must look like this:

```text
API document root/
  .htaccess
  api/
  config/
    env.php
    env.example.php
  lib/
```

Important:

- Include the hidden `.htaccess` file.
- Do not upload `public/sql` to the API website.
- Do not upload a local `config/env.local.php`.
- If uploading `php.zip`, extract it inside the API document root and then
  remove the uploaded ZIP from the web-accessible folder.

### 4. Create `config/env.local.php` on Afrihost only

After the code upload, use Afrihost File Manager to copy:

```text
config/env.example.php
```

to:

```text
config/env.local.php
```

Create this copy on Afrihost. Do not create it in the Git repository, Vercel,
or a folder that will later be uploaded publicly. The application automatically
loads this exact host path through `config/env.php`.

If Afrihost supports real server environment variables, those are preferable
to a file. Otherwise, the protected `config/env.local.php` file is the supported
configuration method for this package.

### 5. Fill in the host-only environment values

Edit the new Afrihost `config/env.local.php` and replace every
`replace_with_...` value. Use:

- The MySQL database name `goalvxiw_vowlms` and its Afrihost database user.
- A newly rotated database password.
- Three different long random values for `BRIDGE_API_KEY`, `JWT_SECRET`, and
  `RESOURCE_SIGNING_SECRET`.
- The final VowLMS frontend URL for `APP_URL` and `FRONTEND_ORIGIN`.
- PayFast **sandbox** credentials initially, with `PAYFAST_SANDBOX` set to
  `true`.
- SMTP details only when email delivery is ready to test.

Do not reuse the database password as an application secret. Do not paste any
of these values into Git, documentation, screenshots, support messages, or
Vercel variables whose names begin with `NEXT_PUBLIC_`.

Set `config/env.local.php` to permission `0600` where Afrihost permits it. If
that prevents PHP from reading the file, use the least-permissive readable
setting offered by the hosting account and confirm the URL is blocked in step 6.

### 6. Confirm `.htaccess` protection and routing

In a private browser window, test these URLs using your real API domain:

```text
https://YOUR-API-DOMAIN/config/env.local.php
https://YOUR-API-DOMAIN/config/env.php
https://YOUR-API-DOMAIN/lib/auth.php
```

Each must return **403 Forbidden**. They must never display or download PHP
source or secret values.

Then open:

```text
https://YOUR-API-DOMAIN/health
```

This should reach the rewritten health endpoint. If `/health` returns a normal
404 while `api/health.php` works directly, `.htaccess` rewriting is not active
or the package was extracted into the wrong folder. Do not continue until the
three protected URLs return 403 and `/health` is routed correctly.

### 7. Run post-upload API checks

Perform the checks in the **Smoke Tests** and **Post-Upload Verification**
sections below. Start with:

1. `/health`: JSON response with `status` equal to `healthy` and database check
   equal to `healthy`.
2. `/courses` without `X-Bridge-Key`: rejected with 401 or 403.
3. `/courses` with the exact rotated bridge key: successful JSON response.
4. Login with an incorrect password: generic 401 response without SQL details.
5. Register a normal learner and confirm the browser cannot request `admin`,
   `facilitator`, or `employer` role.

Only after these pass should Vercel be configured with the matching
`BRIDGE_BASE_URL`, `BRIDGE_API_KEY`, and `RESOURCE_SIGNING_SECRET` values.

## Required Host Environment

`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `BRIDGE_API_KEY`, `JWT_SECRET`, `RESOURCE_SIGNING_SECRET`, all six academy-specific Moodle token variables, `APP_URL`, `FRONTEND_ORIGIN`, `API_BASE_URL`, `APP_TIMEZONE`, PayFast variables, and SMTP variables where email is enabled. `MOODLE_TOKEN` is only an optional fallback for an unrecognised Moodle path.

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
