"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCertificateTemplateSrc } from "@/lib/certificates/catalogue";

type CertificateRecord = { certificateId: string; courseName: string; courseSlug: string; issuedAt: string };
type ApiResponse = { ok: boolean; data?: CertificateRecord[]; error?: string };

function formatIssuedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(date);
}

export function CertificatesOverview() {
  const [certificates, setCertificates] = useState<CertificateRecord[] | null>(null);
  const [error, setError] = useState("");
  const [sendingId, setSendingId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/certificates", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as ApiResponse;
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Certificates could not be loaded.");
        setCertificates(payload.data ?? []);
      })
      .catch((reason) => { if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Certificates could not be loaded."); });
    return () => controller.abort();
  }, []);

  async function emailCertificate(certificateId: string) {
    setSendingId(certificateId); setNotice("");
    try {
      const response = await fetch("/api/certificates/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ certificateId }) });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Certificate email could not be sent.");
      setNotice("A secure certificate link has been emailed to your account address.");
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "Certificate email could not be sent."); }
    finally { setSendingId(""); }
  }

  if (error) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-800">{error} <button type="button" onClick={() => window.location.reload()} className="font-semibold underline">Retry</button></div>;
  if (certificates === null) return <div aria-label="Loading certificates" className="h-40 animate-pulse rounded-lg border border-slate-200 bg-white" />;
  if (certificates.length === 0) return <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><h2 className="text-xl font-semibold text-ink">No certificate records yet</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">Certificates are automatically issued after every course module is completed and every assessment is passed.</p><ButtonLink href="/courses" variant="ink" className="mt-6 inline-flex">Browse courses</ButtonLink></div>;

  return <>
    {notice ? <p role="status" className="mb-4 rounded-lg border border-[#1166c8]/20 bg-[#1166c8]/5 px-4 py-3 text-sm text-ink">{notice}</p> : null}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate) => {
        const template = getCertificateTemplateSrc(certificate.courseSlug);
        return <article key={certificate.certificateId} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_14px_38px_rgba(6,17,31,0.05)]">
          <div className="relative aspect-[1.414/1] bg-slate-100">{template ? <Image src={template} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" /> : null}</div>
          <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">Verified credential</p><h2 className="mt-2 text-lg font-semibold text-ink">{certificate.courseName}</h2><p className="mt-2 text-xs text-muted">Issued {formatIssuedDate(certificate.issuedAt)}</p><p className="mt-1 break-all font-mono text-[11px] text-muted">{certificate.certificateId}</p>
            <div className="mt-5 grid grid-cols-2 gap-2"><Link href={`/certificates/${certificate.courseSlug}`} className="rounded-md bg-[#06111f] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0d2239]">View</Link><a href={`/api/certificates/generate?courseSlug=${encodeURIComponent(certificate.courseSlug)}&format=pdf`} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"><Download size={15} />Download</a><button type="button" onClick={() => emailCertificate(certificate.certificateId)} disabled={sendingId === certificate.certificateId} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50 disabled:opacity-60"><Mail size={15} />{sendingId === certificate.certificateId ? "Sending" : "Email"}</button><Link href={`/verify-certificate?certificateId=${encodeURIComponent(certificate.certificateId)}`} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"><ShieldCheck size={15} />Verify</Link></div>
          </div>
        </article>;
      })}
    </div>
  </>;
}
