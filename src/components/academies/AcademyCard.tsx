import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAcademyHref } from "@/lib/data";
import type { Academy } from "@/types/lms";

export function AcademyCard({ academy }: { academy: Academy }) {
  return (
    <article className="premium-card flex h-full flex-col rounded-xl p-7 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1166c8]">{academy.category.replaceAll("-", " ")}</p>
      <h3 className="mt-4 text-2xl font-semibold">{academy.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{academy.description}</p>
      <p className="mt-5 text-sm font-semibold leading-6 text-ink">{academy.audience}</p>
      <ButtonLink href={getAcademyHref(academy)} variant="ink" className="mt-7 self-start px-4">
        View academy
      </ButtonLink>
    </article>
  );
}
