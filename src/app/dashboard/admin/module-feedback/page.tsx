import Link from "next/link";
import { ModuleFeedbackDashboard } from "@/components/admin/ModuleFeedbackDashboard";

export const metadata = { title: "Module Feedback | Admin" };

export default function ModuleFeedbackPage() {
  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Admin</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Module Feedback</h1>
            <p className="mt-1 text-sm text-muted">Real "Rate this Module" survey responses from learners, across every course.</p>
          </div>
          <Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50">
            ← Dashboard
          </Link>
        </div>
        <ModuleFeedbackDashboard />
      </div>
    </main>
  );
}
