"use client";

import { FormEvent, useState } from "react";
import { ShieldCheck, Search, BadgeCheck, CircleX } from "lucide-react";

type Result = { valid: boolean; certificateId: string; learnerName?: string; courseName?: string; issuedAt?: string; academyName?: string };

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch(`/api/certificates/verify?certificateId=${encodeURIComponent(certificateId)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Verification could not be completed.");
      setResult(payload.data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Verification could not be completed.");
    } finally { setLoading(false); }
  }

  return <main className="premium-page min-h-[70vh]">
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8">
      <div className="border-b border-slate-200 pb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#06111f] text-gold"><ShieldCheck size={25} /></div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">GoalVow credential registry</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Verify a certificate</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">Confirm a VowLMS course credential using the authentication number printed on its certificate.</p>
      </div>
      <form onSubmit={verify} className="mt-8 flex gap-3">
        <label className="sr-only" htmlFor="certificate-id">Certificate authentication number</label>
        <input id="certificate-id" value={certificateId} onChange={(event) => setCertificateId(event.target.value)} placeholder="VOWLMS-COURSE-2026-XXXXXXXX" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-ink outline-none transition focus:border-[#1166c8] focus:ring-2 focus:ring-[#1166c8]/15" required />
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#06111f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2239] disabled:opacity-60"><Search size={17} />{loading ? "Checking" : "Verify"}</button>
      </form>
      {error ? <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
      {result ? result.valid ? <section className="mt-6 rounded-lg border border-emerald-200 bg-white p-6 shadow-[0_14px_38px_rgba(6,17,31,0.05)]"><div className="flex items-center gap-3 text-emerald-700"><BadgeCheck size={24} /><h2 className="text-lg font-semibold">Authentic VowLMS certificate</h2></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted">Learner</dt><dd className="mt-1 font-semibold text-ink">{result.learnerName}</dd></div><div><dt className="text-muted">Course</dt><dd className="mt-1 font-semibold text-ink">{result.courseName}</dd></div><div><dt className="text-muted">Issued</dt><dd className="mt-1 font-semibold text-ink">{result.issuedAt ? new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(new Date(result.issuedAt)) : "-"}</dd></div><div><dt className="text-muted">Authentication number</dt><dd className="mt-1 break-all font-mono text-xs text-ink">{result.certificateId}</dd></div></dl></section> : <section className="mt-6 rounded-lg border border-red-200 bg-white p-6"><div className="flex items-center gap-3 text-red-700"><CircleX size={24} /><h2 className="text-lg font-semibold">Certificate not found</h2></div><p className="mt-3 text-sm text-muted">No active VowLMS credential matches that authentication number.</p></section> : null}
    </section>
  </main>;
}
