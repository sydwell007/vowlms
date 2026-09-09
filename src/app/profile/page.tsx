"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { setSessionCache, useSession } from "@/lib/auth/useSession";

const tabs = ["Profile", "Security", "Notifications", "Preferences"] as const;
type Tab = typeof tabs[number];

export default function ProfilePage() {
  const session = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");
  const [dashboardMetrics, setDashboardMetrics] = useState<Array<{ label: string; value: string }> | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "South Africa",
    bio: "",
    academy: "Upskilling Academy",
    emailNotifications: true,
    smsNotifications: false,
    language: "English",
    timezone: "Africa/Johannesburg",
  });

  const sessionUser = session.status === "authenticated" ? session.user : null;

  useEffect(() => {
    let cancelled = false;
    if (!sessionUser) return () => { cancelled = true; };

    Promise.resolve().then(() => {
      if (cancelled) return;
      setForm((current) => ({
        ...current,
        name: sessionUser.name || current.name,
        email: sessionUser.email || current.email,
      }));
      setAvatarUrl(sessionUser.avatar_url ?? sessionUser.avatarUrl ?? null);
    });

    fetch("/api/user/profile")
      .then((response) => response.json())
      .then((json) => {
        if (cancelled || !json.ok || !json.data) return;
        const profile = json.data;
        setForm((current) => ({
          ...current,
          name: profile.name ?? current.name,
          email: profile.email ?? current.email,
          phone: profile.phone ?? "",
          city: profile.city ?? "",
          country: profile.country ?? current.country,
          bio: profile.bio ?? "",
          academy: profile.preferred_academy ?? current.academy,
          emailNotifications: Boolean(profile.email_notifications),
          smsNotifications: Boolean(profile.sms_notifications),
          language: profile.language ?? current.language,
          timezone: profile.timezone ?? current.timezone,
        }));
        setAvatarUrl(profile.avatar_url ?? null);
      })
      .catch(() => {});

    if (sessionUser.role === "learner") {
      fetch("/api/dashboard/learner", { cache: "no-store" })
        .then((response) => response.json())
        .then((json) => {
          if (cancelled || !json.ok || !Array.isArray(json.data?.metrics)) return;
          setDashboardMetrics(json.data.metrics.slice(0, 4));
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [sessionUser]);

  async function uploadAvatar(file: File) {
    setAvatarMessage("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarMessage("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setAvatarMessage("The image must be smaller than 4 MB.");
      return;
    }

    const previousUrl = avatarUrl;
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setAvatarUploading(true);

    try {
      const body = new FormData();
      body.set("avatar", file);
      const response = await fetch("/api/user/avatar", { method: "POST", body });
      const json = await response.json();
      if (!response.ok || !json.ok || !json.data?.avatar_url) {
        throw new Error(json.error ?? "Avatar upload failed.");
      }

      const uploadedUrl = json.data.avatar_url as string;
      setAvatarUrl(uploadedUrl);
      if (sessionUser) {
        setSessionCache({ ...sessionUser, avatar_url: uploadedUrl, avatarUrl: uploadedUrl });
      }
      setAvatarMessage("Profile photo updated.");
    } catch (error) {
      setAvatarUrl(previousUrl);
      setAvatarMessage(error instanceof Error ? error.message : "Avatar upload failed.");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  async function removeAvatar() {
    setAvatarMessage("");
    setAvatarUploading(true);
    try {
      const response = await fetch("/api/user/avatar", { method: "DELETE" });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error ?? "Could not remove photo.");
      setAvatarUrl(null);
      if (sessionUser) setSessionCache({ ...sessionUser, avatar_url: null, avatarUrl: null });
      setAvatarMessage("Profile photo removed.");
    } catch (error) {
      setAvatarMessage(error instanceof Error ? error.message : "Could not remove photo.");
    } finally {
      setAvatarUploading(false);
    }
  }

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const initials = form.name
    ? form.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "??";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone || null,
          city: form.city || null,
          country: form.country || null,
          bio: form.bio || null,
          preferred_academy: form.academy || null,
          language: form.language,
          timezone: form.timezone,
          email_notifications: form.emailNotifications,
          sms_notifications: form.smsNotifications,
        }),
      });
      const json = await res.json();
      if (!json.ok) { setSaveError(json.error ?? "Failed to save."); return; }
    } catch {
      setSaveError("Connection error. Changes not saved.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function requestPasswordReset() {
    if (!form.email) return;
    setSecurityLoading(true);
    setSecurityMessage("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error ?? "Reset link could not be sent.");
      setSecurityMessage("Check your inbox for a secure password reset link.");
    } catch (error) {
      setSecurityMessage(error instanceof Error ? error.message : "Reset link could not be sent.");
    } finally {
      setSecurityLoading(false);
    }
  }

  const stats = dashboardMetrics ?? [
    { label: "Courses enrolled", value: "-" },
    { label: "Completed", value: "-" },
    { label: "Certificates", value: "-" },
    { label: "VOWR balance", value: "-" },
  ];
  const roleLabel = sessionUser?.role
    ? `${sessionUser.role.charAt(0).toUpperCase()}${sessionUser.role.slice(1)} profile`
    : "Account profile";
  const dashboardHref = sessionUser?.role ? `/dashboard/${sessionUser.role}` : "/dashboard/learner";

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="visual-hero hero-achievement mb-6 rounded-lg p-8 text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gold text-3xl font-black text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)]">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={`${form.name || "User"} profile photo`} fill sizes="80px" className="object-cover" unoptimized />
              ) : initials}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{roleLabel}</p>
              <h1 className="mt-1 text-2xl font-semibold">{form.name}</h1>
              <p className="mt-1 text-sm text-white/70">{form.email} · {form.city}, {form.country}</p>
            </div>
            {sessionUser?.role === "learner" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="premium-card-dark rounded-xl p-3 text-center">
                    <p className="text-xl font-semibold text-gold">{s.value}</p>
                    <p className="mt-1 text-[10px] font-medium text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Profile settings" className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`profile-panel-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-max rounded-lg px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${activeTab === tab ? "bg-[#06111f] text-white" : "text-muted hover:text-ink"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={save}>
          {activeTab === "Profile" && (
            <div id="profile-panel-profile" role="tabpanel" className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Personal information</h2>
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gold text-xl font-black text-[#06111f]">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Profile photo preview" fill sizes="64px" className="object-cover" unoptimized />
                  ) : initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">Profile photo</p>
                  <p className="mt-1 text-xs text-muted">JPG, PNG or WebP. Maximum 4 MB.</p>
                  {avatarMessage && (
                    <p className={`mt-1 text-xs ${avatarMessage.includes("updated") || avatarMessage.includes("removed") ? "text-emerald-700" : "text-red-700"}`}>
                      {avatarMessage}
                    </p>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  id="profile-avatar"
                  name="avatar"
                  aria-label="Profile photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadAvatar(file);
                  }}
                />
                <div className="flex shrink-0 gap-2">
                  {avatarUrl && !avatarUrl.startsWith("blob:") && (
                    <button
                      type="button"
                      disabled={avatarUploading}
                      onClick={removeAvatar}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={avatarUploading}
                    onClick={() => avatarInputRef.current?.click()}
                    className="rounded-lg bg-[#06111f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#10243a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {avatarUploading ? "Uploading..." : "Upload photo"}
                  </button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-semibold text-ink mb-1.5">Full name</label>
                  <input id="profile-name" name="name" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                  <input id="profile-email" name="email" type="email" autoComplete="email" readOnly aria-readonly="true" value={form.email}
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-muted" />
                  <p className="mt-1 text-xs text-muted">Contact support to change your sign-in email.</p>
                </div>
                <div>
                  <label htmlFor="profile-phone" className="block text-sm font-semibold text-ink mb-1.5">Phone</label>
                  <input id="profile-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label htmlFor="profile-academy" className="block text-sm font-semibold text-ink mb-1.5">Primary academy</label>
                  <select id="profile-academy" name="preferredAcademy" value={form.academy} onChange={(e) => update("academy", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                    {(sessionUser?.role === "admin"
                      ? ["Upskilling Academy", "Skills Training Academy", "Chef Academy", "Private School", "Sports Academy", "Business School", "University Online"]
                      : ["Upskilling Academy"]
                    ).map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-city" className="block text-sm font-semibold text-ink mb-1.5">City</label>
                  <input id="profile-city" name="city" autoComplete="address-level2" value={form.city} onChange={(e) => update("city", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
                <div>
                  <label htmlFor="profile-country" className="block text-sm font-semibold text-ink mb-1.5">Country</label>
                  <input id="profile-country" name="country" autoComplete="country-name" value={form.country} onChange={(e) => update("country", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition" />
                </div>
              </div>
              <div>
                <label htmlFor="profile-bio" className="block text-sm font-semibold text-ink mb-1.5">Bio</label>
                <textarea id="profile-bio" name="bio" rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition resize-none" />
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div id="profile-panel-security" role="tabpanel" className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Security settings</h2>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-ink">Change your password securely</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  We will send a time-limited reset link to <strong className="text-ink">{form.email}</strong>. VowLMS never displays or stores your password in this page.
                </p>
                <button
                  type="button"
                  disabled={securityLoading || !form.email}
                  onClick={requestPasswordReset}
                  className="mt-4 rounded-lg bg-[#06111f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10243a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {securityLoading ? "Sending reset link..." : "Send password reset link"}
                </button>
                {securityMessage ? <p role="status" className="mt-3 text-sm text-muted">{securityMessage}</p> : null}
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div id="profile-panel-notifications" role="tabpanel" className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Notification preferences</h2>
              <div className="space-y-4">
                {[
                  { key: "emailNotifications" as const, label: "Email notifications", desc: "Receive lesson reminders, assessment results, and certificates by email." },
                  { key: "smsNotifications" as const, label: "SMS notifications", desc: "Get critical alerts and deadline reminders via SMS." },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition">
                    <div>
                      <p className="text-sm font-semibold text-ink">{label}</p>
                      <p className="mt-0.5 text-xs text-muted">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      name={key}
                      checked={form[key]}
                      onChange={(event) => update(key, event.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1166c8] ${form[key] ? "bg-[#1166c8]" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-1"}`} />
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Preferences" && (
            <div id="profile-panel-preferences" role="tabpanel" className="premium-card rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-ink">Platform preferences</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-language" className="block text-sm font-semibold text-ink mb-1.5">Language</label>
                  <select id="profile-language" name="language" value={form.language} onChange={(e) => update("language", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition">
                    <option>English</option>
                    <option>Zulu</option>
                    <option>Xhosa</option>
                    <option>Afrikaans</option>
                    <option>Sotho</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-timezone" className="block text-sm font-semibold text-ink mb-1.5">Timezone</label>
                  <select id="profile-timezone" name="timezone" value={form.timezone} onChange={(e) => update("timezone", e.target.value)}
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

          {saveError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>
          )}
          <div className="mt-5 flex items-center justify-between">
            <Link href={dashboardHref} className="text-sm text-muted hover:text-ink transition">
              ← Back to dashboard
            </Link>
            {activeTab !== "Security" ? (
              <button type="submit"
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${saved ? "bg-emerald-500 text-white" : "bg-gold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] hover:bg-[#e8b830]"}`}>
                {saved ? "✓ Saved" : "Save changes"}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}
