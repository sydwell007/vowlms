import { badRequest, bridgeUnavailable, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload.certificateId !== "string") return badRequest("certificateId is required");
  if (!isBridgeConfigured()) return bridgeUnavailable();
  try {
    return ok(await bridgePost("/certificates/email", { certificateId: payload.certificateId }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Certificate email could not be sent");
  }
}
