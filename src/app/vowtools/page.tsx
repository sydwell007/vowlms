import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "VowTools - Planned Career Readiness Toolkit",
  description: "Review the proposed VowTools roadmap for future learner career-readiness features.",
};

const tools = [
  { icon: "📄", title: "CV Builder", desc: "Build a professional CV pre-populated with your GoalVow certificates, completed courses, and VowRewards achievements.", status: "Coming soon" },
  { icon: "🔍", title: "Skill Gap Diagnostics", desc: "Identify gaps between your current skills and target job requirements, with course recommendations to close them.", status: "Coming soon" },
  { icon: "🎤", title: "Interview Preparation", desc: "Practice common interview questions, get AI-powered feedback, and prepare for industry-specific scenarios.", status: "Coming soon" },
  { icon: "📅", title: "Study Planner", desc: "Set weekly learning goals, track your progress, and get nudges to stay on track across your enrolled courses.", status: "Coming soon" },
  { icon: "📊", title: "Career Pathway Mapper", desc: "Visualise career pathways from your current credentials to your target role, with GoalVow courses highlighted.", status: "In development" },
  { icon: "🧮", title: "Earnings Calculator", desc: "Estimate potential earnings based on your academy pathway, location, and sector — motivation powered by data.", status: "In development" },
];

export default function VowToolsPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
            Coming soon
          </span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">VowTools</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            A proposed career-readiness toolkit covering CV preparation, skills reflection, interview practice, and planning. These tools are not yet available in VowLMS.
          </p>
          <div className="mt-8">
            <a href="mailto:support@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]">
              Get early access →
            </a>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowTools dashboard for career readiness, certificates, and learner progress"
            aspect="video"
          />
        </div>
      </section>
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Tools in development</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <article key={t.title} className="gv-card rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{t.icon}</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700">{t.status}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-ink">{t.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{t.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
