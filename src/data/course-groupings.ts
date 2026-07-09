/**
 * Course groupings for the Upskilling Academy.
 *
 * The Moodle migration imported every individual module as a top-level course.
 * This config maps each proper parent course (slug + metadata) to the ordered
 * list of child module slugs that belong to it.
 *
 * buildGroupedCourses() in src/lib/data.ts reads this to:
 *   1. Create parent Course objects whose modules[] are assembled from child courses.
 *   2. Remove the individual child-module courses from the flat list.
 */

export type CourseGrouping = {
  slug: string;
  title: string;
  description: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  duration: string;
  outcomes: string[];
  /** Child module-course slugs in display order */
  moduleSlugOrder: string[];
};

// ─── A–T Upskilling Soft-Skills Groupings ─────────────────────────────────────

export const upskillGroupings: CourseGrouping[] = [
  {
    slug: "business-ethics",
    title: "Business Ethics",
    description:
      "Build ethical foundations in the workplace — from business integrity and employee conduct to ethical leadership that drives lasting trust.",
    level: "Foundation",
    duration: "14 weeks",
    outcomes: [
      "Define business ethics and workplace integrity",
      "Recognise ethical warning signs and resolve dilemmas",
      "Lead teams with transparency and accountability",
      "Earn a GoalVow Business Ethics certificate",
    ],
    moduleSlugOrder: [
      "module-1-business-ethics-fundamentals",
      "module-3-employee-ethics",
      "module-2-leadership-on-ethics",
    ],
  },
  {
    slug: "workplace-compliance",
    title: "Workplace Compliance",
    description:
      "Master essential workplace compliance — health & safety regulations, workplace violence prevention, and your legal obligations as an employee or manager.",
    level: "Foundation",
    duration: "8 weeks",
    outcomes: [
      "Apply health and safety standards in any work environment",
      "Identify and respond to workplace violence risks",
      "Understand your legal rights and responsibilities",
      "Earn a GoalVow Workplace Compliance certificate",
    ],
    moduleSlugOrder: [
      "module-1-workplace-health-amp-safety",
      "module-2-workplace-violence",
    ],
  },
  {
    slug: "organizational-culture",
    title: "Organizational Culture",
    description:
      "Foster an inclusive, respectful, and culturally competent workplace. Build the interpersonal skills that turn diverse teams into high-performing ones.",
    level: "Foundation",
    duration: "10 weeks",
    outcomes: [
      "Communicate inclusively across diverse teams",
      "Develop cultural competence and sensitivity",
      "Champion inclusion and respect at every level",
      "Earn a GoalVow Organizational Culture certificate",
    ],
    moduleSlugOrder: [
      "module-1-inclusion-and-respect",
      "module-2-inclusive-communication",
      "module-3-culture-competence",
    ],
  },
  {
    slug: "stress-management",
    title: "Stress Management",
    description:
      "Understand, manage, and reduce workplace stress. Develop evidence-based strategies to protect your performance, health, and well-being under pressure.",
    level: "Foundation",
    duration: "10 weeks",
    outcomes: [
      "Identify the root causes and signs of workplace stress",
      "Apply practical stress-reduction strategies",
      "Improve performance and well-being under pressure",
      "Earn a GoalVow Stress Management certificate",
    ],
    moduleSlugOrder: [
      "module-1-stress-fundamentals",
      "module-2-stress-and-work-performance",
      "module-3-strategies-to-relieve-stress",
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    description:
      "Protect yourself and your organisation online. Cover the essentials of online security, data protection, and social engineering awareness.",
    level: "Foundation",
    duration: "10 weeks",
    outcomes: [
      "Understand core cybersecurity principles",
      "Apply data protection practices daily",
      "Recognise and defend against social engineering attacks",
      "Earn a GoalVow Cybersecurity certificate",
    ],
    moduleSlugOrder: [
      "module-1-online-security-fundamentals",
      "module-2-how-to-protect-your-data",
      "module-3-social-engineering",
    ],
  },
  {
    slug: "health-and-wellness",
    title: "Health and Wellness",
    description:
      "Build lasting mental and physical well-being. From positive psychology and healthy habits to emotional resilience and mental health awareness in the workplace.",
    level: "Foundation",
    duration: "24 weeks",
    outcomes: [
      "Apply positive psychology principles at work",
      "Build and sustain healthy daily habits",
      "Develop emotional regulation and mental resilience",
      "Earn a GoalVow Health and Wellness certificate",
    ],
    moduleSlugOrder: [
      "module-1-positive-psychology-fundamentals",
      "module-2-forming-healthy-habits",
      "module-3-positive-psychology-in-the-workplace",
      "module-4-exercise",
      "module-5-mental-health-awareness",
      "module-6-dealing-with-emotions",
    ],
  },
  {
    slug: "human-resources",
    title: "Human Resources",
    description:
      "Master the full HR lifecycle — from recruiting and diversity to talent management, well-being, anti-harassment, and retirement planning.",
    level: "Foundation",
    duration: "28 weeks",
    outcomes: [
      "Apply core HR principles across the employee lifecycle",
      "Build inclusive, bias-aware hiring and management practices",
      "Manage talent, well-being, and workplace compliance",
      "Earn a GoalVow Human Resources certificate",
    ],
    moduleSlugOrder: [
      "module-1-hr-fundamentals",
      "module-2-diversity-inclusion-and-belonging",
      "module-3-interviewing",
      "module-4-unconscious-bias",
      "module-5-talent-management",
      "module-6-workplace-well-being",
      "module-7-anti-harassment-and-discrimination",
      "module-8-retirement-planning",
    ],
  },
  {
    slug: "marketing",
    title: "Marketing",
    description:
      "Build a complete marketing skill set — from brand strategy and content creation to SEO, paid advertising, social media, analytics, and beyond.",
    level: "Foundation",
    duration: "36 weeks",
    outcomes: [
      "Develop and execute multi-channel marketing strategies",
      "Optimise digital campaigns for search, social, and email",
      "Analyse marketing data to drive better decisions",
      "Earn a GoalVow Marketing certificate",
    ],
    moduleSlugOrder: [
      "module-1-marketing-fundamentals",
      "module-2-brand-identity-and-strategy",
      "module-3-product-marketing",
      "module-4-content-marketing",
      "module-5-customer-and-marketing-research",
      "module-6-website-marketing",
      "module-7-search-engine-optimization",
      "module-8-social-media-marketing",
      "module-9-email-marketing",
      "module-10-paid-advertising",
      "module-11-marketing-analytics",
    ],
  },
  {
    slug: "sales",
    title: "Sales",
    description:
      "Develop a complete sales capability — from prospecting and psychology to presenting solutions, handling objections, closing deals, and building lasting relationships.",
    level: "Foundation",
    duration: "26 weeks",
    outcomes: [
      "Prospect, qualify, and manage a sales pipeline",
      "Present solutions and handle objections confidently",
      "Close deals using proven sales frameworks",
      "Earn a GoalVow Sales certificate",
    ],
    moduleSlugOrder: [
      "module-1-sales-fundamentals",
      "module-2-sales-leadership-and-management",
      "module-3-sales-psychology",
      "module-4-presenting-your-solution",
      "module-5-building-relationships",
      "module-6-closing-the-deal",
      "module-7-handling-objections",
      "module-8-prospecting",
    ],
  },
  {
    slug: "project-management",
    title: "Project Management",
    description:
      "Lead projects from initiation to delivery. Cover frameworks, communication, scheduling, scope, risk, reporting, and improvement methods.",
    level: "Foundation",
    duration: "28 weeks",
    outcomes: [
      "Apply project management frameworks and methodologies",
      "Plan, schedule, and control projects effectively",
      "Manage scope, stakeholder communication, and change",
      "Earn a GoalVow Project Management certificate",
    ],
    moduleSlugOrder: [
      "module-1-project-management-fundamentals",
      "module-2-project-frameworks",
      "module-3-project-communication",
      "module-4-project-scheduling",
      "module-5-project-scope-management",
      "module-6-project-reporting",
      "module-7-project-improvement",
      "module-8-project-change-management",
    ],
  },
  {
    slug: "customer-service",
    title: "Customer Service",
    description:
      "Deliver exceptional customer experiences. Build skills in communication, cultural sensitivity, difficult situations, team management, and service excellence.",
    level: "Foundation",
    duration: "24 weeks",
    outcomes: [
      "Communicate clearly and empathetically with customers",
      "Handle difficult situations and complaints professionally",
      "Apply cultural sensitivity in diverse service contexts",
      "Earn a GoalVow Customer Service certificate",
    ],
    moduleSlugOrder: [
      "module-1-customer-service-fundamentals",
      "module-2-customer-service-skills",
      "module-3-customer-communication-basics",
      "module-4-customer-communication-channels",
      "module-5-team-management",
      "module-6-culture-sensitivity",
      "module-7-difficult-situations",
    ],
  },
  {
    slug: "career-management",
    title: "Career Management",
    description:
      "Take ownership of your career trajectory. From self-assessment and professional etiquette to networking, mentoring, and navigating the modern job market.",
    level: "Foundation",
    duration: "30 weeks",
    outcomes: [
      "Assess your strengths and map your career path",
      "Build a professional network and find new opportunities",
      "Develop mentoring relationships and workplace presence",
      "Earn a GoalVow Career Management certificate",
    ],
    moduleSlugOrder: [
      "module-1-driving-your-career",
      "module-2-assessing-your-strengths-and-skills",
      "module-3-finding-a-new-job",
      "module-4-new-professional",
      "module-5-networking",
      "module-6-mentoring-in-the-workplace",
      "module-7-professional-etiquette",
      "module-8-working-relationships",
      "module-9-overcoming-challenges",
    ],
  },
  {
    slug: "change-management",
    title: "Change Management",
    description:
      "Lead and navigate organisational change. Master the fundamentals, frameworks, communication strategies, and crisis-handling techniques that make change stick.",
    level: "Foundation",
    duration: "20 weeks",
    outcomes: [
      "Apply change management models and frameworks",
      "Communicate change clearly to stakeholders",
      "Lead teams through uncertainty and crisis",
      "Earn a GoalVow Change Management certificate",
    ],
    moduleSlugOrder: [
      "module-1-change-management-fundamentals",
      "module-2-change-management-models",
      "module-3-the-change-management-process",
      "module-4-communicating-change",
      "module-5-leading-through-change",
      "module-6-managing-change-in-time-of-crisis",
    ],
  },
  {
    slug: "communication",
    title: "Communication",
    description:
      "Communicate with clarity, confidence, and impact. Cover verbal and written communication, meetings, presentations, negotiation, and difficult conversations.",
    level: "Foundation",
    duration: "26 weeks",
    outcomes: [
      "Communicate clearly across verbal, written, and digital formats",
      "Facilitate effective meetings and deliver compelling presentations",
      "Navigate difficult conversations and negotiate with confidence",
      "Earn a GoalVow Communication certificate",
    ],
    moduleSlugOrder: [
      "module-1-communication-fundamentals",
      "module-2-empathy",
      "module-3-verbal-communication",
      "module-4-meetings",
      "module-5-presentations",
      "module-6-negotiation-and-persuasion",
      "module-7-writing-well",
      "module-8-communicating-in-difficult-situations",
    ],
  },
  {
    slug: "leadership",
    title: "Leadership",
    description:
      "Develop the mindset and skills of effective leadership. Cover leadership fundamentals, emotional intelligence, leadership styles, and crisis management.",
    level: "Foundation",
    duration: "14 weeks",
    outcomes: [
      "Apply core leadership principles and styles",
      "Develop emotional intelligence for people leadership",
      "Lead confidently through crises and change",
      "Earn a GoalVow Leadership certificate",
    ],
    moduleSlugOrder: [
      "module-1-leadership-fundamentals",
      "module-2-leadership-styles",
      "module-3-emotional-intelligence",
      "module-4-crisis-management",
    ],
  },
  {
    slug: "resilience",
    title: "Resilience",
    description:
      "Build resilience that lasts. Develop emotional, physical, and career resilience skills to thrive in the face of setbacks, uncertainty, and change.",
    level: "Foundation",
    duration: "16 weeks",
    outcomes: [
      "Build career and emotional resilience strategies",
      "Develop physical resilience habits",
      "Lead with resilience and bounce back from adversity",
      "Earn a GoalVow Resilience certificate",
    ],
    moduleSlugOrder: [
      "module-1-resilience-fundamentals",
      "module-2-building-career-resilience",
      "module-3-leadership-and-resilience",
      "module-4-emotional-and-physical-resilience",
      "module-5-thriving-through-challenges",
    ],
  },
  {
    slug: "problem-solving",
    title: "Problem Solving",
    description:
      "Build a systematic approach to solving workplace challenges. From fundamentals and frameworks to advanced problem-solving and real-world application.",
    level: "Foundation",
    duration: "14 weeks",
    outcomes: [
      "Apply structured problem-solving frameworks",
      "Identify root causes and generate effective solutions",
      "Solve complex workplace challenges confidently",
      "Earn a GoalVow Problem Solving certificate",
    ],
    moduleSlugOrder: [
      "module-1-problem-solving-fundamentals",
      "module-2-problem-solving-in-the-workplace",
      "module-3-steps-to-problem-solving",
      "module-4-advanced-problem-solving",
    ],
  },
  {
    slug: "time-management",
    title: "Time Management",
    description:
      "Master your time and productivity. Develop concentration, goal-setting, scheduling, prioritisation, and overcoming time-wasting habits.",
    level: "Foundation",
    duration: "20 weeks",
    outcomes: [
      "Apply time management frameworks and goal-setting techniques",
      "Build concentration and prioritisation habits",
      "Overcome procrastination and time-wasting patterns",
      "Earn a GoalVow Time Management certificate",
    ],
    moduleSlugOrder: [
      "module-1-time-management-fundamentals",
      "module-2-goal-setting",
      "module-3-scheduling",
      "module-4-prioritization",
      "module-5-concentration",
      "module-6-overcoming-time-challenges",
    ],
  },
  {
    slug: "team-management",
    title: "Team Management",
    description:
      "Become the manager your team needs. Cover team fundamentals, delegation, culture, dynamics, conflict resolution, performance management, and remote leadership.",
    level: "Foundation",
    duration: "36 weeks",
    outcomes: [
      "Delegate tasks and develop high-performing teams",
      "Build strong team culture and manage dynamics",
      "Handle conflict, performance issues, and remote work effectively",
      "Earn a GoalVow Team Management certificate",
    ],
    moduleSlugOrder: [
      "module-1-team-management-fundamentals",
      "module-2-new-manager",
      "module-3-developing-your-team",
      "module-4-team-culture",
      "module-5-delegating-tasks",
      "module-6-motivating-your-team",
      "module-7-managing-remote-teams",
      "module-8-team-dynamics",
      "module-9-performance-management",
      "module-10-resolving-conflict",
      "module-11-letting-an-employee-go",
    ],
  },
  {
    slug: "critical-thinking",
    title: "Critical Thinking",
    description:
      "Sharpen your analytical mind. Build critical thinking fundamentals, information literacy, and the ability to apply reasoned thinking to any workplace challenge.",
    level: "Foundation",
    duration: "10 weeks",
    outcomes: [
      "Apply critical thinking frameworks to real problems",
      "Evaluate information sources and avoid cognitive biases",
      "Think clearly and communicate reasoning at work",
      "Earn a GoalVow Critical Thinking certificate",
    ],
    moduleSlugOrder: [
      "module-1-critical-thinking-fundamentals",
      "module-2-thinking-in-the-workplace",
      "module-3-critical-thinking-and-information-literacy",
    ],
  },
];

// ─── Microsoft Office Groupings ───────────────────────────────────────────────
// Each parent slug already exists in seed-data as a placeholder; it gets
// replaced by a rich course built from the individual lesson-course slugs below.

export const msOfficeGroupings: CourseGrouping[] = [
  {
    slug: "microsoft-word-basics",
    title: "Microsoft Word Basics",
    description:
      "Master the fundamentals of Microsoft Word — document creation, editing, formatting, tables, lists, references, and settings for professional output.",
    level: "Foundation",
    duration: "12 weeks",
    outcomes: [
      "Create and format professional Word documents",
      "Work with tables, lists, and references",
      "Manage document settings and styles",
      "Earn a GoalVow Microsoft Word certificate",
    ],
    moduleSlugOrder: [
      "working-with-word-objects",
      "managing-word-edits-and-document-layouts",
      "managing-word-documents-and-options",
      "inserting-and-managing-word-tables-and-lists",
      "managing-word-references-and-finalizing-word-documents",
      "updating-word-settings",
    ],
  },
  {
    slug: "microsoft-word-advance",
    title: "Microsoft Word Advanced",
    description:
      "Take your Word skills further — custom styles, templates, reusable content, macros, mail merge, and restricting editing for enterprise document workflows.",
    level: "Intermediate",
    duration: "12 weeks",
    outcomes: [
      "Create reusable templates and custom design elements",
      "Automate workflows with macros and mail merge",
      "Restrict editing and manage document security",
      "Earn a GoalVow Microsoft Word Advanced certificate",
    ],
    moduleSlugOrder: [
      "modifying-and-creating-document-style-and-templates",
      "creating-reusable-content-and-custom-design-elements",
      "creating-reference-tables-and-restricting-editing",
      "managing-document-content",
      "creating-and-managing-macros",
      "managing-customer-lists-and-creating-mailings",
    ],
  },
  {
    slug: "microsoft-excel-basics",
    title: "Microsoft Excel Basics",
    description:
      "Build a solid Excel foundation — worksheets, formatting, formulas, data transformation, visualisation, and print-ready workbook management.",
    level: "Foundation",
    duration: "16 weeks",
    outcomes: [
      "Navigate and format Excel workbooks with confidence",
      "Write essential formulas and transform data",
      "Visualise data with charts and prepare print-ready output",
      "Earn a GoalVow Microsoft Excel certificate",
    ],
    moduleSlugOrder: [
      "introduction-to-excel",
      "managing-worksheets-and-workbooks",
      "formatting-cells",
      "managing-tables-and-range-data",
      "using-formulas-and-functions",
      "getting-and-transforming-data",
      "visualizing-data",
      "preparing-to-print-and-checking-for-issues",
    ],
  },
  {
    slug: "microsoft-excel-advance",
    title: "Microsoft Excel Advanced",
    description:
      "Master advanced Excel techniques — data validation, auditing, advanced formulas, PivotTables, PivotCharts, macros, and collaborative workbooks.",
    level: "Intermediate",
    duration: "14 weeks",
    outcomes: [
      "Validate and audit complex Excel datasets",
      "Write advanced formulas and use PivotTables",
      "Automate tasks with simple macros",
      "Earn a GoalVow Microsoft Excel Advanced certificate",
    ],
    moduleSlugOrder: [
      "managing-and-formatting-data",
      "using-advanced-formulas",
      "validating-and-auditing-data",
      "analyzing-data",
      "using-simple-macros",
      "using-microsoft-pivottables-and-microsoft-pivotcharts",
      "collaborating-with-other-people",
    ],
  },
  {
    slug: "microsoft-power-point",
    title: "Microsoft PowerPoint",
    description:
      "Create compelling presentations from scratch — content, visuals, animations, slide masters, slideshow configuration, and professional delivery.",
    level: "Foundation",
    duration: "14 weeks",
    outcomes: [
      "Build structured presentations with professional design",
      "Add and work with advanced visuals and animations",
      "Configure and deliver polished slideshows",
      "Earn a GoalVow Microsoft PowerPoint certificate",
    ],
    moduleSlugOrder: [
      "introducing-the-powerpoint-fundamentals",
      "managing-content-on-slides",
      "adding-visuals-to-presentations",
      "working-with-advanced-visuals",
      "organizing-and-printing-presentations",
      "configuring-slideshows",
      "managing-slide-masters-and-presentation-settings",
    ],
  },
  {
    slug: "microsoft-outlook",
    title: "Microsoft Outlook",
    description:
      "Take control of your inbox and workday — email composition, organisation, automation, calendar management, contacts, tasks, and notes.",
    level: "Foundation",
    duration: "14 weeks",
    outcomes: [
      "Compose, organise, and automate email workflows",
      "Manage calendars, contacts, tasks, and notes efficiently",
      "Apply professional email practices in the workplace",
      "Earn a GoalVow Microsoft Outlook certificate",
    ],
    moduleSlugOrder: [
      "getting-started-with-outlook",
      "composing-and-managing-email",
      "organizing-email",
      "automating-messages",
      "managing-calendars",
      "creating-and-managing-contacts",
      "managing-tasks-and-notes",
    ],
  },
  {
    slug: "microsoft-access",
    title: "Microsoft Access",
    description:
      "Build and query relational databases. Cover data entry, structure design, queries, reporting, relationships, and presenting complex data insights.",
    level: "Intermediate",
    duration: "16 weeks",
    outcomes: [
      "Design and populate relational database structures",
      "Write queries to extract and analyse data",
      "Create reports and present complex data findings",
      "Earn a GoalVow Microsoft Access certificate",
    ],
    moduleSlugOrder: [
      "introduction-to-databases-and-microsoft-access",
      "adding-and-editing-data",
      "designing-and-setting-up-data-structure",
      "asking-questions-of-data",
      "understanding-reporting-basics",
      "defining-database-relationships",
      "asking-deeper-questions-of-data",
      "presenting-complex-data",
    ],
  },
];

/** All groupings combined — upskilling soft-skills + MS Office */
export const allGroupings: CourseGrouping[] = [
  ...upskillGroupings,
  ...msOfficeGroupings,
];

/**
 * Set of every child module slug that gets consumed into a parent group.
 * Used by buildGroupedCourses() to filter them from the flat course list.
 */
export const consumedSlugs: Set<string> = new Set(
  allGroupings.flatMap((g) => g.moduleSlugOrder)
);

/**
 * Parent placeholder slugs that exist in seed-data as minimal stubs
 * and should be replaced by the grouped version (MS Office parents).
 * Also consumed to avoid showing both the stub and the grouped version.
 */
export const parentPlaceholderSlugs: Set<string> = new Set(
  msOfficeGroupings.map((g) => g.slug)
);
