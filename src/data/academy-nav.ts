import type { AcademyCategory } from "@/types/lms";

export type AcademyNavLink = {
  href: string;
  label: string;
  icon: string;
  category: AcademyCategory;
};

/**
 * Lightweight academy list for nav/footer surfaces — deliberately independent
 * of `src/lib/data.ts` (which pulls in the ~70k-line `seed-data.ts`) so these
 * client components stay small. Filter by role with `isHiddenAcademyCategory`
 * from `@/lib/academy-launch`.
 */
export const academyNavLinks: AcademyNavLink[] = [
  { href: "/academies/upskilling", label: "Upskilling", icon: "📈", category: "upskilling" },
  { href: "/academies/skills-training", label: "Skills Training", icon: "🔧", category: "skills-training" },
  { href: "/academies/chef-academy", label: "Chef Academy", icon: "🍳", category: "chef-academy" },
  { href: "/academies/private-school", label: "Private School", icon: "🎒", category: "private-school" },
  { href: "/academies/sports-academy", label: "Sports Academy", icon: "🏅", category: "sports-academy" },
  { href: "/academies/business-school", label: "Business School", icon: "💼", category: "business-school" },
  { href: "/academies/university-online", label: "University Online", icon: "🎓", category: "university-online" },
];
