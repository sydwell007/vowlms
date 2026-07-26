import type { AcademyCategory } from "@/types/lms";

/** Brand accent colour per academy category — used across academy, course, and lesson pages. */
export const ACADEMY_ACCENT_COLORS: Record<AcademyCategory, string> = {
  "upskilling": "#1E3A8A",
  "skills-training": "#16A34A",
  "chef-academy": "#EA580C",
  "private-school": "#9b59b6",
  "sports-academy": "#f97316",
  "business-school": "#D97706",
  "university-online": "#20c7ff",
};

export function getAcademyAccentColor(category?: string | null): string {
  return (category && ACADEMY_ACCENT_COLORS[category as AcademyCategory]) || "#1166c8";
}
