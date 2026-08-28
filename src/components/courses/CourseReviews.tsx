"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Star } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import type { CourseReviewSummary } from "@/types/lms";

type Props = {
  courseSlug: string;
  accentColor: string;
};

const EMPTY_SUMMARY: CourseReviewSummary = {
  averageRating: null,
  totalReviews: 0,
  recommendationPercent: null,
  distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  reviews: [],
};

async function requestReviews(courseSlug: string) {
  const response = await fetch(`/api/courses/${encodeURIComponent(courseSlug)}/reviews`, {
    cache: "no-store",
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Reviews could not be loaded.");
  return payload.data as CourseReviewSummary;
}

export function CourseReviews({ courseSlug, accentColor }: Props) {
  const session = useSession();
  const [summary, setSummary] = useState<CourseReviewSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setSummary(await requestReviews(courseSlug));
      setError(null);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Reviews could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    let active = true;
    requestReviews(courseSlug)
      .then((data) => {
        if (active) {
          setSummary(data);
          setError(null);
        }
      })
      .catch((reviewError) => {
        if (active) setError(reviewError instanceof Error ? reviewError.message : "Reviews could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseSlug]);

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (rating < 1) {
      setError("Choose a rating before submitting your review.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${encodeURIComponent(courseSlug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ rating, feedback, wouldRecommend }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Your review could not be saved.");

      setMessage("Your review has been saved.");
      setFeedback("");
      await loadReviews();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Your review could not be saved.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-muted" role="status">
        <LoaderCircle aria-hidden="true" className="mr-2 h-5 w-5 animate-spin" />
        Loading learner reviews
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Learner rating</p>
        <div className="mt-2 flex items-end gap-2">
          <strong className="text-5xl font-semibold text-ink">
            {summary.averageRating === null ? "-" : summary.averageRating.toFixed(1)}
          </strong>
          <span className="pb-1 text-sm text-muted">out of 5</span>
        </div>
        <div className="mt-3 flex gap-1" aria-label={summary.averageRating === null ? "Not yet rated" : `${summary.averageRating.toFixed(1)} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              aria-hidden="true"
              className="h-5 w-5"
              fill={summary.averageRating !== null && star <= Math.round(summary.averageRating) ? accentColor : "transparent"}
              color={accentColor}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">
          {summary.totalReviews === 0 ? "No verified learner reviews yet." : `${summary.totalReviews} verified learner review${summary.totalReviews === 1 ? "" : "s"}`}
        </p>
        {summary.recommendationPercent !== null ? (
          <p className="mt-2 text-sm font-semibold text-ink">{summary.recommendationPercent}% would recommend this course</p>
        ) : null}

        <div className="mt-5 space-y-2">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = summary.distribution[String(score) as keyof typeof summary.distribution];
            const percent = summary.totalReviews ? (count / summary.totalReviews) * 100 : 0;
            return (
              <div key={score} className="grid grid-cols-[20px_1fr_28px] items-center gap-2 text-xs text-muted">
                <span>{score}</span>
                <span className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <span className="block h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: accentColor }} />
                </span>
                <span className="text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        {session.status === "authenticated" && session.user.role === "learner" ? (
          <form onSubmit={submitReview} className="border-b border-slate-200 pb-7">
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Rate this course</legend>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    aria-pressed={rating === star}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-slate-100"
                  >
                    <Star aria-hidden="true" className="h-6 w-6" fill={star <= rating ? accentColor : "transparent"} color={accentColor} />
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-ink">
              Share useful feedback
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                maxLength={1500}
                rows={4}
                placeholder="What helped you learn, and what could be clearer?"
                className="resize-y rounded-md border border-slate-200 bg-white p-3 font-normal text-ink"
              />
            </label>
            <label className="mt-4 flex items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={wouldRecommend}
                onChange={(event) => setWouldRecommend(event.target.checked)}
                className="h-4 w-4 accent-[#1166c8]"
              />
              I would recommend this course
            </label>
            {message ? <p className="mt-4 text-sm font-medium text-emerald-700" role="status">{message}</p> : null}
            {error ? <p className="mt-4 text-sm font-medium text-red-700" role="alert">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="mt-5 min-h-11 rounded-md bg-[#06111f] px-5 text-sm font-semibold text-white hover:bg-[#0d2239] disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Submit review"}
            </button>
          </form>
        ) : session.status === "unauthenticated" ? (
          <div className="border-b border-slate-200 pb-7 text-sm text-muted">
            <Link href={`/auth/signin?returnTo=${encodeURIComponent(`/courses/${courseSlug}`)}`} className="font-semibold text-brand-blue hover:underline">
              Sign in
            </Link>{" "}
            to review a course you are enrolled in.
          </div>
        ) : null}

        {error && summary.reviews.length === 0 ? <p className="mt-6 text-sm text-red-700" role="alert">{error}</p> : null}
        {summary.reviews.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {summary.reviews.map((review) => (
              <article key={review.id} className="py-6 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{review.learnerName}</p>
                    <p className="mt-1 text-xs text-muted">Verified learner</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <span className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} aria-hidden="true" className="h-4 w-4" fill={star <= review.rating ? accentColor : "transparent"} color={accentColor} />
                      ))}
                    </span>
                    <time dateTime={review.createdAt}>{new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(review.createdAt))}</time>
                  </div>
                </div>
                {review.feedback ? <p className="mt-4 text-sm leading-6 text-muted">{review.feedback}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="py-8">
            <h3 className="font-semibold text-ink">Be the first to share a verified review</h3>
            <p className="mt-2 text-sm leading-6 text-muted">Enrolled learners can add feedback after starting the course.</p>
          </div>
        )}
      </div>
    </div>
  );
}
