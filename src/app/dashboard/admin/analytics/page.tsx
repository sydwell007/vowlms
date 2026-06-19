import Link from "next/link";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata = { title: "Analytics | Admin" };

export default function AdminAnalyticsPage() {
  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Admin</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Analytics & Reporting</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50">
              ← Dashboard
            </Link>
            <button className="rounded-lg bg-[#06111f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d2239]">
              Export CSV
            </button>
          </div>
        </div>
        <AnalyticsDashboard />
      </div>
    </main>
  );
}
