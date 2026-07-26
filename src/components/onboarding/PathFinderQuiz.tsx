"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { AcademyBadge } from "@/components/ui/AcademyBadge";
import { getQuizRecommendation, type QuizAnswers } from "@/lib/goal-routing";
import { getAcademies } from "@/lib/data";
import { getAcademyAccentColor } from "@/lib/academy-colors";

type Question = {
  key: keyof QuizAnswers;
  prompt: string;
  options: { id: string; label: string }[];
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
      { id: "light", label: "1–2 hours a week" },
      { id: "moderate", label: "A few hours a day" },
      { id: "fulltime", label: "I want to finish fast — full time" },
      { id: "flexible", label: "Flexible — whenever I can" },
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

export function PathFinderQuiz({
  onComplete,
}: {
  onComplete: (answers: QuizAnswers, result: ReturnType<typeof getQuizRecommendation>) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [result, setResult] = useState<ReturnType<typeof getQuizRecommendation> | null>(null);

  const question = questions[step];

  function choose(optionId: string) {
    const next = { ...answers, [question.key]: optionId } as Partial<QuizAnswers>;
    setAnswers(next);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    const complete = next as QuizAnswers;
    const recommendation = getQuizRecommendation(complete);
    setResult(recommendation);
    onComplete(complete, recommendation);
  }

  if (result) {
    const academy = getAcademies().find((a) => a.category === result.academyCategory);
    const accent = getAcademyAccentColor(result.academyCategory);

    return (
      <div className="premium-card rounded-xl p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
          Based on your answers, we recommend
        </p>
        <div className="mt-3">
          <AcademyBadge name={academy?.name ?? "GoalVow Academy"} category={result.academyCategory} />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {result.courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/courses?academy=${result.academyCategory}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0e2440] bg-[linear-gradient(180deg,#0d2239_0%,#06111f_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(6,17,31,0.16)] transition hover:border-[#163657]"
          >
            Start my recommended path →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card rounded-xl p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        Question {step + 1} of {questions.length}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-ink">{question.prompt}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => choose(option.id)}
            className="premium-card-soft rounded-lg p-4 text-left text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-[#1166c8]/30"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
