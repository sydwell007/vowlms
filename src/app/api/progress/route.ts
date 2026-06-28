import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

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
    return created(
      await bridgePost("/progress", {
        lessonSlug: payload.lessonSlug,
        completed: Boolean(payload.completed),
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to save progress");
  }
}
