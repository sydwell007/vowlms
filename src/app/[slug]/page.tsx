import { notFound } from "next/navigation";

const placeholderPages = {
  about: {
    title: "About GoalVow",
    body: "GoalVow is building a practical learning and opportunity ecosystem across skills, schools, business, rewards, and career growth.",
    highlights: ["Academy network", "Investor-ready pathways", "Practical learner outcomes"],
  },
  team: {
    title: "Team",
    body: "This placeholder page is reserved for the GoalVow leadership, academy, product, and delivery teams.",
    highlights: ["Leadership profiles", "Academy heads", "Delivery capability"],
  },
  careers: {
    title: "Careers",
    body: "Future opportunities across GoalVow academies, learning hubs, support, and ecosystem ventures will be surfaced here.",
    highlights: ["Open roles", "Contract pathways", "Partner opportunities"],
  },
  impact: {
    title: "Impact",
    body: "This placeholder page will summarize learner reach, opportunity outcomes, community partnerships, and economic impact.",
    highlights: ["Learner growth", "Community reach", "Opportunity conversion"],
  },
  investors: {
    title: "Investors Hub",
    body: "Investor-facing information for GoalVow Holdings and the academy ecosystem will live here.",
    highlights: ["Group overview", "Ecosystem strategy", "Growth milestones"],
  },
  "innovation-labs": {
    title: "Innovation Labs",
    body: "GoalVow Innovation Labs will showcase experiments across education, simulations, mobile access, and opportunity infrastructure.",
    highlights: ["Pilot programs", "Product R&D", "Applied learning infrastructure"],
  },
  privacy: {
    title: "Privacy Policy",
    body: "This placeholder route is ready for the VowLMS and GoalVow privacy policy.",
    highlights: ["Data handling", "Consent management", "Policy updates"],
  },
  terms: {
    title: "Terms of Use",
    body: "This placeholder route is reserved for the VowLMS terms of use.",
    highlights: ["Platform access", "Learner responsibilities", "Service conditions"],
  },
  cookies: {
    title: "Cookies",
    body: "Cookie notice and consent details will be published here.",
    highlights: ["Cookie types", "Consent controls", "Retention notes"],
  },
  accessibility: {
    title: "Accessibility",
    body: "GoalVow accessibility commitments, contact details, and improvement notes will be published here.",
    highlights: ["Accessibility support", "Improvement roadmap", "Contact pathway"],
  },
  support: {
    title: "VowSupport",
    body: "This placeholder page is ready for learner support services, contact flows, and escalation guidance.",
    highlights: ["Learner help", "Support channels", "Escalation guidance"],
  },
  skillsshop: {
    title: "SkillsShop",
    body: "SkillsShop integrations, product pathways, and marketplace information will be surfaced here.",
    highlights: ["Marketplace setup", "Product pathways", "Partner inventory"],
  },
  vowtools: {
    title: "VowTools",
    body: "VowTools starter kits, trade tools, and linked practical resources will be published here.",
    highlights: ["Starter kits", "Trade readiness", "Resource bundles"],
  },
  cheforder: {
    title: "ChefOrder",
    body: "ChefOrder partner pathways, culinary services, and academy-linked operations details will live here.",
    highlights: ["Kitchen partners", "Service pathways", "Operations support"],
  },
} as const;

export function generateStaticParams() {
  return Object.keys(placeholderPages).map((slug) => ({ slug }));
}

export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = placeholderPages[slug as keyof typeof placeholderPages];

  if (!page) {
    notFound();
  }

  return (
    <main>
      <section className="surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Information</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">{page.title}</h1>
          <div className="glass-panel mt-8 rounded-xl p-8 sm:p-10">
            <p className="max-w-3xl text-base leading-7 text-white/74">{page.body}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {page.highlights.map((highlight) => (
                <span key={highlight} className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/72">
                  {highlight}
                </span>
              ))}
            </div>

            {slug === "privacy" ? (
              <div id="data-rights" className="mt-8 border-t border-white/12 pt-8">
                <h2 className="text-xl font-semibold">Data rights request placeholder</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                  This anchor is reserved for privacy controls, data-access requests, deletion requests, and consent preferences.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
