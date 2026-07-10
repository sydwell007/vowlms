"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { useDashboardEndpoint } from "@/lib/auth/useDashboardEndpoint";
import type { DashboardMetric } from "@/types/lms";

type EmployerOpportunity = {
  id: string;
  title: string;
  type: string;
  location?: string;
  description?: string;
  is_active?: number | boolean;
};

type EmployerData = {
  employer: string;
  company?: string;
  metrics: Array<{ label: string; value: string; detail?: string }>;
  opportunities: EmployerOpportunity[];
};

const pendingMetrics: DashboardMetric[] = [
  { label: "Opportunities posted", value: "-", detail: "Loading" },
  { label: "Active listings", value: "-", detail: "Loading" },
  { label: "Assigned learners", value: "Restricted", detail: "Consent required" },
  { label: "Skills evidence", value: "Restricted", detail: "Authorisation required" },
];

export default function EmployerDashboardPage() {
  const { data, error, loading } = useDashboardEndpoint<EmployerData>("/api/dashboard/employer");
  const metrics: DashboardMetric[] = data?.metrics.map((item) => ({ ...item, detail: item.detail ?? "Authorised organisation data" })) ?? pendingMetrics;

  return (
    <DashboardShell
      role="employer"
      title={data?.company || data?.employer || "Organisation dashboard"}
      description="Manage your organisation's opportunity listings. Learner-level records remain private unless an assignment and consent model authorises access."
      metrics={metrics}
    >
      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div> : null}
      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-ink">Your opportunity listings</h2>
        <Link href="/support" className="text-sm font-semibold text-[#1166c8] hover:underline">Organisation support</Link>
      </div>
      {loading ? (
        <div className="mt-4 h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
      ) : data?.opportunities.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.opportunities.map((opportunity) => (
            <article key={opportunity.id} className="rounded-lg border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">{opportunity.type}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{opportunity.title}</h3>
              {opportunity.location ? <p className="mt-2 text-sm text-muted">{opportunity.location}</p> : null}
              {opportunity.description ? <p className="mt-3 text-sm leading-6 text-muted">{opportunity.description}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-muted">No opportunities have been posted by this organisation.</div>
      )}
    </DashboardShell>
  );
}
