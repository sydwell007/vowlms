import type { DashboardMetric } from "@/types/lms";

type MetricCardProps = DashboardMetric & {
  tone?: "light" | "dark";
};

export function MetricCard({ label, value, detail, tone = "light" }: MetricCardProps) {
  const dark = tone === "dark";

  return (
    <article className={dark ? "rounded-lg border border-white/10 bg-white/10 p-5" : "rounded-lg border border-slate-200 bg-white p-5 card-shadow"}>
      <p className={dark ? "text-sm font-medium text-white/64" : "text-sm font-medium text-muted"}>{label}</p>
      <p className={dark ? "mt-3 text-3xl font-semibold text-white" : "mt-3 text-3xl font-semibold text-ink"}>{value}</p>
      <p className={dark ? "mt-2 text-sm leading-6 text-white/62" : "mt-2 text-sm leading-6 text-muted"}>{detail}</p>
    </article>
  );
}
