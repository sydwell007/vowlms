"use client";

import { useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "facilitator" | "employer" | "admin";
  academy: string;
  status: "active" | "inactive" | "suspended";
  joined: string;
  courses: number;
  progress: number;
};

const users: User[] = [
  { id: "u1", name: "Amina Mokoena", email: "amina@goalvow.com", role: "learner", academy: "Upskilling Academy", status: "active", joined: "Jan 2026", courses: 2, progress: 65 },
  { id: "u2", name: "Sipho Dlamini", email: "sipho@goalvow.com", role: "learner", academy: "Skills Training Academy", status: "active", joined: "Feb 2026", courses: 1, progress: 80 },
  { id: "u3", name: "Zanele Mahlangu", email: "zanele@goalvow.com", role: "learner", academy: "Business School", status: "active", joined: "Mar 2026", courses: 2, progress: 45 },
  { id: "u4", name: "Themba Nkosi", email: "themba@goalvow.com", role: "facilitator", academy: "Upskilling Academy", status: "active", joined: "Dec 2025", courses: 4, progress: 0 },
  { id: "u5", name: "Nokwanda Zulu", email: "nokwanda@goalvow.com", role: "learner", academy: "Chef Academy", status: "active", joined: "Apr 2026", courses: 1, progress: 55 },
  { id: "u6", name: "Bongani Khumalo", email: "bongani@goalvow.com", role: "learner", academy: "University Online", status: "inactive", joined: "Jan 2026", courses: 1, progress: 20 },
  { id: "u7", name: "Lerato Sithole", email: "lerato@goalvow.com", role: "employer", academy: "PlugConnect", status: "active", joined: "Mar 2026", courses: 0, progress: 0 },
  { id: "u8", name: "Mpho Modise", email: "mpho@goalvow.com", role: "learner", academy: "Private School", status: "active", joined: "May 2026", courses: 1, progress: 30 },
  { id: "u9", name: "Refilwe Tau", email: "refilwe@goalvow.com", role: "facilitator", academy: "Business School", status: "active", joined: "Jan 2026", courses: 3, progress: 0 },
  { id: "u10", name: "Kabelo Moeng", email: "kabelo@goalvow.com", role: "learner", academy: "Skills Training Academy", status: "suspended", joined: "Feb 2026", courses: 1, progress: 10 },
];

const roleColors = {
  learner: "bg-[#1166c8]/10 text-[#1166c8]",
  facilitator: "bg-emerald-100 text-emerald-700",
  employer: "bg-purple-100 text-purple-700",
  admin: "bg-gold/20 text-yellow-700",
};
const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  suspended: "bg-red-100 text-red-700",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((u) => u.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Admin</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">User management</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50">
              ← Dashboard
            </Link>
            <button className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-[#06111f] shadow-sm transition hover:bg-[#e8b830]">
              + Invite user
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
          {[
            { label: "Total users", value: users.length },
            { label: "Learners", value: users.filter((u) => u.role === "learner").length },
            { label: "Facilitators", value: users.filter((u) => u.role === "facilitator").length },
            { label: "Active this month", value: users.filter((u) => u.status === "active").length },
          ].map((s) => (
            <div key={s.label} className="premium-card rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-ink">{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none transition">
            <option value="all">All roles</option>
            <option value="learner">Learner</option>
            <option value="facilitator">Facilitator</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-[#1166c8] focus:outline-none transition">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#1166c8]/30 bg-[#f0f7ff] px-4 py-3">
            <p className="text-sm font-semibold text-[#1166c8]">{selected.size} selected</p>
            <div className="flex gap-2 ml-auto">
              <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-50 transition">Resend invite</button>
              <button className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition">Suspend</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll} className="h-4 w-4 rounded accent-[#1166c8]" />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted">User</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted">Role</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted hidden sm:table-cell">Academy</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted hidden md:table-cell">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted hidden lg:table-cell">Progress</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted hidden lg:table-cell">Joined</th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className={`transition hover:bg-slate-50 ${selected.has(user.id) ? "bg-[#f0f7ff]" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(user.id)} onChange={() => toggleOne(user.id)}
                        className="h-4 w-4 rounded accent-[#1166c8]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-black text-[#06111f]">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{user.name}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted hidden sm:table-cell">{user.academy}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {user.role === "learner" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 max-w-16">
                            <div className="h-1.5 rounded-full bg-[#1166c8]" style={{ width: `${user.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted">{user.progress}%</span>
                        </div>
                      ) : <span className="text-xs text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted hidden lg:table-cell">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[#1166c8] hover:bg-[#1166c8]/8 transition">View</button>
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:text-ink hover:bg-slate-100 transition">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-muted">{filtered.length} of {users.length} users</p>
            <div className="flex gap-1">
              <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-muted hover:text-ink transition disabled:opacity-40" disabled>← Prev</button>
              <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-muted hover:text-ink transition">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
