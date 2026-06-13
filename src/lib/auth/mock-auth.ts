import type { Role } from "@/types/lms";

export type MockSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
};

const roleNames: Record<Role, string> = {
  learner: "Amina Mokoena",
  facilitator: "GoalVow Facilitator",
  employer: "PlugConnect Employer",
  admin: "GoalVow Admin",
};

export function getMockSession(role: Role = "learner"): MockSession {
  return {
    user: {
      id: `mock-${role}`,
      name: roleNames[role],
      email: `${role}@vowlms.local`,
      role,
    },
  };
}

export function canAccess(role: Role, allowed: Role[]) {
  return allowed.includes(role);
}
