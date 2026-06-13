import { AcademyCard } from "@/components/academies/AcademyCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { LearningFlow } from "@/components/learning/LearningFlow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCourses } from "@/lib/data";

export default function Home() {
  const academies = getAcademies();
  const courses = getCourses();
  const ecosystemHighlights = [
    ["PWA-ready mobile access", "Learners can move between hubs, phones, and web."],
    ["Certificate and rewards flow", "Practical evidence becomes achievement and momentum."],
    ["PayFast and ecosystem APIs", "Structured for growth across GoalVow subsidiaries."],
  ];
  const investorTrust = [
    "Role-based dashboards for learners, facilitators, employers, and admins.",
    "Analytics events for progress, assessment attempts, VR attempts, certificates, and engagement.",
    "Prisma schema ready for PostgreSQL without forcing a database for this local mock.",
    "PWA manifest, service worker, and offline page ready for mobile-first rollout.",
  ];

  return (
    <main className="premium-page">
      <section className="premium-section-dark surface-grid relative isolate overflow-hidden border-b border-white/6 py-20 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_24%,rgba(32,199,255,0.18),transparent_26rem),radial-gradient(circle_at_18%_78%,rgba(245,197,66,0.12),transparent_20rem)]" />
        <div className="absolute right-[-4rem] top-10 -z-10 h-80 w-80 rounded-full border border-electric/20" />
        <div className="absolute left-[58%] top-[14%] -z-10 hidden h-48 w-48 rounded-full bg-electric/8 blur-3xl lg:block" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Academy Ecosystem</p>
            <h1 className="text-balance text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">
              VowLMS
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              A premium learning platform for skills, schools, business, VR practice, rewards, mobile access, support, and opportunity pathways.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64">
              Built to serve GoalVow Holdings with a confident academy experience, clearer progress signals, and infrastructure that feels credible to partners, learners, and investors.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/courses">Start learning</ButtonLink>
              <ButtonLink href="/dashboard/learner" variant="secondary">Open dashboard</ButtonLink>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {ecosystemHighlights.map(([title, detail]) => (
                <div key={title} className="premium-card-dark rounded-xl px-4 py-4">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/62">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:pl-6">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Learner progress</p>
                  <h2 className="mt-3 text-2xl font-semibold">One journey across learning, practice, proof, and opportunity.</h2>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Live system view
                </div>
              </div>
              <div className="mt-6 h-2.5 rounded-full bg-white/14">
                <div className="h-2.5 w-[74%] rounded-full bg-gradient-to-r from-electric via-[#78d9ff] to-gold" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-white/72">
                <span className="rounded-lg border border-white/10 bg-white/8 p-3">Assess</span>
                <span className="rounded-lg border border-white/10 bg-white/8 p-3">VR</span>
                <span className="rounded-lg border border-white/10 bg-white/8 p-3">Reward</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="premium-card-dark rounded-2xl p-5">
                <p className="text-3xl font-semibold text-gold">6</p>
                <p className="mt-2 text-sm font-semibold text-white">GoalVow academies</p>
                <p className="mt-2 text-sm leading-6 text-white/62">One platform shell tailored for training, school, chef, business, and university pathways.</p>
              </div>
              <div className="premium-card-dark rounded-2xl p-5">
                <p className="text-3xl font-semibold text-electric">4</p>
                <p className="mt-2 text-sm font-semibold text-white">Ecosystem services</p>
                <p className="mt-2 text-sm leading-6 text-white/62">Rewards, opportunities, hubs, and future venture integrations sit close to learning outcomes.</p>
              </div>
            </div>

            <div className="premium-card-dark rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Investor-ready platform shell</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Structured academy network", "Clear user roles", "Rewards and certificates", "Opportunity routing"].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-white/74">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        tone="light"
        eyebrow="Academy catalogue"
        title="One LMS template for the GoalVow learning ecosystem"
        description="Upskilling, skills training, Chef Academy, private school, business school, and university online pathways share a common learner journey."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => (
            <AcademyCard key={academy.slug} academy={academy} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Core flow"
        title="From academy entry to opportunity matching"
        description="The platform keeps this phase focused: learning content, assessments, VR practice placeholders, results, certificates, rewards, and opportunity surfaces."
      >
        <LearningFlow />
      </Section>

      <Section
        tone="light"
        eyebrow="Featured courses"
        title="Seeded courses for each academy"
        description="Sample courses make the local build feel complete while leaving the structure ready for PostgreSQL and admin tooling."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Section>

      <Section
        tone="light"
        eyebrow="Ecosystem"
        title="VR, rewards, support, shops, tools, hubs, and mobile access"
        description="VowLMS includes placeholder integration routes for VowRewards, PlugConnect, VowSupport, SkillsShop, VowTools, Learning Hubs, ChefOrder, PayFast, Mux, and Cloudflare R2."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["VR simulations", "WebXR-ready practice pages with future React Three Fiber Canvas structure."],
            ["VowRewards", "Reward events for lessons, assessments, VR attempts, and completion."],
            ["PlugConnect", "Opportunity pathways for employers and verified learner achievements."],
            ["Learning hubs", "Mobile-first learning access with offline structure and future sync."],
          ].map(([title, description]) => (
            <article key={title} className="premium-card rounded-xl p-5 text-ink">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="premium-section-light py-16 text-ink md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Investor-ready trust</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Focused LMS now, scalable ecosystem later.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {investorTrust.map((item) => (
              <div key={item} className="premium-card-soft rounded-xl p-5 text-sm leading-6 text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
