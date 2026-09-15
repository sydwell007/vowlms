import type { ConversationResult, ScenarioState } from "@/simulation/types";
import type { DigitalHumanAdapter, DigitalHumanSessionContext, LearnerTurn } from "@/simulation/integrations/digitalHuman";

export type VowHumansTransport = {
  createSession(context: DigitalHumanSessionContext): Promise<{ sessionId: string }>;
  sendTurn(sessionId: string, turn: LearnerTurn): Promise<ConversationResult>;
  updateState(sessionId: string, state: ScenarioState): Promise<void>;
  endSession(sessionId: string): Promise<void>;
};

export class VowHumansAdapter implements DigitalHumanAdapter {
  readonly provider = "vowhumans" as const;
  constructor(private readonly transport: VowHumansTransport) {}
  createSession(context: DigitalHumanSessionContext) { return this.transport.createSession(context); }
  sendLearnerTurn(context: DigitalHumanSessionContext, turn: LearnerTurn) { return this.transport.sendTurn(context.state.sessionId, turn); }
  updateScenarioState(sessionId: string, state: ScenarioState) { return this.transport.updateState(sessionId, state); }
  endSession(sessionId: string) { return this.transport.endSession(sessionId); }
}
