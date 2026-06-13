import { AcademyCard } from "@/components/academies/AcademyCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { LearningFlow } from "@/components/learning/LearningFlow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCourses } from "@/lib/data";

export default function Home() {
  const academies = getAcademies();
  const courses = getCourses();

  return (
    <main>
      <section className="surface-grid relative isolate min-h-[72svh] overflow-hidden py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_24%,rgba(32,199,255,0.28),transparent_30rem),radial-gradient(circle_at_20%_72%,rgba(245,197,66,0.22),transparent_24rem)]" />
        <div className="absolute right-[-6rem] top-8 -z-10 h-80 w-80 rounded-full border border-electric/30" />
        <div className="absolute bottom-12 right-[10%] -z-10 h-44 w-72 rotate-[-10deg] rounded-lg border border-white/10 bg-white/10 shadow-[0_30px_120px_rgba(32,199,255,0.18)]" />
        <div className="absolute right-[16%] top-28 -z-10 hidden w-72 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Learner progress</p>
          <div className="mt-4 h-2 rounded-full bg-white/20">
            <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-electric to-gold" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-white/70">
            <span className="rounded-md bg-white/10 p-2">Assess</span>
            <span className="rounded-md bg-white/10 p-2">VR</span>
            <span className="rounded-md bg-white/10 p-2">Reward</span>
          </div>
        </div>
        <div className="absolute bottom-24 left-[56%] -z-10 hidden w-56 rounded-lg border border-gold/30 bg-[#f5c542]/15 p-4 backdrop-blur lg:block">
          <p className="text-3xl font-semibold">6</p>
          <p className="mt-1 text-sm text-white/70">GoalVow academy pathways</p>
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-5 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Academy Ecosystem</p>
          <h1 className="text-balance text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">
            VowLMS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74">
            A premium learning platform for skills, schools, business, VR practice, rewards, mobile access, support, and opportunity pathways.
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/66">
            Empower greatness and independence to global learners through practical evidence, certificates, and real-world growth routes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/courses">Start learning</ButtonLink>
            <ButtonLink href="/dashboard/learner" variant="secondary">Open dashboard</ButtonLink>
          </div>
          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {["PWA-ready mobile access", "Certificate and rewards flow", "PayFast and ecosystem APIs"].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white/78 backdrop-blur">
                {item}
              </div>
            ))}
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
            <article key={title} className="rounded-lg border border-white/10 bg-white/10 p-5">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/68">{description}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-white py-16 text-ink md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Investor-ready trust</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Focused LMS now, scalable ecosystem later.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Role-based dashboards for learners, facilitators, employers, and admins.",
              "Analytics events for progress, assessment attempts, VR attempts, certificates, and engagement.",
              "Prisma schema ready for PostgreSQL without forcing a database for this local mock.",
              "PWA manifest, service worker, and offline page ready for mobile-first rollout.",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
