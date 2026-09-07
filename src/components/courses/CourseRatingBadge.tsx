"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  COURSE_REVIEW_SUMMARIES_CHANGED,
  getCourseReviewSummaries,
  type CourseRatingSummary,
} from "@/lib/course-review-summaries-client";

type Props = {
  courseSlug: string;
  /** "card" = compact inline line for the catalogue card. "hero" = matches the
   * light-on-dark trust-badge row on the course landing page. */
  variant?: "card" | "hero";
  className?: string;
};

/**
 * Renders nothing until a course has at least one real review — a course
 * with zero reviews looks identical to how the card/hero already looks
 * today, so this never shows an empty "0.0 ★ (0)" placeholder. The moment
 * real reviews land, the badge appears on its own, everywhere it's used.
 */
export function CourseRatingBadge({ courseSlug, variant = "card", className = "" }: Props) {
  const [summary, setSummary] = useState<CourseRatingSummary | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      getCourseReviewSummaries()
        .then((summaries) => {
          if (active) setSummary(summaries[courseSlug] ?? { averageRating: null, totalReviews: 0 });
        })
        .catch(() => undefined);
    };

    const handleChange = (event: Event) => {
      const changedSlug = (event as CustomEvent<{ courseSlug?: string }>).detail?.courseSlug;
      if (changedSlug !== courseSlug) return;
      setSummary(null);
      load();
    };

    load();
    window.addEventListener(COURSE_REVIEW_SUMMARIES_CHANGED, handleChange);
    return () => {
      active = false;
      window.removeEventListener(COURSE_REVIEW_SUMMARIES_CHANGED, handleChange);
    };
  }, [courseSlug]);

  if (!summary || summary.totalReviews === 0 || summary.averageRating === null) return null;

  const rating = summary.averageRating.toFixed(1);
  const label = `Rated ${rating} out of 5 from ${summary.totalReviews} learner review${summary.totalReviews === 1 ? "" : "s"}`;

  if (variant === "hero") {
    return (
      <span className={`flex items-center gap-1.5 ${className}`} aria-label={label}>
        <Star aria-hidden="true" className="h-4 w-4 fill-gold text-gold" />
        <span className="font-semibold text-white">{rating}</span>
        <span className="text-white/60">({summary.totalReviews.toLocaleString()})</span>
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-1 text-xs ${className}`} aria-label={label}>
      <Star aria-hidden="true" className="h-3.5 w-3.5 fill-gold text-gold" />
      <span className="font-semibold text-ink">{rating}</span>
      <span className="text-muted">({summary.totalReviews.toLocaleString()})</span>
    </span>
  );
}
