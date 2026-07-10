"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDashboardEndpoint } from "@/lib/auth/useDashboardEndpoint";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

type AdminData = {
  recentUsers: AdminUser[];
  roleCounts: Record<string, number>;
  mode?: string;
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { data, error, loading } = useDashboardEndpoint<AdminData>("/api/dashboard/admin");
  const filtered = useMemo(() => {
    const users = data?.recentUsers ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
  }, [search, data?.recentUsers]);

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Recent users</h1>
            <p className="mt-2 text-sm text-muted">Read-only account visibility from the authorised admin endpoint.</p>
          </div>
          <Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink">Back to dashboard</Link>
        </div>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Role changes, invitations, suspension, and deletion require audited backend actions and are intentionally not simulated in this interface.
        </div>
        {error ? <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div> : null}

        <label htmlFor="user-search" className="mt-6 block text-sm font-semibold text-ink">Search recent users</label>
        <input
          id="user-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-ink focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20"
        />

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4 font-medium text-ink">{user.name}</td>
                    <td className="px-5 py-4 text-muted">{user.email}</td>
                    <td className="px-5 py-4 capitalize text-muted">{user.role}</td>
                    <td className="px-5 py-4 text-muted">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-ZA") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">{data?.mode === "development" ? "No development users are fabricated." : "No matching recent users."}</p>
          ) : null}
          {loading ? <div className="h-32 animate-pulse bg-slate-50" /> : null}
        </div>
      </div>
    </main>
  );
}
