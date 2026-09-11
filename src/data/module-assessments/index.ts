import type { Assessment } from "@/types/lms";

/**
 * Real "Module Assessment: Test Your Knowledge" content for the 20 Upskilling
 * Academy courses' 118 real modules — replacing the auto-generated Moodle
 * migration's placeholder assessments, which are generic filler ("What is
 * the primary goal of X?") and, worse, wired to a lesson slug
 * (`...-knowledge-check`) that doesn't exist in any of these modules, so the
 * real "Take Assessment" button never appeared for them at all.
 *
 * Keyed by the real, predictable lesson slug
 * (`${childModuleSlug}-module-assessment-test-your-knowledge`) so
 * `buildParentCourse()` in `src/lib/data.ts` can look each one up directly —
 * see that file for exactly how this plugs in.
 *
 * One file per course keeps each PR-sized chunk of content reviewable and
 * lets different modules be authored independently without merge conflicts.
 */
import { businessEthicsAssessments } from "./business-ethics";
import { workplaceComplianceAssessments } from "./workplace-compliance";
import { organizationalCultureAssessments } from "./organizational-culture";
import { stressManagementAssessments } from "./stress-management";
import { cybersecurityAssessments } from "./cybersecurity";
import { healthAndWellnessAssessments } from "./health-and-wellness";
import { humanResourcesAssessments } from "./human-resources";
import { marketingAssessments } from "./marketing";
import { salesAssessments } from "./sales";
import { projectManagementAssessments } from "./project-management";
import { customerServiceAssessments } from "./customer-service";
import { careerManagementAssessments } from "./career-management";
import { changeManagementAssessments } from "./change-management";
import { communicationAssessments } from "./communication";
import { leadershipAssessments } from "./leadership";
import { resilienceAssessments } from "./resilience";
import { problemSolvingAssessments } from "./problem-solving";
import { timeManagementAssessments } from "./time-management";
import { teamManagementAssessments } from "./team-management";
import { criticalThinkingAssessments } from "./critical-thinking";

export const MODULE_ASSESSMENTS: Record<string, Assessment> = {
  ...businessEthicsAssessments,
  ...workplaceComplianceAssessments,
  ...organizationalCultureAssessments,
  ...stressManagementAssessments,
  ...cybersecurityAssessments,
  ...healthAndWellnessAssessments,
  ...humanResourcesAssessments,
  ...marketingAssessments,
  ...salesAssessments,
  ...projectManagementAssessments,
  ...customerServiceAssessments,
  ...careerManagementAssessments,
  ...changeManagementAssessments,
  ...communicationAssessments,
  ...leadershipAssessments,
  ...resilienceAssessments,
  ...problemSolvingAssessments,
  ...timeManagementAssessments,
  ...teamManagementAssessments,
  ...criticalThinkingAssessments,
};
