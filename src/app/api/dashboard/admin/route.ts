import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getAdminDashboard } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return ok(getAdminDashboard());

  try {
    return ok(await bridgeGet("/dashboard/admin"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) return unauthorized("Admin access required");
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch admin dashboard");
  }
}
