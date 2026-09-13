"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Lock } from "lucide-react";
import { getCertificateIssuePayload } from "@/lib/certificates/eligibility";

type Status = "loading" | "issued" | "locked" | "unavailable";

/**
 * The one real "Certificate of Completion" — rendered once per course,
 * after every module in the sidebar, never per-module. Replaces the old
 * per-module placeholder lesson that used to sit at the end of each module
 * (removed from src/data/seed-data.ts) and which never actually issued
 * anything. Reflects the real, server-checked issuance state from
 * /api/certificates/generate (PHP requires every course module at 100%
 * progress, all Module 0 orientation lessons, and every assessment passed).
 */
export function CertificateStatusCard({ courseSlug, accentColor }: { courseSlug: string; accentColor: string }) {
  const issuePayload = getCertificateIssuePayload(courseSlug);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!issuePayload) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/certificates/generate?courseSlug=${encodeURIComponent(issuePayload.courseSlug)}`);
        if (cancelled) return;
        if (res.ok) setStatus("issued");
        else if (res.status === 404) setStatus("locked");
        else setStatus("unavailable");
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [issuePayload]);

  if (!issuePayload) return null;

  return (
    <div className="mx-3 mt-2 overflow-hidden rounded-xl bg-white shadow-[0_10px_28px_rgba(6,17,31,0.12)]">
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)` }} />
      <div className="p-3.5">
        <div className="flex items-center gap-1.5">
          {status === "issued" ? (
            <Award aria-hidden="true" className="h-3.5 w-3.5" style={{ color: accentColor }} />
          ) : (
            <Lock aria-hidden="true" className="h-3.5 w-3.5" style={{ color: accentColor }} />
          )}
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
            Certificate of completion
          </p>
        </div>

        {status === "loading" ? (
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        ) : status === "issued" ? (
          <>
            <p className="mt-1.5 text-xs font-medium text-ink/70">Every module and assessment complete — your certificate is ready.</p>
            <Link
              href={`/results/${issuePayload.courseSlug}`}
              className="mt-3 flex w-full items-center justify-center rounded-lg px-4 py-2 text-center text-xs font-bold text-[#06111f] transition hover:bg-[#e8b830]"
              style={{ backgroundColor: "#f5c542" }}
            >
              View certificate
            </Link>
          </>
        ) : status === "locked" ? (
          <p className="mt-1.5 text-xs font-medium text-ink/70">
            Complete every remaining module and pass every assessment to unlock your certificate.
          </p>
        ) : (
          <p className="mt-1.5 text-xs font-medium text-ink/70">Couldn&apos;t check your certificate status — check back shortly.</p>
        )}
      </div>
    </div>
  );
}
