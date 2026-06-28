import { notFound, ok, serverError } from "@/lib/api/responses";
import { getCourseBySlug } from "@/lib/data";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (!isBridgeConfigured()) {
    const course = getCourseBySlug(slug);
    if (!course) return notFound("Course not found");
    return ok(course);
  }

  try {
    return ok(await bridgeGet(`/courses/${encodeURIComponent(slug)}`, { noAuth: true }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 404) return notFound("Course not found");
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch course");
  }
}
