"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learner" | "facilitator" | "employer" | "admin">("learner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mock auth — replace with Auth.js signIn() when database is connected
    await new Promise((r) => setTimeout(r, 800));

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    // Store mock session in sessionStorage for client-side role routing
    const session = { user: { email, role, name: email.split("@")[0] } };
    sessionStorage.setItem("vowlms_session", JSON.stringify(session));

    const dashboardMap = {
      learner: "/dashboard/learner",
      facilitator: "/dashboard/facilitator",
      employer: "/dashboard/employer",
      admin: "/dashboard/admin",
    };

    router.push(dashboardMap[role]);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold text-xl font-black text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)]">
            VL
          </div>
          <h1 className="text-3xl font-semibold text-ink">Sign in to VowLMS</h1>
          <p className="mt-2 text-sm text-muted">GoalVow Academy Learning Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="premium-card rounded-2xl p-8 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@goalvow.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-ink">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs font-medium text-[#1166c8] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-ink mb-1.5">
              Sign in as
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition"
            >
              <option value="learner">Learner</option>
              <option value="facilitator">Facilitator</option>
              <option value="employer">Employer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] hover:shadow-[0_14px_28px_rgba(245,197,66,0.32)] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#1166c8] hover:underline">
              Sign up free
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          GoalVow Holdings · VowLMS v1.0 · Secure learning platform
        </p>
      </div>
    </main>
  );
}
