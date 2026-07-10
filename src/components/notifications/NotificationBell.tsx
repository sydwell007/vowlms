import Link from "next/link";

export function NotificationBell() {
  return (
    <Link
      href="/announcements"
      aria-label="Open announcements"
      title="Announcements"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/14 bg-white/6 text-white/76 transition hover:bg-white/10 hover:text-white"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m8-2H7l1.2-1.8V10a3.8 3.8 0 0 1 7.6 0v3.2L17 15Zm-6 4h2" />
      </svg>
    </Link>
  );
}
