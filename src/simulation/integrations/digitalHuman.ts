import type { ConversationResult, ScenarioState, SimulationManifest } from "@/simulation/types";

export type DigitalHumanSessionContext = { manifest: SimulationManifest; state: ScenarioState; personaId: string };
export type LearnerTurn = { text: string; inputMethod: "text" | "voice" };

export interface DigitalHumanAdapter {
  readonly provider: "scripted" | "vowhumans";
  createSession(context: DigitalHumanSessionContext): Promise<{ sessionId: string }>;
  sendLearnerTurn(context: DigitalHumanSessionContext, turn: LearnerTurn): Promise<ConversationResult>;
  updateScenarioState(sessionId: string, state: ScenarioState): Promise<void>;
  endSession(sessionId: string): Promise<void>;
}
