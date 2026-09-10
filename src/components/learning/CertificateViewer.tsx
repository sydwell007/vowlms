"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Mail, ShieldCheck, Share2 } from "lucide-react";
import { getCertificateTemplateSrc } from "@/lib/certificates/catalogue";
import type { Course } from "@/types/lms";

type Props = { course: Course; academyName: string; learnerName: string; completionDate: string; certificateId: string };

export function CertificateViewer({ course, academyName, learnerName, completionDate, certificateId }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [notice, setNotice] = useState("");
  const templateSrc = getCertificateTemplateSrc(course.slug);

  async function downloadPDF() {
    setDownloading(true); setNotice("");
    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      if (templateSrc) {
        const image = await fetch(templateSrc).then((response) => response.blob());
        const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(image); });
        doc.addImage(dataUrl, "PNG", 0, 0, 297, 210);
        doc.setTextColor(31, 35, 120); doc.setFont("helvetica", "normal"); doc.setFontSize(17);
        doc.text(learnerName.toUpperCase(), 148.5, 82, { align: "center", maxWidth: 190 });
        doc.setTextColor(75, 75, 75); doc.setFontSize(7);
        doc.text(`Achieved: ${completionDate}   |   Authentication: ${certificateId}`, 148.5, 193, { align: "center" });
      } else {
        doc.setFillColor(6, 17, 31); doc.rect(0, 0, 297, 210, "F"); doc.setTextColor(245, 197, 66); doc.setFontSize(24); doc.text("Certificate of Completion", 148.5, 50, { align: "center" }); doc.setTextColor(255, 255, 255); doc.setFontSize(26); doc.text(learnerName, 148.5, 95, { align: "center" }); doc.setFontSize(18); doc.text(course.title, 148.5, 120, { align: "center" }); doc.setFontSize(10); doc.text(`Achieved: ${completionDate} | ${certificateId}`, 148.5, 175, { align: "center" });
      }
      doc.save(`${certificateId}.pdf`);
    } catch { setNotice("PDF download failed. Please try again."); }
    finally { setDownloading(false); }
  }

  async function emailCertificate() {
    setEmailing(true); setNotice("");
    try {
      const response = await fetch("/api/certificates/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ certificateId }) });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Certificate email could not be sent.");
      setNotice("A secure certificate link has been emailed to your account address.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Certificate email could not be sent."); }
    finally { setEmailing(false); }
  }

  async function shareCertificate() {
    const url = `${window.location.origin}/verify-certificate?certificateId=${encodeURIComponent(certificateId)}`;
    if (navigator.share) await navigator.share({ title: `${course.title} certificate`, url });
    else { await navigator.clipboard.writeText(url); setNotice("Verification link copied."); }
  }

  return <main className="premium-page">
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">GoalVow achievements</p><h1 className="mt-1 text-2xl font-semibold text-ink">Certificate of Completion</h1></div><Link href="/certificates" className="text-sm font-semibold text-[#1166c8] hover:underline">All certificates</Link></div>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(6,17,31,0.12)]">
        <div className="relative aspect-[1.414/1] overflow-hidden bg-white">
          {templateSrc ? <Image src={templateSrc} alt={`${course.title} certificate`} fill priority sizes="(min-width: 1024px) 1100px, 100vw" className="object-contain" /> : null}
          <p className="absolute left-[12%] right-[12%] top-[37%] text-center text-xl font-medium tracking-[0.1em] text-[#202176] sm:text-3xl">{learnerName.toUpperCase()}</p>
          <p className="absolute bottom-[5.5%] left-[24%] right-[24%] text-center text-[7px] font-medium tracking-wide text-slate-600 sm:text-xs">Achieved {completionDate}  |  Authentication {certificateId}</p>
        </div>
      </section>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={downloadPDF} disabled={downloading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#06111f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2239] disabled:opacity-60"><Download size={17} />{downloading ? "Preparing PDF" : "Download certificate"}</button>
        <button onClick={emailCertificate} disabled={emailing} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50 disabled:opacity-60"><Mail size={17} />{emailing ? "Sending" : "Email me a copy"}</button>
        <button onClick={shareCertificate} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"><Share2 size={17} />Share verification</button>
      </div>
      {notice ? <p role="status" className="mt-4 rounded-lg border border-[#1166c8]/20 bg-[#1166c8]/5 px-4 py-3 text-sm text-ink">{notice}</p> : null}
      <section className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Course</p><p className="mt-1 text-sm font-semibold text-ink">{course.title}</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Issued by</p><p className="mt-1 text-sm font-semibold text-ink">{academyName}</p></div><Link href={`/verify-certificate?certificateId=${encodeURIComponent(certificateId)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#1166c8] hover:underline"><ShieldCheck size={18} />Verify this credential</Link></section>
    </div>
  </main>;
}
