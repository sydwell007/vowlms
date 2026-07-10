import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { siteConfig } from "@/lib/site";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Innovation Labs - GoalVow R&D",
  description: "Review GoalVow's current platform experiments and clearly labelled research roadmap.",
};

const projects = [
  { icon: "🥽", title: "Skills Practice previews", status: "In development", desc: "Guided practice-preview interfaces with future WebXR work gated by content, device, safety, and assessment requirements." },
  { icon: "🤖", title: "AI learning support", status: "Research phase", desc: "Potential assistance features require privacy, curriculum, accuracy, safeguarding, and human-review controls before implementation." },
  { icon: "📊", title: "Outcome analytics", status: "In development", desc: "Role-scoped dashboard foundations are present; published outcome reporting remains blocked until data governance is approved." },
  { icon: "📱", title: "Progressive Web App foundation", status: "Live", desc: "A manifest, service worker, and public offline fallback are present. Private and API routes are deliberately excluded from caching." },
  { icon: "🔐", title: "Certificate records", status: "Live", desc: "Account-owned certificate identifiers are supported. External public verification and advanced credential standards remain future work." },
  { icon: "🌐", title: "Multi-language support", status: "Planned", desc: "Language priorities, translation ownership, curriculum review, and accessible localisation require business confirmation." },
];

const statusColors: Record<string, string> = {
  "Live": "bg-emerald-100 text-emerald-700",
  "In development": "bg-cyan-100 text-cyan-700",
  "Research phase": "bg-blue-100 text-blue-700",
  "Planned": "bg-amber-100 text-amber-700",
};

export default function InnovationLabsPage() {
  return (
    <main>
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            🔬 R&D in progress
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Innovation Labs</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            GoalVow Innovation Labs is the clearly labelled research and development pathway for Skills Practice, analytics, accessibility, and future learning tools.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=GoalVow%20Innovation%20Labs%20enquiry`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0891b2]"
            >
              Discuss an R&amp;D enquiry →
            </a>
            <ButtonLink href="/investors" variant="secondary">Innovation investment case</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.vrPracticeLab}
            alt="GoalVow Innovation Labs VR practice and simulation environment"
            priority
            aspect="video"
          />
        </div>
      </section>

      <section className="gv-section-blue py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Current projects</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.title} className="gv-card rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{p.icon}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusColors[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gv-section-dark py-12 text-white text-center">
        <div className="mx-auto max-w-xl px-5">
          <h2 className="text-2xl font-semibold">Collaborate with GoalVow Innovation Labs</h2>
          <p className="mt-3 text-sm text-white/66">
            Use the verified GoalVow support channel to introduce a research, accessibility, content, or technology proposal.
          </p>
          <div className="mt-6">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=GoalVow%20Innovation%20Labs%20enquiry`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0891b2]"
            >
              Contact GoalVow →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
