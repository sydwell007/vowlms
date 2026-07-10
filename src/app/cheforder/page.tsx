import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "ChefOrder - Planned Chef Business Platform",
  description: "Review the proposed ChefOrder pathway for future Chef Academy enterprise services.",
};

const features = [
  { icon: "🍽️", title: "Ordering concept", desc: "Explore how approved culinary businesses could publish products or menus through a future ordering service." },
  { icon: "🧑‍🍳", title: "Business profiles", desc: "Define identity, menu, service area, availability, and evidence requirements before profiles can be published." },
  { icon: "📦", title: "Catering enquiries", desc: "Assess a structured enquiry and booking workflow with clear provider and customer protections." },
  { icon: "🏆", title: "Credential consent", desc: "A chef would choose which eligible GoalVow records can be associated with a public business profile." },
  { icon: "💰", title: "Commercial model", desc: "Fees, payouts, refunds, disputes, taxes, and provider eligibility require approval before launch." },
  { icon: "🌍", title: "Partner operations", desc: "Any kitchen, hub, incubator, or delivery partnership must be confirmed before it is presented publicly." },
];

export default function ChefOrderPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
            Coming soon
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">ChefOrder</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            A proposed food-ordering and chef-business pathway for GoalVow Chef Academy learners and culinary entrepreneurs.
          </p>
          <div className="mt-6 text-white/60 text-sm">
            Product, provider, payment, food-safety, and fulfilment rules are still being defined.
          </div>
          <div className="mt-6">
            <a href="mailto:support@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]">
              Register your interest →
            </a>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.academyNetwork}
            alt="Chef Academy and GoalVow academy network for culinary business pathways"
            aspect="video"
          />
        </div>
      </section>
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Concept areas under review</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="gv-card rounded-xl p-6">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="gv-section-dark py-12 text-white text-center">
        <div className="mx-auto max-w-xl px-5">
          <h2 className="text-2xl font-semibold">Are you a Chef Academy learner?</h2>
          <p className="mt-3 text-sm text-white/66">Explore the current Chef Academy catalogue while the ChefOrder business model is validated separately.</p>
          <div className="mt-6">
            <ButtonLink href="/academies/chef-academy" variant="primary">Explore Chef Academy →</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
