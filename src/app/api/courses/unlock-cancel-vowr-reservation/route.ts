import { badRequest, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.reservationId !== "string" || payload.reservationId === "") {
    return badRequest("reservationId is required");
  }

  if (!isBridgeConfigured()) {
    return badRequest("This action requires a connected backend and is unavailable in this environment.");
  }

  try {
    return ok(await bridgePost("/courses/unlock-cancel-vowr-reservation", { reservationId: payload.reservationId }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return badRequest(e.message);
    return serverError("Failed to cancel VOWR reservation");
  }
}
