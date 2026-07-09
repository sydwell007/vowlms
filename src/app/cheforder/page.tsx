import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "ChefOrder · Chef Business & Food Platform" };

const features = [
  { icon: "🍽️", title: "Online food ordering", desc: "Customers discover and order from GoalVow Chef Academy graduates — supporting learner entrepreneurs with real revenue from day one." },
  { icon: "🧑‍🍳", title: "Chef business profiles", desc: "Each Chef Academy graduate gets a professional ChefOrder profile showcasing their menu, credentials, and GoalVow certificates." },
  { icon: "📦", title: "Catering bookings", desc: "Individuals and businesses can book GoalVow-trained chefs for events, corporate catering, and pop-up restaurant experiences." },
  { icon: "🏆", title: "Verified credentials", desc: "All chefs on ChefOrder are verified GoalVow academy graduates — giving customers confidence in their food safety and professional training." },
  { icon: "💰", title: "Revenue from learning", desc: "Chef Academy learners build income pathways before they even graduate by listing trial offerings during their practical training phase." },
  { icon: "🌍", title: "Community food hubs", desc: "ChefOrder integrates with GoalVow learning hubs to create community kitchen programmes and food enterprise incubators." },
];

export default function ChefOrderPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
            Coming soon
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">ChefOrder</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            A food-ordering and chef-business platform that creates commercial revenue pathways for GoalVow Chef Academy graduates and culinary entrepreneurs.
          </p>
          <div className="mt-6 text-white/60 text-sm">
            ChefOrder connects learning to earning for every Chef Academy graduate.
          </div>
          <div className="mt-6">
            <a href="mailto:support@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]">
              Register your interest →
            </a>
          </div>
        </div>
      </section>
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">How ChefOrder works</h2>
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
          <p className="mt-3 text-sm text-white/66">Enrol in the Chef Academy today and position yourself to be one of the first chefs on ChefOrder at launch.</p>
          <div className="mt-6">
            <ButtonLink href="/academies/chef-academy" variant="primary">Explore Chef Academy →</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
