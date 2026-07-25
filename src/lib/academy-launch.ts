import type { AcademyCategory } from "@/types/lms";

/**
 * Launch schedule for academies that are visible but not yet fully live.
 * Once `now` passes an academy's launch date, `getComingSoonInfo` returns
 * `null` automatically and every "Coming Soon" ribbon/overlay across the site
 * disappears on its own — no other code changes are needed to bring an
 * academy (or its courses) live.
 *
 * Academies in `HIDDEN_ACADEMY_CATEGORIES` below are pulled from visibility
 * entirely (nav, listings, direct URLs) regardless of what's set here.
 */
export const ACADEMY_LAUNCH_DATES: Record<AcademyCategory, string | "tbd" | null> = {
  "upskilling": null,
  "skills-training": null,
  "chef-academy": null,
  "business-school": null,
  "private-school": "2026-11-30",
  "university-online": "2026-12-30",
  "sports-academy": "tbd",
};

/**
 * Academies held back for a future intake (planned for next year). They stay
 * fully intact in the data layer — just excluded from every visible surface
 * (header, top bar, footer, academy/course listings, search, sitemap, and
 * direct navigation to their academy/course pages). Remove a category here
 * to bring it — and its courses — back into visibility.
 */
export const HIDDEN_ACADEMY_CATEGORIES: readonly AcademyCategory[] = [
  "private-school",
  "sports-academy",
  "university-online",
];

export function isHiddenAcademyCategory(category?: string | null): boolean {
  if (!category) return false;
  return (HIDDEN_ACADEMY_CATEGORIES as readonly string[]).includes(category);
}

export type ComingSoonInfo = {
  /** Long form for cards/ribbons, e.g. "Coming 30 August 2026" or "Coming soon". */
  label: string;
  /** Compact form for small ribbons, e.g. "30 Aug 2026" or "Soon". */
  shortLabel: string;
};

function formatLaunchDate(iso: string): string {
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T00:00:00`),
  );
}

function formatLaunchDateShort(iso: string): string {
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${iso}T00:00:00`),
  );
}

export function getComingSoonInfo(
  category?: string | null,
  now: Date = new Date(),
): ComingSoonInfo | null {
  if (!category) return null;
  const value = ACADEMY_LAUNCH_DATES[category as AcademyCategory];
  if (!value) return null;

  if (value === "tbd") {
    return { label: "Coming soon", shortLabel: "Soon" };
  }

  const launchDate = new Date(`${value}T00:00:00`);
  if (now >= launchDate) return null;

  return {
    label: `Coming ${formatLaunchDate(value)}`,
    shortLabel: formatLaunchDateShort(value),
  };
}
