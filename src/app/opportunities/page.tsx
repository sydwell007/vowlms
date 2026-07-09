import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { getOpportunities } from "@/lib/data";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Opportunities — VowLMS",
};

const TYPE_COLOR: Record<string, string> = {
  employment: "#1166c8",
  entrepreneurship: "#19c37d",
  internship: "#f5c542",
  supplier: "#ff7a59",
  study: "#9b59b6",
};

const TYPE_ICON: Record<string, string> = {
  employment: "💼",
  entrepreneurship: "🚀",
  internship: "🎓",
  supplier: "🏭",
  study: "📚",
};

export default function OpportunitiesPage() {
  const opportunities = getOpportunities();

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">PlugConnect pathways</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
            Learning that leads somewhere
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            Complete a GoalVow course, earn a certificate, and unlock direct pathways to employment, internships, supplier contracts, entrepreneurship grants, and further study.
          </p>
          <ButtonLink href="/courses" className="mt-8">Start a course to unlock opportunities</ButtonLink>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowLMS learner dashboard connecting certificates, progress, and opportunities"
            aspect="video"
          />
        </div>
      </section>

      {/* Opportunity cards */}
      <Section
        tone="light"
        eyebrow="Available pathways"
        title="Current GoalVow opportunity matches"
        description="Opportunities are matched to learners based on completed courses, earned certificates, and assessment scores."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {opportunities.map((opp) => {
            const color = TYPE_COLOR[opp.type] ?? "#1166c8";
            const icon = TYPE_ICON[opp.type] ?? "🎯";
            return (
              <article key={opp.id} className="premium-card rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl">{icon}</div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] shrink-0"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    {opp.type}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-ink">{opp.title}</h2>
                  <p className="mt-1 text-sm font-medium text-muted">{opp.partner} · {opp.location}</p>
                </div>
                <p className="text-sm leading-6 text-slate-600 flex-1">{opp.description}</p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-[#1166c8]/30 hover:text-[#1166c8] self-start"
                >
                  Apply via PlugConnect →
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      {/* How it works */}
      <section className="premium-section-dark py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold text-center">How opportunity matching works</p>
          <h2 className="mt-3 text-center text-3xl font-semibold">Four steps from learning to opportunity</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              { step: "01", title: "Complete a course", detail: "Finish all modules and pass the assessment." },
              { step: "02", title: "Earn your certificate", detail: "Download and share your GoalVow verified certificate." },
              { step: "03", title: "Collect VowRewards", detail: "Build your reward balance across the ecosystem." },
              { step: "04", title: "Match to opportunities", detail: "PlugConnect surfaces roles, gigs, grants, and study pathways matched to your profile." },
            ].map((s) => (
              <div key={s.step} className="premium-card-dark rounded-xl p-6">
                <p className="text-3xl font-semibold text-gold">{s.step}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/68">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
