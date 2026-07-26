import { getCourseSummaries } from "@/lib/data";
import type { RoleOption } from "@/data/goal-tiles";
import type { AcademyCategory, CourseSummary } from "@/types/lms";

function scoreCourseForRole(course: CourseSummary, role: RoleOption): number {
  const haystack = `${course.title} ${course.description}`.toLowerCase();
  let score = 0;
  for (const keyword of role.keywords) {
    if (haystack.includes(keyword.toLowerCase())) score += 1;
  }
  return score;
}

/** Top courses in an academy for a given role, ranked by keyword relevance then reward value. Never empty if the academy has courses. */
export function getCoursesForRole(academyCategory: AcademyCategory, role: RoleOption, limit = 6): CourseSummary[] {
  const academyCourses = getCourseSummaries().filter((course) => course.academyCategory === academyCategory);

  const ranked = [...academyCourses].sort((a, b) => {
    const scoreDiff = scoreCourseForRole(b, role) - scoreCourseForRole(a, role);
    if (scoreDiff !== 0) return scoreDiff;
    return b.rewards - a.rewards;
  });

  return ranked.slice(0, limit);
}

/** Count shown on a role card — courses that actually match the role's keywords, falling back to the whole academy's count so it's never "0 courses available". */
export function getRoleCourseCount(academyCategory: AcademyCategory, role: RoleOption): number {
  const academyCourses = getCourseSummaries().filter((course) => course.academyCategory === academyCategory);
  const matched = academyCourses.filter((course) => scoreCourseForRole(course, role) > 0).length;
  return matched > 0 ? matched : academyCourses.length;
}

export type QuizAnswers = {
  q1: "unemployed" | "employed" | "business" | "student";
  q2: "light" | "moderate" | "fulltime" | "flexible";
  q3: "hands-on" | "office" | "mixed" | "people";
  q4: "get-job" | "certificate" | "career" | "income";
};

const ACADEMY_ORDER: AcademyCategory[] = ["upskilling", "skills-training", "chef-academy", "business-school"];

type AcademyScores = Record<AcademyCategory, number>;

function addScore(scores: AcademyScores, category: AcademyCategory, points: number) {
  scores[category] = (scores[category] ?? 0) + points;
}

/**
 * Scoring matrix from the Path Finder Quiz spec. Q2 (time commitment) and the
 * "mixed" option on Q3 are intentionally unscored — the original spec never
 * assigned them points, so they're stored for context/copy only rather than
 * silently folded into another question's weight.
 */
export function getQuizRecommendation(answers: QuizAnswers): { academyCategory: AcademyCategory; courses: CourseSummary[] } {
  const scores: AcademyScores = {
    "upskilling": 0,
    "skills-training": 0,
    "chef-academy": 0,
    "business-school": 0,
    "private-school": 0,
    "sports-academy": 0,
    "university-online": 0,
  };

  if (answers.q1 === "unemployed") {
    addScore(scores, "skills-training", 3);
    addScore(scores, "chef-academy", 2);
  } else if (answers.q1 === "employed") {
    addScore(scores, "upskilling", 3);
    addScore(scores, "business-school", 2);
  } else if (answers.q1 === "business") {
    addScore(scores, "business-school", 3);
    addScore(scores, "upskilling", 2);
  } else if (answers.q1 === "student") {
    addScore(scores, "upskilling", 2);
    addScore(scores, "chef-academy", 2);
  }

  if (answers.q3 === "hands-on") {
    addScore(scores, "skills-training", 3);
    addScore(scores, "chef-academy", 3);
  } else if (answers.q3 === "office") {
    addScore(scores, "upskilling", 3);
    addScore(scores, "business-school", 2);
  } else if (answers.q3 === "people") {
    addScore(scores, "business-school", 2);
    addScore(scores, "upskilling", 2);
  }

  if (answers.q4 === "get-job") {
    addScore(scores, "skills-training", 3);
    addScore(scores, "chef-academy", 2);
  } else if (answers.q4 === "certificate") {
    addScore(scores, "upskilling", 3);
    addScore(scores, "skills-training", 1);
    addScore(scores, "chef-academy", 1);
    addScore(scores, "business-school", 1);
  } else if (answers.q4 === "career") {
    addScore(scores, "upskilling", 3);
    addScore(scores, "business-school", 2);
  } else if (answers.q4 === "income") {
    addScore(scores, "business-school", 3);
    addScore(scores, "skills-training", 2);
  }

  let winner: AcademyCategory = ACADEMY_ORDER[0];
  for (const category of ACADEMY_ORDER) {
    if (scores[category] > scores[winner]) winner = category;
  }

  const courses = getCourseSummaries()
    .filter((course) => course.academyCategory === winner)
    .sort((a, b) => b.rewards - a.rewards)
    .slice(0, 3);

  return { academyCategory: winner, courses };
}
