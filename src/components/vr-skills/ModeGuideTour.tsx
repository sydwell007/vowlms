"use client";

import { ArrowLeft, ArrowRight, Check, MapPinned, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SimulationMode } from "@/simulation/types";

type TourStep = { selector: string; title: string; body: string };

const stepsByMode: Record<Exclude<SimulationMode, "legacy">, TourStep[]> = {
  adaptive: [
    { selector: '[data-mode-tour="adaptive-brief"]', title: "Know your role", body: "Start with the scenario and your workplace role. Your goal is to reach a professional outcome, not to guess a hidden answer." },
    { selector: '[data-mode-tour="adaptive-human"]', title: "Meet the Digital Human", body: "This person has a role, motivation, and changing emotional state. Their responses adapt to the way you communicate." },
    { selector: '[data-mode-tour="adaptive-conversation"]', title: "Respond naturally", body: "Type in your own words or deliberately activate the microphone. Ask questions, clarify evidence, apply policy, and agree the next action." },
    { selector: '[data-mode-tour="adaptive-state"]', title: "Watch the workplace signals", body: "Trust, stress, engagement, objectives, and consequences change as the conversation develops. Text and voice are assessed equally." },
  ],
  immersive: [
    { selector: 'section[aria-label="VR Skills 3 Immersive Living Workplace"] > header', title: "Enter the workplace", body: "You are performing a workplace role. Inspect the room, speak with people, and complete every required action before the scenario concludes." },
    { selector: "#living-world-canvas", title: "Select a labelled object", body: "Every interactive object has a visible name. Click the object or its label to inspect it. Selection alone never completes a task." },
    { selector: 'section[aria-label="VR Skills 3 Immersive Living Workplace"] aside > div:nth-child(2)', title: "Complete the required action", body: "After selecting an object, its evidence and decision appear here. Choose a response and confirm it. Use the numbered station row below to jump to any of the five actions — a check appears once its decision is recorded." },
    { selector: 'section[aria-label="VR Skills 3 Immersive Living Workplace"] aside > div:nth-child(3)', title: "Speak with workplace agents", body: "Choose a named person here or select their body in the room, then communicate in your own words. Conversations and object decisions share one persistent world state." },
  ],
};

function visibleTarget(selector: string) {
  const target = document.querySelector<HTMLElement>(selector);
  const rect = target?.getBoundingClientRect();
  return target && rect && rect.width > 0 && rect.height > 0 ? target : null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ModeGuideTour({ mode, manifestId, version }: { mode: Exclude<SimulationMode, "legacy">; manifestId: string; version: number }) {
  const steps = stepsByMode[mode];
  const storageKey = `goalvow-vr-${mode}-guide:${manifestId}:v${version}`;
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[stepIndex];

  useEffect(() => {
    if (window.localStorage.getItem(storageKey)) return;
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const target = visibleTarget(step.selector);
      if (!target) return;
      target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      window.setTimeout(() => setRect(target.getBoundingClientRect()), 180);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open, step.selector]);

  const popoverStyle = useMemo(() => {
    if (!rect) return { left: 16, top: 80 };
    const width = Math.min(380, window.innerWidth - 32);
    const margin = 16;
    const rightSpace = window.innerWidth - rect.right;
    const left = rightSpace >= width + margin ? rect.right + margin : clamp(rect.left, margin, window.innerWidth - width - margin);
    const below = rect.bottom + 250 < window.innerHeight;
    const top = below ? rect.bottom + 14 : clamp(rect.top - 238, margin, window.innerHeight - 250);
    return { left, top };
  }, [rect]);

  function close() {
    window.localStorage.setItem(storageKey, "complete");
    setOpen(false);
  }

  if (!open || !rect) return null;
  const last = stepIndex === steps.length - 1;
  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={`${mode} simulation guide tour`}>
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="pointer-events-none absolute border-2 border-teal-300 shadow-[0_0_0_9999px_rgba(2,6,23,0.44)]" style={{ left: Math.max(8, rect.left - 7), top: Math.max(8, rect.top - 7), width: Math.min(window.innerWidth - 16, rect.width + 14), height: Math.min(window.innerHeight - 16, rect.height + 14) }}>
        <span className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-teal-300 text-slate-950"><MapPinned aria-hidden="true" className="h-4 w-4" /></span>
      </div>
      <div className="absolute w-[min(380px,calc(100vw-32px))] rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-2xl" style={popoverStyle}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">{mode === "adaptive" ? "Adaptive guide" : "Immersive guide"} {stepIndex + 1} of {steps.length}</p><h2 className="mt-2 text-xl font-bold">{step.title}</h2></div><button type="button" onClick={close} aria-label="Close guide" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700"><X aria-hidden="true" className="h-4 w-4" /></button></div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
        <div className="mt-5 h-1.5 overflow-hidden bg-slate-100"><div className="h-full bg-teal-600 transition-[width]" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
        <div className="mt-5 flex items-center justify-between gap-3"><button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((index) => Math.max(0, index - 1))} className="inline-flex h-10 items-center gap-2 px-2 text-sm font-bold text-slate-600 disabled:opacity-30"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back</button><div className="flex gap-2"><button type="button" onClick={close} className="h-10 px-3 text-sm font-bold text-slate-600">Skip</button><button type="button" onClick={() => last ? close() : setStepIndex((index) => index + 1)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white">{last ? <Check aria-hidden="true" className="h-4 w-4" /> : null}{last ? "Finish" : "Next"}{!last ? <ArrowRight aria-hidden="true" className="h-4 w-4" /> : null}</button></div></div>
      </div>
    </div>
  );
}
