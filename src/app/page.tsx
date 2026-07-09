import Link from "next/link";
import { AcademyCard } from "@/components/academies/AcademyCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCourses } from "@/lib/data";

// ── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "6", label: "Academy pathways" },
  { value: "614+", label: "Courses" },
  { value: "6+", label: "Support systems" },
  { value: "1", label: "Connected ecosystem" },
  { value: "PWA", label: "Mobile-first" },
  { value: "L→P→A", label: "Learn · Practice · Apply" },
];

const whyGoalVow = [
  {
    icon: "🎯",
    title: "Learn → Practice → Apply",
    desc: "The only African platform that takes a learner from structured online study all the way to verified opportunity — in one connected journey.",
  },
  {
    icon: "🏫",
    title: "Hybrid learning hubs",
    desc: "Physical community hubs reduce the digital divide and give learners in-person mentoring, printing, devices, and practical development support.",
  },
  {
    icon: "🔁",
    title: "Retention ecosystem",
    desc: "VowRewards, PlugConnect opportunities, and SkillsShop credits keep learners engaged long after course completion.",
  },
  {
    icon: "🔬",
    title: "Innovation moat",
    desc: "VR/AR skill simulations and AI learning support are being built in-house — creating a defensible technology edge unavailable elsewhere in the region.",
  },
  {
    icon: "⚡",
    title: "Rewards & opportunity engine",
    desc: "Every lesson, assessment, and VR session earns points redeemable for kits, tools, and employer introductions — turning motivation into livelihood.",
  },
  {
    icon: "📈",
    title: "Multi-academy scalability",
    desc: "Six separate academy verticals share one backend, one rewards system, and one opportunity network — scaling without proportional cost.",
  },
];

const ecosystemPillars = [
  { icon: "🎓", label: "Academies", desc: "6 vertical pathways", href: "/academies", color: "#1e3a8a" },
  { icon: "🏫", label: "Learning Hubs", desc: "Hybrid access points", href: "/learning-hubs", color: "#06b6d4" },
  { icon: "🤝", label: "VowSupport", desc: "Tutoring & mentoring", href: "/vowsupport", color: "#19c37d" },
  { icon: "⭐", label: "VowRewards", desc: "Motivation & milestones", href: "/rewards", color: "#f5c542" },
  { icon: "🔧", label: "VowTools", desc: "CV, diagnostics, prep", href: "/vowtools", color: "#f97316" },
  { icon: "🔗", label: "PlugConnect", desc: "Jobs & opportunities", href: "/opportunities", color: "#8b5cf6" },
  { icon: "🛍️", label: "SkillsShop", desc: "Kits & equipment", href: "/skillsshop", color: "#06b6d4" },
  { icon: "🍳", label: "ChefOrder", desc: "Chef business pathway", href: "/cheforder", color: "#f97316" },
];

const supportServices = [
  {
    icon: "🤝",
    title: "VowSupport",
    desc: "Tutoring, mentoring, coaching, and registration support for every learner at every stage.",
    href: "/vowsupport",
    badge: "Built-in",
    badgeColor: "gv-badge-green",
  },
  {
    icon: "⭐",
    title: "VowRewards",
    desc: "Reward milestones, learning motivation, progress tracking, and ecosystem value for every completed step.",
    href: "/rewards",
    badge: "Built-in",
    badgeColor: "gv-badge-green",
  },
  {
    icon: "🏫",
    title: "Learning Hubs",
    desc: "Hybrid spaces for access, mentoring, printing, study support, and practical community development.",
    href: "/learning-hubs",
    badge: "Connected",
    badgeColor: "gv-badge-blue",
  },
  {
    icon: "🔗",
    title: "PlugConnect",
    desc: "Jobs, internships, projects, and entrepreneurship opportunities matched to verified learner achievements.",
    href: "/opportunities",
    badge: "Connected",
    badgeColor: "gv-badge-blue",
  },
  {
    icon: "🛍️",
    title: "SkillsShop",
    desc: "Learning kits, tools, equipment, and academy-aligned product bundles for practical skill development.",
    href: "/skillsshop",
    badge: "Coming soon",
    badgeColor: "gv-badge-orange",
  },
  {
    icon: "🔧",
    title: "VowTools",
    desc: "CV builder, skill gap diagnostics, interview preparation, and productivity tools for learner success.",
    href: "/vowtools",
    badge: "Coming soon",
    badgeColor: "gv-badge-orange",
  },
  {
    icon: "🍳",
    title: "ChefOrder",
    desc: "Food ordering and chef business pathway platform connecting Chef Academy graduates to real commercial work.",
    href: "/cheforder",
    badge: "Coming soon",
    badgeColor: "gv-badge-orange",
  },
  {
    icon: "🔬",
    title: "Innovation Labs",
    desc: "VR/AR simulations, AI learning support, and R&D for future GoalVow platform capabilities.",
    href: "/innovation-labs",
    badge: "In development",
    badgeColor: "gv-badge-cyan",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const academies = getAcademies();
  const courses = getCourses();
  const featuredCourses = courses.slice(0, 4);

  return (
    <main>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="gv-hero relative isolate overflow-hidden py-24 text-white sm:py-28 lg:py-36">
        <div className="absolute inset-0 -z-10 surface-grid opacity-30" />
        {/* Floating rings */}
        <div className="absolute -right-24 top-0 -z-10 h-[520px] w-[520px] rounded-full border border-cyan-400/15 blur-sm" />
        <div className="absolute -left-16 bottom-0 -z-10 h-72 w-72 rounded-full border border-white/8" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              GoalVow Holdings · Africa&apos;s Learn-to-Earn Ecosystem
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Building a Global{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Learning-to-Earning
              </span>{" "}
              Ecosystem
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              GoalVow connects academies, support systems, rewards, tools, learning hubs, VR simulations, and opportunity pathways so every learner in Africa can build skills and apply them in the real world.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/courses" variant="primary">
                Start Learning
              </ButtonLink>
              <ButtonLink href="/academies" variant="secondary">
                Explore Academies
              </ButtonLink>
              <ButtonLink href="/investors" variant="outline">
                Investor Overview
              </ButtonLink>
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white/72 transition hover:text-white"
              >
                Join as Partner →
              </Link>
            </div>

            {/* Learn → Practice → Apply badge */}
            <div className="mt-10 flex items-center gap-3">
              {["Learn", "Practice", "Apply"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold">
                    {step}
                  </span>
                  {i < 2 && <span className="text-cyan-400/60">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Hero right panel */}
          <div className="flex flex-col gap-4">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/12 bg-white/8 p-4 text-center backdrop-blur-sm">
                  <p className="text-xl font-bold text-cyan-300">{s.value}</p>
                  <p className="mt-1 text-[11px] font-semibold text-white/60 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Ecosystem preview */}
            <div className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Ecosystem pillars
              </p>
              <div className="grid grid-cols-4 gap-2">
                {ecosystemPillars.map((p) => (
                  <Link
                    key={p.label}
                    href={p.href}
                    className="eco-node flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/6 p-2.5 text-center hover:border-white/20 hover:bg-white/12"
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-[10px] font-semibold leading-tight text-white/80">{p.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-xs text-white/52">
              Building the future of African education and livelihood infrastructure since 2024.
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="border-y border-[#1e3a8a]/12 bg-white py-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-6 px-5 sm:px-6 md:grid-cols-6 lg:px-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-[#1e3a8a]">{value}</p>
              <p className="mt-1 text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW GOALVOW WORKS ─────────────────────────────────────────────── */}
      <Section
        tone="light"
        eyebrow="How GoalVow Works"
        title="From learning to earning — one connected journey"
        description="Every GoalVow learner follows a structured pathway that turns study into skills, skills into evidence, and evidence into real-world opportunity."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Learn",
              color: "#1e3a8a",
              bg: "#eff6ff",
              icon: "📚",
              desc: "Structured online learning across 6 academies. Guided pathways, video lessons, assessments, and flexible study environments.",
              items: ["614+ structured courses", "6 academy verticals", "Video, text & assessment", "Progress tracking"],
              href: "/learn",
              cta: "Browse courses",
            },
            {
              step: "02",
              title: "Practice",
              color: "#06b6d4",
              bg: "#ecfeff",
              icon: "🔬",
              desc: "Learning hubs, VR/AR simulations, mentor exercises, practical tasks, and skill evidence that prove real-world competence.",
              items: ["Community learning hubs", "VR skill simulations", "Mentor-led exercises", "Skill evidence portfolio"],
              href: "/practice",
              cta: "Explore practice",
            },
            {
              step: "03",
              title: "Apply",
              color: "#f97316",
              bg: "#fff7ed",
              icon: "🚀",
              desc: "Certificates, portfolios, PlugConnect opportunities, entrepreneurship support, jobs, projects, and business growth pathways.",
              items: ["Verified certificates", "PlugConnect job matching", "Entrepreneurship pathways", "VowRewards ecosystem"],
              href: "/apply",
              cta: "See opportunities",
            },
          ].map((c) => (
            <article
              key={c.title}
              className="gv-card rounded-2xl p-7 text-ink"
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{ background: c.bg }}
                >
                  {c.icon}
                </span>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted">
                  Step {c.step}
                </span>
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: c.color }}
              >
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{c.desc}</p>
              <ul className="mt-5 space-y-2">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: c.color }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={c.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:gap-3"
                style={{ color: c.color }}
              >
                {c.cta} →
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* ── WHY GOALVOW WINS ──────────────────────────────────────────────── */}
      <section className="gv-section-dark py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Competitive advantage
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">
            Why GoalVow Wins
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/62">
            Six structural advantages that make GoalVow the right platform for African learners, communities, and investors.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyGoalVow.map((w) => (
              <div
                key={w.title}
                className="rounded-xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm"
              >
                <span className="text-3xl">{w.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-white">{w.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMY CATALOGUE ─────────────────────────────────────────────── */}
      <Section
        tone="light"
        eyebrow="Academy catalogue"
        title="One LMS for the entire GoalVow learning ecosystem"
        description="Upskilling, skills training, Chef Academy, private school, business school, and university online pathways — all sharing one learner journey."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => (
            <AcademyCard key={academy.slug} academy={academy} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/academies" variant="outline">
            View all academies →
          </ButtonLink>
        </div>
      </Section>

      {/* ── ECOSYSTEM DIAGRAM ─────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#06b6d4]">
              Integrated ecosystem
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-4xl">
              GoalVow Holdings — Connected Platform
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              Eight interconnected service verticals orbiting a single learner identity, rewards balance, and opportunity network.
            </p>
          </div>

          {/* Ecosystem grid */}
          <div className="relative mt-12">
            {/* Centre node */}
            <div className="mb-8 flex justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] p-6 text-center text-white shadow-[0_16px_48px_rgba(30,58,138,0.28)]">
                <p className="text-2xl font-bold">GoalVow</p>
                <p className="mt-1 text-xs font-semibold text-white/72 uppercase tracking-widest">
                  Holdings
                </p>
                <p className="mt-2 text-[11px] text-white/60">Africa&apos;s L→P→A Platform</p>
              </div>
            </div>

            {/* Surrounding nodes */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ecosystemPillars.map((p) => (
                <Link key={p.label} href={p.href}>
                  <div className="eco-node gv-card rounded-xl p-5 text-center cursor-pointer">
                    <span className="text-3xl">{p.icon}</span>
                    <p className="mt-3 text-sm font-semibold text-ink">{p.label}</p>
                    <p className="mt-1 text-xs text-muted">{p.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <ButtonLink href="/ecosystem" variant="outline">
              Explore the full ecosystem →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ──────────────────────────────────────────────── */}
      <Section
        eyebrow="Featured courses"
        title="Start learning today"
        description={`Browse ${courses.length.toLocaleString()} courses across all GoalVow academies — with assessments, certificates, and VowRewards.`}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/courses" variant="outline">
            Browse all {courses.length.toLocaleString()} courses →
          </ButtonLink>
        </div>
      </Section>

      {/* ── SUPPORT SYSTEMS ───────────────────────────────────────────────── */}
      <section className="gv-section-blue py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1e3a8a]">
              Integrated support systems
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-4xl">
              A complete learner support network
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              GoalVow wraps every learner in a support ecosystem that keeps them motivated, resourced, and connected to opportunity.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {supportServices.map((s) => (
              <Link key={s.title} href={s.href}>
                <article className="gv-card h-full rounded-xl p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(30,58,138,0.12)]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted">{s.desc}</p>
                  <p className="mt-4 text-xs font-semibold text-[#1e3a8a]">Learn more →</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTOR TRUST BAR ────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1e3a8a]">
                Investor-ready
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold text-ink">
                Built for scale. Designed for impact.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                GoalVow is a platform, not a single product. It combines education, support, rewards, tools, hubs, marketplaces, and opportunity pathways into one defensible ecosystem.
              </p>
              <div className="mt-5 flex gap-3">
                <ButtonLink href="/investors" variant="primary">
                  View investor hub
                </ButtonLink>
                <ButtonLink href="/ecosystem" variant="outline">
                  Ecosystem map
                </ButtonLink>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Production-grade Next.js + MySQL infrastructure", "✓"],
                ["PayFast ZAR checkout for course payments", "✓"],
                ["Role-based dashboards: learner, admin, facilitator, employer", "✓"],
                ["VR simulations + AI support in development", "🔬"],
                ["PWA — full mobile + offline support", "✓"],
                ["GoalVow ecosystem flywheel: rewards, hubs, opportunities", "✓"],
              ].map(([item, badge]) => (
                <div key={item as string} className="premium-card-soft rounded-xl p-4 text-sm leading-5 text-muted">
                  <span className="mr-2 font-bold text-[#1e3a8a]">{badge}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="gv-hero py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Ready to start?
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">
            Join Africa&apos;s most connected learning ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/66">
            Enrol in a course, earn rewards, practice with VR, and connect to real opportunities — all in one platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/auth/signup" variant="primary">
              Create free account
            </ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Browse {courses.length.toLocaleString()} courses
            </ButtonLink>
          </div>
        </div>
      </section>

    </main>
  );
}
