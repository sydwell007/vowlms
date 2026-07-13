import { badRequest, created, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getEnrollableCourseSlugs, getParentGroupSlug } from "@/lib/data";

type BridgeEnrollment = {
  courseSlug?: string;
  course_slug?: string;
  [key: string]: unknown;
};

/** Attach the grouped "parent" course slug (if any) so the frontend can match on either. */
function withGroupSlug(enrollment: BridgeEnrollment): BridgeEnrollment {
  const childSlug = enrollment.courseSlug ?? enrollment.course_slug;
  return { ...enrollment, groupSlug: childSlug ? getParentGroupSlug(childSlug) : null };
}

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok(
      [
        { enrollmentId: "mock-enr-001", courseSlug: "improving-your-mental-health", status: "active", progress: 40 },
        { enrollmentId: "mock-enr-002", courseSlug: "module-3-employee-ethics", status: "active", progress: 10 },
      ].map(withGroupSlug),
    );
  }

  try {
    const enrollments = (await bridgeGet("/enrollments")) as BridgeEnrollment[];
    return ok(enrollments.map(withGroupSlug));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) {
      return serverError("Bridge authorization failed. Check BRIDGE_API_KEY on Vercel and Afrihost.");
    }
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

  // Grouped "parent" courses (e.g. "business-ethics") don't exist as a real `courses`
  // row — enrol in each real child course slug that backs the parent instead.
  const targetSlugs = getEnrollableCourseSlugs(payload.courseSlug);

  try {
    let lastResult: unknown = null;
    for (const slug of targetSlugs) {
      lastResult = await bridgePost("/enrollments", { courseSlug: slug });
    }

    return created({
      ...(typeof lastResult === "object" && lastResult !== null ? lastResult : {}),
      courseSlug: payload.courseSlug,
      status: "active",
    });
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) {
      return serverError("Bridge authorization failed. Check BRIDGE_API_KEY on Vercel and Afrihost.");
    }
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to enroll");
  }
}
