import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

type BridgeUnlockPriceResponse = {
  items: {
    parentSlug: string;
    standardPriceZar: number;
    priceZar: number;
    foundingActive: boolean;
    foundingSlotsLeft: number;
  }[];
  subtotalZar: number;
  isBundle: boolean;
  bundleDiscountPercent: number;
  totalZar: number;
  vowrDiscountPercent: number;
  vowrPrice: number;
};

/** Real, server-computed price to unlock the rest of one or more courses — never invented client-side. GET /api/courses/unlock-price?slugs=business-ethics,leadership */
export async function GET(request: Request) {
  const slugs = new URL(request.url).searchParams.get("slugs") ?? "";
  if (!slugs.trim()) return badRequest("slugs is required");

  if (!isBridgeConfigured()) {
    return ok({
      items: [{ parentSlug: slugs.split(",")[0], standardPriceZar: 299, priceZar: 209, foundingActive: true, foundingSlotsLeft: 87 }],
      subtotalZar: 209,
      isBundle: false,
      bundleDiscountPercent: 0,
      totalZar: 209,
      vowrDiscountPercent: 12,
      vowrPrice: 184,
    } satisfies BridgeUnlockPriceResponse);
  }

  try {
    return ok(await bridgeGet<BridgeUnlockPriceResponse>(`/courses/unlock-price?slugs=${encodeURIComponent(slugs)}`, { noAuth: true }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 404) return badRequest(e.message);
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Could not load pricing");
  }
}

export type { BridgeUnlockPriceResponse };
