"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoveRight, RotateCcw } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { AcademyBadge } from "@/components/ui/AcademyBadge";
import { getQuizRecommendation, type QuizAnswers } from "@/lib/goal-routing";
import { getAcademies } from "@/lib/data";
import { getAcademyAccentColor } from "@/lib/academy-colors";

const DRAFT_STORAGE_KEY = "vowlms_path_finder_draft";

type Question = {
  key: keyof QuizAnswers;
  prompt: string;
  options: { id: string; label: string }[];
};

type QuizDraft = {
  step: number;
  answers: Partial<QuizAnswers>;
};

const questions: Question[] = [
  {
    key: "q1",
    prompt: "What is your current situation?",
    options: [
      { id: "unemployed", label: "I'm unemployed and looking for work" },
      { id: "employed", label: "I'm employed and want to grow" },
      { id: "business", label: "I want to start my own business" },
      { id: "student", label: "I'm a student looking for skills" },
    ],
  },
  {
    key: "q2",
    prompt: "How much time can you commit to learning?",
    options: [
      { id: "light", label: "1-2 hours a week" },
      { id: "moderate", label: "A few hours a day" },
      { id: "fulltime", label: "I want to finish fast, full time" },
      { id: "flexible", label: "Flexible, whenever I can" },
    ],
  },
  {
    key: "q3",
    prompt: "Do you prefer working with your hands or in an office?",
    options: [
      { id: "hands-on", label: "Hands-on / practical work" },
      { id: "office", label: "Office / desk / admin work" },
      { id: "mixed", label: "A mix of both" },
      { id: "people", label: "I work with people / customers" },
    ],
  },
  {
    key: "q4",
    prompt: "What matters most to you right now?",
    options: [
      { id: "get-job", label: "Getting a job as fast as possible" },
      { id: "certificate", label: "Earning a formal certificate" },
      { id: "career", label: "Building long-term career skills" },
      { id: "income", label: "Starting my own income stream" },
    ],
  },
];

function readDraft(): QuizDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuizDraft>;
    if (typeof parsed.step !== "number" || !parsed.answers || typeof parsed.answers !== "object") return null;
    return {
      step: Math.min(Math.max(parsed.step, 0), questions.length - 1),
      answers: parsed.answers,
    };
  } catch {
    return null;
  }
}

export function PathFinderQuiz({
  onComplete,
  onClearSavedProfile,
}: {
  onComplete: (answers: QuizAnswers, result: ReturnType<typeof getQuizRecommendation>) => void;
  onClearSavedProfile: () => void;
}) {
  const [initialDraft] = useState(readDraft);
  const [step, setStep] = useState(initialDraft?.step ?? 0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(initialDraft?.answers ?? {});
  const [result, setResult] = useState<ReturnType<typeof getQuizRecommendation> | null>(null);

  const question = questions[step];

  function persistDraft(nextStep: number, nextAnswers: Partial<QuizAnswers>) {
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ step: nextStep, answers: nextAnswers }));
    } catch {
      // The quiz remains usable in memory when local storage is unavailable.
    }
  }

  function clearDraft() {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Private browsing can make local storage unavailable.
    }
  }

  function choose(optionId: string) {
    const next = { ...answers, [question.key]: optionId } as Partial<QuizAnswers>;
    setAnswers(next);

    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      persistDraft(nextStep, next);
      return;
    }

    const complete = next as QuizAnswers;
    const recommendation = getQuizRecommendation(complete);
    clearDraft();
    setResult(recommendation);
    onComplete(complete, recommendation);
  }

  function goBack() {
    const previousStep = Math.max(0, step - 1);
    setStep(previousStep);
    persistDraft(previousStep, answers);
  }

  function restart() {
    clearDraft();
    onClearSavedProfile();
    setAnswers({});
    setResult(null);
    setStep(0);
  }

  if (result) {
    const academy = getAcademies().find((item) => item.category === result.academyCategory);
    const accent = getAcademyAccentColor(result.academyCategory);

    return (
      <section aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
          Based on your answers, we recommend
        </p>
        <div className="mt-3">
          <AcademyBadge name={academy?.name ?? "GoalVow Academy"} category={result.academyCategory} />
        </div>
        <div className="mt-5 max-w-3xl border-l-4 border-[#1166c8] bg-[#f5f9ff] px-5 py-4">
          <h3 className="text-base font-semibold text-ink">Why this path</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{result.reason}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{result.selectionReason}</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {result.courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/courses?academy=${result.academyCategory}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#0e2440] bg-[linear-gradient(180deg,#0d2239_0%,#06111f_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(6,17,31,0.16)] transition hover:border-[#163657]"
          >
            Start my recommended path
            <MoveRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-[#1166c8]/30"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Change my answers
          </button>
        </div>
      </section>
    );
  }

  const completion = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="premium-card rounded-xl p-8">
      <div className="flex items-center justify-between gap-4">
        <p id="path-finder-progress-label" className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          Question {step + 1} of {questions.length}
        </p>
        <span className="text-xs font-medium text-muted">{completion}%</span>
      </div>
      <progress
        value={step + 1}
        max={questions.length}
        aria-labelledby="path-finder-progress-label"
        className="mt-3 h-2 w-full accent-[#1166c8]"
      />
      <h3 className="mt-4 text-2xl font-semibold text-ink">{question.prompt}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={answers[question.key] === option.id}
            onClick={() => choose(option.id)}
            className="premium-card-soft min-h-14 rounded-lg p-4 text-left text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-[#1166c8]/30"
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-[#1166c8] disabled:cursor-not-allowed disabled:text-slate-400"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={restart}
          className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Restart
        </button>
      </div>
    </div>
  );
}
