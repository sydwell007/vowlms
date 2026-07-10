import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getFacilitatorDashboard } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    const dashboard = getFacilitatorDashboard();
    return ok({
      facilitator: dashboard.name,
      metrics: dashboard.metrics,
      courses: dashboard.focusCourses.map((course) => ({
        id: course.slug,
        slug: course.slug,
        title: course.title,
        level: course.level,
        academy_name: course.academySlug,
        total_enrolments: 0,
        avg_progress: 0,
      })),
      recentAttempts: [],
      upcomingEvents: [],
    });
  }

  try {
    return ok(await bridgeGet("/dashboard/facilitator"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) return unauthorized("Facilitator access required");
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch facilitator dashboard");
  }
}
