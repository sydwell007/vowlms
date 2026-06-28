import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getLearnerDashboard } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return ok(getLearnerDashboard());

  try {
    return ok(await bridgeGet("/dashboard/learner"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch dashboard");
  }
}
