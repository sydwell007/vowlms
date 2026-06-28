import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { getAssessmentBySlug } from "@/lib/data";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.assessmentSlug !== "string") {
    return badRequest("assessmentSlug is required");
  }

  if (!isBridgeConfigured()) {
    const result = getAssessmentBySlug(payload.assessmentSlug);
    if (!result) return badRequest("Unknown assessmentSlug");
    const score = 84;
    return created({
      attemptId: `attempt-${Date.now()}`,
      assessmentSlug: payload.assessmentSlug,
      score,
      passed: score >= result.assessment.passMark,
      passMark: result.assessment.passMark,
    });
  }

  try {
    return created(
      await bridgePost("/assessments/submit", {
        assessmentSlug: payload.assessmentSlug,
        answers: payload.answers ?? {},
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to submit assessment");
  }
}
