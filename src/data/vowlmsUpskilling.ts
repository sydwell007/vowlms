// VowLMS's adapter for the shared VR Skills components synced from the Virtual Reality
// Practice Studio (see scripts/sync-vowlms-vr-skills-ui.mjs in that repo). Same exported
// names as the Studio's own data/vowlmsUpskilling.ts, reading VowLMS's own already-synced
// copy of the practice catalogue (src/data/vr/upskilling-practices.json) instead of the
// Studio's copy. Does not replace src/data/vr/upskilling-practices.ts, which still owns
// lesson placement in the course curriculum.

import manifestJson from "./vr/upskilling-practices.json";
import type { Hotspot, Simulation, SimulationEnvironment, SimulationTask } from "@/types/vr-simulation";

export type VowLmsPracticeTask = {
  id: string;
  order: number;
  stage: string;
  title: string;
  instruction: string;
  theoryReference: string;
  actionPrompt: string;
  options: string[];
  correctOption: string;
  successFeedback: string;
  retryFeedback: string;
  evidencePrompt: string;
  hotspotId: string;
  hotspotLabel: string;
};

export type VowLmsPractice = {
  id: string;
  slug: string;
  academySlug: string;
  courseSlug: string;
  courseTitle: string;
  sourceCourseSlug: string;
  moduleOrder: number;
  moduleTitle: string;
  assessmentLessonSlug: string;
  lessonSlug: string;
  title: string;
  role: string;
  environment: string;
  environmentLabel: string;
  signatureMechanic: string;
  scenario: string;
  briefing: string;
  objectives: string[];
  lessonTopics: string[];
  skillsPracticed: string[];
  tasks: VowLmsPracticeTask[];
  hotspots: Array<{
    id: string;
    label: string;
    concept: string;
    position: number[];
    shape: "console" | "table" | "screen" | "pod" | "wall";
    color: string;
  }>;
  estimatedMinutes: number;
  passMark: number;
  scorePlaceholder: number;
  difficulty: "guided" | "applied" | "advanced";
  status: "draft" | "studio-ready" | "approved" | "deployed";
  version: string;
  deployment: {
    target: string;
    placement: string;
    route: string;
    completionCallback: string;
    eventName: string;
  };
};

type Manifest = {
  schemaVersion: string;
  generatedAt: string;
  summary: {
    courseCount: number;
    moduleCount: number;
    practiceCount: number;
    taskCount: number;
    status: string;
  };
  practices: VowLmsPractice[];
};

export const vowLmsPracticeManifest = manifestJson as Manifest;
export const vowLmsUpskillingPractices = vowLmsPracticeManifest.practices;

export function getVowLmsPractice(slug: string) {
  return vowLmsUpskillingPractices.find((practice) => practice.slug === slug);
}

const environmentByCourse: Record<string, SimulationEnvironment> = {
  "business-ethics": "leadership-meeting-room",
  "workplace-compliance": "workshop",
  "organizational-culture": "leadership-meeting-room",
  "stress-management": "career-coaching-office",
  cybersecurity: "project-control-room",
  "health-and-wellness": "career-coaching-office",
  "human-resources": "hr-office",
  marketing: "marketing-strategy-room",
  sales: "sales-negotiation-room",
  "project-management": "project-control-room",
  "customer-service": "customer-service-desk",
  "career-management": "career-coaching-office",
  "change-management": "operations-control-centre",
  communication: "leadership-meeting-room",
  leadership: "leadership-meeting-room",
  resilience: "career-coaching-office",
  "problem-solving": "business-strategy-room",
  "time-management": "project-control-room",
  "team-management": "leadership-meeting-room",
  "critical-thinking": "business-strategy-room",
};

function hotspotSize(shape: VowLmsPractice["hotspots"][number]["shape"]): [number, number, number] {
  if (shape === "table") return [1.6, 0.7, 1];
  if (shape === "screen" || shape === "wall") return [1.25, 1.45, 0.2];
  if (shape === "pod") return [0.85, 1.2, 0.85];
  return [1.1, 0.9, 0.75];
}

export function practiceToSimulation(practice: VowLmsPractice): Simulation {
  const tasks: SimulationTask[] = practice.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    detail: task.instruction,
    hotspotId: task.hotspotId,
    hotspotLabel: task.hotspotLabel,
    action: task.actionPrompt,
    options: task.options,
    correctOption: task.correctOption,
    successFeedback: task.successFeedback,
    retryFeedback: task.retryFeedback,
  }));

  const hotspots: Hotspot[] = practice.hotspots.map((hotspot, index) => {
    const task = practice.tasks.find((item) => item.hotspotId === hotspot.id);
    return {
      id: hotspot.id,
      label: hotspot.label,
      concept: hotspot.concept,
      instruction: task?.instruction ?? "Inspect this evidence station.",
      feedback: task
        ? `Evidence for ${task.theoryReference} is loaded. Complete the required action to finish this task.`
        : "Evidence station selected.",
      position: (hotspot.position.length === 3
        ? [hotspot.position[0] * 0.72, hotspot.position[1], hotspot.position[2] * 0.82]
        : [index * 1.2 - 2.4, 0.6, 0]) as [number, number, number],
      size: hotspotSize(hotspot.shape),
      color: hotspot.color,
      shape: hotspot.shape === "pod" ? "cylinder" : hotspot.shape === "screen" ? "screen" : hotspot.shape === "table" ? "table" : "box",
    };
  });

  return {
    id: practice.slug,
    lessonId: practice.lessonSlug,
    academyId: "upskilling",
    courseId: practice.courseSlug,
    moduleId: `module-${practice.moduleOrder}`,
    title: practice.title,
    environment: environmentByCourse[practice.courseSlug] ?? "leadership-meeting-room",
    environmentLabel: practice.environmentLabel,
    narrative: `${practice.scenario} ${practice.signatureMechanic}`,
    tasks,
    hotspots,
    estimatedMinutes: practice.estimatedMinutes,
  };
}
