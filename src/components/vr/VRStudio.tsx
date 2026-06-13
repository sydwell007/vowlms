import type { VRPractice } from "@/types/lms";

export function VRStudio({ practice }: { practice: VRPractice }) {
  return (
    <div className="grid gap-6 rounded-lg border border-white/10 bg-[#071526] p-5 text-white md:grid-cols-[1.2fr_0.8fr]">
      <div className="surface-grid relative min-h-[320px] overflow-hidden rounded-lg border border-white/10 bg-[#091a2f]">
        <div className="absolute inset-x-8 bottom-8 h-24 rounded-[50%] border border-electric/40 bg-electric/10" />
        <div className="absolute left-1/2 top-20 h-32 w-32 -translate-x-1/2 rotate-45 rounded-lg border border-gold/50 bg-gold/20 shadow-[0_0_80px_rgba(245,197,66,0.22)]" />
        <div className="absolute left-[18%] top-24 h-20 w-20 rounded-lg border border-white/20 bg-white/10" />
        <div className="absolute right-[16%] top-28 h-24 w-24 rounded-lg border border-electric/40 bg-electric/20" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071526] to-transparent p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">WebXR-ready scene</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            This placeholder is structured for a future React Three Fiber Canvas, headset controls, and facilitator scoring.
          </p>
        </div>
      </div>
      <aside className="rounded-lg bg-white p-5 text-ink">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Practice scenario</p>
        <h2 className="mt-3 text-2xl font-semibold">{practice.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{practice.scenario}</p>
        <div className="mt-5 space-y-2">
          {practice.skillsPracticed.map((skill) => (
            <div key={skill} className="rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-ink">
              {skill}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-md bg-[#fff5d1] p-4">
          <p className="text-sm font-semibold text-[#8a6100]">Score placeholder</p>
          <p className="mt-1 text-3xl font-semibold text-ink">{practice.scorePlaceholder}%</p>
        </div>
      </aside>
    </div>
  );
}
