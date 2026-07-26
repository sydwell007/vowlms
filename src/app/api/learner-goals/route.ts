import { badRequest, created, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok(null);
  }

  try {
    const profile = await bridgeGet("/learner-goals");
    return ok(profile);
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) {
      return serverError("Bridge authorization failed. Check BRIDGE_API_KEY on Vercel and Afrihost.");
    }
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch learner goal profile");
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.goalTileId !== "string" || typeof payload.academyCategory !== "string") {
    return badRequest("goalTileId and academyCategory are required");
  }

  if (!isBridgeConfigured()) {
    return created({ profileId: `local-${Date.now()}`, ...payload });
  }

  try {
    const result = await bridgePost("/learner-goals/save", payload);
    return created(result);
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError && e.status === 403) {
      return serverError("Bridge authorization failed. Check BRIDGE_API_KEY on Vercel and Afrihost.");
    }
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to save learner goal profile");
  }
}
