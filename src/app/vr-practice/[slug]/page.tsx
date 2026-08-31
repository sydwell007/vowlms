import { notFound, redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VRStudio } from "@/components/vr/VRStudio";
import { getAcademyBySlug, getAcademyHref, getEnrollableCourseSlugs, getVRPracticeBySlug } from "@/lib/data";
import { BridgeError } from "@/lib/bridge";
import { hasActiveCourseEnrollment } from "@/lib/course-access";

export default async function VRPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getVRPracticeBySlug(slug);

  if (!result) {
    notFound();
  }

  const { practice, course } = result;
  try {
    if (!await hasActiveCourseEnrollment(getEnrollableCourseSlugs(course.slug))) {
      redirect(`/courses/${course.slug}?enrolment=required`);
    }
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) {
      redirect(`/auth/signin?returnTo=${encodeURIComponent(`/vr-practice/${slug}`)}`);
    }
    throw error;
  }

  const academy = getAcademyBySlug(course.academySlug);

  return (
    <main>
      <section className="premium-section-dark surface-grid py-12 text-white md:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumb
            tone="dark"
            items={[
              { label: "Academies", href: "/academies" },
              ...(academy ? [{ label: academy.name, href: getAcademyHref(academy) }] : []),
              { label: course.title, href: `/courses/${course.slug}` },
              { label: "VR Practice" },
            ]}
          />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold">{course.title}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">VR Practice</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">
            WebXR-ready practice area for future immersive simulations, facilitator scoring, and headset-based learning hubs.
          </p>
          <div className="mt-8">
            <VRStudio practice={practice} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/lesson/${practice.lessonSlug}`} variant="secondary">
              ← Back to course
            </ButtonLink>
            <ButtonLink href={`/results/${course.slug}`}>
              Continue to results
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
