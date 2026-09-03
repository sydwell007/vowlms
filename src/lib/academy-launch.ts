import type { AcademyCategory, Role } from "@/types/lms";

/**
 * Launch schedule for academies that are visible but not yet fully live.
 * Once `now` passes an academy's launch date, `getComingSoonInfo` returns
 * `null` automatically and every "Coming Soon" ribbon/overlay across the site
 * disappears on its own — no other code changes are needed to bring an
 * academy (or its courses) live.
 *
 * Academies in `ADMIN_ONLY_ACADEMY_CATEGORIES` below are pulled from learner
 * visibility entirely (nav, listings, direct URLs) regardless of what's set
 * here — admin always sees them live, with no launch-date lock at all.
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
 * Academies not yet ready for learners. They stay fully intact in the data
 * layer and fully visible/interactive to admin — just excluded from every
 * learner-facing surface (header, top bar, footer, academy/course listings,
 * search, sitemap, and direct navigation to their academy/course pages).
 * Remove a category here (or grant a learner-visibility override once the
 * admin control center is wired to the backend) to bring it — and its
 * courses — back for learners.
 */
export const ADMIN_ONLY_ACADEMY_CATEGORIES: readonly AcademyCategory[] = [
  "skills-training",
  "chef-academy",
  "business-school",
  "private-school",
  "sports-academy",
  "university-online",
];

/**
 * True when `category` should be hidden from the current viewer. Admin sees
 * everything (always `false`); every other role/anonymous visitor only ever
 * sees `upskilling` at the academy level.
 */
export function isHiddenAcademyCategory(category?: string | null, role?: Role | null): boolean {
  if (role === "admin") return false;
  if (!category) return false;
  return (ADMIN_ONLY_ACADEMY_CATEGORIES as readonly string[]).includes(category);
}

export function getConnectedAcademyCount(): number {
  return Object.entries(ACADEMY_LAUNCH_DATES).filter(
    ([category, launch]) => !isHiddenAcademyCategory(category) && launch === null,
  ).length;
}

export function getPlannedAcademyCount(): number {
  return Object.keys(ACADEMY_LAUNCH_DATES).filter((category) => isHiddenAcademyCategory(category)).length;
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

/**
 * Returns the "Coming Soon" ribbon info for `category`, or `null` when the
 * card/link should render fully live. Admin never gets a lock — they need to
 * be able to click into and review anything, regardless of launch date.
 */
export function getComingSoonInfo(
  category?: string | null,
  role?: Role | null,
  now: Date = new Date(),
): ComingSoonInfo | null {
  if (role === "admin") return null;
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
