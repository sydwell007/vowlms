"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const academyOptions = [
  "Upskilling Academy",
  "Skills Training Academy",
  "Chef Academy",
  "Private School",
  "Business School",
  "University Online",
];

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "learner" as "learner" | "facilitator" | "employer",
    academy: "",
    city: "",
    country: "South Africa",
    agreeTerms: false,
  });
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (!form.agreeTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    setError("");
    // Mock registration — replace with real API call when DB is connected
    await new Promise((r) => setTimeout(r, 1000));

    const session = { user: { email: form.email, role: form.role, name: form.name } };
    sessionStorage.setItem("vowlms_session", JSON.stringify(session));
    router.push("/dashboard/learner");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold text-xl font-black text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)]">
            VL
          </div>
          <h1 className="text-3xl font-semibold text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Join the GoalVow Academy ecosystem</p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${step >= s ? "bg-gold text-[#06111f]" : "bg-slate-100 text-muted"}`}>
                {s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? "text-ink" : "text-muted"}`}>
                {s === 1 ? "Account details" : "Profile & preferences"}
              </span>
              {s < 2 && <div className="h-px flex-1 bg-slate-200" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="premium-card rounded-2xl p-8 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">Full name</label>
                  <input id="name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-1.5">Phone (optional)</label>
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                <input id="signup-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>

              <div>
                <label htmlFor="role-select" className="block text-sm font-semibold text-ink mb-1.5">I am a</label>
                <select id="role-select" value={form.role} onChange={(e) => update("role", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                  <option value="learner">Learner</option>
                  <option value="facilitator">Facilitator / Educator</option>
                  <option value="employer">Employer / Partner</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pwd" className="block text-sm font-semibold text-ink mb-1.5">Password</label>
                  <input id="pwd" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-semibold text-ink mb-1.5">Confirm password</label>
                  <input id="confirm" type="password" required value={form.confirm} onChange={(e) => update("confirm", e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
              </div>

              <button type="submit"
                className="w-full rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] hover:shadow-[0_14px_28px_rgba(245,197,66,0.32)]">
                Continue to profile →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="academy" className="block text-sm font-semibold text-ink mb-1.5">Primary academy of interest</label>
                <select id="academy" value={form.academy} onChange={(e) => update("academy", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                  <option value="">Select an academy…</option>
                  {academyOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-ink mb-1.5">City</label>
                  <input id="city" type="text" value={form.city} onChange={(e) => update("city", e.target.value)}
                    placeholder="Johannesburg"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-ink mb-1.5">Country</label>
                  <input id="country" type="text" value={form.country} onChange={(e) => update("country", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreeTerms} onChange={(e) => update("agreeTerms", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#1166c8]" />
                <span className="text-sm text-muted leading-6">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#1166c8] hover:underline font-medium">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-[#1166c8] hover:underline font-medium">Privacy Policy</Link>
                  {" "}of GoalVow Holdings.
                </span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:opacity-60">
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-[#1166c8] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
