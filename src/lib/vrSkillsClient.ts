"use client";

// VowLMS's adapter for the shared VR Skills components synced from the Virtual Reality
// Practice Studio (see scripts/sync-vowlms-vr-skills-ui.mjs in that repo). Same exported
// names as the Studio's own lib/vrSkillsClient.ts, different bodies: this one submits
// through VowLMS's own already-tested completion pipeline instead of a separate PHP host.

import { getVRPracticeBySlug } from "@/lib/data";

export type VrSkillsMode = "legacy" | "adaptive" | "immersive";

export type VrContext = {
  manifestId: string;
  courseId: string;
  moduleId: string;
  mode: VrSkillsMode;
};

/** VowLMS records completion per action server-side via the assessment engine; no separate per-action call needed. */
export async function submitVrObjectAction(context: VrContext, objectId: string, selectedOption: string): Promise<void> {
  void context; void objectId; void selectedOption;
}

/** VowLMS doesn't need granular telemetry events for this mode's v1. */
export async function sendVrEvent(context: VrContext, eventType: string, payload: Record<string, unknown>, sequence: number): Promise<void> {
  void context; void eventType; void payload; void sequence;
}

/** VowLMS doesn't persist raw conversation transcripts for this mode's v1. */
export async function submitVrConversationTurn(context: VrContext, personaId: string, learnerText: string, humanResponse: string): Promise<void> {
  void context; void personaId; void learnerText; void humanResponse;
}

/**
 * Submits the completed practice through VowLMS's existing /api/vr/submit + /api/progress,
 * exactly as the retired VRStudio.tsx did. Best-effort: never throws, never blocks the UI.
 */
export async function completeVrSession(context: VrContext, result?: { score: number; passed: boolean }): Promise<void> {
  const found = getVRPracticeBySlug(context.manifestId);
  if (!found || !result) return;
  const { practice, course } = found;

  try {
    const submitResponse = await fetch("/api/vr/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        practiceSlug: practice.slug,
        score: result.score,
        feedback: JSON.stringify({ version: practice.version, mode: context.mode }),
      }),
    });
    if (!submitResponse.ok) return;

    if (result.passed && practice.lessonSlug) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ lessonSlug: practice.lessonSlug, courseSlug: course.slug, completed: true }),
      });
    }

    window.localStorage.setItem(`vowlms:vr-result:${practice.slug}`, JSON.stringify({ score: result.score, completedAt: new Date().toISOString() }));
  } catch {
    // Fail soft: the learner's local progress (versioned localStorage in each mode component)
    // is unaffected, and they can re-open the practice to retry submission.
  }
}
