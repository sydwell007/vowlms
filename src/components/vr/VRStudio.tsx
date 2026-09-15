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
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";
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
  stationNumber,
  active,
  selected,
  complete,
  onSelect,
}: {
  hotspot: VRPracticeHotspot;
  stationNumber: number;
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
      <StationLabel
        stationNumber={stationNumber}
        label={hotspot.label}
        positionY={dimensions[1] / 2 + 0.66}
        active={active}
        complete={complete}
        onSelect={() => onSelect(hotspot.id)}
      />
    </group>
  );
}

function StationLabel({
  stationNumber,
  label,
  positionY,
  active,
  complete,
  onSelect,
}: {
  stationNumber: number;
  label: string;
  positionY: number;
  active: boolean;
  complete: boolean;
  onSelect: () => void;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return;

    const background = complete ? "#047857" : active ? "#087f74" : "#071526";
    context.fillStyle = background;
    context.beginPath();
    context.roundRect(8, 8, 1008, 240, 42);
    context.fill();
    context.strokeStyle = complete ? "#86efac" : active ? "#5eead4" : "#94a3b8";
    context.lineWidth = active ? 12 : 7;
    context.stroke();

    const [stage = "Station", ...detailParts] = label.split(" ");
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = complete ? "#d1fae5" : "#ffffff";
    context.font = "700 64px Arial";
    context.fillText(`STATION ${stationNumber}  |  ${stage.toUpperCase()}`, 512, active ? 86 : 128);

    if (active) {
      let detail = detailParts.join(" ") || label;
      context.font = "600 46px Arial";
      while (context.measureText(detail).width > 900 && detail.length > 12) detail = `${detail.slice(0, -4).trim()}...`;
      context.fillStyle = "#ccfbf1";
      context.fillText(detail, 512, 170);
    }

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.minFilter = LinearFilter;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [active, complete, label, stationNumber]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <sprite
      position={[0, positionY, 0]}
      scale={active ? [3.25, 0.81, 1] : [1.7, 0.43, 1]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { document.body.style.cursor = "default"; }}
    >
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
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
      {hotspots.map((hotspot, index) => (
        <HotspotObject
          key={hotspot.id}
          hotspot={hotspot}
          stationNumber={index + 1}
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
  const [cardHeight, setCardHeight] = useState(260);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem(`vowlms:vr-tour:${practiceSlug}:v1`) === "complete") return;
    const frame = window.requestAnimationFrame(() => setStep(0));
    return () => window.cancelAnimationFrame(frame);
  }, [practiceSlug]);

  useEffect(() => {
    if (step === null) return;
    const update = () => {
      const rect = document.querySelector(TOUR_STEPS[step].selector)?.getBoundingClientRect();
      setBox(rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null);
    };
    const target = document.querySelector<HTMLElement>(TOUR_STEPS[step].selector);
    const targetRect = target?.getBoundingClientRect();
    if (targetRect) {
      const safeTop = window.innerWidth >= 768 ? 132 : 80;
      const safeBottom = window.innerHeight - 16;
      if (targetRect.top < safeTop || targetRect.bottom > safeBottom) {
        const availableHeight = safeBottom - safeTop;
        const desiredTop = targetRect.height >= availableHeight
          ? safeTop
          : safeTop + (availableHeight - targetRect.height) / 2;
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo({
          top: Math.max(0, window.scrollY + targetRect.top - desiredTop),
          behavior: "auto",
        });
        root.style.scrollBehavior = previousScrollBehavior;
      }
    }
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [step]);

  useEffect(() => {
    if (step === null || !cardRef.current) return;

    const card = cardRef.current;
    const updateHeight = () => setCardHeight(card.getBoundingClientRect().height);
    const observer = new ResizeObserver(updateHeight);
    updateHeight();
    observer.observe(card);
    return () => observer.disconnect();
  }, [step]);

  function close() {
    localStorage.setItem(`vowlms:vr-tour:${practiceSlug}:v1`, "complete");
    setStep(null);
  }

  if (step === null || typeof document === "undefined") return null;
  const item = TOUR_STEPS[step];
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const cardWidth = Math.min(380, viewportWidth - 32);
  const gap = 18;
  const focusBox = box && viewportWidth < 640
    ? { ...box, height: Math.min(box.height, 72) }
    : box;
  const centeredLeft = focusBox
    ? Math.min(Math.max(16, focusBox.left + focusBox.width / 2 - cardWidth / 2), viewportWidth - cardWidth - 16)
    : Math.max(16, (viewportWidth - cardWidth) / 2);
  let cardLeft = centeredLeft;
  let cardTop = Math.max(16, viewportHeight - cardHeight - 16);

  if (focusBox) {
    const boxBottom = focusBox.top + focusBox.height;
    const boxRight = focusBox.left + focusBox.width;
    if (focusBox.top >= cardHeight + gap + 16) {
      cardTop = focusBox.top - cardHeight - gap;
    } else if (viewportHeight - boxBottom >= cardHeight + gap + 16) {
      cardTop = boxBottom + gap;
    } else if (viewportWidth - boxRight >= cardWidth + gap + 16) {
      cardLeft = boxRight + gap;
      cardTop = Math.min(Math.max(16, focusBox.top), viewportHeight - cardHeight - 16);
    } else if (focusBox.left >= cardWidth + gap + 16) {
      cardLeft = focusBox.left - cardWidth - gap;
      cardTop = Math.min(Math.max(16, focusBox.top), viewportHeight - cardHeight - 16);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Simulation guide tour">
      <div className="absolute inset-0 bg-[#020817]/74" />
      {focusBox ? (
        <div
          data-vr-tour-spotlight="true"
          className="pointer-events-none fixed rounded-xl ring-4 ring-[#5eead4] ring-offset-4 ring-offset-[#020817]/60"
          style={{
            left: Math.max(8, focusBox.left - 4),
            top: Math.max(8, focusBox.top - 4),
            width: Math.min(viewportWidth - 16, focusBox.width + 8),
            height: Math.min(viewportHeight - 16, focusBox.height + 8),
          }}
        />
      ) : null}
      <div
        ref={cardRef}
        data-vr-tour-card="true"
        className="fixed max-h-[calc(100vh-32px)] overflow-y-auto rounded-xl border border-white/15 bg-[#071526] p-5 text-white shadow-2xl sm:p-6"
        style={{ left: cardLeft, top: cardTop, width: cardWidth }}
      >
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
    </div>,
    document.body,
  );
}

export function VRStudio({ practice, courseSlug }: Props) {
  const tasks = useMemo(() => practice.tasks ?? [], [practice.tasks]);
  const hotspots = useMemo(() => practice.hotspots ?? [], [practice.hotspots]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [stationFound, setStationFound] = useState(false);
  const [actionPanelOpen, setActionPanelOpen] = useState(false);
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

  useEffect(() => {
    if (!actionPanelOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [actionPanelOpen]);

  function selectHotspot(id: string) {
    if (!task || taskComplete) return;
    setSelectedHotspotId(id);
    if (id !== task.hotspotId) {
      setFeedback(`That is not the ${task.hotspotLabel} station. Review the current instruction and try another object.`);
      return;
    }
    setStationFound(true);
    setActionPanelOpen(true);
    setFeedback(null);
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
    setActionPanelOpen(false);
    setFeedback(null);
  }

  function restart() {
    setTaskIndex(0);
    setSelectedHotspotId(null);
    setStationFound(false);
    setActionPanelOpen(false);
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
    <div data-vr-studio="true" className="overflow-hidden rounded-xl border border-white/10 bg-[#050b1a] text-white shadow-[0_30px_90px_rgba(2,8,23,0.35)]">
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

      <div className="grid xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r" data-vr-tour="room">
          <div className="border-b border-white/10 bg-[#071526] px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#99f6e4]"><LocateFixed aria-hidden="true" className="h-4 w-4" /> Step 1: Find and select</p>
            <p className="mt-1 text-sm font-semibold">Click the labelled <span className="text-[#99f6e4]">{task.hotspotLabel}</span> station.</p>
            <p className="mt-1 text-xs text-white/58">Then complete the decision that opens on screen.</p>
          </div>
          <div className="relative h-[440px] sm:h-[520px]">
            <PracticeScene hotspots={hotspots} activeId={task.hotspotId} selectedId={selectedHotspotId} completedIds={completedHotspotIds} onSelect={selectHotspot} />
            {feedback && !stationFound ? (
              <div role="status" className="absolute inset-x-3 bottom-3 rounded-lg border border-amber-300/35 bg-[#231c0a]/95 px-4 py-3 text-sm font-semibold text-amber-100 shadow-xl sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-lg">
                {feedback}
              </div>
            ) : null}

            {stationFound && actionPanelOpen && typeof document !== "undefined" ? createPortal(
              <div className="fixed inset-0 z-[90] grid place-items-center bg-[#020817]/82 p-3 text-white backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`Action for ${task.hotspotLabel}`}>
                <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#5eead4]/45 bg-[#071526] p-4 shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#5eead4]">Station {taskIndex + 1} found</p>
                      <h3 className="mt-1 text-xl font-semibold sm:text-2xl">Step 2: Complete the action</h3>
                    </div>
                    {!taskComplete ? (
                      <button type="button" onClick={() => setActionPanelOpen(false)} aria-label="Close decision panel" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 hover:bg-white/20">
                        <X aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/50">Evidence station</p>
                    <p className="mt-1 font-semibold text-white">{task.hotspotLabel}</p>
                    <p className="mt-2 text-sm leading-6 text-white/60"><span className="font-semibold text-white/85">Theory to apply:</span> {task.theoryReference}</p>
                  </div>
                  <p className="mt-5 text-base font-semibold leading-7 text-white sm:text-lg">{task.actionPrompt}</p>
                  <div className="mt-4 grid gap-3">
                    {task.options.map((option, optionIndex) => (
                      <button key={option} type="button" disabled={taskComplete} onClick={() => chooseAction(option)} className={`flex min-h-14 items-start gap-3 rounded-lg border p-3 text-left text-sm font-semibold leading-6 transition sm:p-4 ${taskComplete && option === task.correctOption ? "border-emerald-300 bg-emerald-400/15 text-emerald-100" : "border-white/12 bg-white/[0.045] text-white/80 hover:border-[#5eead4]/70 hover:bg-[#5eead4]/10 disabled:opacity-45"}`}>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-xs text-[#99f6e4]">{String.fromCharCode(65 + optionIndex)}</span>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                  {feedback ? (
                    <div aria-live="polite" className={`mt-4 rounded-lg border px-4 py-3 text-sm font-semibold leading-6 ${taskComplete ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-100"}`}>
                      {feedback}
                    </div>
                  ) : null}
                  {taskComplete ? (
                    <div className="mt-4 flex justify-end">
                      {!finished ? (
                        <button type="button" onClick={nextTask} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#5eead4] px-5 text-sm font-bold text-[#06111f]">Continue to station {taskIndex + 2} <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
                      ) : (
                        <button type="button" onClick={() => setActionPanelOpen(false)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#5eead4] px-5 text-sm font-bold text-[#06111f]">Review final score <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>,
              document.body,
            ) : null}
          </div>

          <div className="border-t border-white/10 bg-[#071020] p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.13em] text-white/48">Labelled station map</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {hotspots.map((hotspot, index) => {
              const complete = completedHotspotIds.has(hotspot.id);
              const active = hotspot.id === task.hotspotId;
              return (
                <button key={hotspot.id} type="button" onClick={() => selectHotspot(hotspot.id)} aria-label={`Select station ${index + 1}: ${hotspot.label}`} className={`min-h-16 rounded-lg border px-2 py-2 text-left text-[10px] font-bold leading-tight transition sm:text-xs ${complete ? "border-emerald-300/40 bg-emerald-500/20 text-emerald-100" : active ? "border-[#5eead4] bg-[#087f74]/92 text-white" : "border-white/15 bg-white/[0.04] text-white/58 hover:text-white"}`}>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[#99f6e4]">{complete ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <span>{index + 1}</span>} Station</span>
                  <span className="mt-1 block line-clamp-2">{hotspot.label}</span>
                </button>
              );
            })}
            </div>
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
              <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[#5eead4]/25 bg-[#5eead4]/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-white/70">The station is identified. Open the decision panel and choose the action that best applies the theory.</p>
                <button type="button" onClick={() => setActionPanelOpen(true)} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5eead4] px-4 text-sm font-bold text-[#06111f]">{taskComplete ? "Review decision" : "Open decision"} <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
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
