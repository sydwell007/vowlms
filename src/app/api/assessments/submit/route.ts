import { badRequest, created } from "@/lib/api/responses";
import { getAssessmentBySlug } from "@/lib/data";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.assessmentSlug !== "string") {
    return badRequest("assessmentSlug is required");
  }

  const result = getAssessmentBySlug(payload.assessmentSlug);

  if (!result) {
    return badRequest("Unknown assessmentSlug");
  }

  const score = 84;

  return created({
    attemptId: `attempt-${Date.now()}`,
    assessmentSlug: payload.assessmentSlug,
    score,
    passed: score >= result.assessment.passMark,
    passMark: result.assessment.passMark,
  });
}
