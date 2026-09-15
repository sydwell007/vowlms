import { legacyPracticeToManifest } from "@/simulation/manifests/legacyAdapter";
import { practiceToSimulation, type VowLmsPractice } from "@/data/vowlmsUpskilling";
import { PracticeExperience } from "@/components/vr-skills/PracticeExperience";
import type { VRPractice } from "@/types/lms";

export function VrSkillsPracticeExperience({ practice, courseSlug }: { practice: VRPractice; courseSlug: string }) {
  const vowLmsPractice = practice as unknown as VowLmsPractice;
  const simulation = practiceToSimulation(vowLmsPractice);
  const manifest = legacyPracticeToManifest(vowLmsPractice);

  return (
    <PracticeExperience
      manifest={manifest}
      legacySimulation={simulation}
      initialMode="legacy"
      exitHref={`/courses/${courseSlug}`}
      completeHref={`/results/${courseSlug}`}
    />
  );
}
