import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.redemptionType !== "string") {
    return badRequest("redemptionType is required");
  }

  if (!isBridgeConfigured()) {
    return badRequest("VOWR redemption requires a connected backend and is unavailable in this environment.");
  }

  try {
    return created(
      await bridgePost("/rewards/redeem", {
        redemptionType: payload.redemptionType,
        amount: payload.amount,
        recipientEmail: payload.recipientEmail,
        metadata: payload.metadata ?? {},
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to submit VOWR redemption");
  }
}
