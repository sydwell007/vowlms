# VOWR Earning & Redemption Model

Status: **valuation + partial-redemption pricing implemented and unit-tested this pass**; milestone-based earning triggers, admin audit UI, and the full redemption catalogue rework are **not yet implemented** (see §6).

## 1. Valuation (confirmed with the user 2026-09-14)

- **100 VOWR = R1** (1 VOWR = R0.01), stored as `platform_settings.vowr_per_zar = 100`.
- Previously `vowr_per_zar = 1.0` (≈1 VOWR = R1) since launch. The change is a **unit rescale**, not a value cut: `public/sql/032_vowr_valuation_rescale.sql` multiplies every existing `reward_events.points` row by 100 in the same migration, so a learner's real ZAR purchasing power is unchanged by the rescale itself.
- This conflict and the decision are recorded in `docs/audits/VOWLMS_VOWR_BASELINE_AUDIT.md` §4.
- Single source of truth for this and every other VOWR constant: `public/php/lib/vowr_config.php`'s `getVowrConfig()` (reads `platform_settings`, never hardcoded, never client-trusted).

## 2. Two coexisting redemption paths (by design, not accidental duplication)

| | All-VOWR unlock | Hybrid partial redemption (new) |
|---|---|---|
| Endpoint | `POST /courses/unlock-with-vowr` | `POST /courses/unlock-reserve-vowr` → gateway create → gateway verify/notify |
| Covers | 100% of price | Up to `maxPercent` of price (see §3); remainder paid by card |
| Ledger effect | Instant single debit | Debit at reserve time, held until cash payment resolves (§4) |
| Existing discount setting used | `vowr_discount_percent` (12%) — an extra discount applied ONLY when paying 100% in VOWR | `vowr_max_redemption_percent` (12% default) — a ceiling on how much of the price VOWR may cover at all |

These are deliberately separate settings (`vowr_discount_percent` vs `vowr_max_redemption_percent`) even though both currently default to 12 — they answer different questions and must not be conflated in future changes.

## 3. Partial redemption ceiling — `computePartialVowrRedemption()`

```
maxRedeemableZar = totalZar × (maxPercent / 100)
maxVowr          = floor(maxRedeemableZar × vowrPerZar)
vowrAmount        = min(requestedVowr, maxVowr, availableBalance)   // server-clamped, never trusts the client
vowrValueZar      = vowrAmount / vowrPerZar
cashAmountZar     = totalZar − vowrValueZar
```

Worked example (matches the spec's own numbers exactly, unit-tested):
R209 course, 12% max → `maxRedeemableZar = 25.08` → `maxVowr = 2,508` VOWR → paying the max leaves `cashAmountZar = 183.92`.

### Bundle-size tiers (`getMaxRedemptionPercentForBundleSize()`)

| Items in unlock | Max redemption % |
|---|---|
| 1 (single course) | 12% (= `vowr_max_redemption_percent`) |
| 2 | 10% |
| 3 | 8% |
| 4 | 5% |
| 5+ | 3% |

Scaffolded per the spec even though no purchasable bundle *preset* exists yet beyond the existing ad-hoc multi-slug unlock (`computeCourseUnlockPrice()` already treats 2+ `parentSlugs` as a bundle). No fake bundle products were invented.

## 4. Reservation lifecycle (reserve → commit → release/expire)

1. **Reserve** (`unlock-reserve-vowr.php`): real balance checked under `SELECT ... FOR UPDATE`; VOWR debited immediately via a negative `reward_events` row; a `course_unlock_vowr_reservations` row is created (`status = 'reserved'`, `expires_at = now + vowr_reservation_ttl_minutes` (30 min default)).
2. **Pay the remainder**: the gateway-create endpoint (`course-unlock-payfast-create.php` today) charges `reservation.cash_amount_zar`, not the full price, when a `reservationId` is supplied; the reservation id is stored on the `payments`/`international_payments` row.
3. **Commit** (`commitVowrReservation()`, called from `payfast-notify.php` on a genuinely-paid ITN and `paystack-verify-transaction.php` after a real server-side Paystack verification): flips the reservation to `committed`. No further ledger effect — the debit already happened at step 1.
4. **Release** (`releaseVowrReservation()`): refunds the VOWR via a compensating positive `reward_events` row, called from three places — a definitively failed/cancelled cash payment (immediate), an explicit learner "Remove VOWR" action (`unlock-cancel-vowr-reservation.php`, immediate), or the TTL sweep (`release-expired-vowr-reservations.php`, cron, catches anything abandoned mid-checkout).

Every step re-derives amounts server-side; the client only ever supplies a *requested* VOWR amount and a gateway name.

## 5. Fixed redemption catalogue rescale (`redeem.php`)

Existing flat-cost catalogue items were multiplied ×100 to track the valuation rescale in §1 (their real ZAR cost is unchanged):

| Item | Old (1 VOWR≈R1) | New (100 VOWR=R1) |
|---|---|---|
| `course_credit` | 500 | 50,000 |
| `data_bundle` | 300 | 30,000 |
| `electricity_token` | 400 | 40,000 |
| `mentorship_session` | 250 | 25,000 |
| `vr_practice_credit` | 100 | 10,000 |
| `assessment_retake_waiver` (instant) | 50 | 5,000 |
| Minimum peer donation | 10 | 1,000 |

## 6. Explicitly not done this pass (honest scope boundary)

- **Milestone-based earning triggers** (first lesson / first assessment pass / certificate issued). `award.php` still has zero automatic callers — the ledger is still populated by admin/facilitator action or the existing redemption/unlock flows only. The `dedupe_key` column added in `033_vowr_reservations_and_dedupe.sql` is ready for this, but the learner-callable `complete-milestone` endpoint and its three call sites were not built this pass.
- **PayPal / Lemon Squeezy hybrid wiring.** The reservation is gateway-agnostic and `unlock-reserve-vowr.php` accepts any of the four gateway names, but only `payfast` (via `payfast-notify.php`) and `paystack` (via `paystack-verify-transaction.php`) actually commit/release a reservation today. The frontend hybrid slider (`VowrRedemptionSlider.tsx`) is deliberately hidden for `paypal`/`lemonsqueezy` rather than offering a flow that can't complete.
- **Admin rewards audit interface.** Not built this pass.
- **Full 20-course VOWR-equivalent pricing inventory.** Deferred to the final implementation report once real production `course_unlock_pricing` rows can be read against the new rate.
