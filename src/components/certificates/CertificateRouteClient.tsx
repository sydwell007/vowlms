"use client";

import { useEffect, useState } from "react";
import { CertificateViewer } from "@/components/learning/CertificateViewer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Course } from "@/types/lms";

type CertificateData = {
  learnerName: string;
  completionDate: string;
  certificateId: string;
};

export function CertificateRouteClient({ course, academyName }: { course: Course; academyName: string }) {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/certificates/generate?courseSlug=${encodeURIComponent(course.slug)}`, {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Certificate could not be loaded.");
        setCertificate(payload.data);
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Certificate could not be loaded.");
      });

    return () => controller.abort();
  }, [course.slug]);

  if (error) {
    return (
      <main className="premium-page px-5 py-20">
        <div role="alert" className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-ink">Certificate unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{error}</p>
          <ButtonLink href="/certificates" variant="ink" className="mt-6 inline-flex">Back to certificates</ButtonLink>
        </div>
      </main>
    );
  }

  if (!certificate) {
    return <main className="premium-page min-h-screen" aria-label="Loading certificate" />;
  }

  return (
    <CertificateViewer
      course={course}
      academyName={academyName}
      learnerName={certificate.learnerName}
      completionDate={certificate.completionDate}
      certificateId={certificate.certificateId}
    />
  );
}
