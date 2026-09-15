"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  CircleHelp,
  Crosshair,
  Eye,
  Glasses,
  LocateFixed,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { VRPractice, VRPracticeHotspot } from "@/types/lms";

type Props = {
  practice: VRPractice;
  courseSlug: string;
};

const TOUR_STEPS = [
  {
    selector: "[data-vr-tour='briefing']",
    label: "Mission briefing",
    title: "Know the outcome before you move",
    body: "Your role, pressure event, and special simulation mechanic are introduced here.",
  },
  {
    selector: "[data-vr-tour='room']",
    label: "3D practice room",
    title: "Find the named evidence station",
    body: "Select the pulsing station named in the current task. Finding it unlocks the action, but does not finish the task.",
  },
  {
    selector: "[data-vr-tour='tasks']",
    label: "Task checklist",
    title: "Complete five stages in order",
    body: "Observe, diagnose, decide, act, and verify. Progress moves only after the required action is completed correctly.",
  },
  {
    selector: "[data-vr-tour='action']",
    label: "Action console",
    title: "Apply the lesson theory",
    body: "After finding the station, choose the professional response that best applies the current module concept.",
  },
];

function HotspotObject({
  hotspot,
  active,
  selected,
  complete,
  onSelect,
}: {
  hotspot: VRPracticeHotspot;
  active: boolean;
  selected: boolean;
  complete: boolean;
  onSelect: (id: string) => void;
}) {
  const [x = 0, y = 0.8, z = 0] = hotspot.position;
  const dimensions: [number, number, number] =
    hotspot.shape === "screen"
      ? [1.3, 1.7, 0.22]
      : hotspot.shape === "table"
        ? [1.7, 0.75, 1]
        : hotspot.shape === "wall"
          ? [1.5, 1.9, 0.25]
          : [1, 1.2, 0.8];

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(hotspot.id);
  }

  return (
    <group position={[x, Math.max(y, dimensions[1] / 2), z]}>
      <mesh
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { document.body.style.cursor = "default"; }}
        scale={active ? 1.08 : 1}
      >
        {hotspot.shape === "pod" ? (
          <cylinderGeometry args={[0.55, 0.7, dimensions[1], 24]} />
        ) : (
          <boxGeometry args={dimensions} />
        )}
        <meshStandardMaterial
          color={complete ? "#10b981" : selected ? "#f5c542" : active ? hotspot.color : "#64748b"}
          emissive={complete ? "#047857" : active ? hotspot.color : "#000000"}
          emissiveIntensity={active || complete ? 0.35 : 0}
          metalness={0.2}
          roughness={0.46}
        />
      </mesh>
      <mesh position={[0, dimensions[1] / 2 + 0.18, 0]}>
        <sphereGeometry args={[active ? 0.14 : 0.08, 18, 18]} />
        <meshBasicMaterial color={complete ? "#86efac" : active ? "#ffffff" : "#94a3b8"} />
      </mesh>
    </group>
  );
}

function PracticeScene({
  hotspots,
  activeId,
  selectedId,
  completedIds,
  onSelect,
}: {
  hotspots: VRPracticeHotspot[];
  activeId: string;
  selectedId: string | null;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 5.4, 11], fov: 48 }} shadows>
      <color attach="background" args={["#dbe8e6"]} />
      <fog attach="fog" args={["#dbe8e6", 12, 24]} />
      <ambientLight intensity={1.5} />
      <directionalLight castShadow intensity={2.2} position={[4, 8, 6]} />
      <pointLight color="#5eead4" intensity={12} position={[-4, 4, 2]} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color="#eef5f3" roughness={0.92} />
      </mesh>
      <mesh receiveShadow position={[0, 3.2, -4.4]}>
        <boxGeometry args={[15, 6.4, 0.25]} />
        <meshStandardMaterial color="#c9d6d3" />
      </mesh>
      <mesh receiveShadow position={[-7.3, 2.2, 0]}>
        <boxGeometry args={[0.25, 4.4, 9]} />
        <meshStandardMaterial color="#b9c7c4" />
      </mesh>
      {hotspots.map((hotspot) => (
        <HotspotObject
          key={hotspot.id}
          hotspot={hotspot}
          active={hotspot.id === activeId}
          selected={hotspot.id === selectedId}
          complete={completedIds.has(hotspot.id)}
          onSelect={onSelect}
        />
      ))}
      <gridHelper args={[15, 15, "#7ba6a1", "#c8d8d5"]} position={[0, 0.01, 0]} />
    </Canvas>
  );
}

function PracticeTour({ practiceSlug }: { practiceSlug: string }) {
  const [step, setStep] = useState<number | null>(null);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (localStorage.getItem(`vowlms:vr-tour:${practiceSlug}:v1`) !== "complete") setStep(0);
  }, [practiceSlug]);

  useEffect(() => {
    if (step === null) return;
    const update = () => {
      const rect = document.querySelector(TOUR_STEPS[step].selector)?.getBoundingClientRect();
      setBox(rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [step]);

  function close() {
    localStorage.setItem(`vowlms:vr-tour:${practiceSlug}:v1`, "complete");
    setStep(null);
  }

  if (step === null) return null;
  const item = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Simulation guide tour">
      <div className="absolute inset-0 bg-[#020817]/74" />
      {box ? (
        <div
          className="pointer-events-none fixed rounded-xl ring-4 ring-[#5eead4] ring-offset-4 ring-offset-[#020817]/60"
          style={box}
        />
      ) : null}
      <div className="fixed inset-x-4 bottom-5 mx-auto max-w-lg rounded-xl border border-white/15 bg-[#071526] p-5 text-white shadow-2xl sm:bottom-8 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5eead4]">{item.label}</p>
            <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
          </div>
          <button type="button" onClick={close} aria-label="Skip simulation tour" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 hover:bg-white/20">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/72">{item.body}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/50">{step + 1} of {TOUR_STEPS.length}</span>
          <button
            type="button"
            onClick={() => step === TOUR_STEPS.length - 1 ? close() : setStep(step + 1)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#5eead4] px-4 text-sm font-bold text-[#06111f]"
          >
            {step === TOUR_STEPS.length - 1 ? "Start practice" : "Next"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function VRStudio({ practice, courseSlug }: Props) {
  const tasks = practice.tasks ?? [];
  const hotspots = practice.hotspots ?? [];
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [stationFound, setStationFound] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [headsetReady, setHeadsetReady] = useState(false);

  const task = tasks[taskIndex];
  const completedHotspotIds = useMemo(
    () => new Set(tasks.filter((item) => completedTaskIds.includes(item.id)).map((item) => item.hotspotId)),
    [completedTaskIds, tasks],
  );
  const finished = tasks.length > 0 && completedTaskIds.length === tasks.length;
  const progress = tasks.length ? Math.round((completedTaskIds.length / tasks.length) * 100) : 0;
  const score = Math.max(0, 100 - mistakes * 5);
  const passed = score >= (practice.passMark ?? 70);
  const taskComplete = task ? completedTaskIds.includes(task.id) : false;

  useEffect(() => {
    const xr = (navigator as Navigator & { xr?: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr;
    xr?.isSessionSupported("immersive-vr").then(setHeadsetReady).catch(() => setHeadsetReady(false));
  }, []);

  function selectHotspot(id: string) {
    if (!task || taskComplete) return;
    setSelectedHotspotId(id);
    if (id !== task.hotspotId) {
      setFeedback(`That is not the ${task.hotspotLabel} station. Review the current instruction and try another object.`);
      return;
    }
    setStationFound(true);
    setFeedback("Station found. Complete the practical decision in the Action Console below.");
  }

  function chooseAction(option: string) {
    if (!task || !stationFound || taskComplete) return;
    if (option !== task.correctOption) {
      setMistakes((value) => value + 1);
      setFeedback(task.retryFeedback);
      return;
    }
    setCompletedTaskIds((items) => [...items, task.id]);
    setFeedback(task.successFeedback);
  }

  function nextTask() {
    if (!taskComplete || taskIndex >= tasks.length - 1) return;
    setTaskIndex((value) => value + 1);
    setSelectedHotspotId(null);
    setStationFound(false);
    setFeedback(null);
  }

  function restart() {
    setTaskIndex(0);
    setSelectedHotspotId(null);
    setStationFound(false);
    setCompletedTaskIds([]);
    setFeedback(null);
    setMistakes(0);
    setSubmitted(false);
  }

  async function submitPractice() {
    if (!finished || submitting || submitted) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/vr/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          practiceSlug: practice.slug,
          score,
          feedback: JSON.stringify({
            version: practice.version,
            completedTasks: completedTaskIds,
            mistakes,
            mode: "desktop-3d",
          }),
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      const progressResponse = passed
        ? await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
              lessonSlug: practice.lessonSlug,
              courseSlug,
              completed: true,
            }),
          })
        : null;
      localStorage.setItem(`vowlms:vr-result:${practice.slug}`, JSON.stringify({ score, completedAt: new Date().toISOString() }));
      setSubmitted(true);
      setFeedback(!passed
        ? `Practice evidence saved. The pass mark is ${practice.passMark ?? 70}%. Retry the simulation to complete this module capstone.`
        : progressResponse?.ok
          ? "Practice evidence saved. This module capstone is now complete."
          : "Practice evidence was saved, but lesson progress is still synchronising.");
    } catch {
      setFeedback("The practice is complete, but evidence could not sync. Keep this page open and try submitting again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!task || hotspots.length === 0) {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">This legacy practice is awaiting its interactive task manifest.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#050b1a] text-white shadow-[0_30px_90px_rgba(2,8,23,0.35)]">
      <header className="border-b border-white/10 bg-[#0b1427] px-5 py-5 sm:px-6" data-vr-tour="briefing">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#5eead4]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#99f6e4]">Module capstone</span>
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/70">{practice.environmentLabel}</span>
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/70">{practice.estimatedMinutes ?? 25} min</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{practice.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/68">{practice.briefing ?? practice.scenario}</p>
            {practice.signatureMechanic ? (
              <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-[#f5c542]">
                <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> {practice.signatureMechanic}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setHelpOpen((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-semibold hover:bg-white/15">
              <CircleHelp aria-hidden="true" className="h-4 w-4" /> Help
            </button>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/12 px-3 text-xs font-semibold text-white/65">
              <Glasses aria-hidden="true" className="h-4 w-4" /> {headsetReady ? "WebXR headset ready" : "Desktop 3D"}
            </span>
          </div>
        </div>
        {helpOpen ? <p className="mt-4 rounded-lg border border-[#5eead4]/25 bg-[#5eead4]/8 px-4 py-3 text-sm leading-6 text-white/78">Follow the active task. Find its named station, select it, and then complete the action below. Selecting an object never completes a task by itself.</p> : null}
      </header>

      <div className="grid min-h-[610px] xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="relative min-h-[440px] border-b border-white/10 xl:border-b-0 xl:border-r" data-vr-tour="room">
          <PracticeScene hotspots={hotspots} activeId={task.hotspotId} selectedId={selectedHotspotId} completedIds={completedHotspotIds} onSelect={selectHotspot} />
          <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/15 bg-[#071526]/90 px-4 py-3 shadow-xl backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#99f6e4]"><LocateFixed aria-hidden="true" className="h-4 w-4" /> Find now</p>
            <p className="mt-1 max-w-xs text-sm font-semibold">{task.hotspotLabel}</p>
          </div>
          <div className="absolute inset-x-4 bottom-4 grid grid-cols-5 gap-2">
            {hotspots.map((hotspot, index) => {
              const complete = completedHotspotIds.has(hotspot.id);
              const active = hotspot.id === task.hotspotId;
              return (
                <button key={hotspot.id} type="button" onClick={() => selectHotspot(hotspot.id)} aria-label={`Select ${hotspot.label}`} className={`min-h-12 rounded-lg border px-2 text-[10px] font-bold leading-tight backdrop-blur transition sm:text-xs ${complete ? "border-emerald-300/40 bg-emerald-500/85" : active ? "border-[#5eead4] bg-[#087f74]/92" : "border-white/15 bg-[#071526]/82 text-white/58 hover:text-white"}`}>
                  {complete ? <Check aria-hidden="true" className="mx-auto h-4 w-4" /> : index + 1}
                </button>
              );
            })}
          </div>
        </section>

        <aside className="bg-[#0b1224] p-4 sm:p-5" data-vr-tour="tasks">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-semibold"><Target aria-hidden="true" className="h-4 w-4 text-[#5eead4]" /> Task checklist</h3>
            <span className="text-sm font-bold text-[#99f6e4]">{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#5eead4] transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
          <div className="mt-4 space-y-2">
            {tasks.map((item, index) => {
              const complete = completedTaskIds.includes(item.id);
              const active = index === taskIndex;
              return (
                <div key={item.id} className={`rounded-lg border px-3 py-3 ${complete ? "border-emerald-400/25 bg-emerald-400/10" : active ? "border-[#5eead4]/45 bg-[#5eead4]/10" : "border-white/8 bg-white/[0.035]"}`}>
                  <div className="flex items-start gap-3">
                    {complete ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> : active ? <Crosshair aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#5eead4]" /> : <Circle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />}
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${active || complete ? "text-white" : "text-white/45"}`}>{item.title}</p>
                      {active ? <p className="mt-1 text-xs leading-5 text-white/62">{item.instruction}</p> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <section className="border-t border-white/10 bg-[#071020] p-4 sm:p-6" data-vr-tour="action">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${stationFound ? "bg-[#5eead4] text-[#06111f]" : "bg-white/8 text-white/45"}`}><Eye aria-hidden="true" className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#5eead4]">Action console</p>
            <h3 className="mt-1 text-lg font-semibold">{stationFound ? task.actionPrompt : `Find ${task.hotspotLabel} to unlock the action`}</h3>
            <p className="mt-2 text-sm leading-6 text-white/58"><span className="font-semibold text-white/82">Theory reference:</span> {task.theoryReference}</p>
            {stationFound ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {task.options.map((option) => (
                  <button key={option} type="button" disabled={taskComplete} onClick={() => chooseAction(option)} className={`min-h-24 rounded-lg border p-4 text-left text-sm font-semibold leading-6 transition ${taskComplete && option === task.correctOption ? "border-emerald-300 bg-emerald-400/15 text-emerald-100" : "border-white/12 bg-white/[0.045] text-white/76 hover:border-[#5eead4]/60 hover:bg-[#5eead4]/10 disabled:opacity-45"}`}>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-white/[0.025] px-4 py-4 text-sm text-white/45">The task remains in progress. Selecting the correct 3D station reveals the decision you must perform.</div>
            )}
            {feedback ? (
              <div className={`mt-4 flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${taskComplete ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : "border-amber-300/25 bg-amber-300/10 text-amber-100"}`}>
                <p className="text-sm font-semibold leading-6">{feedback}</p>
                {taskComplete && !finished ? <button type="button" onClick={nextTask} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-[#06111f]">Next task <ArrowRight aria-hidden="true" className="h-4 w-4" /></button> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {finished ? (
        <footer className={`border-t border-white/10 p-5 sm:p-6 ${passed ? "bg-emerald-400/10" : "bg-amber-300/10"}`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div><p className={`text-xs font-bold uppercase tracking-[0.16em] ${passed ? "text-emerald-300" : "text-amber-200"}`}>{passed ? "All five actions complete" : "Actions complete: retry required"}</p><h3 className="mt-2 text-2xl font-semibold">Practice score: {score}%</h3><p className="mt-1 text-sm text-white/60">Pass mark: {practice.passMark ?? 70}%</p></div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={restart} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-bold"><RotateCcw aria-hidden="true" className="h-4 w-4" /> Retry</button>
              {submitted && passed ? (
                <Link href={`/results/${courseSlug}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#5eead4] px-5 text-sm font-bold text-[#06111f]">View course progress <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              ) : !submitted ? (
                <button type="button" disabled={submitting} onClick={submitPractice} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#f5c542] px-5 text-sm font-bold text-[#06111f] disabled:opacity-50">{submitting ? "Saving evidence..." : "Submit practice evidence"} <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
              ) : null}
            </div>
          </div>
        </footer>
      ) : null}
      <PracticeTour practiceSlug={practice.slug} />
    </div>
  );
}
