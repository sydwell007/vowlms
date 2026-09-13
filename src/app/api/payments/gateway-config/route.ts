import { ok } from "@/lib/api/responses";
import { getLearnerCountry } from "@/lib/payments/geo";

/**
 * Exposes the learner's real, server-detected country plus the PUBLIC keys
 * each international gateway's own SDK needs to initialize (Paystack Inline
 * JS, PayPal Smart Buttons) — never a secret. Deliberately does NOT decide
 * the gateway here — `computeInternationalUnlockPrice()` (via
 * /api/courses/unlock-price-international) is the one real source of truth
 * for country → gateway routing (reads `gateway_config`), so there's only
 * ever one place that mapping can drift.
 */
export async function GET() {
  const country = await getLearnerCountry();

  return ok({
    country,
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY ?? null,
    paypalClientId: process.env.PAYPAL_CLIENT_ID ?? null,
  });
}
