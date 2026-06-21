import { Section } from "@/components/ui/Section";

export const metadata = { title: "Innovation Labs — GoalVow Holdings" };

export default function InnovationLabsPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Innovation Labs</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
            Where GoalVow invents what's next
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow Innovation Labs is the research and experimentation arm of GoalVow Holdings — exploring AI-powered learning, VR simulations, and the future of community-driven education.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Active projects" title="What we're building next">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🥽", title: "VR Skills Practice", status: "In development", description: "WebXR-powered practice environments for hands-on skills training — from solar installation simulations to virtual kitchen sessions for Chef Academy learners." },
            { icon: "🤖", title: "AI Learning Assistant", status: "Research phase", description: "An AI-powered learning companion that personalises course recommendations, answers content questions, and tracks learner knowledge gaps in real time." },
            { icon: "📱", title: "GoalVow Mobile App", status: "Design phase", description: "A native mobile companion to VowLMS with offline-first architecture, push notifications for assignments and events, and biometric sign-in." },
            { icon: "🗺️", title: "Skills Demand Mapper", status: "Research phase", description: "Mapping local employer skills demand to GoalVow course completions — enabling real-time curriculum alignment with what the market actually needs." },
            { icon: "🧬", title: "Adaptive Assessment Engine", status: "Concept stage", description: "Dynamically adjusting assessment difficulty based on learner performance history — reducing assessment anxiety while maintaining rigour." },
            { icon: "🌐", title: "Pan-African Expansion", status: "Planning", description: "GoalVow's ecosystem model is being adapted for rollout across SADC countries, with multilingual support and local opportunity matching." },
          ].map((p) => (
            <article key={p.title} className="premium-card rounded-xl p-6">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="text-3xl">{p.icon}</div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-muted">{p.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{p.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Collaborate with GoalVow Labs</h2>
          <p className="mt-4 text-base text-white/70">Researchers, universities, and technology partners are invited to collaborate on GoalVow Innovation Lab projects.</p>
          <a href="mailto:labs@goalvow.com" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] hover:bg-gold/90 transition">
            Contact labs@goalvow.com →
          </a>
        </div>
      </section>
    </main>
  );
}
