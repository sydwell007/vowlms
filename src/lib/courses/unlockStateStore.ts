"use client";

import type { UnlockState } from "@/lib/courses/useCourseUnlockPurchase";

type CacheEntry = { state: UnlockState; totalModules: number };

/**
 * Shared, cross-mount cache of "is the rest of this course unlocked" — keyed
 * by parent course slug. Without this, the course-page unlock card and the
 * lesson-page unlock panel each ran their own independent fetch with no way
 * to tell the other one "I just succeeded" — a learner could pay via VOWR on
 * the course page, then land on the lesson page's own (stale) card and pay
 * again before its own fetch ever caught up. A successful unlock now writes
 * here immediately, and every mounted consumer (current or future) sees it.
 */
const cache = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<(entry: CacheEntry) => void>>();

export function getCachedUnlockState(parentSlug: string): CacheEntry | undefined {
  return cache.get(parentSlug);
}

export function setCachedUnlockState(parentSlug: string, entry: CacheEntry): void {
  cache.set(parentSlug, entry);
  listeners.get(parentSlug)?.forEach((cb) => cb(entry));
}

export function subscribeUnlockState(parentSlug: string, cb: (entry: CacheEntry) => void): () => void {
  if (!listeners.has(parentSlug)) listeners.set(parentSlug, new Set());
  listeners.get(parentSlug)!.add(cb);
  return () => listeners.get(parentSlug)?.delete(cb);
}
