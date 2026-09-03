import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { decodeDevToken } from "@/lib/auth/session-decode";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vowlms_token")?.value;
  if (!token) return unauthorized();

  if (!isBridgeConfigured()) {
    const user = decodeDevToken(token);
    if (user) return ok(user);
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
