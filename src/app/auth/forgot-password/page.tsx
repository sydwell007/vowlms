"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.ok) { setError(json.error ?? "Something went wrong."); return; }
      setSent(true);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold text-xl font-black text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)]">
            VL
          </div>
          <h1 className="text-3xl font-semibold text-ink">Reset your password</h1>
          <p className="mt-2 text-sm text-muted">We&apos;ll send a reset link to your email address.</p>
        </div>

        <div className="premium-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">✓</div>
              <h2 className="text-xl font-semibold text-ink">Check your inbox</h2>
              <p className="text-sm text-muted leading-6">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Check your spam folder if you don&apos;t see it within a few minutes.
              </p>
              <Link href="/auth/signin"
                className="block w-full rounded-lg bg-gold px-6 py-3 text-center text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <div>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                <input id="reset-email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@goalvow.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:opacity-60">
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <p className="text-center text-sm text-muted">
                Remember your password?{" "}
                <Link href="/auth/signin" className="font-semibold text-[#1166c8] hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
