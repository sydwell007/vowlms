import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { getVRPracticeBySlug } from "@/lib/data";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.practiceSlug !== "string") {
    return badRequest("practiceSlug is required");
  }
  const score = Number(payload.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return badRequest("score must be between 0 and 100");
  }

  if (!isBridgeConfigured()) {
    const result = getVRPracticeBySlug(payload.practiceSlug);
    if (!result) return badRequest("Unknown practiceSlug");
    return created({
      vrAttemptId: `vr-${Date.now()}`,
      practiceSlug: payload.practiceSlug,
      score: Math.round(score),
      passed: score >= (result.practice.passMark ?? 70),
      mode: payload.mode === "headset" ? "webxr" : "desktop-3d",
    });
  }

  try {
    return created(
      await bridgePost("/vr/submit", {
        practiceSlug: payload.practiceSlug,
        score: Math.round(score),
        feedback: payload.feedback ?? null,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to submit VR attempt");
  }
}
