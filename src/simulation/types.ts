export type SimulationMode = "legacy" | "adaptive" | "immersive";
export type ModeAvailability = "available" | "beta" | "coming-soon" | "locked" | "completed";
export type PracticeDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type ScenarioStage = "briefing" | "discovery" | "decision" | "action" | "outcome";

export type CompetencyDefinition = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: "knowledge" | "decision" | "evidence" | "communication" | "professional" | "compliance" | "interpersonal" | "judgement";
  weight: number;
  critical: boolean;
};

export type DigitalHumanState = {
  trust: number;
  confidence: number;
  stress: number;
  frustration: number;
  engagement: number;
  willingnessToDisclose: number;
};

export type DigitalHumanDefinition = {
  id: string;
  name: string;
  role: string;
  organisationRole: string;
  biography: string;
  traits: string[];
  motivation: string;
  objectives: string[];
  publicKnowledge: string[];
  privateKnowledge: string[];
  disclosureRules: string[];
  speakingStyle: string;
  stressResponse: string;
  conflictTolerance: number;
  initialState: DigitalHumanState;
  avatar: {
    modelUrl?: string;
    fallbackPalette: string;
    voiceId?: string;
  };
};

export type InteractionVerb = "inspect" | "read" | "open" | "use" | "activate" | "submit" | "select" | "speak";

export type InteractiveObjectDefinition = {
  id: string;
  label: string;
  description: string;
  interaction: InteractionVerb;
  evidenceId?: string;
  position: [number, number, number];
  scale: [number, number, number];
  shape: "box" | "screen" | "table" | "pod" | "wall";
  color: string;
  required: boolean;
  theoryReference: string;
  action: {
    id: string;
    prompt: string;
    options: string[];
    correctOption: string;
    successFeedback: string;
    retryFeedback: string;
    evidencePrompt: string;
    objectiveId: string;
  };
};

export type ConversationIntent = "acknowledge" | "investigate" | "clarify" | "policy" | "resolve" | "escalate" | "dismiss" | "unsafe" | "prompt-injection" | "neutral";

export type AuthoredResponse = {
  intent: ConversationIntent;
  text: string;
  consequence: string;
  stateDelta: Partial<DigitalHumanState>;
  organisationDelta: Partial<OrganisationState>;
  evidenceId?: string;
  objectiveId?: string;
  criticalRuleId?: string;
};

export type ScenarioNode = {
  id: string;
  stage: ScenarioStage;
  title: string;
  situation: string;
  prompt: string;
  responses: AuthoredResponse[];
};

export type ScenarioRule = {
  id: string;
  title: string;
  description: string;
  critical: boolean;
  triggeredBy: ConversationIntent[];
};

export type ScenarioEventDefinition = {
  id: string;
  title: string;
  triggerAtSeconds: number;
  description: string;
  organisationDelta: Partial<OrganisationState>;
};

export type AssessmentRubric = {
  passThreshold: number;
  masteryThreshold: number;
  criteria: CompetencyDefinition[];
  criticalRuleIds: string[];
};

export type ModeConfiguration = {
  availability: ModeAvailability;
  difficulty: PracticeDifficulty;
  estimatedMinutes: number;
  inputMethods: string[];
  headsetCompatibility: "not-required" | "optional" | "recommended";
  prerequisites: string[];
  competencyIds: string[];
};

export type AdaptiveModeConfiguration = ModeConfiguration & {
  provider: "scripted" | "vowhumans";
  maxTurns: number;
  personaIds: string[];
  voiceEnabled: boolean;
};

export type ImmersiveModeConfiguration = ModeConfiguration & {
  maxDurationSeconds: number;
  agentIds: string[];
  graphicsPreset: "auto" | "low" | "medium" | "high";
  locomotion: "desktop-first-person" | "teleport";
  webXrEnabled: boolean;
};

export type OrganisationState = {
  trust: number;
  morale: number;
  productivity: number;
  complianceRisk: number;
  customerConfidence: number;
  financialImpact: number;
};

export type SimulationManifest = {
  id: string;
  slug: string;
  version: number;
  academyId: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  description: string;
  learnerRole: string;
  learningObjectives: Array<{ id: string; title: string }>;
  competencies: CompetencyDefinition[];
  environment: {
    id: string;
    label: string;
    modelUrl?: string;
    fallbackType: string;
  };
  digitalHumans: DigitalHumanDefinition[];
  objects: InteractiveObjectDefinition[];
  evidenceItems: Array<{ id: string; title: string; description: string }>;
  scenario: {
    title: string;
    briefing: string;
    openingLine: string;
    nodes: ScenarioNode[];
  };
  rules: ScenarioRule[];
  events: ScenarioEventDefinition[];
  assessmentRubric: AssessmentRubric;
  legacyMode: ModeConfiguration & { sourcePracticeSlug: string };
  adaptiveMode: AdaptiveModeConfiguration;
  immersiveMode: ImmersiveModeConfiguration;
  accessibility: {
    captions: boolean;
    textAlternative: boolean;
    reducedMotion: boolean;
    keyboardNavigation: boolean;
  };
  publishing: {
    status: "draft" | "review" | "approved" | "published" | "archived";
    target: "studio" | "vowlms";
    updatedAt: string;
  };
};

export type SimulationEvent = {
  id: string;
  sequence: number;
  type: "scenario_started" | "learner_spoke" | "digital_human_spoken" | "object_selected" | "object_action_attempted" | "object_used" | "evidence_collected" | "rule_triggered" | "scenario_event_fired" | "simulation_completed";
  timestamp: string;
  payload: Record<string, string | number | boolean>;
};

export type ScenarioState = {
  sessionId: string;
  manifestId: string;
  mode: SimulationMode;
  status: "ready" | "active" | "completed";
  stage: ScenarioStage;
  turn: number;
  variables: Record<string, number | string | boolean>;
  inspectedObjectIds: string[];
  completedActionIds: string[];
  actionAttempts: Record<string, number>;
  evidenceCollected: string[];
  decisions: string[];
  completedObjectives: string[];
  failedCriticalRules: string[];
  digitalHumanStates: Record<string, DigitalHumanState>;
  organisation: OrganisationState;
  triggeredEvents: string[];
  timeElapsed: number;
  events: SimulationEvent[];
};

export type ConversationResult = {
  intent: ConversationIntent;
  response: string;
  consequence: string;
  state: ScenarioState;
};

export type ObjectActionResult = {
  correct: boolean;
  feedback: string;
  state: ScenarioState;
};

export type CompetencyScore = {
  competencyId: string;
  title: string;
  score: number;
  evidence: string[];
};

export type SimulationAssessmentResult = {
  overallScore: number;
  passed: boolean;
  mastered: boolean;
  criticalFailure: boolean;
  outcome: string;
  competencyScores: CompetencyScore[];
  strengths: string[];
  improvements: string[];
  missedCues: string[];
};
