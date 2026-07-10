import Link from "next/link";

export const metadata = { title: "Platform Settings" };

const configurationGroups = [
  { title: "Application", names: ["NEXT_PUBLIC_APP_URL", "BRIDGE_BASE_URL", "BRIDGE_API_KEY", "RESOURCE_SIGNING_SECRET", "JWT_SECRET"] },
  { title: "Payments", names: ["PAYFAST_MERCHANT_ID", "PAYFAST_MERCHANT_KEY", "PAYFAST_PASSPHRASE", "PAYFAST_SANDBOX"] },
  { title: "Messaging", names: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"] },
  { title: "Ecosystem", names: ["VOWREWARDS_API_URL", "PLUGCONNECT_API_URL", "VOWSUPPORT_API_URL", "SKILLSSHOP_API_URL", "VOWTOOLS_API_URL", "CHEFORDER_API_URL"] },
];

export default function AdminSettingsPage() {
  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Platform configuration</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Production settings are managed through Vercel and Afrihost environment configuration. Values are never displayed or edited in the browser.</p>
          </div>
          <Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink">Back to dashboard</Link>
        </div>

        <div className="mt-7 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
          Rotate the credentials identified in the security audit before production deployment. Apply SQL migration 011 before uploading the hardened PHP package.
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {configurationGroups.map((group) => (
            <section key={group.title} className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-2">
                {group.names.map((name) => (
                  <li key={name} className="rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">{name}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/api/health" className="rounded-lg bg-[#06111f] px-5 py-3 text-sm font-semibold text-white">Open health endpoint</Link>
          <Link href="/support" className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink">Deployment support</Link>
        </div>
      </div>
    </main>
  );
}
