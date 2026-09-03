import { cookies } from "next/headers";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { decodeDevToken } from "@/lib/auth/session-decode";
import type { Role } from "@/types/lms";

/**
 * Server-side viewer role for Server Components deciding what to render —
 * `null` for a signed-out visitor, treated everywhere as the strictest
 * (learner-equivalent) default. Mirrors `/api/auth/me`'s decode logic
 * (shared via `decodeDevToken`) but reads the cookie directly instead of an
 * extra internal HTTP round-trip.
 */
export async function getServerRole(): Promise<Role | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("vowlms_token")?.value;
  if (!token) return null;

  if (!isBridgeConfigured()) {
    return decodeDevToken(token)?.role ?? null;
  }

  try {
    const user = await bridgeGet<{ role?: Role }>("/auth/me");
    return user?.role ?? null;
  } catch {
    return null;
  }
}
