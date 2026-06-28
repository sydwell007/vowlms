import { ok, serverError } from "@/lib/api/responses";
import { getOpportunities } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return ok(getOpportunities());

  try {
    return ok(await bridgeGet("/opportunities", { noAuth: true }));
  } catch (e) {
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch opportunities");
  }
}
