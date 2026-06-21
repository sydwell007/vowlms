import { Section } from "@/components/ui/Section";

export const metadata = { title: "Cookie Policy — VowLMS" };

export default function CookiesPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold">Cookie Policy</h1>
          <p className="mt-3 text-white/60 text-sm">Last updated: 21 June 2026 · GoalVow Holdings (Pty) Ltd</p>
        </div>
      </section>
      <Section tone="light">
        <div className="prose prose-slate max-w-3xl mx-auto text-sm leading-7">
          <h2>What are cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>

          <h2>How VowLMS uses cookies</h2>
          <table>
            <thead>
              <tr><th>Cookie type</th><th>Purpose</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr><td>Session cookies</td><td>Keep you signed in during a visit</td><td>Until browser closed</td></tr>
              <tr><td>Preference cookies</td><td>Remember your language and notification settings</td><td>30 days</td></tr>
              <tr><td>Analytics cookies</td><td>Anonymous usage statistics to improve the platform</td><td>90 days</td></tr>
              <tr><td>Security cookies</td><td>Prevent CSRF attacks and protect your account</td><td>Session</td></tr>
            </tbody>
          </table>

          <h2>Cookies we do NOT use</h2>
          <ul>
            <li>Third-party advertising cookies</li>
            <li>Social media tracking pixels</li>
            <li>Cross-site profiling cookies</li>
          </ul>

          <h2>Managing cookies</h2>
          <p>You can disable cookies in your browser settings. Note that disabling session cookies will prevent you from staying signed in to VowLMS.</p>

          <h2>Contact</h2>
          <p>For cookie-related questions: <a href="mailto:privacy@goalvow.com" className="text-[#1166c8]">privacy@goalvow.com</a></p>
        </div>
      </Section>
    </main>
  );
}
