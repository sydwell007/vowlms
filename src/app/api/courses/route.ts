import { ok, serverError } from "@/lib/api/responses";
import { getCourses } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  if (!isBridgeConfigured()) return ok(getCourses());

  try {
    return ok(await bridgeGet("/courses", { noAuth: true }));
  } catch (e) {
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch courses");
  }
}
