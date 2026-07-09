import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { getLearningHubs } from "@/lib/data";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Learning Hubs — VowLMS",
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Active" },
  "partner-ready": { bg: "bg-blue-50", text: "text-blue-700", label: "Partner ready" },
  planned: { bg: "bg-amber-50", text: "text-amber-700", label: "Coming soon" },
};

export default function LearningHubsPage() {
  const hubs = getLearningHubs();

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Learning Hubs</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
            Community learning. Everywhere.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow Learning Hubs bring facilitator-led courses, VR practice sessions, and community support to neighbourhoods across South Africa — with full PWA offline access.
          </p>
          <ButtonLink href="/courses" className="mt-8">Find a course near you</ButtonLink>
          </div>
          <ImagePanel
            src={visualAssets.vrPracticeLab}
            alt="GoalVow learning hub with VR practice and facilitator support"
            aspect="video"
          />
        </div>
      </section>

      {/* Hub cards */}
      <Section
        tone="light"
        eyebrow="Hub network"
        title="GoalVow Learning Hub locations"
        description="Physical access points supported by facilitators, VR equipment, and broadband connectivity for learners who need in-person support."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {hubs.map((hub) => {
            const style = STATUS_STYLE[hub.status] ?? STATUS_STYLE.planned;
            return (
              <article key={hub.id} className="premium-card rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-2xl">🏫</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-ink">{hub.name}</h2>
                  <p className="mt-1 text-sm text-muted">{hub.location}</p>
                </div>
                <p className="text-sm leading-6 text-slate-600 flex-1">{hub.focus}</p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                  <span className="text-2xl font-semibold text-[#1166c8]">{hub.capacity}</span>
                  <span className="text-sm text-muted">learner capacity</span>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Hub features */}
      <section className="premium-section-dark py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-gold">What every hub offers</p>
          <h2 className="mt-3 text-center text-3xl font-semibold">More than just a classroom</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "📡", title: "Broadband access", detail: "High-speed internet connectivity for streaming lessons, downloading content, and syncing progress." },
              { icon: "🥽", title: "VR practice space", detail: "Dedicated VR headset stations for immersive simulation training aligned to GoalVow courses." },
              { icon: "👩‍🏫", title: "Facilitator support", detail: "Trained GoalVow facilitators available to guide cohorts, answer questions, and track progress." },
              { icon: "📱", title: "Offline content sync", detail: "Learners can download course content at the hub and continue learning at home without data." },
            ].map((f) => (
              <div key={f.title} className="premium-card-dark rounded-xl p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/68">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <Section tone="light" eyebrow="Partner with us" title="Open a GoalVow Learning Hub in your community">
        <div className="premium-card rounded-2xl p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-ink">Apply to host a GoalVow Learning Hub</p>
            <p className="mt-2 text-sm leading-6 text-muted max-w-xl">
              Community centres, schools, libraries, and businesses can apply to become GoalVow partner learning hubs. We provide the technology, content, and facilitator training.
            </p>
          </div>
          <a
            href="mailto:support@goalvow.com?subject=Learning Hub Partnership"
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50 hover:border-[#1166c8]/40"
          >
            Apply for partnership →
          </a>
        </div>
      </Section>
    </main>
  );
}
