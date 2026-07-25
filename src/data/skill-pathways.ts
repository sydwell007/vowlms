/**
 * GoalVow Skill Pathways — curated, self-paced curricula built entirely from
 * real, already-published Upskilling Academy and Microsoft Office courses.
 *
 * Each pathway maps a recognisable job-relevant skill to an ordered list of
 * real course slugs. Completing every course in a pathway is how a learner
 * builds (and can point to on a CV) demonstrable competence in that skill —
 * each individual course already awards its own real certificate; a pathway
 * is a GoalVow-curated bundle of those courses, not a separate accreditation.
 */

export type SkillPathway = {
  slug: string;
  title: string;
  icon: string;
  /** Short, CV-ready framing of the competence this pathway builds. */
  skillStatement: string;
  description: string;
  idealFor: string;
  /** Real course slugs, in the recommended completion order. */
  courseSlugs: string[];
};

export const skillPathways: SkillPathway[] = [
  {
    slug: "hr-people-operations",
    title: "HR & People Operations",
    icon: "👥",
    skillStatement: "Practical competence in HR fundamentals, workplace culture, and ethical people management.",
    description:
      "Build the foundation for HR and people-operations work — from core HR processes to fostering an inclusive culture, leading ethically, and managing teams.",
    idealFor: "Aspiring HR coordinators, people-operations assistants, and team leads.",
    courseSlugs: ["human-resources", "organizational-culture", "business-ethics", "team-management"],
  },
  {
    slug: "leadership-change-management",
    title: "Leadership & Change Management",
    icon: "🌟",
    skillStatement: "Practical competence in leading people and guiding teams through organisational change.",
    description:
      "Develop the mindset and tools of effective leadership, then apply them to leading teams through uncertainty, change, and crisis with clear, confident communication.",
    idealFor: "New and aspiring managers, supervisors, and team leads.",
    courseSlugs: ["leadership", "change-management", "critical-thinking", "resilience"],
  },
  {
    slug: "sales-business-development",
    title: "Sales & Business Development",
    icon: "💰",
    skillStatement: "Practical competence in prospecting, selling, and building lasting customer relationships.",
    description:
      "Cover the full sales cycle — from prospecting and marketing fundamentals to presenting solutions, closing deals, and delivering excellent customer service.",
    idealFor: "Sales representatives, account managers, and business-development roles.",
    courseSlugs: ["sales", "marketing", "customer-service", "communication"],
  },
  {
    slug: "project-operations-management",
    title: "Project & Operations Management",
    icon: "📋",
    skillStatement: "Practical competence in planning, scheduling, and delivering projects on scope and on time.",
    description:
      "Learn project management frameworks, structured problem-solving, and the time-management discipline needed to keep complex work on track.",
    idealFor: "Project coordinators, operations assistants, and team leads running delivery workstreams.",
    courseSlugs: ["project-management", "problem-solving", "time-management", "critical-thinking"],
  },
  {
    slug: "customer-experience-management",
    title: "Customer Experience Management",
    icon: "🎧",
    skillStatement: "Practical competence in delivering consistent, high-quality customer experiences under pressure.",
    description:
      "Master customer-service fundamentals and clear communication, and learn to manage workplace stress and compliance so service quality holds up under pressure.",
    idealFor: "Customer service agents, support-desk staff, and client-facing coordinators.",
    courseSlugs: ["customer-service", "communication", "stress-management", "workplace-compliance"],
  },
  {
    slug: "cybersecurity-digital-risk",
    title: "Cybersecurity & Digital Risk Awareness",
    icon: "🔐",
    skillStatement: "Practical competence in identifying digital risks and applying safe, compliant workplace practices.",
    description:
      "Build core cybersecurity awareness and workplace compliance knowledge, backed by the critical-thinking and time-management skills to apply them consistently.",
    idealFor: "Any office-based role handling sensitive data, systems, or compliance obligations.",
    courseSlugs: ["cybersecurity", "workplace-compliance", "critical-thinking", "time-management"],
  },
  {
    slug: "workplace-wellness-resilience",
    title: "Workplace Wellness & Resilience",
    icon: "💪",
    skillStatement: "Practical competence in managing stress, building resilience, and sustaining performance.",
    description:
      "Develop evidence-based strategies for wellbeing and stress management, and build the personal and career resilience to sustain performance through setbacks.",
    idealFor: "Anyone building sustainable performance habits, and those supporting team wellbeing.",
    courseSlugs: ["health-and-wellness", "stress-management", "resilience", "time-management"],
  },
  {
    slug: "career-growth-professional-development",
    title: "Career Growth & Professional Development",
    icon: "🚀",
    skillStatement: "Practical competence in managing your own career trajectory and professional presence.",
    description:
      "Take ownership of your career path — self-assessment, networking, professional etiquette — supported by strong communication and time-management fundamentals.",
    idealFor: "Early-career professionals and anyone planning their next career move.",
    courseSlugs: ["career-management", "communication", "time-management", "critical-thinking"],
  },
  {
    slug: "microsoft-office-productivity",
    title: "Microsoft Office Productivity",
    icon: "💻",
    skillStatement: "Practical competence in everyday Microsoft Office tools for professional office work.",
    description:
      "Build core fluency across the four Microsoft Office applications used in almost every office role: Word, Excel, PowerPoint, and Outlook.",
    idealFor: "Office administrators, new graduates, and anyone formalising everyday computer skills.",
    courseSlugs: ["microsoft-word-basics", "microsoft-excel-basics", "microsoft-power-point", "microsoft-outlook"],
  },
  {
    slug: "advanced-office-data-management",
    title: "Advanced Office & Data Management",
    icon: "📊",
    skillStatement: "Practical competence in advanced document, spreadsheet, and database work.",
    description:
      "Go beyond the basics with advanced Word and Excel techniques and hands-on relational database skills in Microsoft Access.",
    idealFor: "Office professionals ready to take on reporting, data-management, and document-automation work.",
    courseSlugs: ["microsoft-word-advance", "microsoft-excel-advance", "microsoft-access"],
  },
];
