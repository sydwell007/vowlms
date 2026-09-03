import type { Role } from "@/types/lms";

export type EcosystemServiceStatus = "Built-in" | "Support" | "Coming soon" | "In development";

export type EcosystemService = {
  slug: string;
  icon: string;
  name: string;
  tagline: string;
  /** Longer copy for the full ecosystem map page. */
  description: string;
  status: EcosystemServiceStatus;
  href: string;
  accentColor: string;
  /** Visible to learners today. Admin always sees every service regardless of this. */
  learnerVisible: boolean;
};

/**
 * Single source of truth for the "GoalVow Ecosystem" services — was
 * previously duplicated independently across `EcosystemSidebar.tsx`,
 * `app/ecosystem/page.tsx`, and `Footer.tsx`. VowTools has been discontinued
 * and has no entry here at all (its route is deleted too, not just hidden).
 */
export const ecosystemServices: EcosystemService[] = [
  {
    slug: "vowsupport",
    icon: "🤝",
    name: "VowSupport",
    tagline: "Account and learning support",
    description: "A verified support route for access, registration, course, assessment, and partnership enquiries.",
    status: "Support",
    href: "/support",
    accentColor: "#19c37d",
    learnerVisible: false,
  },
  {
    slug: "vowrewards",
    icon: "⭐",
    name: "VowRewards",
    tagline: "Eligible learning milestones",
    description: "The platform records VowRewards events for configured lesson, assessment, course, and certificate milestones.",
    status: "Built-in",
    href: "/rewards",
    accentColor: "#f5c542",
    learnerVisible: true,
  },
  {
    slug: "plugconnect",
    icon: "🔗",
    name: "PlugConnect",
    tagline: "Planned opportunity routing",
    description: "A planned consent-led route from learner-controlled evidence to confirmed employment, project, and enterprise opportunities.",
    status: "Coming soon",
    href: "/opportunities",
    accentColor: "#8b5cf6",
    learnerVisible: false,
  },
  {
    slug: "skillsshop",
    icon: "🛍️",
    name: "SkillsShop",
    tagline: "Kits, tools & learning bundles",
    description: "Learning kits, trade tools, kitchen equipment, uniform bundles, and digital subscriptions — all aligned to specific academy pathways and redeemable with VowRewards points.",
    status: "Coming soon",
    href: "/skillsshop",
    accentColor: "#06b6d4",
    learnerVisible: false,
  },
  {
    slug: "learning-hubs",
    icon: "🏫",
    name: "Learning Hubs",
    tagline: "Planned partner access model",
    description: "A proposed partner model for supported device access, facilitated study, and selected Skills Practice activities.",
    status: "Coming soon",
    href: "/learning-hubs",
    accentColor: "#06b6d4",
    learnerVisible: false,
  },
  {
    slug: "cheforder",
    icon: "🍳",
    name: "ChefOrder",
    tagline: "Chef business & food platform",
    description: "A dedicated food-ordering and chef-business marketplace that creates a commercial revenue pathway for Chef Academy graduates and culinary entrepreneurs.",
    status: "Coming soon",
    href: "/cheforder",
    accentColor: "#f97316",
    learnerVisible: false,
  },
  {
    slug: "innovation-labs",
    icon: "🔬",
    name: "Innovation Labs",
    tagline: "VR/AR & AI learning tools",
    description: "A development pathway for safe simulations, future WebXR experiences, and evidence-led learning tools.",
    status: "In development",
    href: "/innovation-labs",
    accentColor: "#06b6d4",
    learnerVisible: false,
  },
];

export function getEcosystemServices(role?: Role | null): EcosystemService[] {
  if (role === "admin") return ecosystemServices;
  return ecosystemServices.filter((service) => service.learnerVisible);
}

export const ecosystemStatusBadgeClass: Record<EcosystemServiceStatus, string> = {
  "Built-in": "bg-emerald-100 text-emerald-700",
  "Support": "bg-purple-100 text-purple-700",
  "Coming soon": "bg-amber-100 text-amber-700",
  "In development": "bg-cyan-100 text-cyan-700",
};
