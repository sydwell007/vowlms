import { forbidden, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

/**
 * Called once a day by Vercel Cron (see vercel.json) to keep the ZAR→USD
 * exchange rate fresh — without this, Paystack/PayPal/Lemon Squeezy pricing
 * silently goes stale after 36 hours (lib/exchange_rates.php's
 * EXCHANGE_RATE_MAX_AGE_HOURS) and those three gateways start showing
 * "Unavailable" to real learners. Deliberately routed through Vercel's own
 * cron infrastructure rather than an Afrihost cPanel scheduled task — the
 * latter needs a CRON_SECRET kept in sync across two separate hosting
 * platforms, which drifted out of sync twice in practice.
 *
 * Vercel signs cron-triggered requests with `Authorization: Bearer
 * ${CRON_SECRET}` automatically when CRON_SECRET is set as a Vercel env
 * var — verified here so this route can't be triggered by anyone else.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return forbidden();
  }

  if (!isBridgeConfigured()) return serverError("Backend bridge is not configured.");

  try {
    return ok(await bridgeGet("/cron/refresh-exchange-rates", { noAuth: true }));
  } catch (e) {
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to refresh exchange rate");
  }
}
