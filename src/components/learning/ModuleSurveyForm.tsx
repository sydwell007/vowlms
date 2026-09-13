"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

type Props = {
  lessonSlug: string;
  alreadyCompleted: boolean;
  onSubmitted: () => void;
};

/**
 * The real "Rate this Module" survey — replaces what used to be a broken
 * placeholder lesson ("Content is being loaded..."). Submitting IS how this
 * lesson gets marked complete (see /api/surveys/submit, which marks
 * progress in the same transaction as saving the response) — there's no
 * separate "Mark complete" button alongside it.
 */
export function ModuleSurveyForm({ lessonSlug, alreadyCompleted, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // `alreadyCompleted` starts false and flips true asynchronously (the
  // parent reads it from localStorage after mount) — reading it fresh every
  // render, rather than only capturing it once via useState's initial
  // value, is what makes a page reload correctly show the thank-you state
  // immediately instead of an empty form.
  const [justSubmitted, setJustSubmitted] = useState(false);
  const submitted = alreadyCompleted || justSubmitted;

  async function handleSubmit() {
    if (rating < 1) {
      toast.error("Please choose a star rating first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ lessonSlug, rating, liked: liked || null, improve: improve || null }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Could not submit your feedback.");
      setJustSubmitted(true);
      toast.success("Thanks for your feedback!");
      onSubmitted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 premium-card rounded-xl p-6 text-center">
        <p className="mb-2 text-3xl">🙏</p>
        <h2 className="mb-1 text-lg font-semibold text-ink">Thanks for rating this module!</h2>
        <p className="text-sm text-muted">Your feedback helps us keep improving this course.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 premium-card rounded-xl p-6">
      <h2 className="mb-1 text-lg font-semibold text-ink">Rate this module</h2>
      <p className="mb-4 text-sm text-muted">Your honest feedback helps us improve this course for future learners.</p>

      <div role="radiogroup" aria-label="Star rating" className="mb-5 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1"
          >
            <Star
              aria-hidden="true"
              className={`h-8 w-8 transition ${(hoverRating || rating) >= star ? "fill-gold text-gold" : "fill-none text-slate-300"}`}
            />
          </button>
        ))}
      </div>

      <label className="mb-4 block">
        <span className="text-sm font-semibold text-ink">
          What worked well for you? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          value={liked}
          onChange={(e) => setLiked(e.target.value)}
          rows={3}
          maxLength={2000}
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1166c8] focus:outline-none"
          placeholder="e.g. the real-world examples, the pace, the video lessons..."
        />
      </label>

      <label className="mb-5 block">
        <span className="text-sm font-semibold text-ink">
          What could be improved? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          rows={3}
          maxLength={2000}
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1166c8] focus:outline-none"
          placeholder="e.g. more practice questions, clearer explanations..."
        />
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || rating < 1}
        className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit feedback"}
      </button>
    </div>
  );
}
