import { badRequest, created, notFound, ok, serverError, unauthorized } from "@/lib/api/responses";
import { buildCertificatePdfBytes } from "@/lib/certificates/pdf";
import { getCourseBySlug } from "@/lib/data";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

type CertificateData = {
  learnerName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
};

function mockCertificate(courseSlug: string): CertificateData | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;
  return {
    learnerName: "Amina Mokoena",
    courseName: course.title,
    completionDate: "13 June 2026",
    certificateId: `VOWLMS-${course.slug.toUpperCase().slice(0, 10)}-2026`,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseSlug = url.searchParams.get("courseSlug");
  const format = url.searchParams.get("format");

  if (!courseSlug) return badRequest("courseSlug is required");

  let certificate: CertificateData;

  if (!isBridgeConfigured()) {
    const c = mockCertificate(courseSlug);
    if (!c) return notFound("Course not found");
    certificate = c;
  } else {
    try {
      certificate = await bridgeGet<CertificateData>(
        `/certificates?courseSlug=${encodeURIComponent(courseSlug)}`,
      );
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

  if (!isBridgeConfigured()) {
    const c = mockCertificate(payload.courseSlug);
    if (!c) return notFound("Course not found");
    return created(c);
  }

  try {
    return created(await bridgePost<CertificateData>("/certificates/generate", { courseSlug: payload.courseSlug }));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    return serverError("Failed to generate certificate");
  }
}
