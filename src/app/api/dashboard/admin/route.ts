import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { getAcademies, getCourses } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok({
      totals: {
        users: 0,
        courses: getCourses().length,
        enrollments: 0,
        certificates: 0,
        revenue: 0,
      },
      roleCounts: {},
      recentUsers: [],
      topCourses: [],
      academyStats: getAcademies().map((academy) => ({
        name: academy.name,
        course_count: getCourses().filter((course) => course.academySlug === academy.slug).length,
        total_enrolments: 0,
      })),
      monthlyRevenue: [],
      mode: "development",
    });
  }

  try {
    return ok(await bridgeGet("/dashboard/admin"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) return unauthorized("Admin access required");
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch admin dashboard");
  }
}
