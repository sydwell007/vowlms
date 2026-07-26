import { ButtonLink } from "@/components/ui/ButtonLink";
import { ComingSoonOverlay } from "@/components/ui/ComingSoonOverlay";
import { formatCurrency } from "@/lib/format";
import { getComingSoonInfo } from "@/lib/academy-launch";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import type { CourseSummary } from "@/types/lms";

export function CourseCard({ course }: { course: CourseSummary }) {
  const comingSoon = getComingSoonInfo(course.academyCategory);
  const accent = getAcademyAccentColor(course.academyCategory);

  return (
    <ComingSoonOverlay info={comingSoon}>
      <article
        className="premium-card flex h-full flex-col rounded-xl border-l-4 p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
        style={{ borderLeftColor: accent }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]">{course.level}</span>
          <span className="rounded-full bg-[#fff5d1] px-3 py-1 text-xs font-semibold text-[#8a6100]">{formatCurrency(course.price)}</span>
          {course.hasCertificate ? (
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-muted" title="Awards a certificate on completion">
              🎓
            </span>
          ) : null}
        </div>
        <h3 className="mt-5 text-xl font-semibold leading-snug line-clamp-2">{course.title}</h3>
        <p className="mt-2 text-sm font-medium" style={{ color: accent }}>{course.academyName}</p>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted">{course.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="premium-card-soft rounded-lg p-3">
            <p className="font-semibold text-ink">{course.duration}</p>
            <p className="mt-1 text-xs text-muted">Duration</p>
          </div>
          <div className="premium-card-soft rounded-lg p-3">
            <p className="font-semibold text-ink">Earn {course.rewards} Ʋ</p>
            <p className="mt-1 text-xs text-muted">VowRewards</p>
          </div>
        </div>
        <ButtonLink href={`/courses/${course.slug}`} variant="ink" className="mt-6 w-full">
          Open course
        </ButtonLink>
      </article>
    </ComingSoonOverlay>
  );
}
