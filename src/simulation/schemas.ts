import { z } from "zod";
import type { SimulationManifest } from "@/simulation/types";

const availability = z.enum(["available", "beta", "coming-soon", "locked", "completed"]);
const difficulty = z.enum(["beginner", "intermediate", "advanced", "expert"]);
const humanState = z.object({
  trust: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  stress: z.number().min(0).max(100),
  frustration: z.number().min(0).max(100),
  engagement: z.number().min(0).max(100),
  willingnessToDisclose: z.number().min(0).max(100),
});
const humanStateDelta = z.object({
  trust: z.number().min(-100).max(100).optional(),
  confidence: z.number().min(-100).max(100).optional(),
  stress: z.number().min(-100).max(100).optional(),
  frustration: z.number().min(-100).max(100).optional(),
  engagement: z.number().min(-100).max(100).optional(),
  willingnessToDisclose: z.number().min(-100).max(100).optional(),
});
const organisationDelta = z.object({
  trust: z.number().optional(),
  morale: z.number().optional(),
  productivity: z.number().optional(),
  complianceRisk: z.number().optional(),
  customerConfidence: z.number().optional(),
  financialImpact: z.number().optional(),
}).strict();
const competency = z.object({
  id: z.string().min(1), code: z.string().min(1), title: z.string().min(1), description: z.string().min(1),
  category: z.enum(["knowledge", "decision", "evidence", "communication", "professional", "compliance", "interpersonal", "judgement"]),
  weight: z.number().positive(), critical: z.boolean(),
});
const mode = z.object({
  availability, difficulty, estimatedMinutes: z.number().int().positive(), inputMethods: z.array(z.string().min(1)),
  headsetCompatibility: z.enum(["not-required", "optional", "recommended"]), prerequisites: z.array(z.string()), competencyIds: z.array(z.string()),
});
const response = z.object({
  intent: z.enum(["acknowledge", "investigate", "clarify", "policy", "resolve", "escalate", "dismiss", "unsafe", "prompt-injection", "neutral"]),
  text: z.string().min(1), consequence: z.string().min(1), stateDelta: humanStateDelta, organisationDelta,
  evidenceId: z.string().optional(), objectiveId: z.string().optional(), criticalRuleId: z.string().optional(),
});

export const simulationManifestSchema = z.object({
  id: z.string().min(1), slug: z.string().min(1), version: z.number().int().positive(), academyId: z.string().min(1),
  courseId: z.string().min(1), moduleId: z.string().min(1), lessonId: z.string().optional(), title: z.string().min(1),
  description: z.string().min(1), learnerRole: z.string().min(1),
  learningObjectives: z.array(z.object({ id: z.string().min(1), title: z.string().min(1) })).min(1),
  competencies: z.array(competency).min(1),
  environment: z.object({ id: z.string().min(1), label: z.string().min(1), modelUrl: z.string().optional(), fallbackType: z.string().min(1) }),
  digitalHumans: z.array(z.object({
    id: z.string().min(1), name: z.string().min(1), role: z.string().min(1), organisationRole: z.string().min(1), biography: z.string().min(1),
    traits: z.array(z.string()), motivation: z.string().min(1), objectives: z.array(z.string()), publicKnowledge: z.array(z.string()),
    privateKnowledge: z.array(z.string()), disclosureRules: z.array(z.string()), speakingStyle: z.string().min(1), stressResponse: z.string().min(1),
    conflictTolerance: z.number().min(0).max(100), initialState: humanState,
    avatar: z.object({ modelUrl: z.string().optional(), fallbackPalette: z.string().min(1), voiceId: z.string().optional() }),
  })).min(1),
  objects: z.array(z.object({
    id: z.string().min(1), label: z.string().min(1), description: z.string().min(1),
    interaction: z.enum(["inspect", "read", "open", "use", "activate", "submit", "select", "speak"]),
    evidenceId: z.string().optional(), position: z.tuple([z.number(), z.number(), z.number()]), scale: z.tuple([z.number(), z.number(), z.number()]),
    shape: z.enum(["box", "screen", "table", "pod", "wall"]), color: z.string().min(1), required: z.boolean(), theoryReference: z.string().min(1),
    action: z.object({
      id: z.string().min(1), prompt: z.string().min(1), options: z.array(z.string().min(1)).min(2), correctOption: z.string().min(1),
      successFeedback: z.string().min(1), retryFeedback: z.string().min(1), evidencePrompt: z.string().min(1), objectiveId: z.string().min(1),
    }),
  })).min(1),
  evidenceItems: z.array(z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1) })),
  scenario: z.object({
    title: z.string().min(1), briefing: z.string().min(1), openingLine: z.string().min(1),
    nodes: z.array(z.object({ id: z.string().min(1), stage: z.enum(["briefing", "discovery", "decision", "action", "outcome"]), title: z.string().min(1), situation: z.string().min(1), prompt: z.string().min(1), responses: z.array(response).min(1) })).min(1),
  }),
  rules: z.array(z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), critical: z.boolean(), triggeredBy: z.array(response.shape.intent) })),
  events: z.array(z.object({ id: z.string().min(1), title: z.string().min(1), triggerAtSeconds: z.number().nonnegative(), description: z.string().min(1), organisationDelta })),
  assessmentRubric: z.object({ passThreshold: z.number().min(0).max(100), masteryThreshold: z.number().min(0).max(100), criteria: z.array(competency).min(1), criticalRuleIds: z.array(z.string()) }),
  legacyMode: mode.extend({ sourcePracticeSlug: z.string().min(1) }),
  adaptiveMode: mode.extend({ provider: z.enum(["scripted", "vowhumans"]), maxTurns: z.number().int().min(3).max(20), personaIds: z.array(z.string()).min(1), voiceEnabled: z.boolean() }),
  immersiveMode: mode.extend({ maxDurationSeconds: z.number().int().positive(), agentIds: z.array(z.string()).min(1), graphicsPreset: z.enum(["auto", "low", "medium", "high"]), locomotion: z.enum(["desktop-first-person", "teleport"]), webXrEnabled: z.boolean() }),
  accessibility: z.object({ captions: z.boolean(), textAlternative: z.boolean(), reducedMotion: z.boolean(), keyboardNavigation: z.boolean() }),
  publishing: z.object({ status: z.enum(["draft", "review", "approved", "published", "archived"]), target: z.enum(["studio", "vowlms"]), updatedAt: z.string().min(1) }),
});

export function parseSimulationManifest(value: unknown): SimulationManifest {
  return simulationManifestSchema.parse(value) as SimulationManifest;
}
