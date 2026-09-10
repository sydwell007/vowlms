import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getCertificateIssuePayload } from "@/lib/certificates/eligibility";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.lessonSlug !== "string") {
    return badRequest("lessonSlug is required");
  }

  if (!isBridgeConfigured()) {
    return created({
      progressId: `progress-${Date.now()}`,
      lessonSlug: payload.lessonSlug,
      completed: Boolean(payload.completed),
      syncState: "local-only",
    });
  }

  try {
    const result = await bridgePost("/progress", {
        lessonSlug: payload.lessonSlug,
        completed: Boolean(payload.completed),
      });

    if (payload.completed) {
      const certificatePayload = getCertificateIssuePayload(payload.lessonSlug);
      if (certificatePayload) {
        try {
          await bridgePost("/certificates/generate", certificatePayload);
        } catch (e) {
          if (!(e instanceof BridgeError && e.status === 400)) console.error("Certificate eligibility check failed", e);
        }
      }
    }

    return created(result);
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to save progress");
  }
}
