import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getEnrollableCourseSlugs } from "@/lib/data";
import type { CourseReviewSummary } from "@/types/lms";

/**
 * A course slug like "career-management" is often a virtual parent grouping
 * several real, individually Moodle-migrated child courses — that parent
 * slug has no row of its own in the bridge's `courses` table, so calling the
 * bridge with it directly 404s ("Course not found"). Resolve to the real
 * child slugs first (comma-separated, matched by `.htaccess`'s `[^/]+`
 * capture) so the bridge aggregates reviews across all of them instead.
 */
function resolveBridgeSlug(slug: string): string {
  return getEnrollableCourseSlugs(slug).join(",");
}

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

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (!isBridgeConfigured()) return ok(emptySummary);

  try {
    return ok(await bridgeGet<CourseReviewSummary>(`/courses/${encodeURIComponent(resolveBridgeSlug(slug))}/reviews`, { noAuth: true }));
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

  try {
    return ok(await bridgePost(`/courses/${encodeURIComponent(resolveBridgeSlug(slug))}/reviews`, body));
  } catch (error) {
    if (error instanceof BridgeError) return bridgeError(error);
    return serverError("Your review could not be saved.");
  }
}
