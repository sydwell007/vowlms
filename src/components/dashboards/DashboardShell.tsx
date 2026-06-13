import type { ReactNode } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import type { DashboardMetric, Role } from "@/types/lms";

type DashboardShellProps = {
  role: Role;
  title: string;
  description: string;
  metrics: DashboardMetric[];
  children: ReactNode;
};

export function DashboardShell({ role, title, description, metrics, children }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <section className="bg-[#06111f] py-12 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{role} dashboard</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">{description}</p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
