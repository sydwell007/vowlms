import { serverError, unauthorized, ok } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok({
      balance: 0,
      recentEvents: [],
    });
  }

  try {
    return ok(await bridgeGet("/rewards/balance"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to load VOWR balance");
  }
}
