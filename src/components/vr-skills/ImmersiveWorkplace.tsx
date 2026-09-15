"use client";

import { Grid, Html, OrbitControls, PointerLockControls } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { CheckCircle2, ClipboardCheck, Eye, Gauge, Glasses, Keyboard, LocateFixed, MessageSquareText, Send, Settings2, Timer, Users, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { WebGLRenderer } from "three";
import { AvatarController, type AvatarAnimation } from "@/components/vr-skills/AvatarController";
import { ModeGuideTour } from "@/components/vr-skills/ModeGuideTour";
import { scoreSimulation } from "@/simulation/assessment/scoring";
import { advanceWorldTime, applyConversationTurn, completeObjectAction, createScenarioState, inspectObject } from "@/simulation/engine/stateMachine";
import { completeVrSession, sendVrEvent, submitVrObjectAction, type VrContext } from "@/lib/vrSkillsClient";
import type { InteractiveObjectDefinition, ScenarioState, SimulationAssessmentResult, SimulationManifest } from "@/simulation/types";

type GraphicsPreset = "auto" | "low" | "medium" | "high";
type XRSystemLike = { isSessionSupported(mode: string): Promise<boolean>; requestSession(mode: string, options?: Record<string, unknown>): Promise<unknown> };

function FirstPersonMovement({ enabled, speed }: { enabled: boolean; speed: number }) {
  const { camera } = useThree();
  const keys = useRef(new Set<string>());
  useEffect(() => {
    if (!enabled) return;
    const down = (event: KeyboardEvent) => { if (!(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) keys.current.add(event.code); };
    const up = (event: KeyboardEvent) => keys.current.delete(event.code);
    const activeKeys = keys.current;
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); activeKeys.clear(); };
  }, [enabled]);
  // Three.js camera transforms are intentionally imperative inside the R3F render loop.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    if (!enabled) return;
    const distance = speed * delta;
    if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) camera.translateZ(-distance);
    if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) camera.translateZ(distance);
    if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) camera.translateX(-distance);
    if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) camera.translateX(distance);
    camera.position.x = Math.max(-6.2, Math.min(6.2, camera.position.x));
    camera.position.z = Math.max(-3.8, Math.min(6.5, camera.position.z));
    camera.position.y = 1.65;
  });
  /* eslint-enable react-hooks/immutability */
  return enabled ? <PointerLockControls /> : <OrbitControls enablePan={false} maxDistance={12} minDistance={4} target={[0, 1, -0.6]} />;
}

function WorldObject({ object, active, complete, labelLift, onUse }: { object: InteractiveObjectDefinition; active: boolean; complete: boolean; labelLift: number; onUse: () => void }) {
  function select(event: ThreeEvent<MouseEvent>) { event.stopPropagation(); onUse(); }
  return (
    <group position={object.position}>
      <mesh castShadow receiveShadow onClick={select} onPointerEnter={() => { document.body.style.cursor = "pointer"; }} onPointerLeave={() => { document.body.style.cursor = "default"; }}>
        {object.shape === "pod" ? <cylinderGeometry args={[object.scale[0] / 2, object.scale[0] / 1.8, object.scale[1], 24]} /> : <boxGeometry args={object.scale} />}
        <meshStandardMaterial color={complete ? "#059669" : active ? "#f5c542" : object.color} emissive={active ? "#b45309" : complete ? "#047857" : "#000000"} emissiveIntensity={active || complete ? 0.32 : 0} roughness={0.52} />
      </mesh>
      <Html center position={[0, object.scale[1] / 2 + labelLift, 0]}>
        <button type="button" onClick={onUse} className={`w-24 rounded-lg border px-2 py-1.5 text-center text-[10px] font-bold leading-tight shadow-xl sm:w-28 ${active ? "border-amber-200 bg-amber-400 text-slate-950" : complete ? "border-emerald-200 bg-emerald-700 text-white" : "border-white/50 bg-slate-950/90 text-white"}`}><span className="block text-[8px] uppercase tracking-[0.1em] opacity-65">{object.interaction}</span>{object.label}</button>
      </Html>
    </group>
  );
}

function WorldScene({ manifest, state, selectedObjectId, selectedHumanId, onUseObject, onSelectHuman, firstPerson, movementSpeed }: { manifest: SimulationManifest; state: ScenarioState; selectedObjectId: string | null; selectedHumanId: string; onUseObject: (object: InteractiveObjectDefinition) => void; onSelectHuman: (id: string) => void; firstPerson: boolean; movementSpeed: number }) {
  return <>
    <color attach="background" args={["#d8e7e3"]} /><fog attach="fog" args={["#d8e7e3", 14, 26]} /><ambientLight intensity={1.25} /><directionalLight castShadow intensity={2.3} position={[5, 8, 5]} />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16, 11]} /><meshStandardMaterial color="#eaf2ef" roughness={0.9} /></mesh>
    <mesh receiveShadow position={[0, 3.2, -5]}><boxGeometry args={[16, 6.4, 0.24]} /><meshStandardMaterial color="#c8d6d2" /></mesh>
    <mesh receiveShadow position={[-7.8, 2.4, 0]}><boxGeometry args={[0.24, 4.8, 10]} /><meshStandardMaterial color="#b9c8c4" /></mesh>
    {manifest.objects.map((object, index) => <WorldObject key={object.id} object={{ ...object, position: [[-4.6, -2.4, 0, 2.4, 4.6][index] ?? object.position[0], object.scale[1] / 2, index % 2 === 0 ? -1.1 : 1.25] }} active={selectedObjectId === object.id} complete={state.completedActionIds.includes(object.action.id)} labelLift={[-0.1, -1, -0.1, 2.5, -0.1][index] ?? 0.2} onUse={() => onUseObject(object)} />)}
    {manifest.digitalHumans.map((human, index) => <AvatarController key={human.id} name={human.name} role={human.role} palette={human.avatar.fallbackPalette} position={index === 0 ? [-4.9, 0, -3.8] : index === 1 ? [4.9, 0, -3.8] : [0, 0, -4.1]} active={selectedHumanId === human.id} animation={(selectedHumanId === human.id ? "listen" : "idle") as AvatarAnimation} showLabel={false} onSelect={() => onSelectHuman(human.id)} />)}
    <Grid args={[16, 11]} cellColor="#8eb0aa" cellSize={0.5} fadeDistance={18} position={[0, 0.01, 0]} sectionColor="#0f766e" />
    <FirstPersonMovement enabled={firstPerson} speed={movementSpeed} />
  </>;
}

function signal(value: number, inverse = false) {
  const adjusted = inverse ? 100 - value : value;
  return adjusted >= 68 ? "Strong" : adjusted >= 42 ? "Watch" : "At risk";
}

export function ImmersiveWorkplace({ manifest }: { manifest: SimulationManifest }) {
  const [state, setState] = useState<ScenarioState>(() => createScenarioState(manifest, "immersive"));
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");
  const [selectedHumanId, setSelectedHumanId] = useState(manifest.digitalHumans[0].id);
  const [input, setInput] = useState("");
  const [lastResponse, setLastResponse] = useState(manifest.scenario.openingLine);
  const [lastConsequence, setLastConsequence] = useState("The workplace is active. Gather evidence and speak to the people involved.");
  const [firstPerson, setFirstPerson] = useState(false);
  const [graphics, setGraphics] = useState<GraphicsPreset>(manifest.immersiveMode.graphicsPreset);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [movementSpeed, setMovementSpeed] = useState(2.4);
  const [xrSupported, setXrSupported] = useState(false);
  const [xrActive, setXrActive] = useState(false);
  const [xrMessage, setXrMessage] = useState("Checking headset support...");
  const [result, setResult] = useState<SimulationAssessmentResult | null>(null);
  const renderer = useRef<WebGLRenderer | null>(null);
  const actionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const eventSequence = useRef(0);
  const storageKey = `goalvow:immersive:${manifest.id}:v${manifest.version}`;
  const vrContext: VrContext = useMemo(
    () => ({ manifestId: manifest.id, courseId: manifest.courseId, moduleId: manifest.moduleId, mode: "immersive" }),
    [manifest.courseId, manifest.id, manifest.moduleId]
  );
  const selectedHuman = manifest.digitalHumans.find((human) => human.id === selectedHumanId) ?? manifest.digitalHumans[0];
  const selectedObject = manifest.objects.find((object) => object.id === selectedObjectId) ?? null;
  const requiredEvidence = manifest.objects.filter((object) => object.required && object.evidenceId);
  const completedRequiredCount = requiredEvidence.filter((object) => state.completedActionIds.includes(object.action.id)).length;
  const actionProgress = requiredEvidence.length ? Math.round((completedRequiredCount / requiredEvidence.length) * 100) : 0;
  const dpr: [number, number] = graphics === "low" ? [0.75, 1] : graphics === "high" ? [1, 2] : [1, 1.5];

  function nextEventSequence() {
    eventSequence.current += 1;
    return eventSequence.current;
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<ScenarioState>;
      const restored = { ...createScenarioState(manifest, "immersive", parsed.sessionId), ...parsed, inspectedObjectIds: parsed.inspectedObjectIds ?? [], completedActionIds: parsed.completedActionIds ?? [], actionAttempts: parsed.actionAttempts ?? {} } as ScenarioState;
      window.requestAnimationFrame(() => { setState(restored); if (restored.status === "completed") setResult(scoreSimulation(manifest, restored)); });
    } catch { window.localStorage.removeItem(storageKey); }
  }, [manifest, storageKey]);
  useEffect(() => { window.localStorage.setItem(storageKey, JSON.stringify(state)); }, [state, storageKey]);
  useEffect(() => { const timer = window.setInterval(() => setState((current) => advanceWorldTime(manifest, current, 15)), 10_000); return () => window.clearInterval(timer); }, [manifest]);
  useEffect(() => {
    const secure = window.isSecureContext;
    const xr = (navigator as Navigator & { xr?: XRSystemLike }).xr;
    if (!secure || !xr || !manifest.immersiveMode.webXrEnabled) { window.requestAnimationFrame(() => { setXrSupported(false); setXrMessage(!secure ? "WebXR requires HTTPS." : "Use Desktop 3D Mode on this browser or device."); }); return; }
    xr.isSessionSupported("immersive-vr").then((supported) => { setXrSupported(supported); setXrMessage(supported ? "Compatible headset detected." : "No compatible immersive headset detected. Desktop remains fully functional."); }).catch(() => { setXrSupported(false); setXrMessage("Headset capability could not be confirmed. Continue on desktop."); });
  }, [manifest.immersiveMode.webXrEnabled]);

  function selectObject(object: InteractiveObjectDefinition) {
    setSelectedObjectId(object.id);
    setSelectedOption("");
    setActionFeedback("");
    setState((current) => inspectObject(manifest, current, object.id));
    setLastConsequence(`${object.label} selected. Review its evidence and complete the action decision. Selection alone does not complete the task.`);
    void sendVrEvent(vrContext, "hotspot_viewed", { objectId: object.id }, nextEventSequence());
    window.requestAnimationFrame(() => actionHeadingRef.current?.focus());
  }

  function submitObjectDecision(event: FormEvent) {
    event.preventDefault();
    if (!selectedObject || !selectedOption || state.status === "completed") return;
    const outcome = completeObjectAction(manifest, state, selectedObject.id, selectedOption);
    setState(outcome.state);
    setActionFeedback(outcome.feedback);
    setLastConsequence(outcome.feedback);
    void submitVrObjectAction(vrContext, selectedObject.id, selectedOption);
    if (outcome.state.status === "completed") {
      const assessment = scoreSimulation(manifest, outcome.state);
      setResult(assessment);
      void completeVrSession(vrContext, { score: assessment.overallScore, passed: assessment.passed });
    }
  }
  function converse(event: FormEvent) {
    event.preventDefault();
    const clean = input.trim().slice(0, 800);
    if (!clean || state.status === "completed") return;
    const turn = applyConversationTurn(manifest, state, clean, selectedHumanId);
    setState(turn.state);
    setLastResponse(turn.response);
    setLastConsequence(turn.consequence);
    setInput("");
    void sendVrEvent(vrContext, "learner_spoke", { digitalHumanId: selectedHumanId }, nextEventSequence());
    if (turn.state.status === "completed") {
      const assessment = scoreSimulation(manifest, turn.state);
      setResult(assessment);
      void completeVrSession(vrContext, { score: assessment.overallScore, passed: assessment.passed });
    }
  }
  async function enterXr() {
    const xr = (navigator as Navigator & { xr?: XRSystemLike }).xr;
    if (!xrSupported || !xr || !renderer.current) return;
    try {
      const session = await xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"] });
      renderer.current.xr.enabled = true;
      await renderer.current.xr.setSession(session as never);
      setXrActive(true);
      setXrMessage("Immersive session active. Exit from the headset system menu.");
      void sendVrEvent(vrContext, "xr_started", {}, nextEventSequence());
    } catch {
      setXrActive(false);
      setXrMessage("The headset session did not start. Desktop progress is unchanged.");
      void sendVrEvent(vrContext, "xr_failed", {}, nextEventSequence());
    }
  }

  return (
    <section className="bg-[#050b18] text-white shadow-2xl" aria-label="VR Skills 3 Immersive Living Workplace">
      <header className="border-b border-white/10 bg-[#0b1425] p-5 sm:p-6"><div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">VR Skills 3 - Immersive Living Workplace</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{manifest.environment.label}</h2><p className="mt-2 text-sm leading-6 text-slate-300">Perform as the {manifest.learnerRole}. Inspect evidence, speak with people, respond to timed events, and create a defensible outcome.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setFirstPerson((value) => !value)} className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold ${firstPerson ? "bg-teal-300 text-slate-950" : "bg-white/10"}`}><Keyboard aria-hidden="true" className="h-4 w-4" /> {firstPerson ? "First person on" : "Enter first person"}</button><button type="button" onClick={() => setSettingsOpen((value) => !value)} aria-label="Open comfort and graphics settings" className="grid h-10 w-10 place-items-center rounded-lg bg-white/10"><Settings2 aria-hidden="true" className="h-4 w-4" /></button><button type="button" disabled={!xrSupported || xrActive} onClick={() => void enterXr()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-bold disabled:opacity-40"><Glasses aria-hidden="true" className="h-4 w-4" /> {xrActive ? "VR active" : "Enter VR"}</button></div></div>{settingsOpen ? <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-3"><label className="text-xs font-semibold text-slate-300">Graphics preset<select value={graphics} onChange={(event) => setGraphics(event.target.value as GraphicsPreset)} className="mt-2 h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-white"><option value="auto">Auto</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="text-xs font-semibold text-slate-300">Movement speed<input type="range" min="1" max="4" step="0.2" value={movementSpeed} onChange={(event) => setMovementSpeed(Number(event.target.value))} className="mt-4 w-full accent-teal-400" /></label><div className="text-xs leading-5 text-slate-400"><p className="font-bold text-slate-200">Comfort defaults</p><p>Desktop orbit until first-person is explicitly selected. Headset locomotion uses the runtime&apos;s local-floor space and system comfort controls.</p></div></div> : null}</header>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative h-[620px] min-h-[520px]" id="living-world-canvas">
          <Canvas camera={{ position: [0, 2, 9], fov: 55 }} dpr={dpr} shadows={graphics !== "low"} onCreated={({ gl }) => { renderer.current = gl; gl.xr.enabled = true; }}><WorldScene manifest={manifest} state={state} selectedObjectId={selectedObjectId} selectedHumanId={selectedHumanId} onUseObject={selectObject} onSelectHuman={setSelectedHumanId} firstPerson={firstPerson} movementSpeed={movementSpeed} /></Canvas>
          <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-lg border border-white/15 bg-slate-950/88 p-4 shadow-xl backdrop-blur"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-200"><LocateFixed aria-hidden="true" className="h-4 w-4" /> Live objective</p><p className="mt-2 text-sm font-semibold">Gather evidence, establish trust, and agree a compliant next action.</p><p className="mt-2 text-xs leading-5 text-slate-400">{firstPerson ? "WASD moves. Press Escape to release the pointer." : "Drag to inspect. Select Enter first person for WASD movement."}</p></div>
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-2"><span className="rounded-full bg-slate-950/88 px-3 py-1.5 text-xs font-bold"><Timer aria-hidden="true" className="mr-1.5 inline h-3.5 w-3.5 text-teal-200" />{Math.floor(state.timeElapsed / 60)}:{String(state.timeElapsed % 60).padStart(2, "0")}</span><span className="rounded-full bg-slate-950/88 px-3 py-1.5 text-xs font-bold"><Users aria-hidden="true" className="mr-1.5 inline h-3.5 w-3.5 text-teal-200" />{manifest.digitalHumans.length} active agents</span><span className="rounded-full bg-slate-950/88 px-3 py-1.5 text-xs font-bold"><Gauge aria-hidden="true" className="mr-1.5 inline h-3.5 w-3.5 text-teal-200" />{graphics.toUpperCase()} graphics</span></div>
        </div>

        <aside className="border-t border-white/10 bg-[#0b1425] xl:h-[620px] xl:overflow-y-auto xl:border-l xl:border-t-0">
          <div className="border-b border-white/10 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-200">People in the room</p><div className="mt-3 flex flex-wrap gap-2">{manifest.digitalHumans.map((human) => <button key={human.id} type="button" onClick={() => setSelectedHumanId(human.id)} className={`rounded-lg border px-3 py-2 text-left text-xs ${selectedHumanId === human.id ? "border-teal-300 bg-teal-300 text-slate-950" : "border-white/12 bg-white/5 text-slate-300"}`}><strong className="block">{human.name}</strong><span className="opacity-70">{human.role}</span></button>)}</div></div>
          <div className="border-b border-white/10 p-5" aria-live="polite">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">Action console</p><span className="text-xs font-bold text-teal-200">{actionProgress}% complete</span></div>
            <div className="mt-2 h-1.5 overflow-hidden bg-white/10"><div className="h-full bg-teal-300 transition-[width]" style={{ width: `${actionProgress}%` }} /></div>
            {selectedObject ? (
              <form onSubmit={submitObjectDecision} className="mt-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-200"><Eye aria-hidden="true" className="h-3.5 w-3.5" /> Station selected</p>
                <h3 ref={actionHeadingRef} tabIndex={-1} className="mt-1 text-lg font-bold outline-none">{selectedObject.label}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400"><strong className="text-slate-200">Theory:</strong> {selectedObject.theoryReference}</p>
                <div className="mt-3 border-l-2 border-amber-300 bg-amber-300/8 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200">Required decision</p><p className="mt-1 text-sm font-semibold leading-5 text-white">{selectedObject.action.prompt}</p></div>
                <fieldset className="mt-3 space-y-2" disabled={state.completedActionIds.includes(selectedObject.action.id) || state.status === "completed"}>
                  <legend className="sr-only">Choose the best action for {selectedObject.label}</legend>
                  {selectedObject.action.options.map((option) => (
                    <label key={option} className={`flex cursor-pointer items-start gap-2 border p-3 text-xs leading-5 transition ${selectedOption === option ? "border-teal-300 bg-teal-300/12 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"}`}>
                      <input type="radio" name={`${selectedObject.action.id}-option`} value={option} checked={selectedOption === option} onChange={() => { setSelectedOption(option); setActionFeedback(""); }} className="mt-1 accent-teal-300" />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
                {state.completedActionIds.includes(selectedObject.action.id) ? <p className="mt-3 flex items-start gap-2 bg-emerald-400/12 p-3 text-xs leading-5 text-emerald-100"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> Action completed. Evidence has been recorded.</p> : <button type="submit" disabled={!selectedOption} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal-300 px-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-35"><ClipboardCheck aria-hidden="true" className="h-4 w-4" /> Confirm this action</button>}
                {actionFeedback ? <p className={`mt-3 border-l-2 p-3 text-xs leading-5 ${state.completedActionIds.includes(selectedObject.action.id) ? "border-emerald-300 bg-emerald-300/8 text-emerald-100" : "border-amber-300 bg-amber-300/8 text-amber-100"}`}>{actionFeedback}</p> : null}
              </form>
            ) : <div className="mt-4 border border-dashed border-white/15 p-4 text-sm leading-6 text-slate-300"><strong className="block text-white">1. Select a labelled object.</strong>2. Review its evidence and choose an action.<br />3. Confirm the action to earn progress.</div>}
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-200">Stations</p>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {requiredEvidence.map((object, index) => {
                  const done = state.completedActionIds.includes(object.action.id);
                  const active = selectedObjectId === object.id;
                  return (
                    <button
                      key={object.id}
                      type="button"
                      onClick={() => selectObject(object)}
                      aria-label={`Go to station ${index + 1}: ${object.label}`}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition ${active ? "border-amber-300 bg-amber-300/16" : done ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5 hover:border-white/25"}`}
                    >
                      {done ? (
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${active ? "bg-amber-300 text-slate-950" : "bg-white/15 text-slate-300"}`}>{index + 1}</span>
                      )}
                      <span className="line-clamp-1 text-[9px] font-semibold text-slate-300">{object.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-200"><MessageSquareText aria-hidden="true" className="h-4 w-4" /> Speak with {selectedHuman.name}</p><p className="mt-3 min-h-20 bg-white/6 p-3 text-sm leading-6 text-slate-200">{lastResponse}</p><form onSubmit={converse} className="mt-3 flex gap-2"><label className="min-w-0 flex-1"><span className="sr-only">Speak with {selectedHuman.name}</span><input value={input} onChange={(event) => setInput(event.target.value)} disabled={state.status === "completed"} placeholder="Ask, clarify, decide..." className="h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3 text-sm text-white outline-none focus:border-teal-300" /></label><button type="submit" disabled={!input.trim() || state.status === "completed"} aria-label="Send to Digital Human" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-teal-300 text-slate-950 disabled:opacity-35"><Send aria-hidden="true" className="h-4 w-4" /></button></form><div className="mt-4 border-l-2 border-amber-300 pl-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200">Latest consequence</p><p className="mt-1 text-xs leading-5 text-slate-300">{lastConsequence}</p></div><p className="mt-4 text-xs leading-5 text-slate-500">{xrMessage}</p></div>
        </aside>
      </div>
      {result ? (
        <div className="border-t border-teal-300/30 bg-teal-300/10 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Living workplace outcome</p><h3 className="mt-1 text-2xl font-bold">{result.outcome} - {result.overallScore}%</h3></div>
            <button type="button" onClick={() => { window.localStorage.removeItem(storageKey); setState(createScenarioState(manifest, "immersive")); setResult(null); setSelectedObjectId(null); setSelectedOption(""); setActionFeedback(""); setLastResponse(manifest.scenario.openingLine); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-slate-950"><X aria-hidden="true" className="h-4 w-4" /> Reset world</button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["Trust", signal(state.organisation.trust)], ["Morale", signal(state.organisation.morale)], ["Compliance", signal(state.organisation.complianceRisk, true)], ["Delivery", signal(state.organisation.productivity)]].map(([label, value]) => (
              <div key={label} className="bg-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-100">{label}</p><p className="mt-1 text-sm font-bold text-white">{value}</p></div>
            ))}
          </div>
        </div>
      ) : null}
      <ModeGuideTour manifestId={manifest.id} mode="immersive" version={manifest.version} />
    </section>
  );
}
