import Image from "next/image";
import Link from "next/link";
import { AcademyCard } from "@/components/academies/AcademyCard";
import { CourseCard } from "@/components/courses/CourseCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCourses } from "@/lib/data";
import { visualAssets } from "@/lib/visual-assets";

const journey = [
  {
    step: "01",
    title: "Learn",
    description: "Structured courses across GoalVow academies with progress tracking, assessments, and certificates.",
    href: "/learn",
  },
  {
    step: "02",
    title: "Practice",
    description: "Guided Skills Practice previews and planned facilitated pathways help learners move beyond course content.",
    href: "/practice",
  },
  {
    step: "03",
    title: "Apply",
    description: "Carry account-owned progress and certificate records into confirmed study, work, and enterprise routes.",
    href: "/apply",
  },
];

const trustSignals = [
  "Role-based dashboards for learners, facilitators, employers, and admins",
  "Account-owned enrolment, progress, assessment, and certificate records",
  "Mobile-first PWA foundation with a safe public offline fallback",
  "Planned ecosystem services labelled separately from live capabilities",
];

export default function Home() {
  const academies = getAcademies();
  const courses = getCourses();
  const connectedAcademies = academies.filter((academy) => academy.slug !== "sports-academy").length;
  const featuredCourses = courses.slice(0, 4);
  const stats = [
    { value: connectedAcademies.toLocaleString(), label: "Connected academies" },
    { value: courses.length.toLocaleString(), label: "Courses" },
    { value: "1", label: "Planned academy" },
    { value: "PWA", label: "Mobile ready" },
  ];

  return (
    <main>
      <section className="relative isolate min-h-[calc(100vh-116px)] overflow-hidden bg-[#06111f] py-20 text-white sm:py-24 lg:py-28">
        <Image
          src={visualAssets.ecosystemHero}
          alt="VowLMS learners using laptops, tablets, and VR practice in a modern GoalVow learning ecosystem"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,17,31,0.94)_0%,rgba(6,17,31,0.78)_38%,rgba(6,17,31,0.28)_78%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,17,31,0.2)_0%,rgba(6,17,31,0.88)_100%)]" />

        <div className="mx-auto flex min-h-[58vh] w-full max-w-7xl flex-col justify-center px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            GoalVow academy ecosystem
          </p>
          <h1 className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            VowLMS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            A connected learning platform for GoalVow academies, Skills Practice, support, reward records, and carefully staged progression pathways.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/auth/signup" variant="primary">
              Start Learning
            </ButtonLink>
            <ButtonLink href="/academies" variant="secondary">
              Explore Academies
            </ButtonLink>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-white/16 pl-4">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/54">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section
        tone="light"
        eyebrow="Academy network"
        title="One LMS for the GoalVow learning ecosystem"
        description="Skills, culinary, school, sport, business, and online learning pathways share a connected learner journey."
      >
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ImagePanel
            src={visualAssets.academyNetwork}
            alt="GoalVow academy network across school, skills, culinary, business, and online learning pathways"
            tone="light"
            aspect="video"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {academies.slice(0, 4).map((academy) => (
              <AcademyCard key={academy.slug} academy={academy} />
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/academies" variant="outline">
            View all academies
          </ButtonLink>
          <ButtonLink href="/catalogue" variant="ink">
            Open catalogue
          </ButtonLink>
        </div>
      </Section>

      <section className="gv-section-dark py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Learner journey</p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">
            Learn, practice, and apply without leaving the ecosystem
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {journey.map((item) => (
              <Link key={item.title} href={item.href} className="premium-card-dark rounded-lg p-6 transition hover:-translate-y-1">
                <p className="text-sm font-semibold text-gold">{item.step}</p>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/66">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section
        tone="light"
        eyebrow="Featured courses"
        title="Start with focused, outcome-led courses"
        description={`Browse ${courses.length.toLocaleString()} courses with assessments, certificates, and VowRewards built in.`}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/courses" variant="outline">
            Browse all courses
          </ButtonLink>
        </div>
      </Section>

      <section className="border-y border-slate-100 bg-white py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1166c8]">Platform foundation</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-4xl">
              A focused LMS now, a scalable ecosystem platform next
            </h2>
            <div className="mt-6 grid gap-3">
              {trustSignals.map((signal) => (
                <div key={signal} className="premium-card-soft rounded-xl px-4 py-3 text-sm leading-6 text-muted">
                  {signal}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard/learner" variant="ink">
                View dashboard
              </ButtonLink>
              <ButtonLink href="/ecosystem" variant="outline">
                Ecosystem map
              </ButtonLink>
            </div>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowLMS dashboard experience showing progress, certificates, rewards, and opportunities"
            tone="light"
            aspect="video"
          />
        </div>
      </section>

      <section className="gv-hero py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Your next step</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">
            Build skill, earn rewards, and move into opportunity
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/68">
            VowLMS gives learners one place to study, practise, prove progress, and connect to the wider GoalVow ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/auth/signup" variant="primary">
              Create free account
            </ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Browse courses
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
