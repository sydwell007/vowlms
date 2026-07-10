import { Section } from "@/components/ui/Section";

export const metadata = { title: "Terms of Use — VowLMS" };

export default function TermsPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold">Terms of Use</h1>
          <p className="mt-3 text-white/60 text-sm">Last updated: 21 June 2026 · GoalVow Holdings (Pty) Ltd</p>
        </div>
      </section>
      <Section tone="light">
        <div className="prose prose-slate max-w-3xl mx-auto text-sm leading-7">
          <h2>1. Acceptance of terms</h2>
          <p>By creating an account on VowLMS (vowlms.co.za) you agree to these Terms of Use. If you do not agree, do not use the platform.</p>

          <h2>2. Account responsibilities</h2>
          <ul>
            <li>You must provide accurate information during registration.</li>
            <li>You are responsible for maintaining the security of your password.</li>
            <li>You may not share your account credentials with others.</li>
            <li>You must be 13 years or older to create an account. Users under 18 require parental consent.</li>
          </ul>

          <h2>3. Course access and payments</h2>
          <ul>
            <li>Free courses are accessible without payment. Paid courses require successful PayFast checkout.</li>
            <li>Refunds are available within 7 days of purchase if you have not yet downloaded your certificate.</li>
            <li>Course access is personal and non-transferable.</li>
          </ul>

          <h2>4. Certificates and VowRewards</h2>
          <ul>
            <li>Certificates are issued only upon genuine completion of all course requirements.</li>
            <li>Certificate records may include a unique identifier. No public employer-verification service should be assumed unless GoalVow publishes one.</li>
            <li>VowRewards records do not currently represent cash, stored value, or a payment instrument. Redemption requires separately approved programme terms.</li>
          </ul>

          <h2>5. Acceptable use</h2>
          <p>You may not use VowLMS to: upload harmful or illegal content; attempt to access other users' accounts; circumvent assessment requirements; misrepresent your identity or qualifications; or violate any applicable law.</p>

          <h2>6. Intellectual property</h2>
          <p>All course content, assessments, certificates, and platform design are owned by GoalVow Holdings (Pty) Ltd or its content partners. You may not reproduce, distribute, or resell any content without written permission.</p>

          <h2>7. Termination</h2>
          <p>GoalVow may suspend or terminate accounts that violate these Terms. You may delete your account at any time by contacting support@goalvow.com.</p>

          <h2>8. Limitation of liability</h2>
          <p>VowLMS is provided "as is." GoalVow Holdings is not liable for indirect, incidental, or consequential damages arising from your use of the platform.</p>

          <h2>9. Governing law</h2>
          <p>These terms are governed by the laws of the Republic of South Africa. Disputes shall be resolved in the Western Cape High Court.</p>

          <h2>10. Contact</h2>
          <p>GoalVow Holdings (Pty) Ltd · support@goalvow.com · +27 63 270 6787</p>
        </div>
      </Section>
    </main>
  );
}
