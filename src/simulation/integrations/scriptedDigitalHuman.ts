import { applyConversationTurn } from "@/simulation/engine/stateMachine";
import type { DigitalHumanAdapter, DigitalHumanSessionContext, LearnerTurn } from "@/simulation/integrations/digitalHuman";

export class ScriptedDigitalHumanAdapter implements DigitalHumanAdapter {
  readonly provider = "scripted" as const;
  async createSession(context: DigitalHumanSessionContext) { return { sessionId: context.state.sessionId }; }
  async sendLearnerTurn(context: DigitalHumanSessionContext, turn: LearnerTurn) {
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    return applyConversationTurn(context.manifest, context.state, turn.text, context.personaId);
  }
  async updateScenarioState() { return Promise.resolve(); }
  async endSession() { return Promise.resolve(); }
}
