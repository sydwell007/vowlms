import Link from "next/link";
import { formatCurrency, getAcademyBySlug } from "@/lib/data";
import type { Course } from "@/types/lms";

export function CourseCard({ course }: { course: Course }) {
  const academy = getAcademyBySlug(course.academySlug);

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 text-ink card-shadow">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]">{course.level}</span>
        <span className="rounded-full bg-[#fff5d1] px-3 py-1 text-xs font-semibold text-[#8a6100]">{formatCurrency(course.price)}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold">{course.title}</h3>
      <p className="mt-2 text-sm font-medium text-[#1166c8]">{academy?.name}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{course.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="font-semibold text-ink">{course.duration}</p>
          <p className="mt-1 text-xs text-muted">Duration</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="font-semibold text-ink">{course.rewards} pts</p>
          <p className="mt-1 text-xs text-muted">Rewards</p>
        </div>
      </div>
      <Link href={`/courses/${course.slug}`} className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-[#06111f] px-4 text-sm font-semibold text-white transition hover:bg-[#0d2239]">
        Open course
      </Link>
    </article>
  );
}
