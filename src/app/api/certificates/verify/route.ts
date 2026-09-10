import { badRequest, bridgeUnavailable, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET(request: Request) {
  const certificateId = new URL(request.url).searchParams.get("certificateId")?.trim().toUpperCase();
  if (!certificateId) return badRequest("certificateId is required");
  if (!isBridgeConfigured()) return bridgeUnavailable();
  try {
    return ok(await bridgeGet(`/certificates/verify?certificateId=${encodeURIComponent(certificateId)}`));
  } catch (e) {
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Certificate verification could not be completed");
  }
}
