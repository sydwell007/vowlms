import Image from "next/image";
import Link from "next/link";
import { Award, BookOpen, Box, Clock3, GraduationCap, MoveRight } from "lucide-react";
import { ComingSoonOverlay } from "@/components/ui/ComingSoonOverlay";
import { formatCurrency } from "@/lib/format";
import { formatDuration } from "@/lib/course-content";
import { getComingSoonInfo } from "@/lib/academy-launch";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { getAcademyCourseImage } from "@/lib/visual-assets";
import type { CourseSummary } from "@/types/lms";

type Props = {
  course: CourseSummary;
  layout?: "grid" | "list";
  priority?: boolean;
};

export function CourseCard({ course, layout = "grid", priority = false }: Props) {
  const comingSoon = getComingSoonInfo(course.academyCategory);
  const accent = getAcademyAccentColor(course.academyCategory);
  const image = getAcademyCourseImage(course.academyCategory);
  const isList = layout === "list";

  return (
    <ComingSoonOverlay info={comingSoon}>
      <article
        className={`group premium-card h-full overflow-hidden rounded-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(6,17,31,0.12)] ${
          isList ? "grid md:grid-cols-[220px_1fr]" : "flex flex-col"
        }`}
      >
        <Link
          href={`/courses/${course.slug}`}
          aria-label={`View ${course.title}`}
          className={`relative block overflow-hidden bg-slate-100 ${isList ? "min-h-48 md:min-h-full" : "aspect-[16/9]"}`}
        >
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes={isList ? "(min-width: 768px) 220px, 100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111f]/64 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            {course.level}
          </span>
          <span className="absolute bottom-4 left-4 rounded-md bg-[#06111f]/88 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {formatCurrency(course.price)}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
            {course.academyName}
          </p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-ink">
            <Link href={`/courses/${course.slug}`} className="transition hover:text-[#1166c8]">
              {course.title}
            </Link>
          </h3>
          <p className={`mt-2 text-sm leading-6 text-muted ${isList ? "line-clamp-3" : "line-clamp-2"}`}>
            {course.description}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-slate-100 py-3 text-xs text-muted sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <BookOpen aria-hidden="true" className="h-4 w-4 text-[#1166c8]" />
              <span>{course.lessonCount} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 aria-hidden="true" className="h-4 w-4 text-[#1166c8]" />
              <span>{formatDuration(course.totalMinutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award aria-hidden="true" className="h-4 w-4 text-[#1166c8]" />
              <span>{course.rewards} points</span>
            </div>
          </dl>

          <div className="mt-auto flex items-end justify-between gap-4 pt-4">
            <div className="flex items-center gap-2 text-muted" aria-label="Course features">
              {course.hasCertificate ? <GraduationCap className="h-4 w-4" aria-label="Certificate included" /> : null}
              {course.hasAssessment ? <BookOpen className="h-4 w-4" aria-label="Assessment included" /> : null}
              {course.hasVRPractice ? <Box className="h-4 w-4" aria-label="VR practice included" /> : null}
            </div>
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#06111f] px-4 text-sm font-semibold text-white transition hover:bg-[#1166c8]"
            >
              View course
              <MoveRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </ComingSoonOverlay>
  );
}
