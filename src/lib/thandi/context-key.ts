"use client";

import { usePathname } from "next/navigation";
import { THANDI_GUIDE_KEY } from "@/lib/thandi/config";

const LESSON_PATH = /^\/lesson\/([a-z0-9-]+)/;
const COURSE_PATH = /^\/courses\/([a-z0-9-]+)/;

/**
 * Derives what Thandi should know about "the page the learner is currently
 * on" purely from the route — no extra data fetching needed here, since the
 * actual content digest is built server-side (see `/api/vowhumans/lesson-context`)
 * once this key reaches it.
 */
export function useThandiContextKey(): { key: string; label: string } {
  const pathname = usePathname() || "/";

  const lessonMatch = pathname.match(LESSON_PATH);
  if (lessonMatch) return { key: lessonMatch[1], label: "this lesson" };

  const courseMatch = pathname.match(COURSE_PATH);
  if (courseMatch) return { key: courseMatch[1], label: "this course" };

  return { key: THANDI_GUIDE_KEY, label: "VowLMS" };
}
