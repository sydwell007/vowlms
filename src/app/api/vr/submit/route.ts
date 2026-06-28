import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { getVRPracticeBySlug } from "@/lib/data";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.practiceSlug !== "string") {
    return badRequest("practiceSlug is required");
  }

  if (!isBridgeConfigured()) {
    const result = getVRPracticeBySlug(payload.practiceSlug);
    if (!result) return badRequest("Unknown practiceSlug");
    return created({
      vrAttemptId: `vr-${Date.now()}`,
      practiceSlug: payload.practiceSlug,
      score: result.practice.scorePlaceholder,
      mode: "webxr-dev",
    });
  }

  try {
    return created(
      await bridgePost("/vr/submit", {
        practiceSlug: payload.practiceSlug,
        score: payload.score ?? null,
        feedback: payload.feedback ?? null,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to submit VR attempt");
  }
}
