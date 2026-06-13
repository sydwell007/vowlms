import Link from "next/link";
import type { Academy } from "@/types/lms";

export function AcademyCard({ academy }: { academy: Academy }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 text-ink card-shadow">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1166c8]">{academy.category.replaceAll("-", " ")}</p>
      <h3 className="mt-4 text-xl font-semibold">{academy.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{academy.description}</p>
      <p className="mt-5 text-sm font-semibold text-ink">{academy.audience}</p>
      <Link href={`/academies/${academy.slug}`} className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-[#06111f] px-4 text-sm font-semibold text-white transition hover:bg-[#0d2239]">
        View academy
      </Link>
    </article>
  );
}
