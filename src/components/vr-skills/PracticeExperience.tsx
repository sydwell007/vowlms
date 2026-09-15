"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SimulationViewer } from "@/components/simulation/SimulationViewer";
import { AdaptiveSimulation } from "@/components/vr-skills/AdaptiveSimulation";
import { ImmersiveWorkplace } from "@/components/vr-skills/ImmersiveWorkplace";
import { ModeSelector } from "@/components/vr-skills/ModeSelector";
import type { Simulation } from "@/types/vr-simulation";
import type { SimulationManifest, SimulationMode } from "@/simulation/types";

export function PracticeExperience({ manifest, legacySimulation, initialMode, exitHref, completeHref }: { manifest: SimulationManifest; legacySimulation: Simulation; initialMode: SimulationMode; exitHref?: string; completeHref?: string }) {
  const [mode, setMode] = useState(initialMode);
  const pathname = usePathname();
  const router = useRouter();
  function select(next: SimulationMode) { setMode(next); router.replace(`${pathname}?mode=${next}`, { scroll: false }); }
  return <div className="space-y-6"><ModeSelector manifest={manifest} selected={mode} onSelect={select} /><div role="tabpanel" aria-label={`${mode} practice mode`}>{mode === "legacy" ? <SimulationViewer simulation={legacySimulation} lessonTitle={manifest.title} mode="desktop" exitHref={exitHref} completeHref={completeHref} /> : mode === "adaptive" ? <AdaptiveSimulation manifest={manifest} /> : <ImmersiveWorkplace manifest={manifest} />}</div></div>;
}
