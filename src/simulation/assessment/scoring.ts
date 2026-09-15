import type { CompetencyScore, ScenarioState, SimulationAssessmentResult, SimulationManifest } from "@/simulation/types";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function scoreSimulation(manifest: SimulationManifest, state: ScenarioState): SimulationAssessmentResult {
  const criticalFailure = state.failedCriticalRules.some((rule) => manifest.assessmentRubric.criticalRuleIds.includes(rule));
  const objectiveRatio = state.completedObjectives.length / manifest.learningObjectives.length;
  const evidenceRatio = state.evidenceCollected.length / Math.max(1, Math.min(manifest.evidenceItems.length, 5));
  const human = state.digitalHumanStates[manifest.digitalHumans[0].id] ?? manifest.digitalHumans[0].initialState;
  const signals: Record<CompetencyScore["competencyId"], number> = {};
  manifest.competencies.forEach((competency) => {
    let value = 45 + objectiveRatio * 30 + evidenceRatio * 15;
    if (competency.category === "communication" || competency.category === "interpersonal") value = (human.trust + human.engagement) / 2;
    if (competency.category === "compliance") value = 100 - state.organisation.complianceRisk;
    if (competency.category === "evidence") value = 35 + evidenceRatio * 65;
    if (competency.category === "decision" || competency.category === "judgement") value = state.completedObjectives.includes("agree-action") ? value + 12 : value - 12;
    signals[competency.id] = clamp(value - state.failedCriticalRules.length * 18);
  });
  const competencyScores = manifest.competencies.map((competency) => ({
    competencyId: competency.id,
    title: competency.title,
    score: signals[competency.id],
    evidence: state.events.filter((item) => item.type === "evidence_collected" || item.type === "learner_spoke").slice(-3).map((item) => item.type.replace(/_/g, " ")),
  }));
  const weighted = competencyScores.reduce((sum, item) => {
    const competency = manifest.competencies.find((candidate) => candidate.id === item.competencyId);
    return sum + item.score * ((competency?.weight ?? 0) / 100);
  }, 0);
  const overallScore = criticalFailure ? Math.min(65, clamp(weighted)) : clamp(weighted);
  const passed = !criticalFailure && overallScore >= manifest.assessmentRubric.passThreshold;
  const strengths = competencyScores.filter((item) => item.score >= 75).map((item) => item.title);
  const improvements = competencyScores.filter((item) => item.score < 70).map((item) => item.title);
  const missedCues = [
    !state.completedObjectives.includes("gather-evidence") ? "The available account was not investigated with enough focused questions." : "",
    !state.completedObjectives.includes("apply-policy") ? "The response was not explicitly connected to a policy, standard, or required process." : "",
    !state.completedObjectives.includes("agree-action") ? "The conversation ended without a measurable owner, action, and follow-up." : "",
  ].filter(Boolean);
  const outcome = criticalFailure ? "Critical control breached" : passed && overallScore >= 90 ? "Excellent professional resolution" : passed ? "Workable resolution" : "Outcome requires another rehearsal";
  return { overallScore, passed, mastered: passed && overallScore >= manifest.assessmentRubric.masteryThreshold, criticalFailure, outcome, competencyScores, strengths, improvements, missedCues };
}
