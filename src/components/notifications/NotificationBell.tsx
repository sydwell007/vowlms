"use client";

import { useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  type: "lesson" | "assessment" | "certificate" | "reward" | "announcement" | "opportunity";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
};

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "assessment",
    title: "Assessment passed!",
    body: "You scored 87% on Career Readiness Assessment. Certificate ready to download.",
    time: "2 min ago",
    read: false,
    href: "/certificates/career-readiness-accelerator",
  },
  {
    id: "n2",
    type: "reward",
    title: "250 VowRewards points earned",
    body: "You completed the Solar Installation Foundations course.",
    time: "1 hour ago",
    read: false,
    href: "/rewards",
  },
  {
    id: "n3",
    type: "announcement",
    title: "New announcement from GoalVow",
    body: "Chef Academy adds new kitchen simulation module starting July 2026.",
    time: "3 hours ago",
    read: false,
    href: "/announcements",
  },
  {
    id: "n4",
    type: "opportunity",
    title: "New opportunity match",
    body: "PlugConnect found 2 new employment matches for your career readiness profile.",
    time: "1 day ago",
    read: true,
    href: "/opportunities",
  },
  {
    id: "n5",
    type: "lesson",
    title: "Continue your lesson",
    body: "You have an incomplete lesson: VR Practice Studio in Career Readiness.",
    time: "2 days ago",
    read: true,
    href: "/lesson/career-readiness-accelerator-vr-studio",
  },
];

const typeIcons: Record<Notification["type"], string> = {
  lesson: "📚",
  assessment: "📝",
  certificate: "🏅",
  reward: "⭐",
  announcement: "📣",
  opportunity: "🎯",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/14 bg-white/6 text-white transition hover:bg-white/10"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-black text-[#06111f]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-ink">Notifications</h3>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs font-medium text-[#1166c8] hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href ?? "#"}
                    onClick={() => { markRead(n.id); setOpen(false); }}
                    className={`flex gap-3 border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${!n.read ? "bg-[#f0f7ff]" : ""}`}
                  >
                    <span className="mt-0.5 text-xl shrink-0">{typeIcons[n.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-5 ${n.read ? "text-muted" : "font-semibold text-ink"}`}>
                          {n.title}
                        </p>
                        {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1166c8]" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted leading-4">{n.body}</p>
                      <p className="mt-1 text-[10px] text-muted">{n.time}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="border-t border-slate-100 px-4 py-2.5">
              <Link href="/announcements" onClick={() => setOpen(false)} className="block text-center text-xs font-medium text-[#1166c8] hover:underline">
                View all announcements →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
