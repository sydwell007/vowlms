import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getLearnerCountry } from "@/lib/payments/geo";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || !Array.isArray(payload.parentSlugs) || payload.parentSlugs.length === 0) {
    return badRequest("parentSlugs is required and must be a non-empty array");
  }

  if (!isBridgeConfigured()) {
    return badRequest("PayPal checkout requires a connected backend and is unavailable in this environment.");
  }

  const country = await getLearnerCountry();

  try {
    return created(await bridgePost("/payments/paypal-create-order", { parentSlugs: payload.parentSlugs, country }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to create PayPal order");
  }
}
