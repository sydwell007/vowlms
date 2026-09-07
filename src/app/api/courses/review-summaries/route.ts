import { bridgeUnavailable, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { allGroupings } from "@/data/course-groupings";

type RawSummary = { averageRating: number | null; totalReviews: number };
type Summaries = Record<string, RawSummary>;

/**
 * Same shape and aggregation approach as /api/courses/enrollment-counts: the
 * bridge only knows about real, individually Moodle-migrated child courses,
 * so a grouped Upskilling parent's rating is a review-weighted average of
 * whichever of its child modules have real reviews (children with none are
 * excluded rather than dragging the average toward "unrated").
 */
export async function GET() {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    const summaries = await bridgeGet<Summaries>("/courses/review-summaries", { noAuth: true });

    for (const grouping of allGroupings) {
      const rated = grouping.moduleSlugOrder
        .map((slug) => summaries[slug])
        .filter((s): s is RawSummary => Boolean(s) && s.totalReviews > 0 && s.averageRating !== null);

      const totalReviews = rated.reduce((sum, s) => sum + s.totalReviews, 0);
      const averageRating = totalReviews > 0
        ? rated.reduce((sum, s) => sum + s.averageRating! * s.totalReviews, 0) / totalReviews
        : null;

      summaries[grouping.slug] = { averageRating, totalReviews };
    }

    return ok(summaries);
  } catch (error) {
    if (error instanceof BridgeError) return serverError(error.message);
    return serverError("Failed to load course rating summaries");
  }
}
