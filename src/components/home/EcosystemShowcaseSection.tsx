import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Briefcase, Headset, LayoutDashboard, LifeBuoy, Route } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ecosystemStatusBadgeClass, getEcosystemServices } from "@/data/ecosystem-services";
import type { Role } from "@/types/lms";

/**
 * A learner's real, always-live destinations beyond "a course" — every card
 * here links to a genuine VowLMS page today, not a stub, so this holds up
 * for every visitor (signed out, learner, or admin), unlike a raw services
 * list where most GoalVow sibling services are still admin-only pending
 * their own launch.
 */
const journeyDestinations = [
  { Icon: Route, name: "Skill Pathways", href: "/learn/pathways", description: "Structured routes that connect several courses to one outcome.", accentColor: "#1765a6" },
  { Icon: Headset, name: "VR Practice", href: "/vr-practice", description: "Rehearse workplace scenarios safely before applying them for real.", accentColor: "#179aa0" },
  { Icon: Award, name: "Certificates", href: "/certificates", description: "Account-owned proof of the learning you have completed.", accentColor: "#b98713" },
  { Icon: LayoutDashboard, name: "Your Dashboard", href: "/dashboard/learner", description: "Courses, assessments, certificates, and rewards in one view.", accentColor: "#184f78" },
  { Icon: Briefcase, name: "Opportunities", href: "/opportunities", description: "A planned route from verified learning evidence to opportunity.", accentColor: "#20885f" },
  { Icon: LifeBuoy, name: "VowSupport", href: "/support", description: "A direct route to learner, course, and account support.", accentColor: "#d45e3e" },
];

export function EcosystemShowcaseSection({ role }: { role?: Role | null }) {
  const dashboardHref = role ? `/dashboard/${role}` : "/dashboard/learner";
  const growingServices = getEcosystemServices(role).filter((s) => s.slug !== "vowrewards");

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {journeyDestinations.map(({ Icon, name, href, description, accentColor }) => (
          <Link
            key={name}
            href={name === "Your Dashboard" ? dashboardHref : href}
            className="gv-card interactive-lift group flex items-start gap-4 rounded-lg p-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: `${accentColor}18` }}>
              <Icon aria-hidden="true" className="h-5 w-5" style={{ color: accentColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-ink">{name}</h3>
              <p className="mt-1 text-[13px] leading-5 text-muted">{description}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1166c8] opacity-0 transition group-hover:opacity-100">
                Explore <ArrowRight aria-hidden="true" className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* A growing GoalVow network — honestly labelled: some are live services
          (like VowRewards, already spotlighted above), others are planned
          services in progress. Real status, never overclaimed. */}
      {growingServices.length > 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-[#eef3f5] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            And VowLMS keeps connecting to the GoalVow network
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {growingServices.map((service) => (
              <span
                key={service.slug}
                title={service.description}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-ink"
              >
                {service.iconImage ? (
                  <Image src={service.iconImage} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                ) : (
                  <span aria-hidden="true">{service.icon}</span>
                )}
                {service.name}
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none ${ecosystemStatusBadgeClass[service.status]}`}>
                  {service.status}
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
        <ButtonLink href="/ecosystem" variant="ink">
          Explore the full ecosystem map →
        </ButtonLink>
      </div>
    </div>
  );
}
