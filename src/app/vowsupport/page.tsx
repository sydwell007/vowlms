import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "VowSupport · GoalVow Learner Support" };

const services = [
  { icon: "📚", title: "Academic Tutoring", desc: "One-on-one or small group tutoring sessions aligned to GoalVow academy curriculum across all 6 verticals." },
  { icon: "🧭", title: "Career Mentoring", desc: "Matched mentors from industry partners guide learners on career direction, professional skills, and opportunity navigation." },
  { icon: "🧠", title: "Study Coaching", desc: "Learning coaches help learners build study habits, manage time, and stay on track through courses and assessments." },
  { icon: "📋", title: "Registration Support", desc: "Help with academy enrolment, document submission, payment queries, and course selection — especially for first-time learners." },
  { icon: "💬", title: "Wellbeing Check-ins", desc: "GoalVow facilitators conduct regular wellbeing check-ins to identify learners who need extra support and connect them to resources." },
  { icon: "🎯", title: "Goal Planning", desc: "Structured goal-setting sessions to align a learner's study plan with their career aspirations and life circumstances." },
];

export default function VowSupportPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            ✓ Built-in
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">VowSupport</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Tutoring, mentoring, coaching, and registration support — built into the GoalVow platform so every learner has the help they need, when they need it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/dashboard/learner" variant="primary">Access support</ButtonLink>
            <ButtonLink href="/learning-hubs" variant="secondary">Find a hub near you</ButtonLink>
          </div>
        </div>
      </section>
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">What VowSupport offers</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="gv-card rounded-xl p-6">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="gv-section-dark py-12 text-white text-center">
        <div className="mx-auto max-w-xl px-5">
          <h2 className="text-2xl font-semibold">Need support now?</h2>
          <p className="mt-3 text-sm text-white/66">Contact a VowSupport facilitator via your dashboard or reach out directly.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:support@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#19c37d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15a86c]">
              Email support
            </a>
            <a href="https://wa.me/27839488894" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/14">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
