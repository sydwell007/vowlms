import { badRequest, created } from "@/lib/api/responses";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.courseSlug !== "string") {
    return badRequest("courseSlug is required");
  }

  return created({
    enrollmentId: `enr-${payload.courseSlug}-${Date.now()}`,
    courseSlug: payload.courseSlug,
    status: "active",
    progress: 0,
  });
}
