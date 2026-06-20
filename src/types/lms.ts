export type Role = "learner" | "facilitator" | "employer" | "admin";

export type AcademyCategory =
  | "upskilling"
  | "skills-training"
  | "chef-academy"
  | "private-school"
  | "business-school"
  | "university-online";

export type LessonType = "text" | "video" | "assessment" | "vr-practice";

export type CourseLevel = "Foundation" | "Intermediate" | "Advanced";

export type CourseStatus = "draft" | "published" | "archived";

export type Academy = {
  slug: string;
  name: string;
  description: string;
  audience: string;
  category: AcademyCategory;
  heroMessage: string;
  sampleCourseSlugs: string[];
};

export type Lesson = {
  slug: string;
  title: string;
  type: LessonType;
  content: string;
  videoUrl?: string;
  hasAssessment: boolean;
  hasVRPractice: boolean;
  durationMinutes: number;
};

export type CourseModule = {
  title: string;
  order: number;
  lessons: Lesson[];
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
};

export type Assessment = {
  slug: string;
  lessonSlug: string;
  title: string;
  passMark: number;
  questions: AssessmentQuestion[];
};

export type VRPractice = {
  slug: string;
  lessonSlug: string;
  title: string;
  scenario: string;
  skillsPracticed: string[];
  scorePlaceholder: number;
};

export type Course = {
  slug: string;
  moodleId?: number | null;
  title: string;
  academySlug: string;
  description: string;
  level: CourseLevel;
  duration: string;
  price: number;
  status: CourseStatus;
  modules: CourseModule[];
  assessments: Assessment[];
  vrPractices: VRPractice[];
  outcomes: string[];
  rewards: number;
  opportunityPathways: string[];
};

export type Opportunity = {
  id: string;
  title: string;
  type: "employment" | "entrepreneurship" | "internship" | "supplier" | "study";
  partner: string;
  location: string;
  description: string;
};

export type LearningHub = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  focus: string;
  status: "planned" | "active" | "partner-ready";
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type EnrolledCourse = {
  courseSlug: string;
  progress: number;
  nextLessonSlug: string;
};
