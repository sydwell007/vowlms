# VOWR Ledger & Payment Flow

## Schema (as of `033_vowr_reservations_and_dedupe.sql`)

- `reward_events` (unchanged shape, extended) — the single append-only ledger. Balance is always `SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?`, computed live, never cached/stored. New: nullable `dedupe_key` + `UNIQUE (user_id, dedupe_key)` for future at-most-once milestone awards (NULL = unlimited, used by existing admin awards).
- `course_unlock_vowr_reservations` (new) — one row per hybrid-checkout VOWR hold. `status`: `reserved → committed` (paid) or `reserved → released`/`expired` (refunded). Never mutated after leaving `reserved`.
- `payments.vowr_reservation_id` / `international_payments.vowr_reservation_id` (new, nullable) — links a PayFast/Paystack/PayPal/Lemon Squeezy payment row back to the reservation it's paying the remainder of.
- `redemption_requests` (unchanged) — still used only by the pre-existing fixed-cost catalogue in `redeem.php`, not by the new reservation flow.

## Sequence diagram (PayFast path, fully wired)

```
Learner                 Next.js API              PHP bridge                    DB
  │  set VOWR amount        │                          │                          │
  │─────────────────────────┼─POST /courses/           │                          │
  │                          │ unlock-reserve-vowr      │                          │
  │                          │─────────────────────────▶│ FOR UPDATE balance check │
  │                          │                          │ computePartialVowrRedemption │
  │                          │                          │ INSERT reward_events (-N)│
  │                          │                          │ INSERT reservation (reserved) │
  │◀─── reservationId, cashAmountZar ───────────────────│                          │
  │  click "Pay via PayFast" │                          │                          │
  │─────────────────────────▶ POST /payments/           │                          │
  │                          │ course-unlock-create      │                          │
  │                          │  {reservationId}          │                          │
  │                          │─────────────────────────▶│ reservation.cash_amount_zar│
  │                          │                          │ INSERT payments (pending, vowr_reservation_id) │
  │◀── PayFast form fields ─────────────────────────────│                          │
  │──── redirected to PayFast, pays cash remainder ─────────────────────────────────▶│
  │                                          PayFast ITN │                          │
  │                                          ───────────▶│ signature+server verify │
  │                                                      │ payments → paid          │
  │                                                      │ enrollments granted      │
  │                                                      │ commitVowrReservation()  │
  │                                                      │ reservation → committed  │
```

Paystack follows the identical shape, with `paystack-verify-transaction.php` playing the role of the ITN handler (client-driven, but re-verifies the transaction server-side against Paystack's own API before trusting it — never the browser's own "success" callback).

## Idempotency & safety guarantees

- **VOWR can never be spent twice**: the debit happens once, at reservation time, inside a `FOR UPDATE` transaction. Committing or releasing never touches `reward_events` again — commit is a pure status flip, release is a single compensating credit guarded by `WHERE status = 'reserved'` (so a webhook firing twice, or racing the TTL sweep, can't double-refund).
- **Cash amount is never client-supplied**: every gateway endpoint re-derives the expected charge from `reservation.cash_amount_zar` (itself computed server-side at reserve time from `computeCourseUnlockPrice()`), never from anything the browser sends.
- **Reservation ↔ course match is checked**: `paystack-verify-transaction.php` rejects a reservation whose `parent_slugs` don't cover the requested purchase.
- **Real payment verification only**: PayFast via signature + PayFast's own `/eng/query/validate` server-to-server call; Paystack via `GET /transaction/verify/:reference` with the secret key. Neither path ever trusts a client-reported "payment succeeded."
- **Expiry**: any reservation whose cash leg never resolves is swept by `release-expired-vowr-reservations.php` (cron, `CRON_SECRET`-gated, same convention as `get-exchange-rates.php`).

## What still needs a human to run

This environment has no deploy access to Afrihost. Before any of the above works in production:

1. Run `public/sql/032_vowr_valuation_rescale.sql` then `public/sql/033_vowr_reservations_and_dedupe.sql` against the real database, in that order, via phpMyAdmin or CLI.
2. Upload the new/changed PHP files (`lib/vowr_config.php`, `api/courses/unlock-reserve-vowr.php`, `api/courses/unlock-cancel-vowr-reservation.php`, `api/rewards/redeem.php`, `api/payments/course-unlock-payfast-create.php`, `api/payments/payfast-notify.php`, `api/payments/paystack-verify-transaction.php`, `release-expired-vowr-reservations.php`, `.htaccess`) to Afrihost.
3. Schedule `release-expired-vowr-reservations.php` as an Afrihost cPanel cron job (every 5–10 minutes is reasonable given the 30-minute TTL), passing `?token=<CRON_SECRET>` if invoked over HTTP rather than CLI.
4. Deploy the Next.js changes via the existing Vercel flow (git push → Vercel build), same as every other change this session.
