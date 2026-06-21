import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAcademyHref } from "@/lib/data";
import type { Academy } from "@/types/lms";

const CATEGORY_COLOR: Record<string, string> = {
  "upskilling": "#1166c8",
  "skills-training": "#19c37d",
  "chef-academy": "#ff7a59",
  "private-school": "#9b59b6",
  "business-school": "#f5c542",
  "university-online": "#20c7ff",
};

export function AcademyCard({ academy, courseCount }: { academy: Academy; courseCount?: number }) {
  const accent = CATEGORY_COLOR[academy.category] ?? "#1166c8";

  return (
    <article className="premium-card flex h-full flex-col rounded-xl p-7 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          {academy.category.replaceAll("-", " ")}
        </span>
        {courseCount !== undefined && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-muted">
            {courseCount} courses
          </span>
        )}
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{academy.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{academy.description}</p>
      <p className="mt-4 text-sm font-medium text-ink border-t border-slate-100 pt-4">{academy.audience}</p>
      <ButtonLink href={getAcademyHref(academy)} variant="ink" className="mt-5 self-start px-4">
        View academy →
      </ButtonLink>
    </article>
  );
}
