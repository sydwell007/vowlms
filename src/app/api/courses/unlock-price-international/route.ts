import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getLearnerCountry } from "@/lib/payments/geo";
import type { BridgeUnlockPriceResponse } from "@/app/api/courses/unlock-price/route";

type InternationalPriceResponse = {
  zar: BridgeUnlockPriceResponse;
  gateway: "payfast" | "paystack" | "paypal";
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
  const slugs = new URL(request.url).searchParams.get("slugs") ?? "";
  if (!slugs.trim()) return badRequest("slugs is required");

  const country = await getLearnerCountry();

  if (!isBridgeConfigured()) {
    return ok({
      zar: { items: [{ parentSlug: slugs.split(",")[0], standardPriceZar: 299, priceZar: 209, foundingActive: true, foundingSlotsLeft: 87 }], subtotalZar: 209, isBundle: false, bundleDiscountPercent: 0, totalZar: 209, vowrDiscountPercent: 12, vowrPrice: 184 },
      gateway: country === "ZA" ? "payfast" : "paypal",
      currency: country === "ZA" ? "ZAR" : "USD",
      countryCode: country,
      amountCharged: country === "ZA" ? 209 : 11,
      exchangeRate: country === "ZA" ? 1 : 0.053,
      conversionAvailable: true,
    } satisfies InternationalPriceResponse);
  }

  try {
    return ok(
      await bridgeGet<InternationalPriceResponse>(
        `/courses/unlock-price-international?slugs=${encodeURIComponent(slugs)}&country=${encodeURIComponent(country)}`,
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
