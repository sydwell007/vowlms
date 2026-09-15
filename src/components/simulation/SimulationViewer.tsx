"use client";

import Link from "next/link";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Grid, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  DoorOpen,
  ListChecks,
  MapPinned,
  Trophy,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import type { Hotspot, Simulation } from "@/types/vr-simulation";
import { cn } from "@/lib/utils";
import { completeVrSession, submitVrObjectAction } from "@/lib/vrSkillsClient";

function HotspotMesh({
  hotspot,
  active,
  onSelect
}: {
  hotspot: Hotspot;
  active: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const color = active ? "#14b8a6" : hotspot.color;

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect();
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut() {
    setHovered(false);
    document.body.style.cursor = "auto";
  }

  return (
    <group position={hotspot.position}>
      <mesh
        castShadow
        onClick={handleClick}
        onPointerOut={handlePointerOut}
        onPointerOver={handlePointerOver}
        scale={hovered ? 1.04 : 1}
      >
        {hotspot.shape === "cylinder" ? (
          <cylinderGeometry args={[hotspot.size[0] / 2, hotspot.size[0] / 2, hotspot.size[1], 32]} />
        ) : (
          <boxGeometry args={hotspot.size} />
        )}
        <meshStandardMaterial color={color} emissive={active ? "#0f766e" : "#000000"} emissiveIntensity={active ? 0.28 : 0} roughness={0.46} />
      </mesh>
      <Html center distanceFactor={11} occlude position={[0, hotspot.size[1] / 2 + 0.2, 0]}>
        {active || hovered ? (
          <div
            className={cn(
              "pointer-events-none max-w-36 rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold leading-tight shadow-lg ring-1",
              active ? "bg-teal-700 text-white ring-teal-200/40" : "bg-white/94 text-slate-900 ring-slate-200"
            )}
          >
            {hotspot.label}
          </div>
        ) : (
          <div className="pointer-events-none grid h-6 w-6 place-items-center rounded-full bg-white/90 shadow-lg ring-2 ring-teal-500">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
          </div>
        )}
      </Html>
    </group>
  );
}

function PrimitiveEnvironment({
  simulation,
  selectedHotspotId,
  onSelectHotspot
}: {
  simulation: Simulation;
  selectedHotspotId: string;
  onSelectHotspot: (hotspot: Hotspot, index: number) => void;
}) {
  return (
    <>
      <SceneCamera />
      <ambientLight intensity={0.76} />
      <directionalLight castShadow intensity={2.2} position={[4, 6, 4]} shadow-mapSize={[1024, 1024]} />
      <pointLight color="#c89b3c" intensity={1.1} position={[-3, 2.2, 2.6]} />
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[7, 0.12, 5]} />
        <meshStandardMaterial color="#e4ece8" roughness={0.74} />
      </mesh>
      <mesh position={[0, 1.65, -2.5]} receiveShadow>
        <boxGeometry args={[7, 3.4, 0.12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      <mesh position={[-3.5, 1.35, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.8, 5]} />
        <meshStandardMaterial color="#edf4f1" roughness={0.82} />
      </mesh>
      <mesh position={[3.5, 1.35, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.8, 5]} />
        <meshStandardMaterial color="#edf4f1" roughness={0.82} />
      </mesh>

      {/* Future GLB or GLTF room assets can replace these primitive meshes from /public/models. */}
      {simulation.hotspots.map((hotspot, index) => (
        <HotspotMesh
          active={selectedHotspotId === hotspot.id}
          hotspot={hotspot}
          key={hotspot.id}
          onSelect={() => onSelectHotspot(hotspot, index)}
        />
      ))}

      <Grid args={[7, 7]} cellColor="#94a3b8" cellSize={0.5} fadeDistance={8} fadeStrength={1.2} position={[0, 0.01, 0]} sectionColor="#0f766e" />
      <ContactShadows blur={2.6} far={8} opacity={0.28} position={[0, 0.02, 0]} />
      <OrbitControls enablePan enableZoom maxDistance={8} maxPolarAngle={Math.PI / 2.1} minDistance={3.3} target={[0, 0.55, 0]} />
    </>
  );
}

function SceneCamera() {
  const cameraRef = useRef<PerspectiveCameraType>(null);

  useEffect(() => {
    if (!cameraRef.current) {
      return;
    }

    cameraRef.current.lookAt(0, 0.55, 0);
    cameraRef.current.updateProjectionMatrix();
  }, []);

  return <PerspectiveCamera makeDefault fov={42} position={[4.8, 3.35, 5.6]} ref={cameraRef} />;
}

const guideSteps = [
  {
    selector: '[data-tour="simulation-brief"]',
    title: "Scenario brief",
    body: "Start here to understand the workplace or classroom scenario before interacting with the 3D room."
  },
  {
    selector: '[data-tour="simulation-tasks"]',
    title: "One task at a time",
    body: "This panel always shows the current task, the marker to find, and the decision to complete. Use the numbered row to jump between the five tasks."
  },
  {
    selector: '[data-tour="simulation-window"]',
    title: "3D simulation area",
    body: "Click the circular hotspot markers in this window. Drag to rotate the view and zoom to inspect stations."
  },
  {
    selector: '[data-tour="simulation-actions"]',
    title: "Finish practice",
    body: "Use Help when you are stuck. Complete unlocks after every task is finished."
  }
];

const PLATFORM_TOUR_STORAGE_KEY = "goalvow-vr-platform-tour-complete";

function getGuideElement(selector: string) {
  return document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>('[data-tour="simulation-window"]');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function SimulationGuideTour({ simulationId, mode }: { simulationId: string; mode: "desktop" | "vr" }) {
  const storageKey = `goalvow-simulation-guide-${simulationId}-${mode}`;
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = guideSteps[stepIndex];

  useEffect(() => {
    if (window.localStorage.getItem(storageKey)) {
      return undefined;
    }

    const openWhenPlatformTourIsDone = () => {
      if (window.localStorage.getItem(PLATFORM_TOUR_STORAGE_KEY)) {
        setOpen(true);
        return true;
      }

      return false;
    };

    const timer = window.setTimeout(() => {
      if (openWhenPlatformTourIsDone()) {
        return;
      }

      const interval = window.setInterval(() => {
        if (openWhenPlatformTourIsDone()) {
          window.clearInterval(interval);
        }
      }, 600);

      window.setTimeout(() => window.clearInterval(interval), 30000);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function updateRect() {
      const element = getGuideElement(step.selector);

      if (!element) {
        return;
      }

      setRect(element.getBoundingClientRect());
    }

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [open, step.selector]);

  function finishGuide() {
    window.localStorage.setItem(storageKey, "true");
    setOpen(false);
  }

  if (!open || !rect) {
    return null;
  }

  const popoverWidth = 360;
  const left = rect.right + popoverWidth + 24 < window.innerWidth ? rect.right + 18 : clamp(rect.left, 16, window.innerWidth - popoverWidth - 16);
  const top = clamp(rect.top, 16, window.innerHeight - 270);
  const isLastStep = stepIndex === guideSteps.length - 1;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Simulation guide tour">
      <div className="absolute inset-0 bg-slate-950/52" />
      <div
        className="pointer-events-none absolute rounded-xl border-2 border-teal-300 bg-transparent shadow-[0_0_0_9999px_rgba(2,6,23,0.42)]"
        style={{
          left: Math.max(8, rect.left - 8),
          top: Math.max(8, rect.top - 8),
          width: Math.min(window.innerWidth - 16, rect.width + 16),
          height: Math.min(window.innerHeight - 16, rect.height + 16)
        }}
      >
        <span className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-teal-300 text-slate-950 shadow-lg">
          <MapPinned aria-hidden className="h-4 w-4" />
        </span>
      </div>
      <div
        className="absolute w-[min(360px,calc(100vw-32px))] rounded-lg border border-white/20 bg-white p-5 text-slate-950 shadow-2xl"
        style={{ left, top }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Simulation guide {stepIndex + 1} of {guideSteps.length}
            </p>
            <h2 className="mt-2 text-xl font-bold">{step.title}</h2>
          </div>
          <button
            aria-label="Close simulation guide"
            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={finishGuide}
            type="button"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
        <div className="mt-5 h-1.5 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-600" style={{ width: `${((stepIndex + 1) / guideSteps.length) * 100}%` }} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold transition",
              stepIndex === 0 ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100"
            )}
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            type="button"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800"
            onClick={() => {
              if (isLastStep) {
                finishGuide();
              } else {
                setStepIndex((current) => current + 1);
              }
            }}
            type="button"
          >
            {isLastStep ? <Check aria-hidden className="h-4 w-4" /> : <ArrowRight aria-hidden className="h-4 w-4" />}
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SimulationViewer({
  simulation,
  lessonTitle,
  mode,
  exitHref,
  completeHref
}: {
  simulation: Simulation;
  lessonTitle: string;
  mode: "desktop" | "vr";
  /** Defaults to the Studio's own academy lesson route. */
  exitHref?: string;
  /** Defaults to the Studio's own assessment route. */
  completeHref?: string;
}) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(simulation.hotspots[0]);
  const [activeTaskId, setActiveTaskId] = useState(simulation.tasks[0]?.id);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [foundHotspotIds, setFoundHotspotIds] = useState<string[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const storageKey = `goalvow:legacy:${simulation.id}`;
  const progress = Math.round((completedTaskIds.length / simulation.tasks.length) * 100);
  const isComplete = completedTaskIds.length === simulation.tasks.length;

  const selectedTask = useMemo(() => {
    return (
      simulation.tasks.find((task) => task.id === activeTaskId) ??
      simulation.tasks.find((task) => task.hotspotId === selectedHotspot.id && !completedTaskIds.includes(task.id)) ??
      simulation.tasks[0]
    );
  }, [activeTaskId, completedTaskIds, selectedHotspot.id, simulation.tasks]);

  const taskNumber = useMemo(() => {
    const index = simulation.tasks.findIndex((task) => task.id === selectedTask?.id);
    return index >= 0 ? index + 1 : 1;
  }, [selectedTask?.id, simulation.tasks]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { completedTaskIds?: string[]; foundHotspotIds?: string[] };
      window.requestAnimationFrame(() => {
        if (parsed.completedTaskIds?.length) setCompletedTaskIds(parsed.completedTaskIds);
        if (parsed.foundHotspotIds?.length) setFoundHotspotIds(parsed.foundHotspotIds);
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    // Restore only on mount; subsequent saves are one-directional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ completedTaskIds, foundHotspotIds }));
  }, [completedTaskIds, foundHotspotIds, storageKey]);

  const vrContext = useMemo(
    () => ({ manifestId: simulation.id, courseId: simulation.courseId, moduleId: simulation.moduleId, mode: "legacy" as const }),
    [simulation.courseId, simulation.id, simulation.moduleId]
  );

  useEffect(() => {
    if (isComplete) void completeVrSession(vrContext, { score: 100, passed: true });
  }, [isComplete, vrContext]);

  function handleSelectHotspot(hotspot: Hotspot) {
    setSelectedHotspot(hotspot);
    setFoundHotspotIds((current) => (current.includes(hotspot.id) ? current : [...current, hotspot.id]));
    const nextTaskForHotspot =
      simulation.tasks.find((task) => task.hotspotId === hotspot.id && !completedTaskIds.includes(task.id)) ??
      simulation.tasks.find((task) => task.hotspotId === hotspot.id);

    if (nextTaskForHotspot) {
      setActiveTaskId(nextTaskForHotspot.id);
      setActionFeedback(null);
    }
  }

  function handleSelectTask(taskId: string) {
    const task = simulation.tasks.find((candidate) => candidate.id === taskId);

    if (!task) {
      return;
    }

    const hotspot = simulation.hotspots.find((candidate) => candidate.id === task.hotspotId);
    setActiveTaskId(task.id);
    setActionFeedback(null);

    if (hotspot) {
      setSelectedHotspot(hotspot);
    }
  }

  function handleCompleteAction(option?: string) {
    if (!selectedTask || !foundHotspotIds.includes(selectedTask.hotspotId)) {
      return;
    }

    if (selectedTask.correctOption && option !== selectedTask.correctOption) {
      setActionFeedback(selectedTask.retryFeedback ?? "That action does not meet the task requirement. Review the theory and try again.");
      return;
    }

    setActionFeedback(selectedTask.successFeedback ?? "Action completed correctly.");
    setCompletedTaskIds((current) => {
      return Array.from(new Set([...current, selectedTask.id]));
    });
    void submitVrObjectAction(vrContext, selectedTask.hotspotId, option ?? selectedTask.correctOption ?? "acknowledged");
  }

  const selectedTaskCompleted = selectedTask ? completedTaskIds.includes(selectedTask.id) : false;
  const selectedTaskHotspotFound = selectedTask ? foundHotspotIds.includes(selectedTask.hotspotId) : false;

  return (
    <div aria-label={`${lessonTitle} simulation`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-950/15">
      <div className="grid bg-slate-950 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="border-b border-white/10 p-4 lg:border-r" data-tour="simulation-brief">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-400/20 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-teal-100">
                {mode === "vr" ? "VR headset mode" : "Desktop 3D mode"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">{simulation.environmentLabel}</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold">{simulation.title}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-200">{simulation.narrative}</p>
          </div>
        </div>

        <div className="border-b border-white/10 p-4 lg:row-span-2 lg:border-b-0" data-tour="simulation-tasks">
          <div className="soft-scrollbar flex max-h-[760px] flex-col overflow-y-auto rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListChecks aria-hidden className="h-4 w-4 text-teal-200" />
                <p className="font-bold">Task {taskNumber} of {simulation.tasks.length}</p>
              </div>
              <p className="text-sm font-bold text-teal-100">{progress}%</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/12">
              <div className="h-full rounded-full bg-teal-300 transition-all" style={{ width: `${progress}%` }} />
            </div>

            {selectedTask ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold">{selectedTask.title}</h2>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      selectedTaskCompleted
                        ? "bg-emerald-50 text-emerald-800"
                        : selectedTaskHotspotFound
                          ? "bg-teal-50 text-teal-800"
                          : "bg-amber-50 text-amber-800"
                    )}
                  >
                    {selectedTaskCompleted ? "Completed" : selectedTaskHotspotFound ? "Ready for action" : "Find marker first"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <strong className="text-slate-950">{selectedHotspot.concept}:</strong> {selectedTask.detail}
                </p>
                <p className="mt-3 rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">
                  Go to: {selectedTask.hotspotLabel}
                </p>

                <div className="mt-4">
                  {selectedTaskHotspotFound && selectedTask.options?.length ? (
                    <div className="grid gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.13em] text-teal-700">Choose the action you will take</p>
                      {selectedTask.options.map((option) => (
                        <button
                          className={cn(
                            "rounded-lg border p-3 text-left text-sm font-semibold leading-6 transition",
                            selectedTaskCompleted && option === selectedTask.correctOption
                              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                              : "border-slate-200 bg-slate-50 text-slate-800 hover:border-teal-400 hover:bg-teal-50 disabled:opacity-50"
                          )}
                          disabled={selectedTaskCompleted}
                          key={option}
                          onClick={() => handleCompleteAction(option)}
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      className={cn(
                        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition",
                        selectedTaskCompleted
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedTaskHotspotFound
                            ? "bg-teal-700 text-white hover:bg-teal-800"
                            : "cursor-not-allowed bg-slate-200 text-slate-500"
                      )}
                      disabled={!selectedTaskHotspotFound || selectedTaskCompleted}
                      onClick={() => handleCompleteAction()}
                      type="button"
                    >
                      <Check aria-hidden className="h-4 w-4" />
                      {selectedTaskCompleted ? "Action completed" : "Confirm action completed"}
                    </button>
                  )}
                  {!selectedTaskHotspotFound ? (
                    <p className="mt-2 text-sm font-semibold text-amber-700">
                      Click the matching marker in the 3D room before confirming this action.
                    </p>
                  ) : null}
                  {actionFeedback ? (
                    <p className={cn(
                      "mt-3 rounded-lg px-3 py-2 text-sm font-semibold leading-6",
                      selectedTaskCompleted ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                    )}>
                      {actionFeedback}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-5 gap-2">
              {simulation.tasks.map((task, index) => {
                const done = completedTaskIds.includes(task.id);
                const found = foundHotspotIds.includes(task.hotspotId);
                const active = selectedTask?.id === task.id;
                return (
                  <button
                    aria-label={`Go to task ${index + 1}: ${task.title}`}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition",
                      active ? "border-teal-300 bg-teal-400/16" : done ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5 hover:border-white/25"
                    )}
                    key={task.id}
                    onClick={() => handleSelectTask(task.id)}
                    type="button"
                  >
                    {done ? (
                      <CheckCircle2 aria-hidden className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <span
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                          found ? "bg-teal-300 text-slate-950" : "bg-white/15 text-slate-300"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                    <span className="line-clamp-1 text-[10px] font-semibold text-slate-300">{task.hotspotLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative h-[560px] min-h-[420px] overflow-hidden bg-[#dfe8e4] sm:h-[620px]" data-tour="simulation-window">
          <Canvas className="absolute inset-0" dpr={[1, 1.5]} shadows>
            <color args={["#dfe8e4"]} attach="background" />
            <PrimitiveEnvironment
              onSelectHotspot={handleSelectHotspot}
              selectedHotspotId={selectedHotspot.id}
              simulation={simulation}
            />
          </Canvas>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(15,23,42,0.08)_58%,rgba(15,23,42,0.18)_100%)]" />
          <div className="absolute inset-x-3 bottom-3 z-10 grid grid-cols-5 gap-2">
            {simulation.hotspots.map((hotspot, index) => {
              const found = foundHotspotIds.includes(hotspot.id);
              const active = selectedTask?.hotspotId === hotspot.id;
              return (
                <button
                  aria-label={`Select ${hotspot.label}`}
                  className={cn(
                    "min-h-11 rounded-lg border px-2 text-xs font-bold shadow-lg backdrop-blur transition",
                    found
                      ? "border-emerald-300 bg-emerald-600/90 text-white"
                      : active
                        ? "border-teal-200 bg-teal-700/90 text-white"
                        : "border-white/60 bg-white/85 text-slate-700 hover:bg-white"
                  )}
                  key={hotspot.id}
                  onClick={() => handleSelectHotspot(hotspot)}
                  type="button"
                >
                  <span className="sm:hidden">{index + 1}</span>
                  <span className="hidden line-clamp-2 sm:block">{hotspot.label}</span>
                </button>
              );
            })}
          </div>
          {helpOpen ? (
            <div className="absolute right-4 top-4 z-20 max-w-sm rounded-lg border border-white/30 bg-slate-950/88 p-4 text-sm leading-6 text-slate-200 shadow-xl backdrop-blur">
              Click or tap highlighted 3D objects to practise concepts. Use mouse drag or touch drag to orbit the scene.
              Complete every task before entering the assessment.
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 bg-slate-950 p-4" data-tour="simulation-actions">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-slate-100"
          onClick={() => setHelpOpen((current) => !current)}
          type="button"
        >
          <CircleHelp aria-hidden className="h-4 w-4" />
          Help
        </button>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white/12 px-4 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/18"
          href={exitHref ?? `/academies/${simulation.academyId}/courses/${simulation.courseId}/modules/${simulation.moduleId}/lessons/${simulation.lessonId}`}
        >
          <DoorOpen aria-hidden className="h-4 w-4" />
          Exit
        </Link>
        <Link
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold shadow-lg transition",
            isComplete ? "bg-teal-400 text-slate-950 hover:bg-teal-300" : "pointer-events-none bg-slate-400 text-slate-800 opacity-70"
          )}
          href={completeHref ?? `/simulation/${simulation.lessonId}/assessment`}
        >
          <Trophy aria-hidden className="h-4 w-4" />
          Complete
        </Link>
      </div>
      <SimulationGuideTour mode={mode} simulationId={simulation.id} />
    </div>
  );
}
