import { AcademyCard } from "@/components/academies/AcademyCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { LearningFlow } from "@/components/learning/LearningFlow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCourses } from "@/lib/data";

export default function Home() {
  const academies = getAcademies();
  const courses = getCourses();
  const featuredCourses = courses.slice(0, 8);

  const platformHighlights = [
    ["PWA-ready mobile access", "Learners access GoalVow from any device, any learning hub, fully offline-capable."],
    ["Certificate and rewards flow", "Practical evidence converts to verified certificates and VowRewards points."],
    ["PayFast-powered payments", "Secure ZAR checkout for paid courses across all GoalVow academies."],
  ];

  const investorTrust = [
    "Role-based dashboards for learners, facilitators, employers, and admins.",
    "Analytics tracking across progress, assessments, VR sessions, certificates, and engagement.",
    "Prisma + PostgreSQL data layer ready for high-volume production traffic.",
    "PWA manifest, service worker, and offline page for mobile-first rollout across learning hubs.",
  ];

  return (
    <main className="premium-page">
      {/* Hero */}
      <section className="premium-section-dark surface-grid relative isolate overflow-hidden border-b border-white/6 py-20 text-white sm:py-20 lg:py-28">
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
              A premium learning platform connecting {courses.length.toLocaleString()} courses across 6 GoalVow academies — with skills training, culinary arts, business, private school, and university online pathways.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64">
              Built to serve GoalVow Holdings with a confident learner experience, verifiable progress, and infrastructure ready for investors, partners, and large-scale community rollout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/courses">Browse courses</ButtonLink>
              <ButtonLink href="/auth/signin" variant="secondary">Sign in to your academy</ButtonLink>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {platformHighlights.map(([title, detail]) => (
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
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 shrink-0">
                  Live platform
                </div>
              </div>
              <div className="mt-6 h-2.5 rounded-full bg-white/14">
                <div className="h-2.5 w-[74%] rounded-full bg-gradient-to-r from-electric via-[#78d9ff] to-gold" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-white/72">
                <span className="rounded-lg border border-white/10 bg-white/8 p-3">Assess</span>
                <span className="rounded-lg border border-white/10 bg-white/8 p-3">VR Practice</span>
                <span className="rounded-lg border border-white/10 bg-white/8 p-3">Reward</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="premium-card-dark rounded-2xl p-5">
                <p className="text-3xl font-semibold text-gold">{courses.length.toLocaleString()}</p>
                <p className="mt-2 text-sm font-semibold text-white">Active courses</p>
                <p className="mt-2 text-sm leading-6 text-white/62">Across upskilling, trades, culinary, school, business, and university online pathways.</p>
              </div>
              <div className="premium-card-dark rounded-2xl p-5">
                <p className="text-3xl font-semibold text-electric">{academies.length}</p>
                <p className="mt-2 text-sm font-semibold text-white">GoalVow academies</p>
                <p className="mt-2 text-sm leading-6 text-white/62">One platform shell with role-based access, rewards, and opportunity routing per academy.</p>
              </div>
            </div>

            <div className="premium-card-dark rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Investor-ready infrastructure</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Verified certificates", "VowRewards integration", "PlugConnect opportunities", "VR practice sessions"].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-white/74">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-white py-6">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { value: courses.length.toLocaleString(), label: "Courses available" },
            { value: "6", label: "Academy pathways" },
            { value: "9+", label: "Ecosystem integrations" },
            { value: "100%", label: "Mobile + PWA ready" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-semibold text-[#1166c8]">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academy catalogue */}
      <Section
        tone="light"
        eyebrow="Academy catalogue"
        title="One LMS for the entire GoalVow learning ecosystem"
        description="Upskilling, skills training, Chef Academy, private school, business school, and university online pathways share a unified learner journey — from enrolment to certificate to opportunity."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => (
            <AcademyCard key={academy.slug} academy={academy} />
          ))}
        </div>
      </Section>

      {/* Core learning flow */}
      <Section
        eyebrow="How it works"
        title="From academy entry to opportunity matching"
        description="Every learner follows the same structured pathway: enrol, learn, assess, practise with VR, earn a certificate, collect rewards, and connect to employment or entrepreneurship opportunities."
      >
        <LearningFlow />
      </Section>

      {/* Featured courses */}
      <Section
        tone="light"
        eyebrow="Featured courses"
        title="Start learning today"
        description="Browse courses across all GoalVow academies. From professional culinary skills to business fundamentals and university degrees — all with assessments, certificates, and VowRewards."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.slice(0, 4).map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/courses" variant="ink">
            Browse all {courses.length.toLocaleString()} courses →
          </ButtonLink>
        </div>
      </Section>

      {/* Ecosystem */}
      <Section
        eyebrow="Ecosystem"
        title="VR, rewards, support, shops, tools, hubs, and mobile access"
        description="VowLMS connects directly to VowRewards, PlugConnect, VowSupport, SkillsShop, VowTools, Learning Hubs, ChefOrder, Mux video, and Cloudflare R2."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["VR simulations", "WebXR-ready practice pages with React Three Fiber for immersive learner training and assessment."],
            ["VowRewards", "Reward events fire on lesson completion, assessment passes, VR attempts, and course completion."],
            ["PlugConnect", "Verified learner achievements route directly to employer pipelines and freelance opportunities."],
            ["Learning hubs", "Mobile-first access from community learning hubs with offline content and future sync."],
          ].map(([title, description]) => (
            <article key={title} className="premium-card rounded-xl p-5 text-ink">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Investor trust */}
      <section className="premium-section-light py-16 text-ink md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Built for scale</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Focused LMS now. Scalable ecosystem platform next.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">Architected for GoalVow Holdings to onboard partners, facilitate government-funded cohorts, and demonstrate measurable learning impact.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {investorTrust.map((item) => (
              <div key={item} className="premium-card-soft rounded-xl p-5 text-sm leading-6 text-muted">
                <span className="mr-2 text-[#1166c8] font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-section-dark py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Ready to start?</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
            Join GoalVow's growing learner community
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-base text-white/70">
            Enrol in a course today and take the first step toward a certificate, a reward, and an opportunity.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/auth/signup">Create free account</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">Browse courses</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
