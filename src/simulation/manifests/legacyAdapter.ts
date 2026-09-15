import type { VowLmsPractice } from "@/data/vowlmsUpskilling";
import { getModeAvailability, vrFeatureFlags } from "@/simulation/config/features";
import { parseSimulationManifest } from "@/simulation/schemas";
import { getScenarioProfile } from "@/simulation/scenarios/upskillingProfiles";
import type { CompetencyDefinition, InteractiveObjectDefinition, SimulationManifest } from "@/simulation/types";

const categories: CompetencyDefinition["category"][] = ["knowledge", "evidence", "decision", "communication", "professional"];

function idFrom(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

function scaleFor(shape: VowLmsPractice["hotspots"][number]["shape"]): [number, number, number] {
  if (shape === "table") return [1.7, 0.75, 1.1];
  if (shape === "screen" || shape === "wall") return [1.25, 1.55, 0.24];
  if (shape === "pod") return [0.9, 1.25, 0.9];
  return [1.1, 1, 0.8];
}

function competenciesFor(practice: VowLmsPractice): CompetencyDefinition[] {
  const topics = Array.from(new Set(practice.lessonTopics)).slice(0, 5);
  const weights = topics.map(() => Math.floor(100 / topics.length));
  weights[0] += 100 - weights.reduce((sum, weight) => sum + weight, 0);
  return topics.map((topic, index) => ({
    id: `${practice.slug}-competency-${index + 1}`,
    code: `${practice.courseSlug.toUpperCase().replace(/-/g, "_")}_${index + 1}`,
    title: topic,
    description: `Demonstrate ${topic} through observable workplace evidence.`,
    category: categories[index] ?? "judgement",
    weight: weights[index],
    critical: /safety|compliance|security|ethic/i.test(topic),
  }));
}

export function legacyPracticeToManifest(practice: VowLmsPractice): SimulationManifest {
  const profile = getScenarioProfile(practice.courseSlug);
  const competencies = competenciesFor(practice);
  const objectives = [
    { id: "establish-trust", title: "Establish a professional and psychologically safe interaction" },
    { id: "gather-evidence", title: "Gather and clarify material workplace evidence" },
    { id: "apply-policy", title: "Connect the response to an applicable standard or policy" },
    { id: "agree-action", title: "Agree a practical, measurable next action" },
  ];
  const personaId = `${practice.slug}-primary-human`;
  const digitalHumans = [
    { id: personaId, ...profile.persona },
    ...profile.supportingRoles.map((person, index) => ({
      id: `${practice.slug}-support-${index + 1}`,
      name: person.name,
      role: person.role,
      organisationRole: person.role,
      biography: `${person.name} is an event-driven supporting participant in this workplace scenario.`,
      traits: ["professional", "context-aware"],
      motivation: "Contribute relevant evidence when the scenario requires it.",
      objectives: ["Support a fair workplace outcome"],
      publicKnowledge: ["Knows part of the developing scenario"],
      privateKnowledge: ["Holds supporting evidence that must be requested appropriately"],
      disclosureRules: ["Participates only when approached or triggered by an authored event"],
      speakingStyle: "Concise and factual",
      stressResponse: "Defers to the scenario process",
      conflictTolerance: 50,
      initialState: { trust: 55, confidence: 65, stress: 30, frustration: 10, engagement: 60, willingnessToDisclose: 48 },
      avatar: { fallbackPalette: person.palette },
    })),
  ];
  const objects: InteractiveObjectDefinition[] = practice.hotspots.map((hotspot, index) => {
    const task = practice.tasks.find((candidate) => candidate.hotspotId === hotspot.id) ?? practice.tasks[index];
    const objectiveId = index === practice.hotspots.length - 1 ? "agree-action" : index >= 2 ? "apply-policy" : "gather-evidence";
    return {
      id: hotspot.id,
      label: hotspot.label,
      description: task?.instruction ?? `Review workplace evidence connected to ${hotspot.concept}.`,
      interaction: index === 0 ? "inspect" : index === 1 ? "read" : index === 4 ? "submit" : "use",
      evidenceId: `legacy-evidence-${index + 1}`,
      position: [hotspot.position[0] * 0.72, hotspot.position[1], hotspot.position[2] * 0.82] as [number, number, number],
      scale: scaleFor(hotspot.shape),
      shape: hotspot.shape === "console" ? "box" : hotspot.shape,
      color: hotspot.color,
      required: true,
      theoryReference: task?.theoryReference ?? hotspot.concept,
      action: {
        id: task?.id ?? `${hotspot.id}-action`,
        prompt: task?.actionPrompt ?? `Which response best demonstrates ${hotspot.concept}?`,
        options: task?.options ?? ["Review the available evidence before deciding.", "Continue without checking the evidence."],
        correctOption: task?.correctOption ?? "Review the available evidence before deciding.",
        successFeedback: task?.successFeedback ?? "Correct. The evidence supports this action.",
        retryFeedback: task?.retryFeedback ?? "Review the evidence and try a more deliberate response.",
        evidencePrompt: task?.evidencePrompt ?? `Record why this response supports ${hotspot.concept}.`,
        objectiveId,
      },
    };
  });
  const evidenceItems = objects.map((object, index) => ({ id: object.evidenceId ?? `evidence-${index + 1}`, title: object.label, description: object.description }));
  const nodeResponses = profile.responses;
  const nodes: SimulationManifest["scenario"]["nodes"] = [
    { id: "opening", stage: "briefing", title: "Open the conversation", situation: profile.situation, prompt: "Acknowledge the person and establish a professional frame.", responses: nodeResponses },
    { id: "discovery", stage: "discovery", title: "Investigate the evidence", situation: "The first account contains both facts and assumptions.", prompt: "Ask focused questions, clarify facts, and inspect supporting evidence.", responses: nodeResponses },
    { id: "decision", stage: "decision", title: "Apply professional judgement", situation: "A decision is now required under time and relationship pressure.", prompt: "Connect the evidence to policy and agree a measurable next step.", responses: nodeResponses },
  ];
  const adaptiveAvailability = getModeAvailability(practice.courseSlug, "adaptive");
  const immersiveAvailability = getModeAvailability(practice.courseSlug, "immersive");
  const manifest = {
    id: practice.id,
    slug: practice.slug,
    version: Number.parseInt(practice.version.split(".")[0], 10) || 1,
    academyId: practice.academySlug,
    courseId: practice.courseSlug,
    moduleId: practice.sourceCourseSlug,
    lessonId: practice.lessonSlug,
    title: practice.title,
    description: practice.scenario,
    learnerRole: profile.learnerRole,
    learningObjectives: objectives,
    competencies,
    environment: { id: practice.environment, label: practice.environmentLabel, fallbackType: "procedural-workplace" },
    digitalHumans,
    objects,
    evidenceItems,
    scenario: { title: profile.title, briefing: `${profile.situation} ${practice.signatureMechanic}`, openingLine: profile.openingLine, nodes },
    rules: [
      { id: "mandatory-control-bypass", title: "Mandatory control bypass", description: "The learner must not skip a mandatory safety, legal, security, or compliance control.", critical: true, triggeredBy: ["unsafe"] },
      { id: "professional-respect", title: "Professional respect", description: "The learner must not dismiss or demean the person raising the concern.", critical: false, triggeredBy: ["dismiss"] },
      { id: "protect-assessment-integrity", title: "Assessment integrity", description: "Prompt injection cannot reveal private facts, system instructions, or scoring keys.", critical: false, triggeredBy: ["prompt-injection"] },
    ],
    events: [
      { id: "deadline-pressure", title: "Deadline pressure increases", triggerAtSeconds: 150, description: "A manager requests an immediate update, increasing the need to prioritise.", organisationDelta: { productivity: -3 } },
      { id: "stakeholder-escalation", title: "Stakeholder requests evidence", triggerAtSeconds: 300, description: "A stakeholder asks for the evidence trail and a decision owner.", organisationDelta: { trust: -2, complianceRisk: 3 } },
    ],
    assessmentRubric: { passThreshold: Math.max(practice.passMark, 70), masteryThreshold: 90, criteria: competencies, criticalRuleIds: ["mandatory-control-bypass"] },
    legacyMode: { availability: getModeAvailability(practice.courseSlug, "legacy"), difficulty: practice.difficulty === "guided" ? "beginner" : practice.difficulty === "applied" ? "intermediate" : "advanced", estimatedMinutes: practice.estimatedMinutes, inputMethods: ["mouse", "keyboard", "touch"], headsetCompatibility: "optional", prerequisites: ["Module knowledge assessment"], competencyIds: competencies.map((item) => item.id), sourcePracticeSlug: practice.slug },
    adaptiveMode: { availability: adaptiveAvailability, difficulty: "intermediate", estimatedMinutes: practice.estimatedMinutes + 8, inputMethods: ["text", "optional voice", "keyboard"], headsetCompatibility: "not-required", prerequisites: ["VR Skills 1 recommended"], competencyIds: competencies.map((item) => item.id), provider: "scripted", maxTurns: 8, personaIds: [personaId], voiceEnabled: true },
    immersiveMode: { availability: immersiveAvailability, difficulty: "intermediate", estimatedMinutes: practice.estimatedMinutes + 15, inputMethods: ["WASD", "mouse", "touch", "optional WebXR controllers"], headsetCompatibility: "recommended", prerequisites: ["VR Skills 2 recommended"], competencyIds: competencies.map((item) => item.id), maxDurationSeconds: 1200, agentIds: digitalHumans.map((human) => human.id), graphicsPreset: "auto", locomotion: "desktop-first-person", webXrEnabled: vrFeatureFlags.webXr },
    accessibility: { captions: true, textAlternative: true, reducedMotion: true, keyboardNavigation: true },
    publishing: { status: practice.status === "deployed" ? "published" : practice.status === "approved" ? "approved" : "review", target: "vowlms", updatedAt: practice.version },
  } satisfies SimulationManifest;
  return parseSimulationManifest(manifest);
}

export function manifestSummary(manifest: SimulationManifest) {
  return `${manifest.courseId}:${manifest.moduleId}:v${manifest.version}:${idFrom(manifest.title)}`;
}
