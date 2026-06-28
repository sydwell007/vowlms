import { badRequest, created, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok([
      { enrollmentId: "mock-enr-001", courseSlug: "improving-your-mental-health", status: "active", progress: 40 },
      { enrollmentId: "mock-enr-002", courseSlug: "module-3-employee-ethics", status: "active", progress: 10 },
    ]);
  }

  try {
    return ok(await bridgeGet("/enrollments"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch enrollments");
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.courseSlug !== "string") {
    return badRequest("courseSlug is required");
  }

  if (!isBridgeConfigured()) {
    return created({
      enrollmentId: `enr-${payload.courseSlug}-${Date.now()}`,
      courseSlug: payload.courseSlug,
      status: "active",
      progress: 0,
    });
  }

  try {
    return created(await bridgePost("/enrollments", { courseSlug: payload.courseSlug }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to enroll");
  }
}
