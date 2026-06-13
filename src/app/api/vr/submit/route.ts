import { badRequest, created } from "@/lib/api/responses";
import { getVRPracticeBySlug } from "@/lib/data";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.practiceSlug !== "string") {
    return badRequest("practiceSlug is required");
  }

  const result = getVRPracticeBySlug(payload.practiceSlug);

  if (!result) {
    return badRequest("Unknown practiceSlug");
  }

  return created({
    vrAttemptId: `vr-${Date.now()}`,
    practiceSlug: payload.practiceSlug,
    score: result.practice.scorePlaceholder,
    mode: "webxr-placeholder",
  });
}
