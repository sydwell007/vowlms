import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChartNoAxesCombined, Network, ShieldCheck, Smartphone } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { FAQSection } from "@/components/home/FAQSection";
import { PresentersSection } from "@/components/home/PresentersSection";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCourseSummaries } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { visualAssets } from "@/lib/visual-assets";
import { getConnectedAcademyCount, getPlannedAcademyCount } from "@/lib/academy-launch";
import { getServerRole } from "@/lib/auth/getServerRole";

export const metadata: Metadata = {
  title: { absolute: "VowLMS | GoalVow Learning Platform" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "VowLMS | GoalVow Learning Platform",
    description: siteConfig.description,
    url: "/",
    images: [{ url: visualAssets.ecosystemHero, alt: "VowLMS learning platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VowLMS | GoalVow Learning Platform",
    description: siteConfig.description,
    images: [visualAssets.ecosystemHero],
  },
};

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
  { Icon: ChartNoAxesCombined, title: "Visible progress", description: "Role-based dashboards for learning, facilitation, employers, and administration." },
  { Icon: ShieldCheck, title: "Account-owned records", description: "Enrolments, assessments, certificates, and secure PayFast checkout." },
  { Icon: Smartphone, title: "Mobile ready", description: "A PWA foundation with an offline-safe public fallback." },
  { Icon: Network, title: "Ecosystem clarity", description: "Live capabilities and planned GoalVow services are clearly separated." },
];

export default async function Home() {
  const role = await getServerRole();
  const courses = getCourseSummaries(role);
  const connectedAcademies = getConnectedAcademyCount();
  const featuredCourses = courses.slice(0, 6);
  const stats = [
    { value: connectedAcademies.toLocaleString(), label: "Connected academies" },
    { value: courses.length.toLocaleString(), label: "Courses" },
    { value: getPlannedAcademyCount().toLocaleString(), label: "Planned academies" },
    { value: "PWA", label: "Mobile ready" },
  ];
  const organisationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}${visualAssets.logo}`,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: "17 Vultee",
      addressLocality: "Cape Town",
      addressCountry: "ZA",
    },
  };

  return (
    <main>
      <JsonLd data={organisationSchema} />
      <section className="relative isolate overflow-hidden bg-[#06111f] py-12 text-white sm:py-14 md:py-16">
        <Image
          src={visualAssets.ecosystemHero}
          alt="VowLMS learners using laptops, tablets, and VR practice in a modern GoalVow learning ecosystem"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-[78%_28%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,17,31,0.94)_0%,rgba(6,17,31,0.8)_42%,rgba(6,17,31,0.32)_80%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,17,31,0.2)_0%,rgba(6,17,31,0.88)_100%)]" />

        <div className="mx-auto flex min-h-[380px] w-full max-w-7xl flex-col justify-center px-5 sm:min-h-[420px] sm:px-6 md:min-h-[460px] lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            GoalVow academy ecosystem
          </p>
          <h1 className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
            What do you want to achieve?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Tell VowLMS your goal and we will match you to the right courses. You do not need to know which academy to choose.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/auth/signup" variant="primary">
              Start Learning
            </ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Browse all courses
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

      <Section tone="light" eyebrow="Find your path" description="Pick what you're working toward and we'll show you exactly which courses to start with.">
        <OnboardingFlow />
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.slug} course={course} priority={index === 0} role={role} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/courses" variant="outline">
            Browse all courses
          </ButtonLink>
        </div>
      </Section>

      <Section
        eyebrow="AI-guided learning"
        title="Meet your AI course presenters"
        description="A GoalVow-built, on-demand interactive presenter available inside select lessons."
      >
        <PresentersSection />
      </Section>

      <section className="border-y border-slate-100 bg-white py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1166c8]">Platform foundation</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-4xl">
              A focused LMS now, a scalable ecosystem platform next
            </h2>
            <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {trustSignals.map(({ Icon, title, description }) => (
                <div key={title} className="border-t border-slate-200 pt-4">
                  <Icon aria-hidden="true" className="h-5 w-5 text-[#1166c8]" />
                  <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
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

      <Section tone="light" eyebrow="FAQ" title="Questions learners ask before they start" description="Straight answers about cost, certificates, rewards, and how VowLMS actually works.">
        <FAQSection />
      </Section>

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
