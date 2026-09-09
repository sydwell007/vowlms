import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BrainCircuit, Coins, Compass } from "lucide-react";
import { AIAndRewardsSection } from "@/components/home/AIAndRewardsSection";
import { EcosystemShowcaseSection } from "@/components/home/EcosystemShowcaseSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedCourseGrid } from "@/components/home/FeaturedCourseGrid";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ButtonLink } from "@/components/ui/ButtonLink";
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

const experiencePath = [
  {
    Icon: Compass,
    title: "Find your direction",
    description: "Match your goal to a practical starting point.",
    href: "/find-my-path",
  },
  {
    Icon: BrainCircuit,
    title: "Learn with guidance",
    description: "Build skill with structured courses and AI support.",
    href: "/courses",
  },
  {
    Icon: BadgeCheck,
    title: "Prove your progress",
    description: "Complete assessments and own your certificates.",
    href: "/certificates",
  },
  {
    Icon: Coins,
    title: "Turn effort into value",
    description: "Earn VOWR and connect learning to opportunity.",
    href: "/rewards",
  },
];

export default async function Home() {
  const role = await getServerRole();
  const courses = getCourseSummaries(role);
  const connectedAcademies = getConnectedAcademyCount();
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

      <section className="relative isolate overflow-hidden bg-[#061725] text-white">
        <Image
          src={visualAssets.ecosystemHero}
          alt="VowLMS learners using laptops, tablets, and VR practice in a modern GoalVow learning ecosystem"
          fill
          priority
          sizes="100vw"
          className="home-hero-media absolute inset-0 -z-20 object-cover object-[76%_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,23,37,0.97)_0%,rgba(6,23,37,0.85)_42%,rgba(6,23,37,0.26)_82%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,23,37,0.12)_0%,rgba(6,23,37,0.88)_100%)]" />

        <div className="home-hero-copy mx-auto flex min-h-[570px] w-full max-w-7xl flex-col justify-center px-5 py-14 sm:min-h-[610px] sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
            GoalVow academy ecosystem
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-6xl font-semibold leading-none sm:text-7xl">
            VowLMS
          </h1>
          <p className="mt-5 max-w-3xl text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Learn skills. Prove progress. Move into opportunity.
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            One connected learning experience for choosing a direction, building practical skills, earning recognised proof, and moving forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/auth/signup" variant="primary">
              Start learning
            </ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Browse courses
            </ButtonLink>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-white/16 pl-4">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/54">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl divide-y divide-slate-200 px-5 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8">
          {experiencePath.map(({ Icon, title, description, href }) => (
            <Link key={title} href={href} className="group flex min-h-32 items-start gap-4 px-1 py-7 md:px-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#e8f4f4] text-[#176f78]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {title}
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-[#1765a6]" />
                </span>
                <span className="mt-1 block text-sm leading-5 text-muted">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Section
        tone="light"
        eyebrow="Find your path"
        title="Start with where you want to go"
        description="Choose the outcome that matters now. VowLMS will surface the most relevant courses and a practical next step."
      >
        <OnboardingFlow />
      </Section>

      <section className="border-y border-slate-200 bg-white py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1765a6]">Featured courses</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Practical learning, selected for momentum
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Explore {courses.length.toLocaleString()} courses with structured lessons, assessments, certificates, and VowRewards.
              </p>
            </div>
            <ButtonLink href="/courses" variant="outline" className="self-start md:self-auto">
              View catalogue
            </ButtonLink>
          </div>
          <FeaturedCourseGrid courses={courses} role={role} />
        </div>
      </section>

      <Section
        eyebrow="AI-guided learning + real rewards"
        title="Learn with a 24/7 AI tutor. Earn VOWR from day one."
        description="Every VowLMS course connects guidance, progress, and rewards in one continuous learning experience."
      >
        <AIAndRewardsSection />
      </Section>

      <Section
        tone="light"
        eyebrow="GoalVow ecosystem"
        title="One account. A whole ecosystem."
        description="Learning, certificates, rewards, support, and opportunity routes stay connected to one learner account."
      >
        <EcosystemShowcaseSection role={role} />
      </Section>

      <section className="border-t border-slate-200 bg-white py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1765a6]">FAQ</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Clear answers before you start
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Understand cost, certificates, rewards, support, and how learning works across VowLMS.
            </p>
          </div>
          <FAQSection />
        </div>
      </section>

      <section className="page-hero border-t border-white/8 py-14 text-white md:py-20">
        <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7de0e2]">Your next step</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">
            Your next move starts with one clear goal
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/68">
            Find the right course, learn with intelligent support, and keep every milestone connected to what comes next.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/auth/signup" variant="primary">
              Create free account
            </ButtonLink>
            <ButtonLink href="/find-my-path" variant="secondary">
              Find my path
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
