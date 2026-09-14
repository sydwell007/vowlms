import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

const VALID_GATEWAYS = ["payfast", "paystack", "paypal", "lemonsqueezy"];

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || !Array.isArray(payload.parentSlugs) || payload.parentSlugs.some((s: unknown) => typeof s !== "string") || payload.parentSlugs.length === 0) {
    return badRequest("parentSlugs is required and must be a non-empty array of course slugs");
  }
  if (typeof payload.vowrAmount !== "number" || payload.vowrAmount <= 0) {
    return badRequest("vowrAmount must be a positive number");
  }
  if (typeof payload.gateway !== "string" || !VALID_GATEWAYS.includes(payload.gateway)) {
    return badRequest("gateway must be one of: " + VALID_GATEWAYS.join(", "));
  }

  if (!isBridgeConfigured()) {
    return badRequest("Hybrid VOWR redemption requires a connected backend and is unavailable in this environment.");
  }

  try {
    return created(
      await bridgePost("/courses/unlock-reserve-vowr", {
        parentSlugs: payload.parentSlugs,
        vowrAmount: Math.floor(payload.vowrAmount),
        gateway: payload.gateway,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to reserve VOWR for this purchase");
  }
}
