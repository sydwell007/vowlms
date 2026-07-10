import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/data";

export const metadata = {
  title: "Course Assignments",
  robots: { index: false, follow: false },
};

export default async function AssignmentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href={`/courses/${course.slug}`} className="transition hover:text-[#1166c8]">
            {course.title}
          </Link>
          <span aria-hidden="true" className="px-2">/</span>
          <span>Assignments</span>
        </nav>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-8 shadow-[0_18px_48px_rgba(6,17,31,0.06)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Course activity</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Assignments</h1>
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-ink">No active assignments</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
              Your facilitator will publish assignment instructions and submission dates here when they are available.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`/courses/${course.slug}`} className="rounded-lg bg-[#06111f] px-5 py-3 text-sm font-semibold text-white">
                Return to course
              </Link>
              <Link href="/support" className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink">
                Contact VowSupport
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
