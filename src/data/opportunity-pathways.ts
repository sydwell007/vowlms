import type { CourseOpportunityPathways } from "@/types/lms";

/**
 * Real, course-specific "what this actually leads to" content — replaces the
 * old placeholder that showed the literal words "Employment", "Entrepreneurship",
 * and "Further study" on every single course regardless of subject.
 *
 * `employment` entries are the ones that will later be matched against real
 * PlugConnect job listings — keep them as real job/role titles, not vague
 * phrases, so that future matching has something concrete to match against.
 */

export const DEFAULT_OPPORTUNITY_PATHWAYS: CourseOpportunityPathways = {
  employment: ["Entry-level roles related to this course's subject area"],
  entrepreneurship: ["Apply what you learn to your own business or side income"],
  furtherStudy: ["A related certificate, diploma, or degree in this field"],
};

function cleanTitle(title: string): string {
  return title.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

// ─── Upskilling Academy — 20 learner-visible parent courses ───────────────────

export const UPSKILLING_OPPORTUNITY_PATHWAYS: Record<string, CourseOpportunityPathways> = {
  "business-ethics": {
    employment: ["Compliance Officer", "Corporate Governance Assistant", "HR Ethics & Conduct Officer", "Risk & Ethics Analyst"],
    entrepreneurship: ["Independent workplace-ethics and compliance training consultant", "Policy-advisory practice for SMEs without an in-house ethics function"],
    furtherStudy: ["Diploma or Degree in Corporate Governance", "Certificate in Business Ethics & Compliance", "Further study toward Law or Business Administration"],
  },
  "workplace-compliance": {
    employment: ["Health & Safety Officer", "Occupational Health & Safety (OHS) Coordinator", "Compliance Administrator", "Site Safety Representative"],
    entrepreneurship: ["Independent workplace health & safety auditor", "SME compliance-consulting practice"],
    furtherStudy: ["SAMTRAC or NEBOSH occupational health & safety certification", "Diploma in Safety Management", "National Certificate in Occupational Health & Safety"],
  },
  "organizational-culture": {
    employment: ["Diversity & Inclusion Officer", "People & Culture Coordinator", "Employee Engagement Specialist", "Internal Communications Officer"],
    entrepreneurship: ["Diversity, equity & inclusion training consultancy", "Team-culture and inclusion workshop facilitator"],
    furtherStudy: ["Diploma in Human Resource Management", "Certificate in Organisational Psychology", "Further study toward Industrial Psychology"],
  },
  "stress-management": {
    employment: ["Employee Wellness Officer", "Wellness Programme Coordinator", "HR Wellbeing Administrator"],
    entrepreneurship: ["Corporate wellness and stress-management workshop facilitator", "Independent wellness-coaching practice"],
    furtherStudy: ["Certificate in Workplace Wellness", "Diploma in Psychology or Counselling", "Further study toward Occupational Health"],
  },
  "cybersecurity": {
    employment: ["IT Security Analyst", "Security Operations Centre (SOC) Analyst", "IT Support Technician (Security-focused)", "Junior Cybersecurity Administrator"],
    entrepreneurship: ["Independent cybersecurity-awareness consultant for small businesses", "Freelance IT security auditor"],
    furtherStudy: ["CompTIA Security+ certification", "National Diploma in Information Technology", "Further study toward a BSc in Cybersecurity"],
  },
  "health-and-wellness": {
    employment: ["Wellness Programme Coordinator", "Employee Assistance Programme (EAP) Administrator", "Health Promotion Officer"],
    entrepreneurship: ["Independent wellness coach", "Corporate wellbeing workshop facilitator"],
    furtherStudy: ["Certificate in Health Promotion", "Diploma in Psychology", "Further study toward Occupational Health & Safety"],
  },
  "human-resources": {
    employment: ["HR Officer", "Recruitment Coordinator", "Talent Acquisition Assistant", "HR Generalist"],
    entrepreneurship: ["Independent recruitment agency", "HR-consulting practice for SMEs"],
    furtherStudy: ["Diploma or Degree in Human Resource Management", "SABPP-aligned HR certification", "Further study toward Industrial Psychology"],
  },
  "marketing": {
    employment: ["Digital Marketing Coordinator", "Social Media Manager", "SEO Specialist", "Marketing Assistant"],
    entrepreneurship: ["Freelance digital-marketing consultant", "Social-media management agency for local businesses"],
    furtherStudy: ["Diploma or Degree in Marketing", "Google and Meta digital-marketing certifications", "Further study toward a Digital Marketing specialisation"],
  },
  "sales": {
    employment: ["Sales Representative", "Business Development Executive", "Account Manager", "Telesales Consultant"],
    entrepreneurship: ["Independent sales agent or broker", "Launch your own product or service sales business"],
    furtherStudy: ["Diploma in Sales & Marketing", "Professional selling-skills certification", "Further study toward a Business degree"],
  },
  "project-management": {
    employment: ["Junior Project Coordinator", "Project Administrator", "Project Management Office (PMO) Assistant"],
    entrepreneurship: ["Independent project-management consultant", "Freelance project coordinator for SMEs"],
    furtherStudy: ["PMI CAPM or PMP certification pathway", "Diploma in Project Management", "Further study toward a Project Management degree"],
  },
  "customer-service": {
    employment: ["Customer Service Representative", "Contact Centre Agent", "Client Support Officer"],
    entrepreneurship: ["Independent customer-experience consultant", "Outsourced customer-support service for SMEs"],
    furtherStudy: ["Certificate in Customer Experience Management", "Diploma in Business Administration", "Further study toward Communications"],
  },
  "career-management": {
    employment: ["Career Development Officer", "Recruitment Coordinator", "HR Administrator"],
    entrepreneurship: ["Independent career coach", "CV-writing and job-placement consultancy"],
    furtherStudy: ["Certificate in Career Counselling", "Diploma in Human Resource Management", "Further study toward Industrial Psychology"],
  },
  "change-management": {
    employment: ["Change Management Analyst", "Organisational Development Coordinator", "Internal Communications Officer"],
    entrepreneurship: ["Independent change-management consultant", "Organisational-development advisory practice"],
    furtherStudy: ["Prosci change-management certification", "Diploma in Organisational Development", "Further study toward Business Administration"],
  },
  "communication": {
    employment: ["Internal Communications Officer", "Corporate Communications Assistant", "Public Relations Coordinator"],
    entrepreneurship: ["Freelance copywriter or communications consultant", "Presentation and public-speaking coaching practice"],
    furtherStudy: ["Diploma or Degree in Communication Science", "Certificate in Public Relations", "Further study toward Journalism or Media Studies"],
  },
  "leadership": {
    employment: ["Team Leader", "Supervisor", "Junior Manager", "Leadership Development Coordinator"],
    entrepreneurship: ["Independent leadership-coaching practice", "Corporate leadership-workshop facilitator"],
    furtherStudy: ["Diploma or Degree in Business Leadership", "Executive/management development programme", "Further study toward an MBA pathway"],
  },
  "resilience": {
    employment: ["Employee Wellness Officer", "HR Wellbeing Coordinator", "People & Culture Assistant"],
    entrepreneurship: ["Independent resilience and mindset coach", "Workplace-resilience workshop facilitator"],
    furtherStudy: ["Certificate in Positive Psychology", "Diploma in Psychology", "Further study toward Occupational Health"],
  },
  "problem-solving": {
    employment: ["Business Analyst", "Operations Coordinator", "Process Improvement Assistant"],
    entrepreneurship: ["Independent business-process consultant", "Freelance operations-troubleshooting service"],
    furtherStudy: ["Certificate in Business Analysis", "Diploma in Operations Management", "Further study toward Industrial Engineering"],
  },
  "time-management": {
    employment: ["Operations Administrator", "Executive Assistant", "Office or Team Coordinator"],
    entrepreneurship: ["Independent productivity coach", "Virtual-assistant or administrative-support business"],
    furtherStudy: ["Certificate in Business Administration", "Diploma in Office Management", "Further study toward Management Studies"],
  },
  "team-management": {
    employment: ["Team Leader", "Line Manager", "Operations Supervisor", "People Manager"],
    entrepreneurship: ["Independent management-coaching practice", "Team-building and facilitation business"],
    furtherStudy: ["Diploma or Degree in Business Management", "Management development programme", "Further study toward an MBA pathway"],
  },
  "critical-thinking": {
    employment: ["Business/Research Analyst", "Quality Assurance Assistant", "Junior Strategy Analyst"],
    entrepreneurship: ["Independent research and analysis consultant", "Freelance strategy-advisory service"],
    furtherStudy: ["Diploma or Degree in Business or Data Analysis", "Certificate in Critical & Analytical Thinking", "Further study toward a Research Methods qualification"],
  },
};

// ─── GoalVow Business School — admin-only preview ─────────────────────────────

export const BUSINESS_SCHOOL_OPPORTUNITY_PATHWAYS: Record<string, CourseOpportunityPathways> = {
  "starting-a-business-in-africa": {
    employment: ["Business Development Officer", "SME Support Officer", "Enterprise Development Coordinator"],
    entrepreneurship: ["Launch your own SME", "Franchise a proven local business model"],
    furtherStudy: ["Diploma in Entrepreneurship", "Further study toward a Business degree"],
  },
  "lean-startup-fundamentals": {
    employment: ["Startup Operations Associate", "Product/Innovation Coordinator"],
    entrepreneurship: ["Launch and iterate your own lean startup", "Build a minimum-viable-product-based side business"],
    furtherStudy: ["Certificate in Innovation Management", "Further study toward Entrepreneurship & Innovation"],
  },
  "business-model-design": {
    employment: ["Business Analyst", "Strategy Coordinator"],
    entrepreneurship: ["Design and launch a new business model", "Advise SMEs on business-model innovation"],
    furtherStudy: ["Diploma in Business Strategy", "Further study toward an MBA pathway"],
  },
  "cloud-tools-for-managers": {
    employment: ["Digital Operations Coordinator", "IT-enabled Business Administrator"],
    entrepreneurship: ["Cloud-tools consulting for SMEs migrating to digital operations"],
    furtherStudy: ["Certificate in Cloud Computing for Business", "Further study toward an IT or Business degree"],
  },
  "data-analytics-for-decision-making": {
    employment: ["Business Analyst", "Data Analyst", "Reporting & Insights Coordinator"],
    entrepreneurship: ["Freelance data-analytics consultant for SMEs"],
    furtherStudy: ["Diploma in Data Analytics", "Further study toward a BSc in Data Science"],
  },
  "ai-for-business": {
    employment: ["AI/Automation Coordinator", "Digital Transformation Assistant"],
    entrepreneurship: ["AI-adoption consulting for local businesses"],
    furtherStudy: ["Certificate in Applied AI for Business", "Further study toward Data Science or AI"],
  },
  "financial-planning-basics": {
    employment: ["Junior Financial Planner", "Personal Finance Administrator"],
    entrepreneurship: ["Independent financial-planning and budgeting coaching practice"],
    furtherStudy: ["Certificate in Financial Planning", "Further study toward a Financial Planning degree or CFP designation"],
  },
  "quick-books-amp-business-accounting": {
    employment: ["Junior Bookkeeper", "Accounts Administrator"],
    entrepreneurship: ["Freelance bookkeeping service for small businesses"],
    furtherStudy: ["Diploma in Accounting", "Further study toward a SAIPA or SAICA-aligned accounting qualification"],
  },
  "financial-literacy-for-non-finance-managers": {
    employment: ["Operations or Business Administrator with budget responsibility"],
    entrepreneurship: ["Manage your own business's finances with confidence"],
    furtherStudy: ["Certificate in Business Finance", "Further study toward a Finance degree or MBA pathway"],
  },
  "sales-mastery": {
    employment: ["Senior Sales Consultant", "Business Development Manager"],
    entrepreneurship: ["Build a sales-driven business or agency"],
    furtherStudy: ["Diploma in Sales & Marketing", "Further study toward a Business degree"],
  },
  "brand-storytelling": {
    employment: ["Brand/Content Coordinator", "Copywriter"],
    entrepreneurship: ["Freelance brand-storytelling or content agency"],
    furtherStudy: ["Diploma in Marketing or Communications", "Further study toward Brand Management"],
  },
  "social-media-strategy": {
    employment: ["Social Media Coordinator", "Community Manager"],
    entrepreneurship: ["Social-media management agency for local businesses"],
    furtherStudy: ["Certificate in Digital Marketing", "Further study toward a Marketing degree"],
  },
  "leading-hybrid-teams": {
    employment: ["Team Lead or People Manager in a hybrid workplace"],
    entrepreneurship: ["Hybrid-team management consulting and training"],
    furtherStudy: ["Diploma in Business Management", "Further study toward Leadership or an MBA pathway"],
  },
  "time-management-business-school": {
    employment: ["Executive Assistant", "Operations Coordinator"],
    entrepreneurship: ["Independent productivity-coaching practice"],
    furtherStudy: ["Certificate in Business Administration", "Further study toward Management Studies"],
  },
  "communication-for-impact": {
    employment: ["Corporate Communications Officer", "Public Relations Assistant"],
    entrepreneurship: ["Public-speaking and communications coaching business"],
    furtherStudy: ["Diploma in Communication Science", "Further study toward Journalism or Media Studies"],
  },
  "diploma-in-people-amp-organizational-leadership": {
    employment: ["People & Culture Manager", "Organisational Development Officer"],
    entrepreneurship: ["Leadership and organisational-development consulting practice"],
    furtherStudy: ["Further study toward a Master's in Organisational Leadership or an MBA"],
  },
  "diploma-in-financial-analysis-amp-investment": {
    employment: ["Financial Analyst", "Investment Administrator"],
    entrepreneurship: ["Independent financial-analysis and advisory practice"],
    furtherStudy: ["Further study toward the CFA charter or a Finance/Investment degree"],
  },
  "diploma-in-marketing-strategy-amp-brand-leadership": {
    employment: ["Marketing Strategist", "Brand Manager"],
    entrepreneurship: ["Brand-strategy consultancy"],
    furtherStudy: ["Further study toward a Marketing Master's or MBA"],
  },
  "diploma-in-digital-business-transformation": {
    employment: ["Digital Transformation Coordinator", "Business Systems Analyst"],
    entrepreneurship: ["Digital-transformation consulting for SMEs"],
    furtherStudy: ["Further study toward an MBA with a Digital/Technology focus"],
  },
  "diploma-in-business-management-amp-operations": {
    employment: ["Operations Manager", "Business Manager"],
    entrepreneurship: ["Run your own SME's day-to-day operations with confidence"],
    furtherStudy: ["Further study toward an MBA"],
  },
  "african-business-fellowship": {
    employment: ["Pan-African Business Development roles", "Trade & Market-entry Coordinator"],
    entrepreneurship: ["Cross-border or regional African trade venture"],
    furtherStudy: ["Further study toward International Business or Trade"],
  },
  "innovation-amp-strategy-program": {
    employment: ["Innovation Manager", "Corporate Strategy Analyst"],
    entrepreneurship: ["Launch an innovation-led venture"],
    furtherStudy: ["Further study toward an MBA with a Strategy/Innovation focus"],
  },
  "executive-mba-emba": {
    employment: ["Senior Manager", "Executive/C-suite-track roles"],
    entrepreneurship: ["Scale or professionalise an existing business at executive level"],
    furtherStudy: ["Further doctoral or executive-education study (DBA)"],
  },
  "executive-leadership-program-elp": {
    employment: ["Senior Leadership and Executive roles"],
    entrepreneurship: ["Lead your own enterprise at executive maturity"],
    furtherStudy: ["Further study toward a DBA or specialised executive-education programme"],
  },
};

// ─── GoalVow University Online — admin-only preview ───────────────────────────

export const UNIVERSITY_ONLINE_OPPORTUNITY_PATHWAYS: Record<string, CourseOpportunityPathways> = {
  "bsc-in-artificial-intelligence-amp-data-science": {
    employment: ["AI/Machine Learning Engineer", "Data Scientist", "Data Analyst"],
    entrepreneurship: ["Launch an AI-powered product or data-consulting startup"],
    furtherStudy: ["Honours or Master's in Data Science or AI", "Postgraduate research in Machine Learning"],
  },
  "bsc-in-software-development-cloud-cybersecurity-robotics": {
    employment: ["Software Developer", "Cloud Engineer", "Cybersecurity Analyst", "Robotics/Automation Engineer"],
    entrepreneurship: ["Build and launch your own software product or tech startup"],
    furtherStudy: ["Honours or Master's in Computer Science", "Specialised Cloud/Security certifications (AWS, Azure, CISSP)"],
  },
  "bba-bachelor-of-business-administration": {
    employment: ["Business Administrator", "Operations Manager", "Management Trainee"],
    entrepreneurship: ["Start and run your own business"],
    furtherStudy: ["MBA", "Honours in Business Management"],
  },
  "bachelor-of-commerce-in-entrepreuship-amp-innovation": {
    employment: ["Innovation Manager", "Business Development Officer", "Venture/Incubator Analyst"],
    entrepreneurship: ["Launch a venture-backed or bootstrapped startup"],
    furtherStudy: ["Honours in Entrepreneurship", "MBA with an Innovation focus"],
  },
  "bachelor-of-education-edtech-amp-elearning-focus": {
    employment: ["Teacher", "Instructional Designer", "eLearning Content Developer", "EdTech Coordinator"],
    entrepreneurship: ["Launch an online tutoring or eLearning content business"],
    furtherStudy: ["Honours or Master's in Education", "Postgraduate Certificate in Education (PGCE)"],
  },
  "bachelor-of-design-and-digital-media": {
    employment: ["Graphic/UX Designer", "Digital Media Producer", "Motion Designer"],
    entrepreneurship: ["Freelance design studio or digital-media agency"],
    furtherStudy: ["Honours in Design", "Master's in Digital Media or UX Design"],
  },
  "bachelor-of-communication-amp-marketing-digital-focus": {
    employment: ["Digital Marketing Specialist", "Communications Officer", "Brand Manager"],
    entrepreneurship: ["Digital-marketing agency", "Personal-brand or content business"],
    furtherStudy: ["Honours in Marketing or Communication", "Master's in Digital Marketing"],
  },
  "bachelor-of-finance-amp-investment-technology": {
    employment: ["Financial Analyst", "Fintech Product Analyst", "Investment Administrator"],
    entrepreneurship: ["Fintech startup", "Independent investment-advisory practice"],
    furtherStudy: ["CFA charter pathway", "Honours or Master's in Finance"],
  },
  "bachelor-of-public-health-digital-health-systems": {
    employment: ["Public Health Officer", "Health Systems Analyst", "Digital Health Coordinator"],
    entrepreneurship: ["Health-tech or telehealth venture"],
    furtherStudy: ["Honours or Master's in Public Health", "Postgraduate study in Health Informatics"],
  },
  "bachelor-of-environmental-amp-sustainable-development": {
    employment: ["Environmental Officer", "Sustainability Analyst", "ESG Coordinator"],
    entrepreneurship: ["Green/sustainability consulting or circular-economy venture"],
    furtherStudy: ["Honours or Master's in Environmental Management", "Postgraduate study in Sustainable Development"],
  },
};

// ─── GoalVow Private School — admin-only preview ──────────────────────────────
// K-12 subjects, so pathways are framed as the long-term destinations this
// foundation supports rather than jobs available immediately.

export const PRIVATE_SCHOOL_OPPORTUNITY_PATHWAYS: Record<string, CourseOpportunityPathways> = {
  "physical-education": {
    employment: ["Sports Coach", "Physical Education Teacher", "Fitness Trainer", "Physiotherapist (with further study)"],
    entrepreneurship: ["Personal-training or youth sports-coaching business, later in life"],
    furtherStudy: ["High School Life Orientation/Sport pathway", "Sport Science or Physiotherapy degree"],
  },
  "art": {
    employment: ["Graphic Designer", "Illustrator", "Art Teacher (with further study)"],
    entrepreneurship: ["Independent artist or design studio"],
    furtherStudy: ["High School Visual Arts", "Fine Art or Design degree"],
  },
  "music": {
    employment: ["Music Teacher", "Performing Musician", "Sound/Audio Technician (with further study)"],
    entrepreneurship: ["Independent music tutor or performing artist"],
    furtherStudy: ["High School Music", "Music or Performing Arts degree"],
  },
  "elementary-sign-language": {
    employment: ["Sign Language Interpreter", "Deaf-education Support Practitioner (with further study)"],
    entrepreneurship: ["Independent sign-language tutoring or interpreting service"],
    furtherStudy: ["Further South African Sign Language study", "SASL Interpreting qualification"],
  },
  "language-arts-term-1": {
    employment: ["Writer", "Editor", "Teacher", "Communications Officer (with further study)"],
    entrepreneurship: ["Freelance writing or tutoring business"],
    furtherStudy: ["High School Home Language/English", "Degree in Languages, Communication, or Education"],
  },
  "language-arts-term-2": {
    employment: ["Writer", "Editor", "Teacher", "Communications Officer (with further study)"],
    entrepreneurship: ["Freelance writing or tutoring business"],
    furtherStudy: ["High School Home Language/English", "Degree in Languages, Communication, or Education"],
  },
  "mathematics-term-1": {
    employment: ["Roles in Engineering, Accounting, or Data Analysis (with further study)"],
    entrepreneurship: ["Maths tutoring business"],
    furtherStudy: ["High School Mathematics", "Engineering, Accounting, or Data Science degree"],
  },
  "mathematics-term-2": {
    employment: ["Roles in Engineering, Accounting, or Data Analysis (with further study)"],
    entrepreneurship: ["Maths tutoring business"],
    furtherStudy: ["High School Mathematics", "Engineering, Accounting, or Data Science degree"],
  },
  "science-term-1": {
    employment: ["Roles in Health Sciences, Engineering, or Research (with further study)"],
    entrepreneurship: ["Science tutoring business"],
    furtherStudy: ["High School Physical/Life Sciences", "Health Sciences, Engineering, or Research degree"],
  },
  "science-term-2": {
    employment: ["Roles in Health Sciences, Engineering, or Research (with further study)"],
    entrepreneurship: ["Science tutoring business"],
    furtherStudy: ["High School Physical/Life Sciences", "Health Sciences, Engineering, or Research degree"],
  },
};

// ─── Skills Training Academy — 98 real occupational-qualification titles ──────
// Each course title is already a real, registered SA occupational title, so
// rather than hand-author 98 near-duplicate entries, each is matched against
// a real trade/sector category and given tailored (not generic) pathways —
// the exact course title always leads as the concrete employment answer.

type SkillsCategory = {
  test: RegExp;
  build: (title: string) => CourseOpportunityPathways;
};

const SKILLS_CATEGORIES: SkillsCategory[] = [
  {
    test: /clean|ablution|kitchenette|all-rounder|floor surface/i,
    build: (title) => ({
      employment: [title, "Facilities & Hygiene Supervisor", "Cleaning Services Team Leader"],
      entrepreneurship: ["Independent contract-cleaning business", "Specialised commercial-cleaning service"],
      furtherStudy: ["NQF-registered Cleaning & Hygiene occupational certificate", "Further study toward a Facilities Management learnership"],
    }),
  },
  {
    test: /recycl|paper and packaging collector/i,
    build: (title) => ({
      employment: [title, "Waste Management Coordinator", "Materials Recovery Facility Operator"],
      entrepreneurship: ["Own recycling or waste-collection micro-business", "Buy-back centre operator"],
      furtherStudy: ["Occupational certificate in Waste Management", "Further study toward an Environmental/Circular-economy learnership"],
    }),
  },
  {
    test: /textile|fibre|beam house|sewing machine|saddle stitch|winding|creeling|warping|carding|tissue winder|wet mill|dry mill/i,
    build: (title) => ({
      employment: [title, "Textile Production Supervisor", "Quality Control Inspector (Textiles)"],
      entrepreneurship: ["Independent textile/garment repair or alteration service", "Small-scale textile production business"],
      furtherStudy: ["NQF-registered Textile Manufacturing occupational certificate", "Further study toward a Production/Operations Management learnership"],
    }),
  },
  {
    test: /mechanic|repairer|clutch|brake|engine|drive train|suspension|battery fitter|auto-electrical|vehicle air conditioning|workshop assistant|tractor/i,
    build: (title) => ({
      employment: [title, "Motor Workshop Technician", "Vehicle Service Advisor"],
      entrepreneurship: ["Independent auto-repair workshop", "Mobile vehicle-maintenance service"],
      furtherStudy: ["merSETA-registered Motor Mechanic trade-test pathway", "Further study toward an Automotive Engineering learnership"],
    }),
  },
  {
    test: /air conditioning|refrigeration|refrigerant|hvac|evaporative cooling/i,
    build: (title) => ({
      employment: [title, "HVAC Technician", "Refrigeration Service Supervisor"],
      entrepreneurship: ["Independent air-conditioning and refrigeration installation & repair business"],
      furtherStudy: ["Occupational trade certificate in Refrigeration & Air Conditioning", "Further study toward a Mechanical Engineering learnership"],
    }),
  },
  {
    test: /abattoir|kitchen hand|ice cream|dried dairy|perishable goods/i,
    build: (title) => ({
      employment: [title, "Food Production Supervisor", "Quality Assurance Assistant (Food)"],
      entrepreneurship: ["Small-scale food-production or catering business"],
      furtherStudy: ["Occupational certificate in Food & Beverage Processing", "Further study toward a Food Technology learnership"],
    }),
  },
  {
    test: /non-destructive|testing operator|compliance verifier/i,
    build: (title) => ({
      employment: [title, "Quality Assurance Inspector", "Non-Destructive Testing Technician"],
      entrepreneurship: ["Independent inspection and testing consultancy"],
      furtherStudy: ["NDT Level 1/2 certification pathway", "Further study toward a Quality Management learnership"],
    }),
  },
  {
    test: /mining|mineral|scraper winch|log yard/i,
    build: (title) => ({
      employment: [title, "Mine Production Supervisor", "Mineral Processing Assistant"],
      entrepreneurship: ["Independent mining-support services contractor"],
      furtherStudy: ["MQA-registered occupational certificate", "Further study toward a Mining Engineering learnership"],
    }),
  },
  {
    test: /carton|lithography|screen-maker|pre-press/i,
    build: (title) => ({
      employment: [title, "Print Production Supervisor", "Packaging Quality Controller"],
      entrepreneurship: ["Small print or packaging production business"],
      furtherStudy: ["Occupational certificate in Print & Packaging", "Further study toward a Production Management learnership"],
    }),
  },
  {
    test: /telecommunications|cable jointer|marine electro|duct work/i,
    build: (title) => ({
      employment: [title, "Field Technician", "Installation Supervisor"],
      entrepreneurship: ["Independent installation and maintenance contracting business"],
      furtherStudy: ["merSETA/ECSA-aligned Electrical or Telecommunications trade certificate", "Further study toward an Electrical Engineering learnership"],
    }),
  },
  {
    test: /personal care|hairdresser|pharmacist|health promotion|patrol officer|first aid responder/i,
    build: (title) => ({
      employment: [title, "Community Health Worker", "Care Services Coordinator"],
      entrepreneurship: ["Independent care or personal-services practice", "Own salon, clinic-support, or home-care business"],
      furtherStudy: ["Occupational certificate in Community Health/Personal Care", "Further study toward Nursing or Health Sciences"],
    }),
  },
  {
    test: /insurance claims|transport clerk|freight handler|bench worker/i,
    build: (title) => ({
      employment: [title, "Claims/Operations Administrator", "Logistics Coordinator"],
      entrepreneurship: ["Independent logistics, courier, or claims-assessing practice"],
      furtherStudy: ["Occupational certificate in Insurance or Logistics", "Further study toward Supply Chain Management"],
    }),
  },
  {
    test: /aquaculture/i,
    build: (title) => ({
      employment: [title, "Aquaculture Production Supervisor", "Fisheries/Farm Manager"],
      entrepreneurship: ["Independent small-scale aquaculture or fish-farming business"],
      furtherStudy: ["Occupational certificate in Aquaculture", "Further study toward Agricultural Sciences"],
    }),
  },
  {
    test: /glass forming|container glass|plastics manufacturing|metal manufacturing/i,
    build: (title) => ({
      employment: [title, "Production Line Supervisor", "Manufacturing Quality Controller"],
      entrepreneurship: ["Small-scale manufacturing or production business"],
      furtherStudy: ["Occupational certificate in Manufacturing/Production", "Further study toward Industrial Engineering"],
    }),
  },
  {
    test: /marimba maker|steelpan maker/i,
    build: (title) => ({
      employment: [title, "Musical-Instrument Workshop Technician"],
      entrepreneurship: ["Independent instrument-making or repair business"],
      furtherStudy: ["Occupational craft-trade certificate", "Further study toward Fine Craft or Design"],
    }),
  },
  {
    test: /end user computing/i,
    build: (title) => ({
      employment: [title, "IT Support Technician", "Office/Digital Skills Administrator"],
      entrepreneurship: ["Independent computer-training or IT-support business"],
      furtherStudy: ["Further study toward Information Technology or Computer Science"],
    }),
  },
  {
    test: /spatial intelligence data scientist/i,
    build: (title) => ({
      employment: [title, "GIS/Spatial Data Analyst", "Data Scientist"],
      entrepreneurship: ["Independent geospatial-analytics consultancy"],
      furtherStudy: ["Further study toward a BSc in Data Science or GIS"],
    }),
  },
  {
    test: /chainsaw operator/i,
    build: (title) => ({
      employment: [title, "Arborist / Tree-Felling Operator", "Forestry Services Technician"],
      entrepreneurship: ["Independent tree-felling or arborist business"],
      furtherStudy: ["Occupational certificate in Forestry or Arboriculture"],
    }),
  },
  {
    test: /dozer operator|winding engine driver/i,
    build: (title) => ({
      employment: [title, "Heavy Equipment Operations Supervisor"],
      entrepreneurship: ["Independent plant/heavy-equipment operating contractor"],
      furtherStudy: ["Occupational plant-operator trade certificate", "Further study toward a Construction/Mining learnership"],
    }),
  },
];

function generateSkillsTrainingPathways(rawTitle: string): CourseOpportunityPathways {
  const title = cleanTitle(rawTitle);
  const category = SKILLS_CATEGORIES.find((c) => c.test.test(title));
  if (category) return category.build(title);

  // No sector match — still lead with the real occupational title rather
  // than a generic phrase.
  return {
    employment: [title, "Related Production/Operations Supervisor role"],
    entrepreneurship: [`Independent, self-employed ${title.toLowerCase()} service`],
    furtherStudy: ["NQF-registered occupational certificate or trade-test pathway in this field", "Further learnership or artisan development"],
  };
}

// ─── Lookup ────────────────────────────────────────────────────────────────────

const OTHER_ACADEMY_LOOKUPS: Record<string, Record<string, CourseOpportunityPathways>> = {
  "business-school": BUSINESS_SCHOOL_OPPORTUNITY_PATHWAYS,
  "university-online": UNIVERSITY_ONLINE_OPPORTUNITY_PATHWAYS,
  "private-school": PRIVATE_SCHOOL_OPPORTUNITY_PATHWAYS,
};

/**
 * Resolves the real opportunity pathways for a course. Falls back to the
 * honest generic default for content that isn't real top-level course
 * content yet (e.g. Chef Academy's raw per-recipe Moodle imports, which are
 * lesson-level fragments, not courses, until they get a grouping pass like
 * Upskilling already had).
 */
export function getOpportunityPathways(course: { slug: string; title: string; academySlug: string }): CourseOpportunityPathways {
  if (course.academySlug === "upskilling-academy" && UPSKILLING_OPPORTUNITY_PATHWAYS[course.slug]) {
    return UPSKILLING_OPPORTUNITY_PATHWAYS[course.slug];
  }

  const otherLookup = OTHER_ACADEMY_LOOKUPS[course.academySlug];
  if (otherLookup?.[course.slug]) return otherLookup[course.slug];

  if (course.academySlug === "skills-training-academy") {
    return generateSkillsTrainingPathways(course.title);
  }

  return DEFAULT_OPPORTUNITY_PATHWAYS;
}
