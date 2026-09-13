import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.lessonSlug !== "string") {
    return badRequest("lessonSlug is required");
  }
  if (typeof payload.rating !== "number" || !Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    return badRequest("rating must be a whole number 1-5");
  }

  if (!isBridgeConfigured()) {
    return created({ lessonSlug: payload.lessonSlug, rating: payload.rating });
  }

  try {
    return created(
      await bridgePost("/surveys/submit", {
        lessonSlug: payload.lessonSlug,
        rating: payload.rating,
        liked: typeof payload.liked === "string" ? payload.liked : null,
        improve: typeof payload.improve === "string" ? payload.improve : null,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to submit survey");
  }
}
