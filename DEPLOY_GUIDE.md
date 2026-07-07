# VowLMS Deployment Guide
## Vercel (Frontend) + Afrihost (Backend PHP + MySQL)

---

## Part 1 — Afrihost: MySQL Database Setup

### 1.1 Create the database
1. Log in to Afrihost cPanel → **MySQL Databases**
2. Create a database: `goalvow_vowlms`
3. Create a user: `goalvow_lms` with a strong password
4. Assign full privileges to that user on `goalvow_vowlms`

### 1.2 Import SQL files via phpMyAdmin
Open **phpMyAdmin** → select `goalvow_vowlms` → click **Import**

Import in this exact order:

| File | What it does |
|---|---|
| `public/sql/001_schema.sql` | Creates all 18 tables |
| `public/sql/002_seed_academies.sql` | Seeds 6 GoalVow academies |
| `public/sql/003_seed_opportunities.sql` | Seeds 10 career opportunities |
| `public/sql/004_seed_learning_hubs.sql` | Seeds 5 learning hubs + announcements + events |
| `public/sql/005_admin_user_setup.sql` | Creates admin user + test learner (edit bcrypt hash first — see step below) |

**Before importing `005_admin_user_setup.sql`:**
- Generate a bcrypt hash for your admin password at https://bcrypt-generator.com (cost 10)
- Open the file and replace `REPLACE_WITH_BCRYPT_HASH` with your hash

**For 614-course seed data:**
```bash
cd C:\Users\sydwe\Desktop\vowlms
npx tsx scripts/export-to-sql.mjs
```
Then import `scripts/output/vowlms_seed.sql` via phpMyAdmin.

---

## Part 2 — Afrihost: PHP Files Setup

### 2.1 Upload PHP files
All PHP files live in `public/php/`. Upload the entire folder contents to a **new subdomain** on Afrihost, e.g. `api.vowlms.co.za` (or use a subfolder like `yourdomain.co.za/api`).

Recommended folder structure on Afrihost:
```
public_html/api/          ← or subdomain root
├── .htaccess
├── config/
│   ├── env.php
│   ├── db.php
│   └── cors.php
├── lib/
│   ├── response.php
│   ├── jwt.php
│   ├── auth.php
│   └── mail.php
└── api/
    ├── health.php
    ├── auth/
    ├── courses/
    ├── academies/
    ├── enrollments/
    ├── progress/
    ├── certificates/
    ├── assessments/
    ├── vr/
    ├── rewards/
    ├── opportunities/
    ├── learning-hubs/
    ├── dashboard/
    ├── user/
    └── payments/
```

### 2.2 Configure `config/env.php`
Edit `config/env.php` on Afrihost to set real values:

```php
$_ENV['DB_HOST']     = 'localhost';
$_ENV['DB_NAME']     = 'goalvow_vowlms';
$_ENV['DB_USER']     = 'goalvow_lms';
$_ENV['DB_PASS']     = 'YOUR_DB_PASSWORD';

$_ENV['JWT_SECRET']  = 'GENERATE_A_RANDOM_64_CHAR_SECRET';
$_ENV['BRIDGE_KEY']  = 'GENERATE_A_RANDOM_SECRET_MATCHING_VERCEL';

$_ENV['APP_URL']          = 'https://vowlms.vercel.app';
$_ENV['FRONTEND_ORIGIN']  = 'https://vowlms.vercel.app';

$_ENV['PAYFAST_MERCHANT_ID']  = 'YOUR_PAYFAST_MERCHANT_ID';
$_ENV['PAYFAST_MERCHANT_KEY'] = 'YOUR_PAYFAST_MERCHANT_KEY';
$_ENV['PAYFAST_PASSPHRASE']   = 'YOUR_PAYFAST_PASSPHRASE';
$_ENV['PAYFAST_SANDBOX']      = 'false';   // set true for testing

$_ENV['SMTP_HOST']   = 'mail.afrihost.com';
$_ENV['SMTP_PORT']   = '587';
$_ENV['SMTP_USER']   = 'noreply@vowlms.co.za';
$_ENV['SMTP_PASS']   = 'YOUR_EMAIL_PASSWORD';
$_ENV['SMTP_FROM']   = 'noreply@vowlms.co.za';
$_ENV['SMTP_NAME']   = 'VowLMS';
```

### 2.3 Enable mod_rewrite on Afrihost
In cPanel → **Apache Handlers** or contact Afrihost support to confirm `mod_rewrite` is enabled for your subdomain. The `.htaccess` file handles all URL routing.

### 2.4 Test the API
Visit: `https://api.vowlms.co.za/health`

Expected response:
```json
{"ok": true, "db": "connected", "ts": "..."}
```

---

## Part 3 — Vercel: Frontend Setup

### 3.1 Deploy to Vercel
```bash
cd C:\Users\sydwe\Desktop\vowlms
npx vercel --prod
```
Or connect the GitHub repo to Vercel for automatic deploys.

### 3.2 Set Environment Variables in Vercel
Go to **Vercel Dashboard → Project → Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `BRIDGE_BASE_URL` | `https://api.vowlms.co.za` |
| `BRIDGE_API_KEY` | Same `BRIDGE_KEY` set in `config/env.php` |
| `NEXT_PUBLIC_APP_URL` | `https://vowlms.vercel.app` |
| `JWT_SECRET` | Same as PHP `JWT_SECRET` |
| `PAYFAST_MERCHANT_ID` | Your PayFast merchant ID |
| `PAYFAST_MERCHANT_KEY` | Your PayFast merchant key |
| `PAYFAST_PASSPHRASE` | Your PayFast passphrase |
| `PAYFAST_SANDBOX` | `false` (or `true` for testing) |

Optional integrations (if using):
| Variable | Value |
|---|---|
| `VOWREWARDS_API_URL` | VowRewards API base URL |
| `VOWREWARDS_API_KEY` | VowRewards API key |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

### 3.3 Redeploy after setting env vars
Vercel → **Deployments → Redeploy** (to pick up the new environment variables).

---

## Part 4 — PayFast ITN Webhook

1. Log in to PayFast Merchant Dashboard
2. Set Notify URL to: `https://vowlms.vercel.app/api/payments/payfast/notify`
3. The Next.js route at `/api/payments/payfast/notify` forwards the ITN body to the PHP bridge at `/payments/payfast-notify`
4. PHP verifies the PayFast signature + IP and auto-enrols the learner on payment completion

---

## Part 5 — VowRewards Integration

If wiring to VowRewards platform:
1. Set `VOWREWARDS_API_URL` and `VOWREWARDS_API_KEY` on Vercel
2. The PHP bridge already inserts `reward_events` rows locally
3. Optionally add a PHP cron or webhook to sync reward events to VowRewards

---

## Part 6 — Production Checklist

- [ ] All 5 SQL files imported in order (001–005)
- [ ] 614 courses imported from `scripts/output/vowlms_seed.sql`
- [ ] All PHP files uploaded to Afrihost subdomain
- [ ] `config/env.php` updated with real values (never commit this file)
- [ ] Afrihost `mod_rewrite` enabled + `.htaccess` working (`/health` returns `{"ok":true}`)
- [ ] Vercel env vars set (all 6+ required vars)
- [ ] Vercel redeployed after env vars set
- [ ] PayFast notify URL set in PayFast dashboard
- [ ] Test sign-up flow end-to-end (register → email → login → dashboard)
- [ ] Test PayFast payment in sandbox mode
- [ ] Switch `PAYFAST_SANDBOX=false` in both Vercel + PHP env when ready for live payments
- [ ] Confirm HTTPS on Afrihost subdomain (free Let's Encrypt via cPanel SSL/TLS)
- [ ] Set `PAYFAST_SANDBOX=false` in PHP env and Vercel when live
- [ ] Verify CORS: Afrihost PHP only allows `https://vowlms.vercel.app`

---

## File Summary

### SQL files (upload to phpMyAdmin)
```
public/sql/
├── 001_schema.sql             ← Run first — creates all tables
├── 002_seed_academies.sql     ← 6 GoalVow academies
├── 003_seed_opportunities.sql ← 10 career opportunities
├── 004_seed_learning_hubs.sql ← 5 hubs + announcements + events
├── 005_admin_user_setup.sql   ← Admin account (edit bcrypt hash first)
└── 006_seed_courses_README.txt← Instructions to generate 614-course SQL
```

### PHP files (upload to Afrihost)
```
public/php/
├── .htaccess                  ← URL routing (27 endpoints)
├── config/
│   ├── env.php                ← DB + secrets (set real values)
│   ├── db.php                 ← PDO singleton
│   └── cors.php               ← CORS headers
├── lib/
│   ├── response.php           ← jsonOk / jsonError helpers
│   ├── jwt.php                ← JWT sign/verify (no Composer)
│   ├── auth.php               ← requireAuth / requireBridgeKey
│   └── mail.php               ← SMTP email sender
└── api/
    ├── health.php
    ├── auth/
    │   ├── login.php
    │   ├── register.php
    │   ├── logout.php
    │   ├── me.php
    │   ├── forgot-password.php
    │   └── reset-password.php
    ├── courses/index.php
    ├── academies/index.php
    ├── enrollments/index.php
    ├── progress/index.php
    ├── certificates/
    │   ├── index.php
    │   └── generate.php
    ├── assessments/submit.php
    ├── vr/submit.php
    ├── rewards/award.php
    ├── opportunities/index.php
    ├── learning-hubs/index.php
    ├── dashboard/
    │   ├── learner.php
    │   ├── facilitator.php
    │   ├── employer.php
    │   └── admin.php
    ├── user/profile.php
    └── payments/
        ├── payfast-create.php
        └── payfast-notify.php
```
