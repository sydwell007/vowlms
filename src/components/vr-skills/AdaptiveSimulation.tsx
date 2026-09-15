"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { CheckCircle2, Circle, Mic, MicOff, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AvatarController } from "@/components/vr-skills/AvatarController";
import { ModeGuideTour } from "@/components/vr-skills/ModeGuideTour";
import { scoreSimulation } from "@/simulation/assessment/scoring";
import { createScenarioState } from "@/simulation/engine/stateMachine";
import { ScriptedDigitalHumanAdapter } from "@/simulation/integrations/scriptedDigitalHuman";
import { completeVrSession, submitVrConversationTurn, type VrContext } from "@/lib/vrSkillsClient";
import type { ScenarioState, SimulationAssessmentResult, SimulationManifest } from "@/simulation/types";

type Message = { id: string; speaker: "human" | "learner" | "system"; text: string };
type RecognitionResult = { results: ArrayLike<{ 0: { transcript: string } }> };
type Recognition = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((event: RecognitionResult) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const stems = ["I hear your concern. Please tell me what happened.", "What evidence or records can help us clarify this?", "Which policy or required process applies here?", "Let us agree the next action, owner, and follow-up time."];

function initialMessages(manifest: SimulationManifest): Message[] {
  return [{ id: "opening", speaker: "human", text: manifest.scenario.openingLine }];
}

export function AdaptiveSimulation({ manifest }: { manifest: SimulationManifest }) {
  const persona = manifest.digitalHumans[0];
  const storageKey = `goalvow:adaptive:${manifest.id}:v${manifest.version}`;
  const [state, setState] = useState<ScenarioState>(() => createScenarioState(manifest, "adaptive"));
  const [messages, setMessages] = useState<Message[]>(() => initialMessages(manifest));
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [consequence, setConsequence] = useState("The workplace is waiting for your response.");
  const [result, setResult] = useState<SimulationAssessmentResult | null>(null);
  const adapter = useMemo(() => new ScriptedDigitalHumanAdapter(), []);
  const vrContext: VrContext = useMemo(
    () => ({ manifestId: manifest.id, courseId: manifest.courseId, moduleId: manifest.moduleId, mode: "adaptive" }),
    [manifest.courseId, manifest.id, manifest.moduleId]
  );
  const humanState = state.digitalHumanStates[persona.id] ?? persona.initialState;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setVoiceAvailable(Boolean((window as RecognitionWindow).SpeechRecognition || (window as RecognitionWindow).webkitSpeechRecognition)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { state: ScenarioState; messages: Message[]; consequence: string };
      window.requestAnimationFrame(() => { setState(parsed.state); setMessages(parsed.messages); setConsequence(parsed.consequence); if (parsed.state.status === "completed") setResult(scoreSimulation(manifest, parsed.state)); });
    } catch { window.localStorage.removeItem(storageKey); }
  }, [manifest, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ state, messages, consequence }));
  }, [consequence, messages, state, storageKey]);

  async function sendTurn(text: string, inputMethod: "text" | "voice" = "text") {
    const clean = text.trim().slice(0, 800);
    if (!clean || thinking || state.status === "completed") return;
    const learnerMessage: Message = { id: `learner-${Date.now()}`, speaker: "learner", text: clean };
    setMessages((items) => [...items, learnerMessage]); setInput(""); setThinking(true);
    try {
      const response = await adapter.sendLearnerTurn({ manifest, state, personaId: persona.id }, { text: clean, inputMethod });
      setState(response.state); setConsequence(response.consequence);
      setMessages((items) => [...items, { id: `human-${Date.now()}`, speaker: "human", text: response.response }]);
      void submitVrConversationTurn(vrContext, persona.id, clean, response.response);
      if (response.state.status === "completed") {
        const outcome = scoreSimulation(manifest, response.state);
        setResult(outcome);
        void completeVrSession(vrContext, { score: outcome.overallScore, passed: outcome.passed });
      }
    } finally { setThinking(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); void sendTurn(input); }

  function startVoice() {
    const SpeechRecognition = (window as RecognitionWindow).SpeechRecognition ?? (window as RecognitionWindow).webkitSpeechRecognition;
    if (!SpeechRecognition || listening) return;
    const recognition = new SpeechRecognition(); recognition.lang = "en-ZA"; recognition.interimResults = false; recognition.continuous = false;
    recognition.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript ?? ""; setInput(transcript); void sendTurn(transcript, "voice"); };
    recognition.onend = () => setListening(false); recognition.onerror = () => setListening(false); setListening(true); recognition.start();
  }

  function restart() { window.localStorage.removeItem(storageKey); setState(createScenarioState(manifest, "adaptive")); setMessages(initialMessages(manifest)); setConsequence("A new authored variation is ready."); setResult(null); setInput(""); }

  return (
    <section className="overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-2xl" aria-label="VR Skills 2 Adaptive Human Simulation">
      <header className="border-b border-white/10 p-5 sm:p-6" data-mode-tour="adaptive-brief">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">VR Skills 2 - Adaptive Human Simulation</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{manifest.scenario.title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">You are the {manifest.learnerRole}. {manifest.scenario.briefing}</p></div>
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-amber-300/12 px-3 py-1.5 text-xs font-bold text-amber-200">{manifest.adaptiveMode.provider === "scripted" ? "Studio scripted provider" : "VowHumans provider"}</span><span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-300">Turn {state.turn}/{manifest.adaptiveMode.maxTurns}</span></div>
        </div>
      </header>
      <div className="grid lg:grid-cols-[360px_minmax(0,1fr)_300px]">
        <div className="border-b border-white/10 bg-[#101a2d] lg:border-b-0 lg:border-r" data-mode-tour="adaptive-human">
          <div className="h-[330px]"><Canvas camera={{ position: [0, 1.35, 4.5], fov: 42 }} dpr={[1, 1.5]}><color attach="background" args={["#152235"]} /><ambientLight intensity={1.7} /><directionalLight intensity={2.2} position={[3, 5, 4]} /><AvatarController name={persona.name} role={persona.role} palette={persona.avatar.fallbackPalette} animation={thinking ? "think" : listening ? "listen" : "speak"} active /><ContactShadows position={[0, 0, 0]} opacity={0.35} blur={2.5} /></Canvas></div>
          <div className="border-t border-white/10 p-5"><p className="font-bold">{persona.name}</p><p className="text-sm text-teal-200">{persona.role}</p><p className="mt-3 text-sm leading-6 text-slate-300">{persona.biography}</p><div className="mt-4 flex flex-wrap gap-2">{persona.traits.map((trait) => <span key={trait} className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-slate-300">{trait}</span>)}</div></div>
        </div>

        <div className="flex min-h-[640px] min-w-0 flex-col border-b border-white/10 lg:border-b-0 lg:border-r" data-mode-tour="adaptive-conversation">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {messages.map((message) => <div key={message.id} className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 ${message.speaker === "learner" ? "ml-auto bg-teal-600 text-white" : "bg-white/8 text-slate-100"}`}><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] opacity-60">{message.speaker === "learner" ? "You" : persona.name}</p>{message.text}</div>)}
            {thinking ? <div className="flex items-center gap-2 text-sm font-semibold text-amber-200"><Sparkles aria-hidden="true" className="h-4 w-4" /> Digital Human is responding...</div> : null}
          </div>
          <div className="border-t border-white/10 p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold text-slate-400">Conversation starters support the interaction; they are not scored answers.</p>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">{stems.map((stem) => <button key={stem} type="button" disabled={state.status === "completed"} onClick={() => setInput(stem)} className="shrink-0 rounded-full border border-white/12 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-teal-300 hover:text-white disabled:opacity-40">{stem}</button>)}</div>
            <form onSubmit={submit} className="flex items-end gap-2"><label className="min-w-0 flex-1"><span className="sr-only">Your response to {persona.name}</span><textarea value={input} disabled={state.status === "completed"} onChange={(event) => setInput(event.target.value)} maxLength={800} rows={2} placeholder="Respond in your own words..." className="w-full resize-none rounded-lg border border-white/12 bg-white/8 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-teal-300" /></label><button type="button" disabled={!voiceAvailable || listening || state.status === "completed"} onClick={startVoice} aria-label={listening ? "Listening" : "Use microphone"} className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10 text-white disabled:opacity-35">{listening ? <MicOff aria-hidden="true" className="h-5 w-5" /> : <Mic aria-hidden="true" className="h-5 w-5" />}</button><button type="submit" disabled={!input.trim() || thinking || state.status === "completed"} aria-label="Send response" className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-teal-400 text-slate-950 disabled:opacity-35"><Send aria-hidden="true" className="h-5 w-5" /></button></form>
            <p className="mt-2 text-xs text-slate-500">Voice is optional and begins only when you press the microphone. Raw audio is not retained.</p>
          </div>
        </div>

        <aside className="bg-[#0b1425] p-5" data-mode-tour="adaptive-state">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-200">Human state</p>
          <div className="mt-4 space-y-3">{(["trust", "stress", "engagement", "willingnessToDisclose"] as const).map((key) => <div key={key}><div className="flex justify-between text-xs font-semibold capitalize text-slate-300"><span>{key.replace(/([A-Z])/g, " $1")}</span><span>{humanState[key]}</span></div><div className="mt-1 h-1.5 bg-white/10"><div className={`h-full ${key === "stress" ? "bg-amber-400" : "bg-teal-400"}`} style={{ width: `${humanState[key]}%` }} /></div></div>)}</div>
          <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-200">Objectives</p><div className="mt-3 space-y-3">{manifest.learningObjectives.map((objective) => { const done = state.completedObjectives.includes(objective.id); return <div key={objective.id} className="flex gap-2 text-sm leading-5">{done ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> : <Circle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />}<span className={done ? "text-white" : "text-slate-400"}>{objective.title}</span></div>; })}</div></div>
          <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-200">Workplace consequence</p><p className="mt-2 text-sm leading-6 text-slate-300">{consequence}</p></div>
        </aside>
      </div>
      {result ? <div className="border-t border-white/10 bg-[#071526] p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-200">Scenario outcome</p><h3 className="mt-2 text-2xl font-bold">{result.outcome} - {result.overallScore}%</h3><p className="mt-2 text-sm text-slate-300">{result.criticalFailure ? "A deterministic critical rule capped this attempt." : result.passed ? "The competency threshold was met." : "Replay and address the missed cues before progressing."}</p></div><button type="button" onClick={restart} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-slate-950"><RotateCcw aria-hidden="true" className="h-4 w-4" /> Replay variation</button></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{result.competencyScores.map((item) => <div key={item.competencyId} className="border-l-2 border-teal-400 pl-3"><p className="text-2xl font-bold">{item.score}</p><p className="mt-1 text-xs leading-5 text-slate-400">{item.title}</p></div>)}</div><div className="mt-5 flex items-start gap-2 rounded-lg bg-white/6 p-4 text-sm text-slate-300"><ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-200" /> Pass/fail, mandatory controls, and competency evidence were calculated by deterministic rules, not the Digital Human response provider.</div></div> : null}
      <ModeGuideTour manifestId={manifest.id} mode="adaptive" version={manifest.version} />
    </section>
  );
}
