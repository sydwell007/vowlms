"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Assessment, Course } from "@/types/lms";

type Props = { assessment: Assessment; course: Course };
type Phase = "intro" | "quiz" | "results";

export function AssessmentPlayer({ assessment, course }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = assessment.questions;
  const total = questions.length;

  function selectAnswer(questionId: string, option: string) {
    setAnswers((a) => ({ ...a, [questionId]: option }));
  }

  function submit() {
    setSubmitted(true);
    setPhase("results");

    // Persist attempt to localStorage
    const attempts = JSON.parse(localStorage.getItem("vowlms_assessments") ?? "{}");
    const score = calculateScore();
    attempts[assessment.slug] = {
      slug: assessment.slug,
      courseSlug: course.slug,
      score,
      passed: score >= assessment.passMark,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("vowlms_assessments", JSON.stringify(attempts));

    // Update course progress
    const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
    if (!progress[course.slug]) progress[course.slug] = { completedLessons: [], assessmentPassed: false };
    if (score >= assessment.passMark) {
      progress[course.slug].assessmentPassed = true;
    }
    localStorage.setItem("vowlms_progress", JSON.stringify(progress));
  }

  const calculateScore = useCallback(() => {
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.answer) correct++;
    }
    return Math.round((correct / total) * 100);
  }, [answers, questions, total]);

  const score = submitted ? calculateScore() : 0;
  const passed = score >= assessment.passMark;
  const answeredCount = Object.keys(answers).length;

  if (phase === "intro") {
    return (
      <main className="premium-page">
        <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="premium-card rounded-2xl p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1166c8]/10 text-2xl">
              📝
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{course.title}</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{assessment.title}</h1>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="premium-card-soft rounded-xl p-4">
                <p className="text-2xl font-semibold text-ink">{total}</p>
                <p className="mt-1 text-xs text-muted">Questions</p>
              </div>
              <div className="premium-card-soft rounded-xl p-4">
                <p className="text-2xl font-semibold text-ink">{assessment.passMark}%</p>
                <p className="mt-1 text-xs text-muted">Pass mark</p>
              </div>
              <div className="premium-card-soft rounded-xl p-4">
                <p className="text-2xl font-semibold text-ink">20</p>
                <p className="mt-1 text-xs text-muted">Minutes</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-muted">
              Answer all questions, then submit to see your score. You can retake this assessment if you don&apos;t pass first time.
            </p>
            <button
              onClick={() => setPhase("quiz")}
              className="mt-8 w-full rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]"
            >
              Start assessment
            </button>
            <Link href={`/courses/${course.slug}`} className="mt-3 block text-sm text-muted hover:text-ink transition">
              ← Back to course
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "results") {
    return (
      <main className="premium-page">
        <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 lg:px-8 space-y-5">
          <div className={`rounded-2xl p-8 text-center ${passed ? "bg-gradient-to-br from-emerald-50 to-[#f0fdf4] border border-emerald-200" : "bg-gradient-to-br from-red-50 to-[#fff5f5] border border-red-200"}`}>
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black ${passed ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
              {passed ? "✓" : "✗"}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{assessment.title}</p>
            <h2 className="mt-3 text-4xl font-bold text-ink">{score}%</h2>
            <p className={`mt-2 text-lg font-semibold ${passed ? "text-emerald-700" : "text-red-700"}`}>
              {passed ? "Congratulations — you passed!" : "Not quite — try again"}
            </p>
            <p className="mt-2 text-sm text-slate-600">Pass mark: {assessment.passMark}% · Your score: {score}%</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {passed ? (
                <>
                  <Link href={`/results/${course.slug}`}
                    className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]">
                    View results & certificate
                  </Link>
                  <Link href={`/vr-practice/${course.vrPractices[0]?.slug ?? ""}`}
                    className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50">
                    Open VR practice
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => { setPhase("intro"); setAnswers({}); setSubmitted(false); setCurrent(0); }}
                    className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]">
                    Retry assessment
                  </button>
                  <Link href={`/courses/${course.slug}`}
                    className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50">
                    Review course
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Answer review */}
          <div className="premium-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Answer review</h3>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const selected = answers[q.id];
                const correct = selected === q.answer;
                return (
                  <div key={q.id} className={`rounded-xl border p-4 ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                    <p className="text-sm font-semibold text-ink">{i + 1}. {q.prompt}</p>
                    <div className="mt-3 grid gap-2">
                      {q.options.map((opt) => {
                        const isCorrect = opt === q.answer;
                        const isSelected = opt === selected;
                        return (
                          <div key={opt} className={`rounded-lg px-3 py-2 text-sm font-medium ${isCorrect ? "bg-emerald-500 text-white" : isSelected && !isCorrect ? "bg-red-500 text-white" : "bg-white/60 text-slate-600"}`}>
                            {isCorrect ? "✓ " : isSelected && !isCorrect ? "✗ " : ""}{opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Quiz phase
  const question = questions[current];
  const progress = ((current + 1) / total) * 100;

  return (
    <main className="premium-page">
      <section className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-[#1166c8]">Question {current + 1} of {total}</p>
            <p className="text-sm text-muted">{answeredCount}/{total} answered</p>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#1166c8] to-[#20c7ff] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="premium-card rounded-2xl p-8">
          <fieldset>
            <legend className="text-xl font-semibold text-ink leading-8">{question.prompt}</legend>
            <div className="mt-6 grid gap-3">
              {question.options.map((option) => {
                const selected = answers[question.id] === option;
                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${selected ? "border-[#1166c8] bg-[#1166c8]/8" : "border-slate-200 bg-white hover:border-[#1166c8]/40 hover:bg-slate-50"}`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${selected ? "border-[#1166c8] bg-[#1166c8]" : "border-slate-300"}`}>
                      {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={selected}
                      onChange={() => selectAnswer(question.id, option)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-ink">{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50 disabled:opacity-40"
            >
              ← Previous
            </button>

            {current < total - 1 ? (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                className="rounded-lg bg-[#06111f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d2239]"
              >
                Next question →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={answeredCount < total}
                className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:opacity-40"
              >
                Submit assessment
              </button>
            )}
          </div>

          {current === total - 1 && answeredCount < total && (
            <p className="mt-3 text-center text-xs text-muted">
              Answer all {total} questions to submit. You&apos;ve answered {answeredCount}/{total}.
            </p>
          )}
        </div>

        {/* Question navigator */}
        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const answered = Boolean(answers[q.id]);
            return (
              <button
                key={q.id}
                onClick={() => setCurrent(i)}
                className={`h-9 w-9 rounded-lg text-xs font-semibold transition ${i === current ? "bg-[#06111f] text-white" : answered ? "bg-[#1166c8]/15 text-[#1166c8]" : "bg-slate-100 text-muted hover:bg-slate-200"}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
