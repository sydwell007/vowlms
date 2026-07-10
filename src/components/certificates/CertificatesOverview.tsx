"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

type CertificateRecord = {
  certificate_id: string;
  course_name: string;
  course_slug: string;
  issued_at: string;
};

type DashboardResponse = {
  ok: boolean;
  data?: { certificates?: CertificateRecord[] };
  error?: string;
};

function formatIssuedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(date);
}

export function CertificatesOverview() {
  const [certificates, setCertificates] = useState<CertificateRecord[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/dashboard/learner", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as DashboardResponse;
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Certificates could not be loaded.");
        setCertificates(payload.data?.certificates ?? []);
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") {
          setError(reason instanceof Error ? reason.message : "Certificates could not be loaded.");
        }
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-800">
        {error} <button type="button" onClick={() => window.location.reload()} className="font-semibold underline">Retry</button>
      </div>
    );
  }

  if (certificates === null) {
    return <div aria-label="Loading certificates" className="h-40 animate-pulse rounded-lg border border-slate-200 bg-white" />;
  }

  if (certificates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <h2 className="text-xl font-semibold text-ink">No certificate records yet</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
          Certificates appear here after an eligible course is completed and the record is issued to your account.
        </p>
        <ButtonLink href="/courses" variant="ink" className="mt-6 inline-flex">Browse courses</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate) => (
        <article key={certificate.certificate_id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_14px_38px_rgba(6,17,31,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">Certificate record</p>
          <h2 className="mt-3 text-lg font-semibold text-ink">{certificate.course_name}</h2>
          <p className="mt-3 text-xs text-muted">
            Issued {formatIssuedDate(certificate.issued_at)}
          </p>
          <p className="mt-1 break-all font-mono text-xs text-muted">{certificate.certificate_id}</p>
          <Link href={`/certificates/${certificate.course_slug}`} className="mt-5 inline-block text-sm font-semibold text-[#1166c8] hover:underline">
            View certificate
          </Link>
        </article>
      ))}
    </div>
  );
}
