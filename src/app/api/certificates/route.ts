import { bridgeUnavailable, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getParentGroupSlug } from "@/lib/data";

export async function GET() {
  if (!isBridgeConfigured()) return bridgeUnavailable();
  try {
    const records = await bridgeGet<Array<Record<string, unknown>>>("/certificates");
    return ok(records.map((record) => ({
      certificateId: String(record.certificate_id ?? record.certificateId ?? ""),
      courseName: String(record.course_name ?? record.courseName ?? "Completed course"),
      courseSlug: getParentGroupSlug(String(record.course_slug ?? "")) ?? String(record.course_slug ?? ""),
      issuedAt: String(record.issued_at ?? record.issuedAt ?? ""),
    })));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    return serverError("Certificates could not be loaded");
  }
}
