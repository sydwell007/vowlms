import Image from "next/image";
import { visualAssets } from "@/lib/visual-assets";
import type { VRPractice } from "@/types/lms";

export function VRStudio({ practice }: { practice: VRPractice }) {
  return (
    <div className="premium-card-dark grid gap-6 rounded-xl p-5 text-white md:grid-cols-[1.2fr_0.8fr]">
      <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-white/10 bg-[#091a2f]">
        <Image
          src={visualAssets.vrPracticeLab}
          alt="VowLMS VR practice lab with a learner using immersive simulation equipment"
          fill
          sizes="(min-width: 768px) 55vw, 92vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071526] via-[#071526]/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071526] to-transparent p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">VR practice lab</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Immersive practice is structured for future WebXR scenes, headset controls, and facilitator scoring.
          </p>
        </div>
      </div>
      <aside className="premium-card rounded-xl p-5 text-ink">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Practice scenario</p>
        <h2 className="mt-3 text-2xl font-semibold">{practice.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{practice.scenario}</p>
        <div className="mt-5 space-y-2">
          {practice.skillsPracticed.map((skill) => (
            <div key={skill} className="premium-card-soft rounded-lg px-3 py-2 text-sm font-medium text-ink">
              {skill}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-[#f5c542]/30 bg-[#fff5d1] p-4">
          <p className="text-sm font-semibold text-[#8a6100]">Score placeholder</p>
          <p className="mt-1 text-3xl font-semibold text-ink">{practice.scorePlaceholder}%</p>
        </div>
      </aside>
    </div>
  );
}
