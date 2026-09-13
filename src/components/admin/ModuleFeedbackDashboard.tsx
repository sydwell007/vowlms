"use client";

import { useEffect, useState } from "react";

type ModuleRow = {
  lesson_id: string;
  lesson_slug: string;
  course_slug: string;
  course_title: string;
  module_title: string;
  response_count: number;
  average_rating: number | null;
  low_rating_count: number;
};

type FeedbackRow = {
  course_title: string;
  module_title: string;
  rating: number;
  liked: string | null;
  improve: string | null;
  updated_at: string;
};

type Summary = {
  modules: ModuleRow[];
  flagged: { courseTitle: string; moduleTitle: string; averageRating: number | null; responseCount: number; lowRatingCount: number }[];
  recentLowRatingFeedback: FeedbackRow[];
};

export function ModuleFeedbackDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/surveys/summary", { cache: "no-store", credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Could not load survey summary.");
        return json.data as Summary;
      })
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load survey summary.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  if (!summary) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" aria-hidden="true" />;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Needs attention</h2>
        {summary.flagged.length === 0 ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            No module is currently flagged — every rated module is averaging 3.5★ or higher with no 1–2★ ratings.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.flagged.map((f) => (
              <div key={`${f.courseTitle}-${f.moduleTitle}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-700">{f.courseTitle}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{f.moduleTitle}</p>
                <p className="mt-2 text-2xl font-bold text-ink">
                  {f.averageRating !== null ? `${f.averageRating.toFixed(1)}★` : "—"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {f.responseCount} response{f.responseCount === 1 ? "" : "s"}
                  {f.lowRatingCount > 0 ? ` · ${f.lowRatingCount} rated 1–2★` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Recent 1–3★ comments</h2>
        {summary.recentLowRatingFeedback.length === 0 ? (
          <p className="text-sm text-muted">No written feedback on a low rating yet.</p>
        ) : (
          <div className="space-y-3">
            {summary.recentLowRatingFeedback.map((f, i) => (
              <div key={i} className="premium-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">
                    {f.course_title} — {f.module_title}
                  </p>
                  <p className="text-sm font-bold text-amber-600">{f.rating}★</p>
                </div>
                {f.liked ? <p className="mt-2 text-sm text-ink/80"><span className="font-semibold">Liked:</span> {f.liked}</p> : null}
                {f.improve ? <p className="mt-1 text-sm text-ink/80"><span className="font-semibold">Improve:</span> {f.improve}</p> : null}
                <p className="mt-2 text-xs text-muted">{new Date(f.updated_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Every module</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              <tr>
                <th className="px-4 py-2.5">Course</th>
                <th className="px-4 py-2.5">Module</th>
                <th className="px-4 py-2.5">Avg. rating</th>
                <th className="px-4 py-2.5">Responses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.modules.map((m) => (
                <tr key={m.lesson_id}>
                  <td className="px-4 py-2.5 text-ink">{m.course_title}</td>
                  <td className="px-4 py-2.5 text-ink">{m.module_title}</td>
                  <td className="px-4 py-2.5 text-ink">{m.average_rating !== null ? `${m.average_rating.toFixed(1)}★` : "—"}</td>
                  <td className="px-4 py-2.5 text-ink">{m.response_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
