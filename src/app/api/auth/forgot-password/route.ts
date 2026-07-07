import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.email !== "string" || !payload.email.includes("@")) {
    return badRequest("A valid email address is required");
  }

  if (!isBridgeConfigured()) {
    // Dev: always succeed silently (don't reveal if email exists)
    return ok({ sent: true, mode: "dev" });
  }

  try {
    await bridgePost("/auth/forgot-password", { email: payload.email }, { noAuth: true });
    return ok({ sent: true });
  } catch (e) {
    if (e instanceof BridgeError && e.status < 500) {
      // Even on 404 (email not found) return success — don't reveal existence
      return ok({ sent: true });
    }
    return serverError("Password reset service unavailable. Please try again.");
  }
}
