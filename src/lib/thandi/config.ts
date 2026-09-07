/**
 * Configuration for "Thandi" — VowLMS's sidebar AI tutor.
 *
 * Thandi is a VowLMS-branded presentation of the real, already-approved
 * "GoalVow Tutor" VowHumans identity (fully synthetic, no real-person
 * likeness — see VowHumans' identity-governance record for this UUID). The
 * embed URL below is the same one already used by VowLMS's per-lesson
 * presenter feature (`src/data/seed-data.ts`, `public/sql/018_vowhuman_presenters.sql`),
 * so this is not a new, unapproved integration — just a second, persistent
 * surface for an identity VowLMS already embeds today.
 */
export const THANDI_EMBED_URL =
  "https://vowhumans.com/embed/c81cca0d-866f-466c-a60d-c343dcdab9c4/goalvow-academies";

export const THANDI_NAME = "Thandi";

/** The special context key that means "no specific lesson or course — help with VowLMS generally." */
export const THANDI_GUIDE_KEY = "vowlms-guide";

/** Wake phrase Thandi listens for, and what she says back once triggered. */
export const THANDI_WAKE_WORD = "thandi";
export const THANDI_WAKE_RESPONSE = "Yes, I'm listening.";
