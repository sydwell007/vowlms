import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "SkillsShop · Learning Kits & Equipment",
  description: "Shop learning kits, tools, and equipment curated for GoalVow learners. Everything you need to practice real skills outside the classroom.",
};

const categories = [
  { icon: "🍳", label: "Chef Academy kits", desc: "Professional knives, aprons, kitchen tools, and food safety kits for culinary learners." },
  { icon: "🔧", label: "Trade tool bundles", desc: "Hand tools, safety gear, and trade equipment for Skills Training academy learners." },
  { icon: "💻", label: "Digital starter packs", desc: "Device bundles, data packs, and productivity software for upskilling academy learners." },
  { icon: "📚", label: "Study materials", desc: "Textbooks, workbooks, stationery packs, and printed course materials across all academies." },
  { icon: "🎓", label: "Uniform bundles", desc: "Academy uniforms, branded merchandise, and professional attire for formal programmes." },
  { icon: "⭐", label: "Rewards redemption", desc: "Redeem VowRewards points for SkillsShop credits — every lesson brings you closer to free gear." },
];

export default function SkillsShopPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
            Coming soon
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">SkillsShop</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Academy-aligned learning kits, tools, equipment, and product bundles — with VowRewards redemption built in. Everything a GoalVow learner needs, in one shop.
          </p>
          <div className="mt-8">
            <a href="mailto:support@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0891b2]">
              Notify me on launch →
            </a>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.academyNetwork}
            alt="SkillsShop learning kits and equipment across the GoalVow academy network"
            aspect="video"
          />
        </div>
      </section>
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">What&apos;s coming to SkillsShop</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <article key={c.label} className="gv-card rounded-xl p-6">
                <span className="text-3xl">{c.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-ink">{c.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
