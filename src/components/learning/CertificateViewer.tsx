"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { visualAssets } from "@/lib/visual-assets";
import type { Course } from "@/types/lms";

type Props = {
  course: Course;
  academyName: string;
  learnerName: string;
  completionDate: string;
  certificateId: string;
};

export function CertificateViewer({ course, academyName, learnerName, completionDate, certificateId }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  async function downloadPDF() {
    setDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      // Gradient-like background
      doc.setFillColor(6, 17, 31);
      doc.rect(0, 0, 297, 210, "F");

      // Gold border
      doc.setDrawColor(245, 197, 66);
      doc.setLineWidth(3);
      doc.rect(10, 10, 277, 190);
      doc.setLineWidth(1);
      doc.rect(13, 13, 271, 184);

      // Header
      doc.setTextColor(245, 197, 66);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("GOALVOW HOLDINGS", 148.5, 30, { align: "center" });

      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Certificate of Completion", 148.5, 50, { align: "center" });

      // Academy name
      doc.setFontSize(11);
      doc.setTextColor(245, 197, 66);
      doc.text(academyName.toUpperCase(), 148.5, 62, { align: "center" });

      // Recipient
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.text("This certifies that", 148.5, 80, { align: "center" });

      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(245, 197, 66);
      doc.text(learnerName, 148.5, 97, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      doc.text("has successfully completed the course", 148.5, 113, { align: "center" });

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      const courseLines = doc.splitTextToSize(course.title, 220);
      doc.text(courseLines, 148.5, 128, { align: "center" });

      // Footer details
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      doc.text(`Completed: ${completionDate}`, 40, 175);
      doc.text(`Certificate ID: ${certificateId}`, 148.5, 175, { align: "center" });
      doc.text("VowLMS - GoalVow Holdings", 258, 175, { align: "right" });

      // Divider line
      doc.setDrawColor(245, 197, 66);
      doc.setLineWidth(0.5);
      doc.line(30, 165, 267, 165);

      doc.save(`${certificateId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  function shareCertificate() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${learnerName} — ${course.title} Certificate`, url });
    } else {
      navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">GoalVow Academy</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Certificate of Completion</h1>
          </div>
          <Link href="/dashboard/learner" className="text-sm font-medium text-muted hover:text-ink transition">
            ← Dashboard
          </Link>
        </div>

        {/* Certificate visual */}
        <div ref={certRef} className="overflow-hidden rounded-2xl">
          <div className="relative bg-gradient-to-br from-[#06111f] via-[#0d2239] to-[#081626] p-1">
            {/* Double border */}
            <div className="rounded-xl border-2 border-gold p-1">
              <div className="rounded-lg border border-gold/40 p-8 sm:p-12">
                {/* Corner decorations */}
                <div className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-gold/60 rounded-tl-sm" />
                <div className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-gold/60 rounded-tr-sm" />
                <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-gold/60 rounded-bl-sm" />
                <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-gold/60 rounded-br-sm" />

                <div className="text-center">
                  {/* Logo */}
                  <div className="brand-mark-frame mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg p-2 shadow-[0_10px_24px_rgba(245,197,66,0.2)]">
                    <Image src={visualAssets.logo} alt="GoalVow" width={48} height={48} className="h-full w-full object-contain" />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold mb-2">GoalVow Holdings</p>
                  <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">Certificate of Completion</h2>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold/80">{academyName}</p>

                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                  <p className="text-sm text-white/70 mb-2">This is to certify that</p>
                  <h3 className="text-4xl font-black text-gold sm:text-5xl" style={{ fontFamily: "serif" }}>
                    {learnerName}
                  </h3>
                  <p className="mt-4 text-sm text-white/70 mb-3">has successfully completed the course</p>
                  <p className="text-2xl font-semibold text-white sm:text-3xl">{course.title}</p>

                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                  <div className="grid gap-4 text-center sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-[0.14em]">Completed</p>
                      <p className="mt-1 text-sm font-semibold text-white">{completionDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-[0.14em]">Certificate ID</p>
                      <p className="mt-1 text-xs font-mono font-semibold text-white/80">{certificateId}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-white/40">
                    Issued by VowLMS - GoalVow Holdings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="flex-1 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)] transition hover:bg-[#e8b830] disabled:opacity-60 text-center"
          >
            {downloading ? "Generating PDF…" : "⬇ Download PDF certificate"}
          </button>
          <button
            onClick={shareCertificate}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50 text-center"
          >
            {shared ? "✓ Link copied!" : "↗ Share certificate"}
          </button>
          <Link href="/opportunities" className="flex-1 rounded-xl bg-[#06111f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2239] text-center">
            View opportunities →
          </Link>
        </div>

        {/* Next steps */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Review rewards", desc: "Open VowRewards to review learning rewards recorded for your account.", href: "/rewards" },
            { title: "View opportunities", desc: "Review opportunity pathways currently published by GoalVow.", href: "/opportunities" },
            { title: "Continue learning", desc: "Explore more courses in the GoalVow academy ecosystem.", href: "/courses" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="premium-card-soft rounded-xl p-5 transition hover:border-[#1166c8]/20">
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-xs text-muted leading-5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
