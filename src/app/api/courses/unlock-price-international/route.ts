import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getLearnerCountry } from "@/lib/payments/geo";
import type { BridgeUnlockPriceResponse } from "@/app/api/courses/unlock-price/route";

type InternationalPriceResponse = {
  zar: BridgeUnlockPriceResponse;
  gateway: "payfast" | "paystack" | "paypal" | "lemonsqueezy";
  currency: string;
  countryCode: string;
  amountCharged: number | null;
  exchangeRate: number | null;
  conversionAvailable: boolean;
};

/**
 * The real, single source of truth for "what should this learner see and
 * pay, in their own gateway and currency" — country is always derived
 * server-side from the request's own x-vercel-ip-country header, never a
 * client-supplied param, so this can't be used to spoof a cheaper region.
 */
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const slugs = searchParams.get("slugs") ?? "";
  if (!slugs.trim()) return badRequest("slugs is required");

  // Set only when a learner explicitly picked a gateway via "Other payment
  // options" rather than their auto-detected one — must be forwarded to the
  // bridge, or a manual override silently has no effect at all.
  const gatewayOverride = searchParams.get("gateway");

  const country = await getLearnerCountry();

  if (!isBridgeConfigured()) {
    return ok({
      zar: { items: [{ parentSlug: slugs.split(",")[0], standardPriceZar: 299, priceZar: 299, foundingActive: false, foundingSlotsLeft: 0 }], subtotalZar: 299, isBundle: false, bundleDiscountPercent: 0, totalZar: 299, vowrDiscountPercent: 12, vowrPrice: 263 },
      gateway: country === "ZA" ? "payfast" : "paypal",
      currency: country === "ZA" ? "ZAR" : "USD",
      countryCode: country,
      amountCharged: country === "ZA" ? 299 : 16,
      exchangeRate: country === "ZA" ? 1 : 0.053,
      conversionAvailable: true,
    } satisfies InternationalPriceResponse);
  }

  const gatewayParam = gatewayOverride ? `&gateway=${encodeURIComponent(gatewayOverride)}` : "";

  try {
    return ok(
      await bridgeGet<InternationalPriceResponse>(
        `/courses/unlock-price-international?slugs=${encodeURIComponent(slugs)}&country=${encodeURIComponent(country)}${gatewayParam}`,
        { noAuth: true },
      ),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 404) return badRequest(e.message);
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Could not load pricing");
  }
}

export type { InternationalPriceResponse };
