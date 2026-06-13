import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCourseBySlug } from "@/lib/data";

export default async function CertificatePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const certificateId = `VOWLMS-${course.slug.toUpperCase().slice(0, 10)}-2026`;

  return (
    <main className="premium-page">
      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="premium-card rounded-xl p-5">
          <div className="rounded-xl border-2 border-[#f5c542] bg-[linear-gradient(180deg,#fffdf6_0%,#fff7e2_100%)] p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1166c8]">Certificate of Completion</p>
            <h1 className="mt-6 text-4xl font-semibold">Amina Mokoena</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
              has successfully completed the VowLMS course
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold">{course.title}</h2>
            <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
              <div className="premium-card rounded-lg p-4">
                <p className="font-semibold">Completion date</p>
                <p className="mt-1 text-muted">13 June 2026</p>
              </div>
              <div className="premium-card rounded-lg p-4">
                <p className="font-semibold">Certificate ID</p>
                <p className="mt-1 break-words text-muted">{certificateId}</p>
              </div>
              <div className="premium-card rounded-lg p-4">
                <p className="font-semibold">Rewards</p>
                <p className="mt-1 text-muted">{course.rewards} points</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/api/certificates/generate?courseSlug=${course.slug}&format=pdf`} variant="ink">
              Download PDF
            </ButtonLink>
            <ButtonLink href="/opportunities" variant="outline">
              View opportunities
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
