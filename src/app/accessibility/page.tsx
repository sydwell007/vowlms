import { Section } from "@/components/ui/Section";

export const metadata = { title: "Accessibility — VowLMS" };

export default function AccessibilityPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Accessibility</p>
          <h1 className="mt-4 text-4xl font-semibold">Accessibility Statement</h1>
          <p className="mt-3 text-white/60 text-sm">Last updated: 21 June 2026 · GoalVow Holdings (Pty) Ltd</p>
        </div>
      </section>
      <Section tone="light">
        <div className="prose prose-slate max-w-3xl mx-auto text-sm leading-7">
          <h2>Our commitment</h2>
          <p>GoalVow Holdings is committed to making VowLMS accessible to learners of all abilities. We work toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.</p>

          <h2>Accessible features</h2>
          <ul>
            <li>Semantic HTML structure with proper heading hierarchy</li>
            <li>Keyboard navigable interface throughout the platform</li>
            <li>High colour contrast ratios for text and interactive elements</li>
            <li>Screen reader compatible navigation and form labels</li>
            <li>ARIA labels on interactive controls</li>
            <li>Mobile-responsive design accessible on all device sizes</li>
            <li>Offline PWA access for learners with intermittent connectivity</li>
          </ul>

          <h2>Known limitations</h2>
          <ul>
            <li>VR practice sessions currently require a compatible device and may not be accessible to all users. Text-based alternatives are provided for all VR content.</li>
            <li>Some third-party embedded content may not meet full accessibility standards.</li>
          </ul>

          <h2>Feedback and support</h2>
          <p>If you experience any accessibility barriers on VowLMS, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:support@goalvow.com" className="text-[#1166c8]">support@goalvow.com</a></li>
            <li>Phone: +27 63 270 6787</li>
            <li>WhatsApp: +27 83 948 8894</li>
          </ul>
          <p>We aim to respond to accessibility feedback within 2 business days.</p>

          <h2>Enforcement</h2>
          <p>This statement is reviewed annually. If you are not satisfied with our response, you may contact the South African Human Rights Commission at <a href="https://www.sahrc.org.za" className="text-[#1166c8]" target="_blank" rel="noopener noreferrer">sahrc.org.za</a>.</p>
        </div>
      </Section>
    </main>
  );
}
