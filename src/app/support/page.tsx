import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "VowSupport - GoalVow Learner Support",
  description: "Get help with VowLMS accounts, enrolment, courses, assessments, payments, and partnerships.",
};

const supportAreas = [
  { title: "Account and access", detail: "Sign-in, password reset, profile, role, and account-access questions." },
  { title: "Learning and assessment", detail: "Course access, lesson progress, assessment submission, and certificate-record questions." },
  { title: "Enrolment and payment", detail: "Free enrolment, pending paid enrolment, PayFast return, and payment-status support." },
  { title: "Academy and partnership", detail: "Catalogue corrections, organisation learning, Learning Hub interest, and ecosystem enquiries." },
];

export default function SupportPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">VowSupport</p>
            <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold sm:text-5xl">A clear route to the right support</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              Contact GoalVow for account, learning, enrolment, payment, certificate, academy, or partnership assistance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-11 items-center rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] transition hover:bg-[#e8b830]">Email support</a>
              <a href={siteConfig.contact.whatsappHref} className="inline-flex min-h-11 items-center rounded-lg border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">WhatsApp</a>
            </div>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowLMS learner dashboard concept for course progress and support access"
            aspect="video"
          />
        </div>
      </section>

      <Section tone="light" eyebrow="How we can help" title="Choose the closest support area">
        <div className="grid gap-5 sm:grid-cols-2">
          {supportAreas.map((area) => (
            <article key={area.title} className="premium-card rounded-lg p-6">
              <h2 className="text-lg font-semibold text-ink">{area.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{area.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Contact GoalVow" title="Verified support channels">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a href={siteConfig.contact.phoneHref} className="premium-card block rounded-lg p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">Phone</p>
            <p className="mt-2 text-sm font-semibold text-ink">{siteConfig.contact.phoneDisplay}</p>
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="premium-card block rounded-lg p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">Email</p>
            <p className="mt-2 break-all text-sm font-semibold text-ink">{siteConfig.contact.email}</p>
          </a>
          <a href={siteConfig.contact.whatsappHref} className="premium-card block rounded-lg p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">WhatsApp</p>
            <p className="mt-2 text-sm font-semibold text-ink">{siteConfig.contact.whatsappDisplay}</p>
          </a>
          <div className="premium-card rounded-lg p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">Address</p>
            <p className="mt-2 text-sm font-semibold text-ink">{siteConfig.contact.address}</p>
          </div>
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Include the details that help us trace the issue</h2>
          <p className="mt-4 text-base leading-7 text-white/70">Share the page, course, approximate time, and what you expected. Never send your password, access token, or card details.</p>
          <ButtonLink href="/dashboard/learner" className="mt-8">Return to dashboard</ButtonLink>
        </div>
      </section>
    </main>
  );
}
