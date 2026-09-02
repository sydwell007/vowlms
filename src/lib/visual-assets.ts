export const visualAssets = {
  logo: "/images/goalvow-logo.png",
  ecosystemHero: "/images/vowlms/hero-ecosystem.png",
  academyNetwork: "/images/vowlms/academy-network.png",
  dashboardExperience: "/images/vowlms/dashboard-experience.png",
  vrPracticeLab: "/images/vowlms/vr-practice-lab.png",
  coursePresenter: "/images/vowlms/course-presenter.webp",
} as const;

type CourseVisual = {
  src: string;
  alt: string;
};

const upskillingCourseVisuals = {
  "business-ethics": {
    src: "/images/courses/upskilling/business-ethics.webp",
    alt: "Diverse professionals discussing an ethical workplace decision together.",
  },
  "workplace-compliance": {
    src: "/images/courses/upskilling/workplace-compliance.webp",
    alt: "A compliance professional guides colleagues through a workplace safety check.",
  },
  "organizational-culture": {
    src: "/images/courses/upskilling/organizational-culture.webp",
    alt: "An inclusive team collaborates during a workplace culture workshop.",
  },
  "stress-management": {
    src: "/images/courses/upskilling/stress-management.webp",
    alt: "A professional pauses for a calming breath during a demanding workday.",
  },
  cybersecurity: {
    src: "/images/courses/upskilling/cybersecurity.webp",
    alt: "A cybersecurity specialist helps a colleague investigate a digital threat.",
  },
  "health-and-wellness": {
    src: "/images/courses/upskilling/health-and-wellness.webp",
    alt: "Colleagues take a healthy movement and wellbeing break together.",
  },
  "human-resources": {
    src: "/images/courses/upskilling/human-resources.webp",
    alt: "An HR professional welcomes a new employee during an onboarding conversation.",
  },
  marketing: {
    src: "/images/courses/upskilling/marketing.webp",
    alt: "A marketing team develops a campaign using creative ideas and customer insights.",
  },
  sales: {
    src: "/images/courses/upskilling/sales.webp",
    alt: "A sales professional presents a solution during a consultative client meeting.",
  },
  "project-management": {
    src: "/images/courses/upskilling/project-management.webp",
    alt: "A project manager coordinates tasks and timing with a cross-functional team.",
  },
  "customer-service": {
    src: "/images/courses/upskilling/customer-service.webp",
    alt: "A customer-service professional listens and helps a customer resolve an issue.",
  },
  "career-management": {
    src: "/images/courses/upskilling/career-management.webp",
    alt: "A professional and mentor review a career-development plan together.",
  },
  "change-management": {
    src: "/images/courses/upskilling/change-management.webp",
    alt: "A team leader supports colleagues as they adopt a new workplace process.",
  },
  communication: {
    src: "/images/courses/upskilling/communication.webp",
    alt: "A facilitator leads a clear and engaged two-way team discussion.",
  },
  leadership: {
    src: "/images/courses/upskilling/leadership.webp",
    alt: "An inclusive leader guides a team toward a shared decision.",
  },
  resilience: {
    src: "/images/courses/upskilling/resilience.webp",
    alt: "Colleagues regroup and create a new plan after a workplace setback.",
  },
  "problem-solving": {
    src: "/images/courses/upskilling/problem-solving.webp",
    alt: "A team analyses evidence together to solve an operational problem.",
  },
  "time-management": {
    src: "/images/courses/upskilling/time-management.webp",
    alt: "An organised professional prioritises tasks and plans a focused workday.",
  },
  "team-management": {
    src: "/images/courses/upskilling/team-management.webp",
    alt: "A manager coordinates responsibilities with an inclusive professional team.",
  },
  "critical-thinking": {
    src: "/images/courses/upskilling/critical-thinking.webp",
    alt: "Professionals compare evidence and question assumptions before reaching a conclusion.",
  },
} as const satisfies Record<string, CourseVisual>;

const warnedCourseSlugs = new Set<string>();

export function getAcademyCourseImage(category: string) {
  switch (category) {
    case "skills-training":
      return visualAssets.vrPracticeLab;
    case "chef-academy":
      return visualAssets.ecosystemHero;
    case "business-school":
      return visualAssets.dashboardExperience;
    default:
      return visualAssets.academyNetwork;
  }
}

export function getCourseVisual(course: { slug: string; title: string }, academyCategory: string): CourseVisual {
  const curatedVisual = upskillingCourseVisuals[course.slug as keyof typeof upskillingCourseVisuals];
  if (curatedVisual) return curatedVisual;

  if (
    process.env.NODE_ENV !== "production" &&
    academyCategory === "upskilling" &&
    !warnedCourseSlugs.has(course.slug)
  ) {
    warnedCourseSlugs.add(course.slug);
    console.warn(`[course-image] No curated image for Upskilling course "${course.slug}"; using academy fallback.`);
  }

  return {
    src: getAcademyCourseImage(academyCategory),
    alt: `${course.title} course`,
  };
}
