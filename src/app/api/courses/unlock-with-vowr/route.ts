import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || !Array.isArray(payload.parentSlugs) || payload.parentSlugs.some((s: unknown) => typeof s !== "string") || payload.parentSlugs.length === 0) {
    return badRequest("parentSlugs is required and must be a non-empty array of course slugs");
  }

  if (!isBridgeConfigured()) {
    return badRequest("VOWR course unlock requires a connected backend and is unavailable in this environment.");
  }

  try {
    return created(await bridgePost("/courses/unlock-with-vowr", { parentSlugs: payload.parentSlugs }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to unlock course with VOWR");
  }
}
