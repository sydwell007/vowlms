import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/data";

export default async function CertificatePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const certificateId = `VOWLMS-${course.slug.toUpperCase().slice(0, 10)}-2026`;

  return (
    <main className="bg-slate-50 text-ink">
      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 card-shadow">
          <div className="rounded-lg border-2 border-[#f5c542] bg-[#fffdf6] p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1166c8]">Certificate of Completion</p>
            <h1 className="mt-6 text-4xl font-semibold">Amina Mokoena</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
              has successfully completed the VowLMS course
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold">{course.title}</h2>
            <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-white p-4">
                <p className="font-semibold">Completion date</p>
                <p className="mt-1 text-muted">13 June 2026</p>
              </div>
              <div className="rounded-md bg-white p-4">
                <p className="font-semibold">Certificate ID</p>
                <p className="mt-1 break-words text-muted">{certificateId}</p>
              </div>
              <div className="rounded-md bg-white p-4">
                <p className="font-semibold">Rewards</p>
                <p className="mt-1 text-muted">{course.rewards} points</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/api/certificates/generate?courseSlug=${course.slug}&format=pdf`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#06111f] px-5 text-sm font-semibold text-white">
              Download PDF
            </Link>
            <Link href="/opportunities" className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-ink">
              View opportunities
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
