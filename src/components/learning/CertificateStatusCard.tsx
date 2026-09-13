"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Lock } from "lucide-react";
import { getCertificateIssuePayload } from "@/lib/certificates/eligibility";

type Status = "loading" | "issued" | "locked" | "unavailable";
type Progress = { percent: number; doneItems: number; totalItems: number };

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
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const payload = getCertificateIssuePayload(courseSlug);
    if (!payload) return;
    let cancelled = false;

    fetch(`/api/certificates/progress?courseSlug=${encodeURIComponent(payload.courseSlug)}`)
      .then(async (res) => (res.ok ? ((await res.json())?.data as Progress) : null))
      .then((data) => {
        if (!cancelled && data) setProgress(data);
      })
      .catch(() => {
        /* the status check below still covers the important "can I get my certificate" answer */
      });

    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  useEffect(() => {
    const payload = getCertificateIssuePayload(courseSlug);
    if (!payload) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/certificates/generate?courseSlug=${encodeURIComponent(payload.courseSlug)}`);
        if (cancelled) return;
        if (res.ok) {
          setStatus("issued");
          return;
        }
        if (res.status !== 404) {
          setStatus("unavailable");
          return;
        }

        // Not yet issued — but "not yet issued" and "not yet eligible" are
        // different things. A learner can be genuinely eligible right now
        // (every real requirement met) without a certificate ever having
        // been generated for them — e.g. their enrollment progress was
        // computed against an older, larger lesson count before the fake
        // per-module lessons were removed, or they finished everything
        // before this card's own generation-attempt logic existed. Rather
        // than just reporting "locked" from a stale read, try to claim it —
        // the real gate (progress/orientation/assessments) is enforced
        // server-side regardless, so this is safe to attempt unconditionally.
        const genRes = await fetch("/api/certificates/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ courseSlug: payload.courseSlug }),
        });
        if (!cancelled) setStatus(genRes.ok ? "issued" : "locked");
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

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

        {progress ? (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-ink/60">
              <span>Attainment progress</span>
              <span>{status === "issued" ? 100 : progress.percent}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${status === "issued" ? 100 : progress.percent}%`,
                  backgroundColor: status === "issued" ? "#22c55e" : accentColor,
                }}
              />
            </div>
            {status !== "issued" ? (
              <p className="mt-1 text-[10px] text-ink/50">
                {progress.doneItems}/{progress.totalItems} requirements complete — the certificate is issued the moment this reaches 100%.
              </p>
            ) : null}
          </div>
        ) : null}

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
