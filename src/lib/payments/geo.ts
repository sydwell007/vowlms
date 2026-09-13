import { headers } from "next/headers";

/**
 * Server-side-only country detection for payment-gateway routing.
 * `x-vercel-ip-country` is set by Vercel's own edge infrastructure from the
 * request's real IP — it is stripped/overwritten upstream for any request
 * that arrives with a client-supplied version of the same header, so
 * reading it here (never trusting a client-submitted country param) is
 * exactly the "can't be trivially spoofed" detection this needs. Falls back
 * to "DEFAULT" locally (Vercel doesn't set this header off-platform) and in
 * gateway_config maps to PayPal.
 */
export async function getLearnerCountry(): Promise<string> {
  const h = await headers();
  return (h.get("x-vercel-ip-country") ?? "DEFAULT").toUpperCase();
}
