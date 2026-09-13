import { forbidden, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok({ modules: [], flagged: [], recentLowRatingFeedback: [] });
  }

  try {
    return ok(await bridgeGet("/surveys/summary"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) return forbidden();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch survey summary");
  }
}
