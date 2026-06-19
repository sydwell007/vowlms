"use client";

import { useState } from "react";
import Link from "next/link";

const integrations = [
  { key: "vowrewards", name: "VowRewards", icon: "⭐", status: "placeholder", env: "VOWREWARDS_API_URL, VOWREWARDS_API_KEY" },
  { key: "plugconnect", name: "PlugConnect", icon: "🎯", status: "placeholder", env: "PLUGCONNECT_API_URL, PLUGCONNECT_API_KEY" },
  { key: "vowsupport", name: "VowSupport", icon: "🛎", status: "placeholder", env: "VOWSUPPORT_API_URL, VOWSUPPORT_API_KEY" },
  { key: "skillsshop", name: "SkillsShop", icon: "🛒", status: "placeholder", env: "SKILLSSHOP_API_URL, SKILLSSHOP_API_KEY" },
  { key: "vowtools", name: "VowTools", icon: "🔧", status: "placeholder", env: "VOWTOOLS_API_URL, VOWTOOLS_API_KEY" },
  { key: "cheforder", name: "ChefOrder", icon: "🍳", status: "placeholder", env: "CHEFORDER_API_URL, CHEFORDER_API_KEY" },
  { key: "payfast", name: "PayFast", icon: "💳", status: "pending-config", env: "PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE" },
  { key: "mux", name: "Mux Video", icon: "📹", status: "pending-config", env: "MUX_TOKEN_ID, MUX_TOKEN_SECRET" },
  { key: "cloudflare-r2", name: "Cloudflare R2", icon: "☁️", status: "pending-config", env: "CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET" },
];

const statusStyle = {
  "placeholder": "bg-slate-100 text-slate-500",
  "pending-config": "bg-yellow-100 text-yellow-700",
  "active": "bg-emerald-100 text-emerald-700",
};

const statusLabel = {
  "placeholder": "Placeholder",
  "pending-config": "Needs config",
  "active": "Active",
};

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "VowLMS",
    platformUrl: "https://vowlms.co.za",
    supportEmail: "support@goalvow.com",
    defaultLanguage: "English",
    allowSelfRegistration: true,
    requireEmailVerification: false,
    enablePWA: true,
    enableVRPractice: true,
    enableDiscussions: true,
    enableAssignments: true,
    maxFileUploadMB: "50",
    sessionTimeoutMin: "60",
  });

  function update(key: keyof typeof settings, value: string | boolean) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 700));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Admin</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Platform settings</h1>
          </div>
          <Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50">
            ← Dashboard
          </Link>
        </div>

        <form onSubmit={save} className="space-y-6">
          {/* General */}
          <div className="premium-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-ink mb-5">General settings</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Platform name</label>
                <input value={settings.platformName} onChange={(e) => update("platformName", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Platform URL</label>
                <input value={settings.platformUrl} onChange={(e) => update("platformUrl", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Support email</label>
                <input type="email" value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Default language</label>
                <select value={settings.defaultLanguage} onChange={(e) => update("defaultLanguage", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none transition">
                  <option>English</option>
                  <option>Zulu</option>
                  <option>Xhosa</option>
                  <option>Afrikaans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Max file upload (MB)</label>
                <input type="number" value={settings.maxFileUploadMB} onChange={(e) => update("maxFileUploadMB", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Session timeout (minutes)</label>
                <input type="number" value={settings.sessionTimeoutMin} onChange={(e) => update("sessionTimeoutMin", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
              </div>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="premium-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-ink mb-5">Feature toggles</h2>
            <div className="space-y-3">
              {[
                { key: "allowSelfRegistration" as const, label: "Allow self-registration", desc: "Learners can sign up independently without admin invite." },
                { key: "requireEmailVerification" as const, label: "Require email verification", desc: "New accounts must verify email before accessing content." },
                { key: "enablePWA" as const, label: "Enable PWA (mobile install)", desc: "Show install prompt and enable offline caching." },
                { key: "enableVRPractice" as const, label: "Enable VR practice modules", desc: "Show VR practice pages and WebXR sessions." },
                { key: "enableDiscussions" as const, label: "Enable course discussions", desc: "Allow learners and facilitators to post in course discussions." },
                { key: "enableAssignments" as const, label: "Enable assignment submissions", desc: "Allow learners to submit files and text assignments." },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                  <div>
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    <p className="mt-0.5 text-xs text-muted">{desc}</p>
                  </div>
                  <div onClick={() => update(key, !settings[key])}
                    className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${settings[key] ? "bg-[#1166c8]" : "bg-slate-200"}`}>
                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${settings[key] ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="premium-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-ink mb-2">GoalVow ecosystem integrations</h2>
            <p className="text-xs text-muted mb-5">Configure API credentials in your <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code> file. Placeholder integrations will activate automatically when keys are present.</p>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.key} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                  <span className="text-xl shrink-0">{integration.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{integration.name}</p>
                    <p className="text-xs text-muted font-mono truncate">{integration.env}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[integration.status as keyof typeof statusStyle] ?? "bg-slate-100 text-slate-500"}`}>
                    {statusLabel[integration.status as keyof typeof statusLabel] ?? integration.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/dashboard/admin" className="text-sm text-muted hover:text-ink transition">← Back to admin</Link>
            <button type="submit"
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${saved ? "bg-emerald-500 text-white" : "bg-gold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] hover:bg-[#e8b830]"}`}>
              {saved ? "✓ Saved" : "Save settings"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
