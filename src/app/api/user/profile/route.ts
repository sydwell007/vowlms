import { bridgeUnavailable, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    return ok(await bridgeGet("/user/profile"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch profile");
  }
}

export async function PUT(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) return ok({ updated: false });

  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    return ok(await bridgePost("/user/profile", payload));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to update profile");
  }
}
