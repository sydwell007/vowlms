import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { getMockSession } from "@/lib/auth/mock-auth";

export async function GET() {
  if (!isBridgeConfigured()) {
    const session = getMockSession("learner");
    return ok(session.user);
  }

  try {
    const user = await bridgeGet<unknown>("/auth/me");
    return ok(user);
  } catch (e: unknown) {
    const status = (e as { status?: number }).status ?? 500;
    if (status === 401) return unauthorized();
    return serverError("Failed to fetch user");
  }
}
