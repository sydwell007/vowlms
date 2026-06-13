import Link from "next/link";
import { notFound } from "next/navigation";
import { VRStudio } from "@/components/vr/VRStudio";
import { getVRPracticeBySlug } from "@/lib/data";

export default async function VRPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getVRPracticeBySlug(slug);

  if (!result) {
    notFound();
  }

  const { practice, course } = result;

  return (
    <main>
      <section className="surface-grid py-12 text-white md:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{course.title}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">VR Practice</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">
            WebXR-ready practice area for future immersive simulations, facilitator scoring, and headset-based learning hubs.
          </p>
          <div className="mt-8">
            <VRStudio practice={practice} />
          </div>
          <Link href={`/results/${course.slug}`} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-5 text-sm font-semibold text-[#07101d]">
            Save demo score
          </Link>
        </div>
      </section>
    </main>
  );
}
