import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { cookies } from "next/headers";

export async function GET() {
  if (!isBridgeConfigured()) {
    // Mock mode: require a cookie so unauthenticated visitors aren't shown as logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("vowlms_token")?.value;

    if (!token) return unauthorized();

    // Tokens starting with "dev." contain base64-encoded user JSON
    if (token.startsWith("dev.")) {
      try {
        const user = JSON.parse(Buffer.from(token.slice(4), "base64").toString("utf8"));
        if (user?.id && user?.name && user?.email && user?.role) {
          return ok(user);
        }
      } catch {
        // fall through
      }
    }

    return unauthorized();
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
