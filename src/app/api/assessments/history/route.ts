import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok({
      attempts: [],
      summary: { totalAttempts: 0, averageScore: 0, passRate: 0, completedCourses: 0 },
    });
  }

  try {
    return ok(await bridgeGet("/assessments/history"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch assessment history");
  }
}
