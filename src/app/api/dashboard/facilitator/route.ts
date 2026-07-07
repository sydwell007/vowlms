import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getFacilitatorDashboard } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return ok(getFacilitatorDashboard());

  try {
    return ok(await bridgeGet("/dashboard/facilitator"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) return unauthorized("Facilitator access required");
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch facilitator dashboard");
  }
}
