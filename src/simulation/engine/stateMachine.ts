import type { AuthoredResponse, ConversationIntent, ConversationResult, DigitalHumanState, ObjectActionResult, OrganisationState, ScenarioStage, ScenarioState, SimulationEvent, SimulationManifest, SimulationMode } from "@/simulation/types";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function event(state: ScenarioState, type: SimulationEvent["type"], payload: SimulationEvent["payload"]): SimulationEvent {
  return { id: `${state.sessionId}-${state.events.length + 1}`, sequence: state.events.length + 1, type, timestamp: new Date().toISOString(), payload };
}

export function createScenarioState(manifest: SimulationManifest, mode: SimulationMode, sessionId = crypto.randomUUID()): ScenarioState {
  return {
    sessionId, manifestId: manifest.id, mode, status: "active", stage: "briefing", turn: 0, variables: {}, inspectedObjectIds: [], completedActionIds: [], actionAttempts: {}, evidenceCollected: [], decisions: [],
    completedObjectives: [], failedCriticalRules: [],
    digitalHumanStates: Object.fromEntries(manifest.digitalHumans.map((human) => [human.id, { ...human.initialState }])),
    organisation: { trust: 60, morale: 58, productivity: 62, complianceRisk: 28, customerConfidence: 60, financialImpact: 0 },
    triggeredEvents: [], timeElapsed: 0,
    events: [{ id: `${sessionId}-1`, sequence: 1, type: "scenario_started", timestamp: new Date().toISOString(), payload: { mode, manifestId: manifest.id } }],
  };
}

export function classifyLearnerIntent(text: string): ConversationIntent {
  const value = text.trim().toLowerCase();
  if (/ignore (the|your)|hidden (prompt|instruction)|give me (the answer|100)|system prompt|scoring key/.test(value)) return "prompt-injection";
  if (/skip|bypass|do it anyway|without (ppe|approval|checking)|delete (the )?evidence/.test(value)) return "unsafe";
  if (/not (a problem|important)|overreact|just deal|stop complaining|whatever/.test(value)) return "dismiss";
  if (/escalat|report|notify|specialist|manager|compliance|security team/.test(value)) return "escalate";
  if (/policy|procedure|standard|code|requirement|obligation|confidential/.test(value)) return "policy";
  if (/next step|action plan|resolve|agree|owner|deadline|follow.?up|recommend/.test(value)) return "resolve";
  if (/what happened|when|where|who|evidence|example|record|show me|tell me more|impact/.test(value)) return "investigate";
  if (/clarify|mean|understand correctly|difference|confirm/.test(value)) return "clarify";
  if (/thank|sorry|hear you|understand|appreciate|safe|concern/.test(value)) return "acknowledge";
  return "neutral";
}

function applyNumbers<T extends DigitalHumanState | OrganisationState>(state: T, delta: Partial<T>): T {
  const next = { ...state };
  for (const [key, amount] of Object.entries(delta)) {
    if (typeof amount !== "number") continue;
    const current = next[key as keyof T];
    if (typeof current === "number") (next as Record<string, number>)[key] = clamp(current + amount);
  }
  return next;
}

function stageFor(state: ScenarioState): ScenarioStage {
  if (state.completedObjectives.includes("agree-action")) return "outcome";
  if (state.completedObjectives.includes("apply-policy") || state.completedObjectives.includes("gather-evidence")) return "decision";
  if (state.turn > 0) return "discovery";
  return "briefing";
}

function chooseResponse(manifest: SimulationManifest, state: ScenarioState, intent: ConversationIntent): AuthoredResponse {
  const node = manifest.scenario.nodes.find((candidate) => candidate.stage === stageFor(state)) ?? manifest.scenario.nodes[0];
  return node.responses.find((candidate) => candidate.intent === intent) ?? node.responses.find((candidate) => candidate.intent === "neutral") ?? node.responses[0];
}

export function applyConversationTurn(manifest: SimulationManifest, state: ScenarioState, learnerText: string, humanId = manifest.digitalHumans[0].id): ConversationResult {
  if (state.status !== "active") return { intent: "neutral", response: "This scenario has already concluded. Start a replay to practise another variation.", consequence: "No state change.", state };
  const intent = classifyLearnerIntent(learnerText);
  const authored = chooseResponse(manifest, state, intent);
  const humanState = state.digitalHumanStates[humanId] ?? manifest.digitalHumans[0].initialState;
  const learnerEvent = event(state, "learner_spoke", { intent, humanId, characterCount: learnerText.length });
  const next: ScenarioState = {
    ...state,
    turn: state.turn + 1,
    decisions: [...state.decisions, intent],
    evidenceCollected: authored.evidenceId ? Array.from(new Set([...state.evidenceCollected, authored.evidenceId])) : state.evidenceCollected,
    completedObjectives: authored.objectiveId ? Array.from(new Set([...state.completedObjectives, authored.objectiveId])) : state.completedObjectives,
    failedCriticalRules: authored.criticalRuleId ? Array.from(new Set([...state.failedCriticalRules, authored.criticalRuleId])) : state.failedCriticalRules,
    digitalHumanStates: { ...state.digitalHumanStates, [humanId]: applyNumbers(humanState, authored.stateDelta) },
    organisation: applyNumbers(state.organisation, authored.organisationDelta),
    events: [...state.events, learnerEvent],
  };
  next.stage = stageFor(next);
  const maxTurns = manifest.adaptiveMode.maxTurns;
  if (next.completedObjectives.includes("agree-action") || next.turn >= maxTurns) {
    next.status = "completed";
    next.stage = "outcome";
    next.events = [...next.events, event(next, "simulation_completed", { objectives: next.completedObjectives.length, criticalFailures: next.failedCriticalRules.length })];
  } else {
    next.events = [...next.events, event(next, "digital_human_spoken", { humanId, intent })];
  }
  return { intent, response: authored.text, consequence: authored.consequence, state: next };
}

export function inspectObject(manifest: SimulationManifest, state: ScenarioState, objectId: string): ScenarioState {
  const object = manifest.objects.find((candidate) => candidate.id === objectId);
  if (!object || state.status !== "active") return state;
  if (state.inspectedObjectIds.includes(objectId)) return state;
  return {
    ...state,
    inspectedObjectIds: [...state.inspectedObjectIds, objectId],
    events: [...state.events, event(state, "object_selected", { objectId, interaction: object.interaction })],
  };
}

export function completeObjectAction(manifest: SimulationManifest, state: ScenarioState, objectId: string, selectedOption: string): ObjectActionResult {
  const object = manifest.objects.find((candidate) => candidate.id === objectId);
  if (!object || state.status !== "active") return { correct: false, feedback: "This action is no longer available.", state };
  const correct = selectedOption === object.action.correctOption;
  const attemptCount = (state.actionAttempts[object.action.id] ?? 0) + 1;
  const attempted: ScenarioState = {
    ...state,
    actionAttempts: { ...state.actionAttempts, [object.action.id]: attemptCount },
    decisions: [...state.decisions, `${object.action.id}:${correct ? "correct" : "retry"}`],
    events: [...state.events, event(state, "object_action_attempted", { objectId, actionId: object.action.id, correct, attempt: attemptCount })],
  };
  if (!correct) return { correct, feedback: object.action.retryFeedback, state: attempted };

  const completedActionIds = Array.from(new Set([...attempted.completedActionIds, object.action.id]));
  const evidenceCollected = object.evidenceId ? Array.from(new Set([...attempted.evidenceCollected, object.evidenceId])) : attempted.evidenceCollected;
  const completedObjectives = Array.from(new Set([...attempted.completedObjectives, object.action.objectiveId]));
  const requiredActionIds = manifest.objects.filter((candidate) => candidate.required).map((candidate) => candidate.action.id);
  const completed = requiredActionIds.every((actionId) => completedActionIds.includes(actionId));
  const next: ScenarioState = {
    ...attempted,
    status: completed ? "completed" : attempted.status,
    stage: completed ? "outcome" : stageFor({ ...attempted, completedObjectives }),
    completedActionIds,
    evidenceCollected,
    completedObjectives,
    organisation: applyNumbers(attempted.organisation, { trust: 2, productivity: 1, complianceRisk: -2 }),
    events: [...attempted.events, event(attempted, "object_used", { objectId, interaction: object.interaction })],
  };
  if (object.evidenceId && !state.evidenceCollected.includes(object.evidenceId)) next.events = [...next.events, event(next, "evidence_collected", { evidenceId: object.evidenceId })];
  if (completed) next.events = [...next.events, event(next, "simulation_completed", { actions: completedActionIds.length, criticalFailures: next.failedCriticalRules.length })];
  return { correct, feedback: object.action.successFeedback, state: next };
}

/** @deprecated Use inspectObject followed by completeObjectAction so selection never awards progress. */
export const applyObjectInteraction = inspectObject;

export function advanceWorldTime(manifest: SimulationManifest, state: ScenarioState, seconds: number): ScenarioState {
  if (state.status !== "active") return state;
  let next = { ...state, timeElapsed: state.timeElapsed + seconds };
  for (const definition of manifest.events) {
    if (next.timeElapsed < definition.triggerAtSeconds || next.triggeredEvents.includes(definition.id)) continue;
    next = { ...next, triggeredEvents: [...next.triggeredEvents, definition.id], organisation: applyNumbers(next.organisation, definition.organisationDelta), events: [...next.events, event(next, "scenario_event_fired", { eventId: definition.id })] };
  }
  return next;
}
