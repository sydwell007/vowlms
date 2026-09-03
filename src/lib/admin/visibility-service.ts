import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import type { VisibilityOverride } from "@/lib/visibility-overrides";

export type VisibilityFetchResult = {
  overrides: VisibilityOverride[];
  /** False when the bridge isn't configured, or its `/admin/visibility` endpoint isn't built yet. */
  connected: boolean;
};

/**
 * Server-only: reads the current overrides from the bridge, degrading
 * gracefully (empty list, `connected: false`) instead of throwing whenever
 * the bridge or its `/admin/visibility` endpoint isn't reachable — see the
 * contract documented in `src/app/api/admin/visibility/route.ts`. The caller
 * is already behind the admin-only `/dashboard/admin` layout guard, so any
 * bridge failure here (missing endpoint, expired session, network error) is
 * treated uniformly as "not connected yet" rather than a hard error.
 */
export async function fetchVisibilityOverrides(): Promise<VisibilityFetchResult> {
  if (!isBridgeConfigured()) return { overrides: [], connected: false };

  try {
    const overrides = await bridgeGet<VisibilityOverride[]>("/admin/visibility");
    return { overrides, connected: true };
  } catch {
    return { overrides: [], connected: false };
  }
}
