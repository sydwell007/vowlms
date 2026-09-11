"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Lightbulb, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CelebrationOverlay } from "@/components/learning/CelebrationOverlay";
import { openThandiPanel } from "@/lib/thandi/panel-store";
import { useWalletBalance } from "@/lib/rewards/useWalletBalance";
import type { Assessment, AssessmentQuestion, Course } from "@/types/lms";

type Props = {
  assessment: Assessment;
  course: Course;
  academyName?: string;
  academyHref?: string;
};
type Phase = "intro" | "quiz" | "results";

type ServerResult = { score: number; passed: boolean; passMark: number };
type CertificateState = "idle" | "pending" | "ready" | "incomplete" | "error";

const RETRY_COST_VOWR = 50;

// ── Shuffle helper — stable per question via useMemo, not re-rolled on every render ──
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Per-type scoring ──────────────────────────────────────────────────────────
function isAnswerCorrect(question: AssessmentQuestion, rawAnswer: string | undefined): boolean {
  if (!rawAnswer) return false;
  switch (question.type) {
    case "true-false":
      return rawAnswer === question.answer;
    case "fill-blank": {
      const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
      const accepted = [question.answer, ...(question.acceptableAnswers ?? [])].map(normalize);
      return accepted.includes(normalize(rawAnswer));
    }
    case "matching": {
      try {
        const picked = JSON.parse(rawAnswer) as Record<string, string>;
        return question.pairs.every((pair, i) => picked[String(i)] === pair.right);
      } catch {
        return false;
      }
    }
    case "ordering": {
      try {
        const order = JSON.parse(rawAnswer) as string[];
        return order.length === question.items.length && order.every((v, i) => v === question.items[i]);
      } catch {
        return false;
      }
    }
    case "scenario":
      return rawAnswer === question.answer;
    case "multiple-choice":
    default:
      return "answer" in question && rawAnswer === question.answer;
  }
}

function questionExplanation(question: AssessmentQuestion): string {
  return question.explanation ?? "You've got this — that's the correct answer for this topic.";
}
function questionClue(question: AssessmentQuestion): string {
  return question.clue ?? "Re-read this module's lessons on this topic, then give it another go.";
}
function questionCorrectSummary(question: AssessmentQuestion): string {
  switch (question.type) {
    case "matching":
      return question.pairs.map((p) => `${p.left} → ${p.right}`).join("; ");
    case "ordering":
      return question.items.map((item, i) => `${i + 1}. ${item}`).join("  ");
    case "true-false":
      return question.answer;
    case "fill-blank":
      return question.answer;
    case "scenario":
    case "multiple-choice":
    default:
      return "answer" in question ? question.answer : "";
  }
}

// ── Interactive inputs per question type ────────────────────────────────────

function OptionList({ options, value, onChange, name }: { options: string[]; value: string | undefined; onChange: (v: string) => void; name: string }) {
  return (
    <div className="mt-6 grid gap-3">
      {options.map((option) => {
        const selected = value === option;
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${selected ? "border-[#1166c8] bg-[#1166c8]/8" : "border-slate-200 bg-white hover:border-[#1166c8]/40 hover:bg-slate-50"}`}
          >
            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${selected ? "border-[#1166c8] bg-[#1166c8]" : "border-slate-300"}`}>
              {selected && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
            <input type="radio" name={name} value={option} checked={selected} onChange={() => onChange(option)} className="sr-only" />
            <span className="text-sm font-medium text-ink">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function TrueFalseInput({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {(["True", "False"] as const).map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border-2 py-8 text-lg font-bold transition ${selected ? (option === "True" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-400 bg-red-50 text-red-700") : "border-slate-200 bg-white text-ink hover:border-slate-300 hover:bg-slate-50"}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function FillBlankInput({ prompt, value, onChange }: { prompt: string; value: string | undefined; onChange: (v: string) => void }) {
  const parts = prompt.split("_____");
  return (
    <div className="mt-6">
      <p className="text-base leading-8 text-ink">
        {parts[0]}
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer"
          autoComplete="off"
          className="mx-1 inline-block w-48 rounded-md border-2 border-[#1166c8]/40 bg-[#1166c8]/5 px-3 py-1 text-center text-sm font-semibold text-ink outline-none focus:border-[#1166c8]"
        />
        {parts[1] ?? ""}
      </p>
    </div>
  );
}

function MatchingInput({ question, value, onChange }: { question: Extract<AssessmentQuestion, { type: "matching" }>; value: string | undefined; onChange: (v: string) => void }) {
  // Shuffled once per question, not re-rolled on every keystroke — question.pairs is
  // static authored data for a given question.id, so that's the only real dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rightOptions = useMemo(() => shuffled(question.pairs.map((p) => p.right)), [question.id]);
  const picked: Record<string, string> = useMemo(() => {
    try {
      return value ? (JSON.parse(value) as Record<string, string>) : {};
    } catch {
      return {};
    }
  }, [value]);

  function selectFor(leftIndex: number, right: string) {
    onChange(JSON.stringify({ ...picked, [String(leftIndex)]: right }));
  }

  return (
    <div className="mt-6 grid gap-3">
      {question.pairs.map((pair, i) => (
        <div key={pair.left} className="flex flex-col gap-2 rounded-xl border-2 border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-ink">{pair.left}</span>
          <select
            value={picked[String(i)] ?? ""}
            onChange={(e) => selectFor(i, e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-[#1166c8] sm:w-64"
          >
            <option value="" disabled>Match to…</option>
            {rightOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function OrderingInput({ question, value, onChange }: { question: Extract<AssessmentQuestion, { type: "ordering" }>; value: string | undefined; onChange: (v: string) => void }) {
  // Same rationale as MatchingInput above — shuffled once per question.id, not on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => shuffled(question.items), [question.id]);
  const order: string[] = useMemo(() => {
    try {
      return value ? (JSON.parse(value) as string[]) : initial;
    } catch {
      return initial;
    }
  }, [value, initial]);

  useEffect(() => {
    if (!value) onChange(JSON.stringify(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function move(index: number, direction: -1 | 1) {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(JSON.stringify(next));
  }

  return (
    <div className="mt-6 grid gap-2">
      {order.map((item, i) => (
        <div key={item} className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-3.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1166c8]/10 text-xs font-bold text-[#1166c8]">{i + 1}</span>
          <span className="flex-1 text-sm font-medium text-ink">{item}</span>
          <div className="flex shrink-0 gap-1">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-muted transition hover:bg-slate-50 disabled:opacity-30">↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-muted transition hover:bg-slate-50 disabled:opacity-30">↓</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionCard({ question, value, onChange }: { question: AssessmentQuestion; value: string | undefined; onChange: (v: string) => void }) {
  const typeBadge: Record<string, string> = {
    "multiple-choice": "Multiple choice",
    "true-false": "True or False",
    "fill-blank": "Fill in the blank",
    matching: "Match the pairs",
    scenario: "Workplace scenario",
    ordering: "Put in order",
  };
  const badgeLabel = question.type ? typeBadge[question.type] : "Multiple choice";

  return (
    <fieldset>
      {badgeLabel ? (
        <span className="mb-3 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
          {badgeLabel}
        </span>
      ) : null}
      {question.type === "scenario" ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">Scenario</p>
          {question.scenario}
        </div>
      ) : null}
      <legend className="text-xl font-semibold text-ink leading-8">{question.type === "fill-blank" ? question.prompt.split("_____")[0] + "…" : question.prompt}</legend>

      {question.type === "true-false" && <TrueFalseInput value={value} onChange={onChange} />}
      {question.type === "fill-blank" && <FillBlankInput prompt={question.prompt} value={value} onChange={onChange} />}
      {question.type === "matching" && <MatchingInput question={question} value={value} onChange={onChange} />}
      {question.type === "ordering" && <OrderingInput question={question} value={value} onChange={onChange} />}
      {(question.type === "scenario" || question.type === "multiple-choice" || !question.type) && "options" in question && (
        <OptionList options={question.options} value={value} onChange={onChange} name={question.id} />
      )}
    </fieldset>
  );
}

export function AssessmentPlayer({ assessment, course, academyName, academyHref }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverResult, setServerResult] = useState<ServerResult | null>(null);
  const [certificateState, setCertificateState] = useState<CertificateState>("idle");
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockingRetry, setUnlockingRetry] = useState(false);

  const wallet = useWalletBalance();
  const questions = assessment.questions;
  const total = questions.length;

  function selectAnswer(questionId: string, value: string) {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  }

  const calculateScore = useCallback(() => {
    let correct = 0;
    for (const q of questions) {
      if (isAnswerCorrect(q, answers[q.id])) correct++;
    }
    return Math.round((correct / total) * 100);
  }, [answers, questions, total]);

  async function submit() {
    setSubmitted(true);
    setPhase("results");
    setServerResult(null);
    setCertificateState("idle");

    const clientScore = calculateScore();
    const clientPassed = clientScore >= assessment.passMark;

    const attempts = JSON.parse(localStorage.getItem("vowlms_assessments") ?? "{}");
    attempts[assessment.slug] = {
      slug: assessment.slug,
      courseSlug: course.slug,
      score: clientScore,
      passed: clientPassed,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("vowlms_assessments", JSON.stringify(attempts));

    const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
    if (!progress[course.slug]) progress[course.slug] = { completedLessons: [], assessmentPassed: false };
    if (clientPassed) progress[course.slug].assessmentPassed = true;
    localStorage.setItem("vowlms_progress", JSON.stringify(progress));

    let effectivePassed = clientPassed;
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ assessmentSlug: assessment.slug, answers }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setServerResult({ score: json.data.score, passed: json.data.passed, passMark: json.data.passMark });
        effectivePassed = json.data.passed;
      }
    } catch {
      // Offline / bridge not configured — the client-computed score above still stands.
    }

    if (!effectivePassed) return;

    setCertificateState("pending");
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ lessonSlug: assessment.lessonSlug, completed: true }),
      });

      const certRes = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      const certJson = await certRes.json().catch(() => null);

      if (certRes.ok && certJson?.ok) {
        setCertificateState("ready");
      } else if (certRes.status === 400) {
        setCertificateState("incomplete");
      } else {
        setCertificateState("error");
      }
    } catch {
      setCertificateState("error");
    }
  }

  function beginRetry() {
    setPhase("intro");
    setAnswers({});
    setSubmitted(false);
    setCurrent(0);
    setServerResult(null);
  }

  // Retrying after a fail costs VOWR — a real, instant spend (not a pending
  // admin-reviewed request), same catalogue item shown on /rewards
  // ("Assessment retake waiver", 50 VOWR), just triggered from here too.
  async function unlockRetry() {
    if (wallet.status !== "ready" || wallet.balance < RETRY_COST_VOWR) {
      toast(`You need ${RETRY_COST_VOWR} VOWR to unlock another attempt.`);
      return;
    }
    setUnlockingRetry(true);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redemptionType: "assessment_retake_waiver", metadata: { assessmentSlug: assessment.slug } }),
      });
      const json = await res.json();
      if (!json.ok) {
        toast(json.error ?? "Could not unlock a retry right now.");
        return;
      }
      toast(`🔓 Retry unlocked — ${RETRY_COST_VOWR} VOWR spent. Give it another go!`);
      wallet.refresh();
      beginRetry();
    } catch {
      toast("Could not unlock a retry right now.");
    } finally {
      setUnlockingRetry(false);
    }
  }

  const score = serverResult?.score ?? (submitted ? calculateScore() : 0);
  const passed = serverResult?.passed ?? score >= assessment.passMark;
  const answeredCount = Object.keys(answers).length;

  const breadcrumbItems = [
    { label: "Academies", href: "/academies" },
    ...(academyName && academyHref ? [{ label: academyName, href: academyHref }] : []),
    { label: course.title, href: `/courses/${course.slug}` },
    { label: "Assessment" },
  ];

  useEffect(() => {
    if (certificateState !== "ready") return;
    toast.success("🎓 Certificate ready! Find it on your results page.");
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setShowCelebration(true);
    });
    return () => {
      cancelled = true;
    };
  }, [certificateState]);

  if (phase === "intro") {
    return (
      <main className="premium-page">
        <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6 premium-card rounded-2xl p-8 text-center">
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
                <p className="text-2xl font-semibold text-ink">~{Math.max(10, total * 2)}</p>
                <p className="mt-1 text-xs text-muted">Minutes</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-muted">
              A mix of true/false, fill-in-the-blank, matching, and scenario questions. Score below{" "}
              {assessment.passMark}% and a retry costs {RETRY_COST_VOWR} VOWR — so give it your best first shot.
              Stuck? Thandi can give you a clue (never the answer).
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
          <Breadcrumb items={breadcrumbItems} />
          <div className={`rounded-2xl p-8 text-center ${passed ? "bg-gradient-to-br from-emerald-50 to-[#f0fdf4] border border-emerald-200" : "bg-gradient-to-br from-red-50 to-[#fff5f5] border border-red-200"}`}>
            <div
              className={`vowlms-result-badge mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black ${passed ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
            >
              {passed ? "✓" : "✗"}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{assessment.title}</p>
            <h2 className="mt-3 text-4xl font-bold text-ink">{score}%</h2>
            <p className={`mt-2 text-lg font-semibold ${passed ? "text-emerald-700" : "text-red-700"}`}>
              {passed ? "Congratulations — you passed!" : "Not quite — take a closer look below, then retry"}
            </p>
            <p className="mt-2 text-sm text-slate-600">Pass mark: {assessment.passMark}% · Your score: {score}%</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {passed ? (
                <>
                  <Link href={`/results/${course.slug}`}
                    className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]">
                    View results
                  </Link>
                  {course.vrPractices[0] ? (
                    <Link href={`/vr-practice/${course.vrPractices[0].slug}`}
                      className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50">
                      Open VR practice
                    </Link>
                  ) : null}
                </>
              ) : (
                <div className="w-full rounded-xl border-2 border-dashed border-red-200 bg-white/60 p-5">
                  <p className="text-sm font-semibold text-ink">Unlock another attempt</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Scoring below {assessment.passMark}% means a retry costs real VOWR — {RETRY_COST_VOWR} VOWR, spent instantly.
                    {wallet.status === "ready" ? ` Your balance: ${wallet.balance} VOWR.` : ""}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      onClick={unlockRetry}
                      disabled={unlockingRetry || (wallet.status === "ready" && wallet.balance < RETRY_COST_VOWR)}
                      className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {unlockingRetry ? "Unlocking…" : `🔓 Unlock retry — ${RETRY_COST_VOWR} VOWR`}
                    </button>
                    <Link href="/rewards" className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50">
                      Earn more VOWR
                    </Link>
                  </div>
                  {wallet.status === "ready" && wallet.balance < RETRY_COST_VOWR ? (
                    <p className="mt-3 text-xs font-medium text-red-600">
                      You need {RETRY_COST_VOWR - wallet.balance} more VOWR — complete a lesson or another course milestone to top up.
                    </p>
                  ) : null}
                  <Link href={`/courses/${course.slug}`} className="mt-4 block text-xs font-semibold text-muted hover:text-ink transition">
                    ← Review the course content first
                  </Link>
                </div>
              )}
            </div>

            {passed ? (
              <p className="mt-4 text-xs text-slate-500">
                {certificateState === "pending" && "Checking your certificate…"}
                {certificateState === "ready" && "🎓 Certificate ready — find it on your results page."}
                {certificateState === "incomplete" && "Complete the remaining lessons in this course to unlock your certificate."}
                {certificateState === "error" && "We couldn't confirm your certificate right now — check back on your dashboard shortly."}
              </p>
            ) : null}
          </div>

          {/* Answer review — every question, correct answers explained, wrong ones get a clue */}
          <div className="premium-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-ink">Answer review</h3>
              <span className="text-xs font-medium text-muted">Correct answers explained · clues for the rest</span>
            </div>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const correct = isAnswerCorrect(q, answers[q.id]);
                return (
                  <div key={q.id} className={`rounded-xl border p-4 ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                    <p className="text-sm font-semibold text-ink">{i + 1}. {q.type === "fill-blank" ? q.prompt.replace("_____", "▁▁▁▁▁") : q.prompt}</p>
                    {correct ? (
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        <span className="font-semibold">✓ Correct — {questionCorrectSummary(q)}.</span>{" "}
                        {questionExplanation(q)}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-red-800">
                        <span className="font-semibold">✗ Not quite.</span> Clue: {questionClue(q)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <style>{`
          @keyframes vowlms-badge-in {
            from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
            60% { transform: scale(1.08) rotate(2deg); }
            to { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          .vowlms-result-badge { animation: vowlms-badge-in 0.5s cubic-bezier(0.34,1.56,0.64,1); }
          @media (prefers-reduced-motion: reduce) {
            .vowlms-result-badge { animation: none; }
          }
        `}</style>

        {showCelebration ? (
          <CelebrationOverlay
            courseTitle={course.title}
            courseSlug={course.slug}
            onClose={() => setShowCelebration(false)}
          />
        ) : null}
      </main>
    );
  }

  // Quiz phase
  const question = questions[current];
  const progress = ((current + 1) / total) * 100;

  return (
    <main className="premium-page">
      <section className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-6">
          <ProgressBar value={progress} label={`Question ${current + 1} of ${total}`} />
          <p className="mt-2 text-right text-xs text-muted">{answeredCount}/{total} answered</p>
        </div>

        <div className="premium-card rounded-2xl p-8">
          <QuestionCard question={question} value={answers[question.id]} onChange={(v) => selectAnswer(question.id, v)} />

          <button
            type="button"
            onClick={openThandiPanel}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#4aa3ff]/30 bg-[#4aa3ff]/5 px-4 py-2.5 text-xs font-semibold text-[#1166c8] transition hover:bg-[#4aa3ff]/10"
          >
            <Lightbulb aria-hidden="true" className="h-4 w-4" />
            Stuck? Ask Thandi for a clue
            <Sparkles aria-hidden="true" className="h-3 w-3 text-[#7c6bf5]" />
          </button>

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
