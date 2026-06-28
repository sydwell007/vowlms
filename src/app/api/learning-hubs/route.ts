import { ok, serverError } from "@/lib/api/responses";
import { getLearningHubs } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return ok(getLearningHubs());

  try {
    return ok(await bridgeGet("/learning-hubs", { noAuth: true }));
  } catch (e) {
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch learning hubs");
  }
}
