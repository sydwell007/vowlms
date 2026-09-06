import type { CoursePreviewContent } from "@/types/lms";

/**
 * Course Preview marketing copy — real, course-specific "why this, why now"
 * content for the 20 Upskilling Academy courses. Deliberately distinct from
 * `outcomes` (skills you'll gain): this is framed around career and life
 * impact, written to persuade someone to enrol.
 */
export const COURSE_PREVIEW_CONTENT: Record<string, CoursePreviewContent> = {
  "business-ethics": {
    purpose:
      "Every workplace faces ethical grey areas — this course gives you the judgement and confidence to navigate them the right way, protecting your reputation and your organisation's integrity.",
    benefits: [
      "Build a reputation as someone colleagues and leaders trust with hard decisions",
      "Recognise ethical red flags before they become costly problems",
      "Stand out to employers who prioritise integrity and governance",
      "Earn a certificate that signals real ethical leadership, not just compliance box-ticking",
    ],
  },
  "workplace-compliance": {
    purpose:
      "Health, safety, and workplace-conduct rules aren't optional — this course turns compliance from a fear-driven checklist into a skill that protects you, your colleagues, and your career.",
    benefits: [
      "Walk into any workplace knowing your rights and responsibilities",
      "Spot safety risks before they cause harm or liability",
      "Become the go-to person for compliance questions on your team",
      "Reduce your own exposure to workplace incidents and disputes",
    ],
  },
  "organizational-culture": {
    purpose:
      "Diverse, inclusive teams outperform — this course equips you to build the kind of workplace culture people actually want to be part of, and to thrive within one yourself.",
    benefits: [
      "Communicate confidently and respectfully across cultural differences",
      "Become a driver of inclusion, not just a bystander",
      "Strengthen your standing as an emotionally intelligent teammate or leader",
      "Contribute directly to a healthier, higher-performing workplace",
    ],
  },
  "stress-management": {
    purpose:
      "Burnout costs careers and health — this course gives you practical, evidence-based tools to stay resilient, focused, and well under real workplace pressure.",
    benefits: [
      "Protect your mental health and long-term career sustainability",
      "Perform better under deadlines and pressure instead of freezing up",
      "Recognise your own stress signals before they become a crisis",
      "Bring calm, steady presence to a stressed team",
    ],
  },
  "cybersecurity": {
    purpose:
      "Every employee is now a frontline defender against cyber threats — this course gives you the awareness and skills to protect yourself and your organisation from real, costly attacks.",
    benefits: [
      "Become the person your team trusts to spot a phishing attempt",
      "Add a genuinely in-demand, future-proof skill to your CV",
      "Protect your own data, identity, and devices with confidence",
      "Open the door to entry-level IT security roles",
    ],
  },
  "health-and-wellness": {
    purpose:
      "Sustainable performance starts with wellbeing — this course builds the mental and physical foundations that let you show up fully, at work and in life.",
    benefits: [
      "Build daily habits that genuinely stick, not quick fixes",
      "Strengthen your emotional resilience for tough days",
      "Bring real wellness leadership to your team or workplace",
      "Invest in your long-term health, not just short-term productivity",
    ],
  },
  "human-resources": {
    purpose:
      "Great organisations are built on great people practices — this course gives you a genuine end-to-end grounding in modern HR, from hiring to wellbeing to compliance.",
    benefits: [
      "Build a real foundation for an HR career, not just theory",
      "Learn to hire, manage, and support people fairly and confidently",
      "Understand the compliance side of HR that protects both people and business",
      "Position yourself for HR administrator and coordinator roles",
    ],
  },
  "marketing": {
    purpose:
      "From brand strategy to paid ads to analytics — this course builds a complete, modern marketing skill set that businesses are actively hiring for right now.",
    benefits: [
      "Go from marketing theory to campaigns you can actually run",
      "Cover the full modern stack: content, SEO, social, email, paid, analytics",
      "Build a portfolio-ready skill set for freelance or agency work",
      "Make data-informed decisions instead of guessing what works",
    ],
  },
  "sales": {
    purpose:
      "Sales skills transfer everywhere — this course builds the complete toolkit to prospect, present, and close with confidence, in any industry.",
    benefits: [
      "Turn cold conversations into genuine, closed opportunities",
      "Handle objections without losing the deal or your composure",
      "Build a repeatable sales process instead of relying on luck",
      "Open doors to sales, business development, and account roles",
    ],
  },
  "project-management": {
    purpose:
      "Every industry needs people who can take a project from idea to delivery — this course gives you the frameworks real project managers use every day.",
    benefits: [
      "Learn the same frameworks used in PMI-aligned project management",
      "Confidently manage scope, schedule, risk, and stakeholders",
      "Turn chaotic projects into structured, trackable delivery",
      "Build a foundation for a Project Coordinator or PMO career path",
    ],
  },
  "customer-service": {
    purpose:
      "Exceptional service turns customers into advocates — this course builds the communication and problem-solving skills that set great service teams apart.",
    benefits: [
      "Handle difficult customers and complaints without losing your cool",
      "Communicate clearly across channels and cultures",
      "Become the team member who actually improves customer satisfaction",
      "Build genuinely transferable, in-demand service skills",
    ],
  },
  "career-management": {
    purpose:
      "Your career doesn't manage itself — this course puts you back in the driver's seat with real tools for growth, networking, and navigating the modern job market.",
    benefits: [
      "Get real clarity on your strengths and where they can take you",
      "Build a professional network that actually opens doors",
      "Navigate job searches, interviews, and career changes with confidence",
      "Take ownership of your career instead of waiting for opportunity",
    ],
  },
  "change-management": {
    purpose:
      "Change is constant — this course gives you the frameworks and communication skills to lead through it instead of being disrupted by it.",
    benefits: [
      "Lead teams through uncertainty without losing trust or momentum",
      "Apply proven change-management models to real workplace shifts",
      "Communicate change in a way that reduces resistance",
      "Become the calm, capable presence during organisational disruption",
    ],
  },
  "communication": {
    purpose:
      "Clear communication is the skill behind every other skill — this course sharpens how you speak, write, present, and negotiate in high-stakes moments.",
    benefits: [
      "Speak and write with clarity, confidence, and real impact",
      "Handle difficult conversations without damaging relationships",
      "Present and negotiate like someone people want to listen to",
      "Make this the single most transferable skill on your CV",
    ],
  },
  "leadership": {
    purpose:
      "Leadership isn't a title, it's a set of skills — this course builds the emotional intelligence and practical toolkit to lead people through calm and crisis alike.",
    benefits: [
      "Build genuine influence, not just positional authority",
      "Lead confidently through crisis, change, and conflict",
      "Develop the emotional intelligence great leaders are known for",
      "Position yourself for your first, or next, leadership role",
    ],
  },
  "resilience": {
    purpose:
      "Setbacks are inevitable — resilience determines whether they stop you or shape you. This course builds the emotional and career resilience to keep moving forward.",
    benefits: [
      "Bounce back faster from setbacks, criticism, and failure",
      "Build genuine emotional and physical resilience, not just coping",
      "Lead yourself and others through adversity with confidence",
      "Turn challenges into career-defining growth instead of burnout",
    ],
  },
  "problem-solving": {
    purpose:
      "Every role rewards people who can think clearly under pressure — this course builds a systematic approach to solving real workplace challenges.",
    benefits: [
      "Move from guessing to structured, repeatable problem-solving",
      "Get to root causes instead of treating symptoms",
      "Become the person colleagues bring hard problems to",
      "Build a skill that's valuable in literally every industry",
    ],
  },
  "time-management": {
    purpose:
      "Productivity isn't about doing more — it's about doing what matters. This course builds real habits for focus, prioritisation, and getting things done.",
    benefits: [
      "Stop procrastination and time-wasting patterns for good",
      "Prioritise what actually moves the needle, not just what's urgent",
      "Build sustainable focus and scheduling habits",
      "Get more done without burning out doing it",
    ],
  },
  "team-management": {
    purpose:
      "Managing people is a completely different skill from doing the work yourself — this course builds the full toolkit today's managers need, including remote teams.",
    benefits: [
      "Go from individual contributor to confident people manager",
      "Handle conflict, performance issues, and tough conversations directly",
      "Lead hybrid and remote teams without losing engagement",
      "Build the management skill set companies are actively promoting for",
    ],
  },
  "critical-thinking": {
    purpose:
      "In a world of information overload, the ability to think clearly and reason well is a genuine competitive advantage — this course sharpens exactly that.",
    benefits: [
      "Evaluate information and avoid common cognitive biases",
      "Make better decisions under uncertainty or pressure",
      "Communicate your reasoning clearly and persuasively",
      "Build a foundational skill that strengthens every other skill you have",
    ],
  },
};

export function getCoursePreviewContent(slug: string): CoursePreviewContent | undefined {
  return COURSE_PREVIEW_CONTENT[slug];
}
