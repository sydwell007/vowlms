import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Impact — GoalVow Holdings" };

export default function ImpactPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Social impact</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">Measuring what matters</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow Holdings tracks real outcomes — certificates earned, opportunities matched, and livelihoods changed — not just enrolment numbers.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Impact metrics" title="GoalVow impact at a glance">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "1,284+", label: "Active learners", icon: "👩‍🎓" },
            { value: "614", label: "Courses available", icon: "📚" },
            { value: "271+", label: "Certificates issued", icon: "🏅" },
            { value: "96+", label: "Opportunity matches", icon: "🎯" },
          ].map((m) => (
            <div key={m.label} className="premium-card rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{m.icon}</div>
              <p className="text-4xl font-bold text-[#1166c8]">{m.value}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{m.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Our impact areas" title="Where GoalVow makes a difference">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: "💼", title: "Youth employment", description: "GoalVow Upskilling and Skills Training courses directly target youth unemployment through practical, certificate-backed pathways into the job market." },
            { icon: "🍳", title: "Food entrepreneurship", description: "Chef Academy trains aspiring chefs and food entrepreneurs, connecting completers to ChefOrder opportunities and catering contracts." },
            { icon: "📐", title: "Digital literacy", description: "Cybersecurity, communication, and digital workplace modules close the digital skills gap for workers and job seekers across SA." },
            { icon: "🏫", title: "School access", description: "GoalVow Schools provide affordable digital curriculum supplements for primary and high school learners in under-resourced communities." },
            { icon: "📊", title: "Business creation", description: "Business School modules guide aspiring entrepreneurs from idea validation to launch, with SkillsShop and VowTools follow-through support." },
            { icon: "🎓", title: "Higher education", description: "University Online makes degree-level learning accessible to working adults through flexible, fully online BSc, BBA, and BCom programmes." },
          ].map((item) => (
            <article key={item.title} className="premium-card-dark rounded-xl p-6">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Partner with GoalVow for impact</h2>
          <p className="mt-4 text-base text-white/70">Government agencies, NGOs, and corporates can partner with GoalVow to deliver funded learning programmes with measurable community outcomes.</p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/investors">Investors hub</ButtonLink>
            <a href="mailto:partnerships@goalvow.com" className="rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
              Contact partnerships →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
