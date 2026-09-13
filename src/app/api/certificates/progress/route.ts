import { badRequest, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getCertificateIssuePayload } from "@/lib/certificates/eligibility";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseSlug = url.searchParams.get("courseSlug");
  if (!courseSlug) return badRequest("courseSlug is required");

  const issuePayload = getCertificateIssuePayload(courseSlug);
  if (!issuePayload) return ok({ percent: 0, doneItems: 0, totalItems: 0 });

  if (!isBridgeConfigured()) return ok({ percent: 0, doneItems: 0, totalItems: 0 });

  try {
    return ok(
      await bridgeGet(
        `/certificates/progress?courseSlugs=${encodeURIComponent(issuePayload.courseSlugs.join(","))}&parentSlug=${encodeURIComponent(issuePayload.courseSlug)}`,
      ),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to fetch certificate progress");
  }
}
