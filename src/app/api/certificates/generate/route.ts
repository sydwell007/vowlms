import { badRequest, created } from "@/lib/api/responses";
import { buildCertificatePdfBytes } from "@/lib/certificates/pdf";
import { getCourseBySlug } from "@/lib/data";

function certificateFor(courseSlug: string) {
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return null;
  }

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

  if (!courseSlug) {
    return badRequest("courseSlug is required");
  }

  const certificate = certificateFor(courseSlug);

  if (!certificate) {
    return badRequest("Unknown courseSlug");
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

  return created(certificate);
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.courseSlug !== "string") {
    return badRequest("courseSlug is required");
  }

  const certificate = certificateFor(payload.courseSlug);

  if (!certificate) {
    return badRequest("Unknown courseSlug");
  }

  return created(certificate);
}
