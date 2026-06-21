import { Section } from "@/components/ui/Section";

export const metadata = { title: "Privacy Policy — VowLMS" };

export default function PrivacyPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-3 text-white/60 text-sm">Last updated: 21 June 2026 · GoalVow Holdings (Pty) Ltd</p>
        </div>
      </section>
      <Section tone="light">
        <div className="prose prose-slate max-w-3xl mx-auto text-sm leading-7">
          <h2>1. Who we are</h2>
          <p>GoalVow Holdings (Pty) Ltd operates VowLMS at vowlms.co.za. We are registered in South Africa. For privacy inquiries contact: <a href="mailto:privacy@goalvow.com" className="text-[#1166c8]">privacy@goalvow.com</a>.</p>

          <h2>2. Information we collect</h2>
          <ul>
            <li><strong>Account information:</strong> Name, email address, phone number, and role selected during registration.</li>
            <li><strong>Learning data:</strong> Course enrolments, lesson progress, assessment scores, VR practice attempts, and certificates issued.</li>
            <li><strong>Payment data:</strong> Payment transactions are processed by PayFast. VowLMS does not store full card details.</li>
            <li><strong>Usage data:</strong> Pages visited, time on platform, device type, and browser — collected via analytics events.</li>
          </ul>

          <h2>3. How we use your information</h2>
          <ul>
            <li>To deliver and improve the VowLMS learning experience.</li>
            <li>To issue certificates and VowRewards tied to your learning achievements.</li>
            <li>To match your profile to PlugConnect opportunities with your consent.</li>
            <li>To communicate course updates, announcements, and platform notices.</li>
          </ul>

          <h2>4. Data sharing</h2>
          <p>We do not sell your personal data. We may share data with GoalVow ecosystem services (VowRewards, PlugConnect, VowSupport) for the purpose of delivering integrated services, with your consent. Facilitators assigned to your cohort may view your progress and assessment results.</p>

          <h2>5. Data retention</h2>
          <p>We retain your account and learning data for as long as your account is active. Certificates and rewards records are retained for 7 years to support verification requests. You may request deletion of your account at any time.</p>

          <h2>6. Your rights (POPIA)</h2>
          <p>Under South Africa's Protection of Personal Information Act (POPIA) you have the right to access, correct, or delete your personal information. Contact <a href="mailto:privacy@goalvow.com" className="text-[#1166c8]">privacy@goalvow.com</a> to exercise these rights.</p>

          <h2>7. Cookies</h2>
          <p>VowLMS uses session cookies to keep you signed in and preference cookies to remember your settings. We do not use third-party advertising cookies.</p>

          <h2>8. Security</h2>
          <p>Passwords are hashed using bcrypt. All data in transit is encrypted via TLS. We follow industry-standard security practices to protect your data.</p>

          <h2>9. Changes to this policy</h2>
          <p>We will notify registered learners of material changes to this policy via email and in-app announcement.</p>

          <h2>10. Contact</h2>
          <p>GoalVow Holdings (Pty) Ltd · 17 Vultee, Cape Town · <a href="mailto:privacy@goalvow.com" className="text-[#1166c8]">privacy@goalvow.com</a> · +27 63 270 6787</p>
        </div>
      </Section>
    </main>
  );
}
