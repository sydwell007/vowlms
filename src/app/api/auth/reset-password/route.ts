import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.token !== "string" || typeof payload.password !== "string") {
    return badRequest("token and password are required");
  }
  if (payload.password.length < 8) {
    return badRequest("Password must be at least 8 characters");
  }

  if (!isBridgeConfigured()) {
    return ok({ reset: true, mode: "dev" });
  }

  try {
    await bridgePost("/auth/reset-password", { token: payload.token, password: payload.password }, { noAuth: true });
    return ok({ reset: true });
  } catch (e) {
    if (e instanceof BridgeError && e.status === 400) {
      return badRequest("Reset link is invalid or has expired. Please request a new one.");
    }
    return serverError("Password reset failed. Please try again.");
  }
}
