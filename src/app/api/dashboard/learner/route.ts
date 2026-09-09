import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getLearnerDashboard } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { normaliseLearnerDashboard, type RawLearnerDashboard } from "@/lib/learner-dashboard";

export async function GET() {
  if (!isBridgeConfigured()) return ok(normaliseLearnerDashboard(getLearnerDashboard()));

  try {
    return ok(normaliseLearnerDashboard(await bridgeGet<RawLearnerDashboard>("/dashboard/learner")));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch dashboard");
  }
}
