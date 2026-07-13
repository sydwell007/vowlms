import type { AcademyCategory } from "@/types/lms";

/**
 * Launch schedule: Upskilling is already live. Each remaining academy launches
 * on the 30th of a subsequent month through December 2026. Sports Academy has
 * no fixed date yet, so it always shows a generic "coming soon" ribbon.
 *
 * Once `now` passes an academy's launch date, `getComingSoonInfo` returns
 * `null` automatically and every "Coming Soon" ribbon/overlay across the site
 * disappears on its own — no other code changes are needed to bring an
 * academy (or its courses) live.
 */
export const ACADEMY_LAUNCH_DATES: Record<AcademyCategory, string | "tbd" | null> = {
  "upskilling": null,
  "skills-training": "2026-08-30",
  "chef-academy": "2026-09-30",
  "business-school": "2026-10-30",
  "private-school": "2026-11-30",
  "university-online": "2026-12-30",
  "sports-academy": "tbd",
};

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
