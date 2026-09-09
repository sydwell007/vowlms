import { ok } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { allGroupings } from "@/data/course-groupings";

type EnrollmentCounts = Record<string, number>;

export async function GET() {
  if (!isBridgeConfigured()) {
    return ok<EnrollmentCounts>({}, { headers: { "X-VowLMS-Degraded": "bridge" } });
  }

  try {
    const counts = await bridgeGet<EnrollmentCounts>("/courses/enrollment-counts", { noAuth: true });

    for (const grouping of allGroupings) {
      const childCounts = grouping.moduleSlugOrder.map((slug) => counts[slug] ?? 0);
      counts[grouping.slug] = childCounts.length > 0 ? Math.min(...childCounts) : 0;
    }

    return ok(counts);
  } catch {
    // Counts enrich public cards but must not make the catalogue unavailable.
    return ok<EnrollmentCounts>({}, { headers: { "X-VowLMS-Degraded": "bridge" } });
  }
}
