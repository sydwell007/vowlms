import type { AcademyCategory } from "@/types/lms";
import type { GoalTileId } from "@/data/goal-tiles";
import type { QuizAnswers } from "@/lib/goal-routing";

const STORAGE_KEY = "vowlms_learner_profile";

export type LearnerProfile = {
  goalTileId: GoalTileId;
  roleId?: string;
  roleLabel?: string;
  academyCategory: AcademyCategory;
  quizAnswers?: QuizAnswers;
  updatedAt: string;
};

export function getLearnerProfile(): LearnerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LearnerProfile;
  } catch {
    return null;
  }
}

export function saveLearnerProfile(profile: Omit<LearnerProfile, "updatedAt">): LearnerProfile {
  const full: LearnerProfile = { ...profile, updatedAt: new Date().toISOString() };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch {
    /* SSR / private browsing — profile still returned for in-memory use this session */
  }

  // Best-effort sync for logged-in learners; silently no-ops when signed out or the bridge isn't configured.
  fetch("/api/learner-goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(full),
  }).catch(() => { /* offline / not signed in — localStorage is still the source of truth */ });

  return full;
}

export function clearLearnerProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
