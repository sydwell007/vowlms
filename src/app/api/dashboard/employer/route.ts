import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getEmployerDashboard } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    const dashboard = getEmployerDashboard();
    return ok({
      employer: dashboard.name,
      company: "Development organisation",
      metrics: dashboard.metrics,
      opportunities: dashboard.opportunities.map((opportunity) => ({
        ...opportunity,
        company: opportunity.partner,
        is_active: true,
      })),
      talent: [],
      vrHighScorers: [],
      upcomingEvents: [],
    });
  }

  try {
    return ok(await bridgeGet("/dashboard/employer"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) return unauthorized("Employer access required");
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch employer dashboard");
  }
}
