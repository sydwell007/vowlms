import { badRequest, ok, serverError } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
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

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (!isBridgeConfigured()) return ok(emptySummary);

  try {
    return ok(await bridgeGet<CourseReviewSummary>(`/courses/${encodeURIComponent(slug)}/reviews`, { noAuth: true }));
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
    return ok(await bridgePost(`/courses/${encodeURIComponent(slug)}/reviews`, body));
  } catch (error) {
    if (error instanceof BridgeError) return bridgeError(error);
    return serverError("Your review could not be saved.");
  }
}
