import Link from "next/link";

const links = [
  { href: "/learning-hubs", label: "Learning hubs" },
  { href: "/rewards", label: "Rewards" },
  { href: "/api/health", label: "API health" },
  { href: "/offline", label: "Offline" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06111f] py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold">VowLMS</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/62">
            GoalVow learning, skills, VR practice, rewards, support, and opportunity pathways in one focused LMS.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
