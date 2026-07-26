"use client";

import { useEffect, useState } from "react";
import { GoalTileGrid } from "@/components/onboarding/GoalTileGrid";
import { RoleSelector } from "@/components/onboarding/RoleSelector";
import { SmartCourseFeed } from "@/components/onboarding/SmartCourseFeed";
import { PathFinderQuiz } from "@/components/onboarding/PathFinderQuiz";
import { ReturningLearnerBanner } from "@/components/onboarding/ReturningLearnerBanner";
import type { GoalTile, RoleOption } from "@/data/goal-tiles";
import { getLearnerProfile, saveLearnerProfile, type LearnerProfile } from "@/lib/learner-profile";
import { getQuizRecommendation, type QuizAnswers } from "@/lib/goal-routing";

type Step = "tiles" | "roles" | "feed" | "quiz";

export function OnboardingFlow({ initialStep = "tiles" }: { initialStep?: "tiles" | "quiz" }) {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [step, setStep] = useState<Step>(initialStep);
  const [selectedTile, setSelectedTile] = useState<GoalTile | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setMounted(true);
      setProfile(getLearnerProfile());
    });
    return () => { cancelled = true; };
  }, []);

  function handleSelectTile(tile: GoalTile) {
    setSelectedTile(tile);
    setStep(tile.academyCategory ? "roles" : "quiz");
  }

  function handleSelectRole(role: RoleOption) {
    if (!selectedTile?.academyCategory) return;
    setSelectedRole(role);
    // Persisted for next visit's "Welcome back" banner — intentionally not mirrored into
    // `profile` here, since that would skip straight past the course feed on this visit.
    saveLearnerProfile({
      goalTileId: selectedTile.id,
      roleId: role.id,
      roleLabel: role.label,
      academyCategory: selectedTile.academyCategory,
    });
    setStep("feed");
  }

  function handleQuizComplete(quizAnswers: QuizAnswers, result: ReturnType<typeof getQuizRecommendation>) {
    saveLearnerProfile({
      goalTileId: selectedTile?.id ?? "unsure",
      academyCategory: result.academyCategory,
      quizAnswers,
    });
  }

  function reset() {
    setSelectedTile(null);
    setSelectedRole(null);
    setStep("tiles");
    setProfile(null);
  }

  if (!mounted) return null;

  if (profile) {
    return <ReturningLearnerBanner profile={profile} onChangeGoal={reset} />;
  }

  return (
    <div className="transition-all duration-300 ease-out">
      {step === "tiles" ? <GoalTileGrid onSelect={handleSelectTile} /> : null}

      {step === "roles" && selectedTile ? (
        <RoleSelector tile={selectedTile} onSelect={handleSelectRole} onBack={() => setStep("tiles")} />
      ) : null}

      {step === "feed" && selectedTile?.academyCategory && selectedRole ? (
        <SmartCourseFeed academyCategory={selectedTile.academyCategory} role={selectedRole} onStartOver={reset} />
      ) : null}

      {step === "quiz" ? <PathFinderQuiz onComplete={handleQuizComplete} /> : null}
    </div>
  );
}
