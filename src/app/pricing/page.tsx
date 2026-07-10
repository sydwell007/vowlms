import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getCourses } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Course Pricing and Funding - VowLMS",
  description: "Understand how VowLMS displays free, paid, and organisation learning options.",
};

export default function PricingPage() {
  const courses = getCourses();
  const freeCourses = courses.filter((course) => course.price === 0).length;
  const paidCourses = courses.filter((course) => course.price > 0).length;
  const organisationSubject = encodeURIComponent("GoalVow organisation learning enquiry");

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Course pricing and funding</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">See the price before you enrol</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            VowLMS uses course-level pricing. The amount shown on a course page is the source of truth for that enrolment.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Current catalogue" title="Learning options on VowLMS">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="premium-card rounded-lg p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Free courses</p>
            <p className="mt-4 text-4xl font-bold text-ink">{freeCourses.toLocaleString()}</p>
            <p className="mt-3 text-sm leading-6 text-muted">Catalogue courses currently marked free can be enrolled in without a payment step.</p>
            <ButtonLink href="/courses" variant="outline" className="mt-6">Browse courses</ButtonLink>
          </article>

          <article className="rounded-lg bg-[#06111f] p-7 text-white shadow-[0_28px_70px_rgba(6,17,31,0.2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Paid courses</p>
            <p className="mt-4 text-4xl font-bold text-gold">{paidCourses.toLocaleString()}</p>
            <p className="mt-3 text-sm leading-6 text-white/70">Each paid course displays its own ZAR price. Access activates only after verified server-to-server payment confirmation.</p>
            <ButtonLink href="/courses" className="mt-6">Compare course prices</ButtonLink>
          </article>

          <article className="premium-card rounded-lg p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Organisations</p>
            <p className="mt-4 text-3xl font-bold text-ink">Scoped quote</p>
            <p className="mt-3 text-sm leading-6 text-muted">Cohort pricing requires confirmed learner numbers, course scope, support, reporting, and delivery requirements.</p>
            <a href={`mailto:${siteConfig.contact.email}?subject=${organisationSubject}`} className="mt-6 inline-flex rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-[#1166c8]/35">
              Request a discussion
            </a>
          </article>
        </div>
      </Section>

      <section className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-xl font-semibold text-ink">Paid enrolment integrity</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">VowLMS creates a pending payment and uses the configured PayFast flow. A browser return alone never activates paid course access.</p>
          </div>
          <ButtonLink href="/support" variant="outline" className="shrink-0">Payment support</ButtonLink>
        </div>
      </section>

      <Section tone="light" eyebrow="Before you enrol" title="Common questions">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Where is the current price?", "Use the amount displayed on the individual course page. Catalogue data may change as academy records are updated."],
            ["When does paid access begin?", "Only after VowLMS receives and verifies the payment provider's server notification."],
            ["Are certificates included?", "Certificate eligibility depends on the course configuration and completion requirements shown for that course."],
            ["What are the refund terms?", "Paid enrolment refund and cancellation rules require final business and legal approval before production sales are enabled. Contact VowSupport for the current position."],
          ].map(([question, answer]) => (
            <article key={question} className="premium-card rounded-lg p-6">
              <h3 className="font-semibold text-ink">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{answer}</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
