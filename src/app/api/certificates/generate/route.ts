import { badRequest, bridgeUnavailable, created, notFound, ok, serverError, unauthorized } from "@/lib/api/responses";
import { buildCertificatePdfBytes } from "@/lib/certificates/pdf";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

type CertificateData = {
  learnerName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
};

function normaliseCertificate(value: unknown): CertificateData {
  if (!value || typeof value !== "object") throw new Error("Invalid certificate response");
  const record = value as Record<string, unknown>;
  const issuedAt = String(record.issuedAt ?? record.issued_at ?? "");
  const issuedDate = issuedAt ? new Date(issuedAt) : null;
  const completionDate = record.completionDate
    ? String(record.completionDate)
    : issuedDate && !Number.isNaN(issuedDate.getTime())
      ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(issuedDate)
      : "";
  return {
    learnerName: String(record.learnerName ?? record.learner_name ?? "GoalVow learner"),
    courseName: String(record.courseName ?? record.course_name ?? "Completed course"),
    completionDate,
    certificateId: String(record.certificateId ?? record.certificate_id ?? ""),
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseSlug = url.searchParams.get("courseSlug");
  const format = url.searchParams.get("format");

  if (!courseSlug) return badRequest("courseSlug is required");

  let certificate: CertificateData;

  if (!isBridgeConfigured()) return bridgeUnavailable();

  {
    try {
      const result = await bridgeGet<unknown>(`/certificates?courseSlug=${encodeURIComponent(courseSlug)}`);
      certificate = normaliseCertificate(result);
    } catch (e) {
      if (e instanceof BridgeError && e.status === 401) return unauthorized();
      if (e instanceof BridgeError && e.status === 404) return notFound("Certificate not found");
      return serverError("Failed to fetch certificate");
    }
  }

  if (format === "pdf") {
    const pdf = buildCertificatePdfBytes(certificate);
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${certificate.certificateId}.pdf"`,
      },
    });
  }

  return ok(certificate);
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload.courseSlug !== "string") {
    return badRequest("courseSlug is required");
  }

  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    const result = await bridgePost<unknown>("/certificates/generate", { courseSlug: payload.courseSlug });
    return created(normaliseCertificate(result));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    return serverError("Failed to generate certificate");
  }
}
