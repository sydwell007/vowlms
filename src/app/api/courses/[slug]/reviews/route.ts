import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getEnrollableCourseSlugs } from "@/lib/data";
import type { CourseReviewSummary } from "@/types/lms";

const emptySummary: CourseReviewSummary = {
  averageRating: null,
  totalReviews: 0,
  recommendationPercent: null,
  distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  reviews: [],
};

function bridgeError(error: BridgeError) {
  return Response.json(
    { ok: false, error: error.message, requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
    { status: error.status },
  );
}

/**
 * Combines one CourseReviewSummary per real child course into the single
 * summary a grouped Upskilling parent (e.g. "career-management") shows.
 * Rating and recommendation percent are weighted by each child's own review
 * count so a child with more reviews counts for more, matching how a plain
 * average-of-all-ratings would read if they'd all been on one course row.
 */
function mergeSummaries(summaries: CourseReviewSummary[]): CourseReviewSummary {
  const totalReviews = summaries.reduce((sum, s) => sum + s.totalReviews, 0);

  const averageRating = totalReviews > 0
    ? summaries.reduce((sum, s) => sum + (s.averageRating ?? 0) * s.totalReviews, 0) / totalReviews
    : null;

  const recommendationPercent = totalReviews > 0
    ? Math.round(
        summaries.reduce((sum, s) => sum + (s.recommendationPercent ?? 0) * s.totalReviews, 0) / totalReviews,
      )
    : null;

  const distribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  for (const s of summaries) {
    for (const key of Object.keys(distribution) as Array<keyof typeof distribution>) {
      distribution[key] += s.distribution[key];
    }
  }

  const reviews = summaries
    .flatMap((s) => s.reviews)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return { averageRating, totalReviews, recommendationPercent, distribution, reviews };
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (!isBridgeConfigured()) return ok(emptySummary);

  // A course slug like "career-management" is often a virtual parent
  // grouping several real, individually Moodle-migrated child courses — that
  // parent slug has no row of its own in the bridge's `courses` table. Each
  // real child slug is fetched separately (rather than sent to the bridge
  // comma-separated in one request) because a request naming 9+ slugs in one
  // go was reproducibly rejected upstream — confirmed even with 9 copies of
  // the *same* slug, so it's a request-shape limit, not a data problem.
  const realSlugs = getEnrollableCourseSlugs(slug);

  try {
    const summaries = await Promise.all(
      realSlugs.map((realSlug) =>
        bridgeGet<CourseReviewSummary>(`/courses/${encodeURIComponent(realSlug)}/reviews`, { noAuth: true }),
      ),
    );
    return ok(mergeSummaries(summaries));
  } catch (error) {
    if (error instanceof BridgeError) return bridgeError(error);
    return serverError("Course reviews could not be loaded.");
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const body = await request.json().catch(() => null) as {
    rating?: number;
    feedback?: string;
    wouldRecommend?: boolean;
  } | null;

  if (!body || !Number.isInteger(body.rating) || (body.rating ?? 0) < 1 || (body.rating ?? 0) > 5) {
    return badRequest("Choose a rating from 1 to 5.");
  }
  if ((body.feedback ?? "").length > 1500) return badRequest("Feedback must be 1,500 characters or fewer.");
  if (!isBridgeConfigured()) return serverError("Course reviews require the backend bridge.");

  // Enrolling in a grouped parent creates a real enrollment row for every one
  // of its real child courses at once, so a review against just the first
  // child is exactly as valid a signal of "enrolled in this course" as one
  // against any other child — and keeps every review request down to a
  // single slug, matching the request shape confirmed to work reliably.
  const [primarySlug] = getEnrollableCourseSlugs(slug);

  try {
    return ok(await bridgePost(`/courses/${encodeURIComponent(primarySlug)}/reviews`, body));
  } catch (error) {
    if (error instanceof BridgeError) return bridgeError(error);
    return serverError("Your review could not be saved.");
  }
}
