import type { AcademyCategory } from "@/types/lms";

export type RoleOption = {
  id: string;
  label: string;
  /** Lowercase keyword fragments matched against course title + description to rank results. */
  keywords: string[];
};

export type GoalTileId = "kitchen" | "trade" | "career" | "business" | "certificate" | "unsure";

export type GoalTile = {
  id: GoalTileId;
  icon: string;
  question: string;
  /** Undefined for the two tiles that route straight into the Path Finder Quiz instead of a role list. */
  academyCategory?: AcademyCategory;
  roles: RoleOption[];
};

export const goalTiles: GoalTile[] = [
  {
    id: "kitchen",
    icon: "🍳",
    question: "I want to work in a kitchen or restaurant",
    academyCategory: "chef-academy",
    roles: [
      { id: "line-cook", label: "Line Cook", keywords: ["cook", "kitchen", "prep", "recipe"] },
      { id: "pastry-chef", label: "Pastry Chef", keywords: ["pastry", "bake", "baking", "dessert", "cake", "bread"] },
      { id: "barista", label: "Barista", keywords: ["coffee", "barista", "espresso", "beverage"] },
      { id: "restaurant-manager", label: "Restaurant Manager", keywords: ["manage", "management", "supervisor", "operations", "service"] },
      { id: "catering-professional", label: "Catering Professional", keywords: ["catering", "event", "banquet"] },
      { id: "head-chef", label: "Head Chef", keywords: ["chef", "menu", "culinary"] },
    ],
  },
  {
    id: "trade",
    icon: "🔧",
    question: "I want to learn a trade or hands-on skill",
    academyCategory: "skills-training",
    roles: [
      { id: "cleaner-hygiene-tech", label: "Cleaner / Hygiene Tech", keywords: ["clean", "cleaner", "hygiene", "sanitation", "ablution"] },
      { id: "security-officer", label: "Security Officer", keywords: ["security", "guard", "patrol"] },
      { id: "warehouse-worker", label: "Warehouse Worker", keywords: ["warehouse", "logistics", "stock", "inventory"] },
      { id: "domestic-worker", label: "Domestic Worker", keywords: ["domestic", "household", "housekeeping"] },
      { id: "groundskeeper", label: "Groundskeeper", keywords: ["ground", "garden", "landscap", "outdoor"] },
      { id: "maintenance-assistant", label: "Maintenance Assistant", keywords: ["maintenance", "repair", "technical", "facilities"] },
    ],
  },
  {
    id: "career",
    icon: "📈",
    question: "I want to grow my career or get promoted",
    academyCategory: "upskilling",
    roles: [
      { id: "get-promotion", label: "Get a Promotion", keywords: ["leadership", "promotion", "management", "supervisor"] },
      { id: "earn-cpd", label: "Earn CPD Points", keywords: ["professional development", "cpd", "compliance"] },
      { id: "reskill-industry", label: "Reskill into a New Industry", keywords: ["career change", "reskill", "transition", "new industry"] },
      { id: "improve-leadership", label: "Improve My Leadership", keywords: ["leadership", "team", "manage", "supervise"] },
      { id: "build-confidence", label: "Build Professional Confidence", keywords: ["confidence", "communication", "soft skills", "personal development"] },
      { id: "prepare-new-job", label: "Prepare for a New Job", keywords: ["job", "interview", "cv", "career readiness", "employab"] },
    ],
  },
  {
    id: "business",
    icon: "💼",
    question: "I want to start or grow a business",
    academyCategory: "business-school",
    roles: [
      { id: "start-spaza", label: "Start a Spaza Shop", keywords: ["spaza", "small business", "start a business", "informal trade"] },
      { id: "register-business", label: "Register My Business", keywords: ["register", "compliance", "legal", "registration"] },
      { id: "learn-finance", label: "Learn About Finance", keywords: ["finance", "accounting", "budget", "bookkeeping"] },
      { id: "build-business-plan", label: "Build a Business Plan", keywords: ["business plan", "strategy", "planning"] },
      { id: "grow-business", label: "Grow an Existing Business", keywords: ["growth", "scale", "expand", "marketing"] },
      { id: "learn-ecommerce", label: "Learn About E-Commerce", keywords: ["e-commerce", "ecommerce", "online store", "digital sales"] },
    ],
  },
  {
    id: "certificate",
    icon: "🎓",
    question: "I want a certificate or formal qualification",
    roles: [],
  },
  {
    id: "unsure",
    icon: "🔍",
    question: "I'm not sure — help me find my path",
    roles: [],
  },
];

export function getGoalTile(id: string): GoalTile | undefined {
  return goalTiles.find((tile) => tile.id === id);
}
