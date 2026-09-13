import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getLearnerCountry } from "@/lib/payments/geo";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.reference !== "string" || !Array.isArray(payload.parentSlugs) || payload.parentSlugs.length === 0) {
    return badRequest("reference and a non-empty parentSlugs array are required");
  }

  if (!isBridgeConfigured()) {
    return badRequest("Payment verification requires a connected backend and is unavailable in this environment.");
  }

  const country = await getLearnerCountry();

  try {
    return created(
      await bridgePost("/payments/paystack-verify-transaction", {
        reference: payload.reference,
        parentSlugs: payload.parentSlugs,
        country,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to verify Paystack payment");
  }
}
