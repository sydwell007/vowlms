import { ok } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  let bridgeStatus = "not-configured";

  if (isBridgeConfigured()) {
    try {
      await bridgeGet("/health", { noAuth: true });
      bridgeStatus = "healthy";
    } catch {
      bridgeStatus = "unreachable";
    }
  }

  return ok({
    service: "VowLMS",
    status: "healthy",
    version: "0.1.0",
    checks: {
      app: "ok",
      bridge: bridgeStatus,
      pwa: "ready",
    },
  });
}
