import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Innovation Labs · VR, AI & R&D at GoalVow" };

const projects = [
  { icon: "🥽", title: "VR Skill Simulations", status: "In development", desc: "WebXR-powered immersive skill practice scenarios — kitchen safety, workplace ethics, business negotiations, and more. Built with React Three Fiber." },
  { icon: "🤖", title: "AI Learning Support", status: "Research phase", desc: "Personalised learning pace adjustments, intelligent course recommendations, and AI-powered assessment feedback aligned to GoalVow curriculum." },
  { icon: "📊", title: "Outcome Analytics Engine", status: "In development", desc: "Real-time learner progress dashboards for facilitators, admins, and employers — tracking completion, assessment performance, and opportunity matches." },
  { icon: "📱", title: "Progressive Web App", status: "Live", desc: "Full offline capability, service worker, and PWA manifest — GoalVow works on any device, even in low-connectivity communities." },
  { icon: "🔐", title: "Verifiable Credentials", status: "Live", desc: "Cryptographically verifiable digital certificates that employers can authenticate without contacting GoalVow directly." },
  { icon: "🌐", title: "Multi-language Support", status: "Planned", desc: "Afrikaans, isiZulu, isiXhosa, and Sesotho language support for courses, assessments, and platform navigation." },
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
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            🔬 R&D in progress
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Innovation Labs</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            GoalVow&apos;s Innovation Labs builds the next generation of learning technology — VR skill simulations, AI personalisation, verifiable credentials, and platform R&D that creates a sustainable competitive moat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:tech@goalvow.com"
              className="inline-flex items-center gap-2 rounded-lg bg-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0891b2]"
            >
              Partner with our tech team →
            </a>
            <ButtonLink href="/investors" variant="secondary">Innovation investment case</ButtonLink>
          </div>
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
            We work with tech partners, researchers, and VR developers to build the next generation of African learning technology.
          </p>
          <div className="mt-6">
            <a
              href="mailto:tech@goalvow.com"
              className="inline-flex items-center gap-2 rounded-lg bg-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0891b2]"
            >
              tech@goalvow.com →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
