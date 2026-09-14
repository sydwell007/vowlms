# VowLMS VOWR Baseline Audit

Date: 2026-09-14
Repo: `C:\Users\sydwe\Desktop\vowlms` (branch `main`, HEAD `a9d9f4f`, clean working tree)
Live site: https://vowlms.vercel.app
Backend: PHP/MySQL bridge on Afrihost (`public/php/`, `public/sql/`), deployed manually by the user via FTP/phpMyAdmin — no deploy access from this environment.

## 1. Baseline tool status (before any change)

- `npx tsc --noEmit -p .` — clean, no errors.
- `npx eslint .` — clean, no errors/warnings.
- `npm run build` — succeeds, full route manifest produced (see below), no build errors.
- Live deployment safety check (required before any release):
  - `GET /php/` → 308 → `/php` → 404 (no directory listing).
  - `GET /php/config/db.php` → **403** (Apache `.htaccess` blocks direct access to non-routed PHP — correct).
  - `GET /sql/` → 308 → `/sql` → 404.
  - `GET /sql/001_schema.sql` → **404** (no raw SQL exposure).
  - Conclusion: PHP/SQL source is not publicly reachable on the live Vercel deployment. This gate already passes; no fix needed here.

## 2. Application architecture (confirmed, not re-derived from memory)

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4, deployed on Vercel.
- Auth: custom JWT-in-cookie, verified via `src/lib/auth`.
- All real data (courses, lessons, enrollments, progress, assessments, certificates, rewards, payments) flows through `src/lib/bridge.ts` → PHP endpoints under `public/php/api/**` → MySQL on Afrihost. Every PHP endpoint follows the same skeleton: `ob_start()` → require `config/cors.php`, `config/db.php`, `lib/auth.php`, `lib/response.php` → `ob_end_clean()` → `setCors()` → `requireBridgeKey()` → `requireMethod()` → `requireAuth()`/`requireRole()` → handler logic → `jsonOk`/`jsonCreated`/`jsonError`.
- Course catalogue has a two-path content model: static `src/data/seed-data.ts` feeds the sidebar/module list; the *currently open* lesson's live `type`/`content` comes from a separate real-time bridge query to the MySQL `lessons` table. (Documented in detail from earlier work this session; unchanged, not touched by this audit.)
- SQL migrations are sequential and additive, `public/sql/001_schema.sql` … `031_survey_lesson_type.sql`, all idempotent (`IF NOT EXISTS` / `INSERT IGNORE`), with a `rollback/` folder and `SCHEMA_CHANGELOG.md`.

## 3. Existing VOWR / wallet / reward implementation (already live in production)

This is the single most important finding of this audit: **VowLMS already has a working, live, production-verified VOWR wallet and redemption system**, built earlier in this engagement (not new). The new request must extend/reconcile this, not assume a green field.

### 3.1 Ledger (`reward_events`, `public/sql/001_schema.sql`)
```sql
CREATE TABLE reward_events (
  id VARCHAR(36) PK, user_id VARCHAR(36), event VARCHAR(100),
  points INT NOT NULL DEFAULT 0, metadata JSON NULL, created_at TIMESTAMP
)
```
- A single additive ledger. Balance = `SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?`. No separate `available`/`pending`/`reserved` columns exist anywhere in the schema.
- No `wallet_balances` table, no reservation table, no idempotency-key column on `reward_events` today.

### 3.2 Earning (`public/php/api/rewards/award.php`)
- `POST /rewards/award`, gated `requireRole('admin','facilitator')` — **not learner-callable**.
- Unconditional `INSERT`, **no idempotency/dedupe check** — calling it twice with the same event double-awards.
- Grep confirms **zero automatic callers** in `src/` today (no lesson-completion, assessment-pass, or certificate-issue hook currently calls `award.php` or any milestone endpoint). i.e. real learners are not currently being awarded VOWR by any automatic trigger — the ledger is populated only by manual admin/facilitator action today.

### 3.3 Spending — two live flows exist and diverge:

**(a) Whole-course VOWR-only unlock** (`public/php/api/courses/unlock-with-vowr.php`, via `useCourseUnlockPurchase.ts`'s `payWithVowr`): pays the *entire* remaining-course price in VOWR, no partial/hybrid option, no cash top-up. Price comes from `computeCourseUnlockPrice()`.

**(b) Fixed-catalogue redemption requests** (`public/php/api/rewards/redeem.php`, `redemption_requests` table from `public/sql/019_redemption_requests.sql`): learner-callable, `SELECT ... FOR UPDATE` balance check, DB-transactional. Two sub-flows:
  - Instant, software-only: `assessment_retake_waiver` (50 VOWR flat) and `donate_to_learner` (peer-to-peer, min 10 VOWR) resolve immediately as `reward_events` rows.
  - Deferred, human-fulfilled: `course_credit` (500), `data_bundle` (300), `electricity_token` (400), `mentorship_session` (250), `vr_practice_credit` (100) VOWR flat — inserted as a `pending` `redemption_requests` row *and* an immediate negative `reward_events` row (so displayed balance reflects the pending spend right away), with copy "Request submitted — reviewed within 24 hours."
- All redemption costs are **fixed flat VOWR amounts hand-picked per catalogue item** — none of them are computed as a percentage of a course price.

### 3.4 Reading (`balance.php`, `history.php`) + frontend
- `GET /rewards/balance` → `{ balance, recentEvents: last 3 }`.
- `GET /rewards/history` → paginated full ledger.
- `src/lib/rewards/useWalletBalance.ts` (client hook, plain fetch, revalidates on focus) is consumed by both the `/rewards` wallet page and `useCourseUnlockPurchase.ts` (`wallet.balance`, `canAffordVowr`).
- `/rewards` page (`src/app/rewards/page.tsx`) is a full wallet UI: balance hero, transaction history, ways-to-earn, redemption catalogue, peer donation — already live.

### 3.5 Course pricing (`public/php/lib/course_unlock_pricing.php`, canonical, single source of truth)
- ZAR pricing: `course_unlock_pricing` table (`price_zar`, `founding_price_zar`, `founding_cutoff`) + `course_unlock_founding_counter` (redemption counter driving the R299→R209 founding-price step-down) + `platform_settings` (key/value: `vowr_per_zar`, `vowr_discount_percent`, `bundle_discount_percent`).
- **Current live `platform_settings` values** (`public/sql/021_course_unlock_pricing.sql`): `vowr_per_zar = 1.0`, `vowr_discount_percent = 12`, `bundle_discount_percent = 20`.
- `vowrPrice = ceil(totalZar * (1 - vowrDiscountPercent/100) * vowrPerZar)`. Worked example at the current founding price (R209): `vowrPrice = ceil(209 * 0.88 * 1.0) = 184` — i.e. **1 VOWR ≈ 1 ZAR of purchasing power today** (184 VOWR buys what R183.92 cash buys).
- This value is consumed by `/api/courses/unlock-price-international` and shown directly in `useCourseUnlockPurchase.ts` (`pricing.vowrPrice`, `pricing.vowrDiscountPercent`) and rendered in `PaymentGatewaySection.tsx`'s VOWR toggle.

### 3.6 International cash payments
- `public/php/lib/international_pricing.php` — ZAR→foreign-currency conversion via `EXCHANGE_RATE_API_*`, gateway selection by `gateway_config` (country_code → payfast/paystack/paypal/lemonsqueezy).
- Paystack: `PAYSTACK_SECRET_KEY`/`PAYSTACK_PUBLIC_KEY` (test mode) verified live in `.env.local`.
- PayPal: `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` (live mode, `PAYPAL_SANDBOX=false`) verified live in `.env.local`.
- Lemon Squeezy: credentials still empty — that gateway is coded but not yet usable.
- All of these are full-price, single-shot charges today — no partial-VOWR-plus-cash flow exists in any gateway path.

## 4. ⚠️ Critical conflict this audit must surface, not resolve silently

The new specification calls for **100 VOWR = R1** (i.e. 1 VOWR = R0.01) as the exchange rate underlying a partial/hybrid redemption model (max 12% of price payable in VOWR, e.g. 2,508 VOWR = R25.08 off a R209 course).

The **currently live, production-verified** exchange rate (`platform_settings.vowr_per_zar = 1.0`) values VOWR at **≈1 VOWR = R1** — i.e. **100× more valuable per token** than the new spec assumes. Under the current live rate, the *same* 12%-of-R209 discount (R25.08) costs **~26 VOWR**, not 2,508.

This is not a cosmetic difference — it changes:
- How many VOWR every existing learner's current balance is actually worth in ZAR terms (a balance of, say, 320 VOWR earned under the old flat-award model is worth ~R320 today; under the new rate it would be worth ~R3.20).
- The economics of every fixed-cost item already live in `redeem.php` (`course_credit` = 500 VOWR ≈ R500 today vs. ≈R5 under the new rate).
- The per-course VOWR *earning* amounts referenced in the new prompt (240–1,320 VOWR) only make sense as meaningful rewards under a rate in the new prompt's range, not the current 1:1 rate — but no such per-course earning amounts exist anywhere in the current codebase to preserve (see §3.2: no automatic earning triggers exist yet).

Per the task's own explicit constraint — *"If the external VowRewards platform currently defines VOWR differently, do not silently change its valuation... identify and document the conflict"* and *"Ask for clarification only if implementation would... change an external VOWR/token valuation"* — **this is a stop-and-ask point, not a judgment call**. Changing `vowr_per_zar` from `1.0` to `0.01` (or introducing a second, differently-valued token concept alongside it) is exactly the kind of external-valuation change the task instructs me not to make unilaterally.

This is being raised to the user directly (outside this document) before any pricing-service or redemption-UI code is written.

## 5. The 20 Upskilling courses

Course catalogue (parent slugs) and pricing rows live in `course_unlock_pricing`; not re-enumerated in full here pending resolution of §4, since any inventory table would need to show VOWR-equivalent price under whichever rate is confirmed. To be completed in the follow-up implementation report once §4 is resolved.

## 6. Security posture already in place (relevant to the new work)

- `requireBridgeKey()` + `requireAuth()`/`requireRole()` on every sensitive endpoint (server-side, not client-trusted).
- `SELECT ... FOR UPDATE` + explicit DB transactions on every balance-mutating endpoint (`redeem.php`, `unlock-with-vowr.php`) — prevents race-condition double-spend on concurrent requests.
- Server-owned fixed cost tables (`$requestCatalog` in `redeem.php`) — client only ever supplies a `redemptionType`, never an amount.
- No `NEXT_PUBLIC_` env var currently holds a payment secret (confirmed by grep against `.env.local` — all Paystack/PayPal/DB secrets are server-only names).
- Gaps identified for the new work to close: no idempotency-key column on `reward_events` (only relied on `redemption_requests`/`payments` foreign-key + fixed-catalogue shape to avoid double effects so far); no reservation/pending-hold concept; `award.php` has no dedupe.

## 7. Conclusion / next step

Baseline is clean (lint/typecheck/build all pass) and the live deployment's PHP/SQL exposure check passes. The architecture, existing wallet system, and pricing code are now mapped in enough depth to design the new pricing/ledger/redemption work safely — **except** for the VOWR valuation conflict in §4, which blocks any concrete numeric implementation (pricing service constants, ledger amounts, redemption UI copy) until resolved with the user.
