import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.event !== "string") {
    return badRequest("event is required");
  }

  if (!isBridgeConfigured()) {
    return created({
      rewardEventId: `reward-${Date.now()}`,
      event: payload.event,
      points: Number(payload.points ?? 20),
      integration: "vowrewards-dev",
    });
  }

  try {
    return created(
      await bridgePost("/rewards/award", {
        event: payload.event,
        points: Number(payload.points ?? 20),
        metadata: payload.metadata ?? {},
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to award reward points");
  }
}
