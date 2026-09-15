"use client";

import { Bot, Boxes, CheckCircle2, Headset, LockKeyhole, MessageSquareText, MousePointer2, Sparkles } from "lucide-react";
import type { ModeAvailability, ModeConfiguration, SimulationManifest, SimulationMode } from "@/simulation/types";

const metadata: Record<SimulationMode, { name: string; short: string; description: string; action: string; icon: typeof Bot; accent: string }> = {
  legacy: { name: "VR Skills 1", short: "Legacy Practice", description: "Explore guided workplace evidence and make theory-based decisions.", action: "Launch Legacy Practice", icon: MousePointer2, accent: "teal" },
  adaptive: { name: "VR Skills 2", short: "Adaptive Human Simulation", description: "Practise a realistic conversation with a stateful Digital Human.", action: "Launch Adaptive Simulation", icon: MessageSquareText, accent: "gold" },
  immersive: { name: "VR Skills 3", short: "Immersive Living Workplace", description: "Enter a living 3D workplace and perform the role.", action: "Enter Immersive Workplace", icon: Headset, accent: "coral" },
};

const statusStyle: Record<ModeAvailability, string> = {
  available: "bg-emerald-50 text-emerald-800", beta: "bg-amber-50 text-amber-800", "coming-soon": "bg-slate-100 text-slate-600",
  locked: "bg-rose-50 text-rose-700", completed: "bg-teal-50 text-teal-800",
};

function config(manifest: SimulationManifest, mode: SimulationMode): ModeConfiguration {
  return mode === "legacy" ? manifest.legacyMode : mode === "adaptive" ? manifest.adaptiveMode : manifest.immersiveMode;
}

export function ModeSelector({ manifest, selected, onSelect }: { manifest: SimulationManifest; selected: SimulationMode; onSelect: (mode: SimulationMode) => void }) {
  return (
    <section aria-labelledby="practice-mode-title" className="border-y border-slate-200 py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.17em] text-teal-700">Practice this module</p><h2 id="practice-mode-title" className="mt-2 text-2xl font-bold text-slate-950">Choose how you want to rehearse</h2></div>
        <p className="text-sm text-slate-500">Mode and difficulty are separate. Your evidence stays attached to this manifest version.</p>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3" role="tablist" aria-label="VR Skills practice modes">
        {(Object.keys(metadata) as SimulationMode[]).map((mode) => {
          const item = metadata[mode];
          const settings = config(manifest, mode);
          const disabled = settings.availability === "coming-soon" || settings.availability === "locked";
          const active = selected === mode;
          const Icon = item.icon;
          return (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={disabled}
              onClick={() => onSelect(mode)}
              className={`min-h-[240px] border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${active ? "border-teal-500 bg-slate-950 text-white shadow-xl" : "border-slate-200 bg-white text-slate-950 hover:border-teal-300"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-lg ${active ? "bg-teal-400 text-slate-950" : "bg-slate-100 text-teal-800"}`}><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusStyle[settings.availability]}`}>{settings.availability.replace("-", " ")}</span>
              </div>
              <p className={`mt-5 text-xs font-bold uppercase tracking-[0.15em] ${active ? "text-teal-200" : "text-teal-700"}`}>{item.name}</p>
              <h3 className="mt-1 text-lg font-bold">{item.short}</h3>
              <p className={`mt-2 text-sm leading-6 ${active ? "text-slate-300" : "text-slate-600"}`}>{item.description}</p>
              <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold ${active ? "text-slate-300" : "text-slate-500"}`}>
                <span>{settings.difficulty}</span><span>{settings.estimatedMinutes} min</span><span>{settings.inputMethods.slice(0, 2).join(" + ")}</span>
              </div>
              <p className={`mt-3 text-xs leading-5 ${active ? "text-slate-400" : "text-slate-500"}`}>Headset: {settings.headsetCompatibility.replace("-", " ")}<br />Prerequisite: {settings.prerequisites[0] ?? "None"}</p>
              <div className={`mt-5 flex items-center gap-2 text-sm font-bold ${disabled ? "text-slate-400" : active ? "text-teal-200" : "text-teal-800"}`}>
                {disabled ? <LockKeyhole aria-hidden="true" className="h-4 w-4" /> : settings.availability === "completed" ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : <Sparkles aria-hidden="true" className="h-4 w-4" />}{disabled ? "Not yet enabled for this module" : item.action}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500"><span className="flex items-center gap-1.5"><Bot aria-hidden="true" className="h-4 w-4 text-teal-700" /> Digital Human state is scenario-controlled</span><span className="flex items-center gap-1.5"><Boxes aria-hidden="true" className="h-4 w-4 text-teal-700" /> One shared simulation manifest</span></div>
    </section>
  );
}
