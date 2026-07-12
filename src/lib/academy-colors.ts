import type { AcademyCategory } from "@/types/lms";

/** Brand accent colour per academy category — used across academy, course, and lesson pages. */
export const ACADEMY_ACCENT_COLORS: Record<AcademyCategory, string> = {
  "upskilling": "#1166c8",
  "skills-training": "#19c37d",
  "chef-academy": "#ff7a59",
  "private-school": "#9b59b6",
  "sports-academy": "#f97316",
  "business-school": "#f5c542",
  "university-online": "#20c7ff",
};

export function getAcademyAccentColor(category?: string | null): string {
  return (category && ACADEMY_ACCENT_COLORS[category as AcademyCategory]) || "#1166c8";
}
