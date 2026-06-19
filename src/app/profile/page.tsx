"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = ["Profile", "Security", "Notifications", "Preferences"] as const;
type Tab = typeof tabs[number];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Amina Mokoena",
    email: "amina@goalvow.com",
    phone: "+27 82 123 4567",
    city: "Johannesburg",
    country: "South Africa",
    bio: "Passionate learner on the GoalVow upskilling pathway. Currently enrolled in the Career Readiness Accelerator and Small Business Launchpad.",
    academy: "Upskilling Academy",
    emailNotifications: true,
    smsNotifications: false,
    language: "English",
    timezone: "Africa/Johannesburg",
  });

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const stats = [
    { label: "Courses enrolled", value: "2" },
    { label: "Lessons completed", value: "8" },
    { label: "Rewards earned", value: "370 pts" },
    { label: "Certificates", value: "2" },
  ];

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="premium-section-dark rounded-2xl p-8 text-white mb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gold text-3xl font-black text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)]">
              AM
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Learner profile</p>
              <h1 className="mt-1 text-2xl font-semibold">{form.name}</h1>
              <p className="mt-1 text-sm text-white/70">{form.email} · {form.city}, {form.country}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="premium-card-dark rounded-xl p-3 text-center">
                  <p className="text-xl font-semibold text-gold">{s.value}</p>
                  <p className="mt-1 text-[10px] font-medium text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-max rounded-lg px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${activeTab === tab ? "bg-[#06111f] text-white" : "text-muted hover:text-ink"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={save}>
          {activeTab === "Profile" && (
            <div className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Personal information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Full name</label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Phone</label>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Primary academy</label>
                  <select value={form.academy} onChange={(e) => update("academy", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                    {["Upskilling Academy", "Skills Training Academy", "Chef Academy", "Private School", "Business School", "University Online"].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">City</label>
                  <input value={form.city} onChange={(e) => update("city", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Country</label>
                  <input value={form.country} onChange={(e) => update("country", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Bio</label>
                <textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition resize-none" />
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Security settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Current password</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">New password</label>
                  <input type="password" placeholder="Min. 8 characters"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Confirm new password</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
              </div>
              <div className="premium-card-soft rounded-xl p-4">
                <p className="text-sm font-semibold text-ink">Two-factor authentication</p>
                <p className="mt-1 text-xs text-muted">Add an extra layer of security to your GoalVow account.</p>
                <button type="button" className="mt-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-slate-50 transition">
                  Enable 2FA →
                </button>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Notification preferences</h2>
              <div className="space-y-4">
                {[
                  { key: "emailNotifications" as const, label: "Email notifications", desc: "Receive lesson reminders, assessment results, and certificates by email." },
                  { key: "smsNotifications" as const, label: "SMS notifications", desc: "Get critical alerts and deadline reminders via SMS." },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                    <div>
                      <p className="text-sm font-semibold text-ink">{label}</p>
                      <p className="mt-0.5 text-xs text-muted">{desc}</p>
                    </div>
                    <div
                      onClick={() => update(key, !form[key])}
                      className={`relative mt-0.5 h-6 w-11 cursor-pointer rounded-full transition-colors ${form[key] ? "bg-[#1166c8]" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Preferences" && (
            <div className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Platform preferences</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Language</label>
                  <select value={form.language} onChange={(e) => update("language", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                    <option>English</option>
                    <option>Zulu</option>
                    <option>Xhosa</option>
                    <option>Afrikaans</option>
                    <option>Sotho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Timezone</label>
                  <select value={form.timezone} onChange={(e) => update("timezone", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                    <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                    <option value="UTC">UTC</option>
                    <option value="Africa/Cairo">Africa/Cairo</option>
                    <option value="Africa/Lagos">Africa/Lagos</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <Link href="/dashboard/learner" className="text-sm text-muted hover:text-ink transition">
              ← Back to dashboard
            </Link>
            <button type="submit"
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${saved ? "bg-emerald-500 text-white" : "bg-gold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] hover:bg-[#e8b830]"}`}>
              {saved ? "✓ Saved" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
