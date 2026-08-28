import { bridgeUnavailable, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

type EnrollmentCounts = Record<string, number>;

export async function GET() {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    return ok(await bridgeGet<EnrollmentCounts>("/courses/enrollment-counts", { noAuth: true }));
  } catch (error) {
    if (error instanceof BridgeError) return serverError(error.message);
    return serverError("Failed to load course enrolment totals");
  }
}
