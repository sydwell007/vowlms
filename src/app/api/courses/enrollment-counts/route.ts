import { bridgeUnavailable, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { allGroupings } from "@/data/course-groupings";

type EnrollmentCounts = Record<string, number>;

export async function GET() {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    const counts = await bridgeGet<EnrollmentCounts>("/courses/enrollment-counts", { noAuth: true });

    for (const grouping of allGroupings) {
      const childCounts = grouping.moduleSlugOrder.map((slug) => counts[slug] ?? 0);
      counts[grouping.slug] = childCounts.length > 0 ? Math.min(...childCounts) : 0;
    }

    return ok(counts);
  } catch (error) {
    if (error instanceof BridgeError) return serverError(error.message);
    return serverError("Failed to load course enrolment totals");
  }
}
