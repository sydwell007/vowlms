export type Role = "learner" | "facilitator" | "employer" | "admin";

export type AcademyCategory =
  | "upskilling"
  | "skills-training"
  | "chef-academy"
  | "private-school"
  | "sports-academy"
  | "business-school"
  | "university-online";

export type LessonType = "text" | "video" | "assessment" | "vr-practice";

export type VowHumanRole = "presenter" | "mentor" | "tutor" | "field-expert";

export type VowHumanPlacement =
  | "after-introduction"
  | "before-content"
  | "after-content";

export type VowHumanPresenterConfig = {
  enabled: boolean;
  embedUrl: string;
  presenterName: string;
  introduction: string;
  placement: VowHumanPlacement;
  role: VowHumanRole;
  expertise: string;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
};

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
  vowHuman?: VowHumanPresenterConfig;
};

export type CourseModule = {
  title: string;
  order: number;
  lessons: Lesson[];
  /** Optional real copy from `modules.description` — falls back to an auto-generated summary when absent. */
  description?: string;
  /** Optional real copy from `modules.outcome` — falls back to an auto-generated "you'll be able to" line when absent. */
  outcome?: string;
};

/**
 * Question type union. `type` is OPTIONAL on the multiple-choice variant
 * specifically so every pre-existing question object across every
 * not-yet-updated course (auto-generated from the Moodle migration, no
 * `type` field ever written) keeps type-checking and rendering exactly as
 * before — an absent `type` always means multiple-choice. Every other
 * variant requires its own `type` as the real discriminant.
 *
 * `explanation` (shown on a correct answer) and `clue` (shown on a wrong
 * one, and fed to Thandi as the only hint she's allowed to give — see
 * `src/lib/thandi/knowledge.ts`) are optional for the same backward-compat
 * reason; the review UI falls back to generic copy when either is absent.
 */
export type MultipleChoiceQuestion = {
  id: string;
  type?: "multiple-choice";
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string;
  clue?: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: "true-false";
  prompt: string;
  answer: "True" | "False";
  explanation?: string;
  clue?: string;
};

export type FillBlankQuestion = {
  id: string;
  type: "fill-blank";
  /** Contains a literal "_____" marking the blank. */
  prompt: string;
  answer: string;
  /** Case-insensitive alternate spellings/synonyms also accepted as correct. */
  acceptableAnswers?: string[];
  explanation?: string;
  clue?: string;
};

export type MatchingPair = { left: string; right: string };

export type MatchingQuestion = {
  id: string;
  type: "matching";
  prompt: string;
  /** `right` values are shuffled for display; `left` order is the display order. */
  pairs: MatchingPair[];
  explanation?: string;
  clue?: string;
};

/** A short real-workplace scenario followed by a "what should you do" multiple choice. */
export type ScenarioQuestion = {
  id: string;
  type: "scenario";
  scenario: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string;
  clue?: string;
};

/** Arrange steps/items into the one correct order. `items` is authored in the correct order. */
export type OrderingQuestion = {
  id: string;
  type: "ordering";
  prompt: string;
  items: string[];
  explanation?: string;
  clue?: string;
};

export type AssessmentQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | ScenarioQuestion
  | OrderingQuestion;

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

/**
 * What a specific course leads to — real, course-specific answers to "what
 * jobs/business ideas/further study does this actually unlock", shown as
 * three clickable categories on the course landing page. `employment` items
 * are the ones that will later link out to matching PlugConnect listings.
 */
export type CourseOpportunityPathways = {
  employment: string[];
  entrepreneurship: string[];
  furtherStudy: string[];
};

/**
 * Marketing/sales content for the "Course Preview" tab — real, course-specific
 * copy that sells the value of enrolling, distinct from the more academic
 * `outcomes` list shown on the Overview tab. Only authored for the 20
 * Upskilling Academy courses today; `undefined` elsewhere hides the tab.
 */
export type CoursePreviewContent = {
  /** Why this course exists — the real problem it solves for the learner. */
  purpose: string;
  /** Value-focused reasons to enrol, not a skills list — career/life impact. */
  benefits: string[];
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
  opportunityPathways: CourseOpportunityPathways;
  coursePreview?: CoursePreviewContent;
};

export type CourseSummary = Pick<
  Course,
  "slug" | "title" | "academySlug" | "description" | "level" | "duration" | "price" | "rewards"
> & {
  academyName: string;
  academyCategory: AcademyCategory;
  hasCertificate: boolean;
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  hasAssessment: boolean;
  hasVRPractice: boolean;
  presenterName: string;
  /** True when this course is only visible because the viewer is an admin previewing unlaunched content. */
  isAdminPreview?: boolean;
};

export type CourseReview = {
  id: string;
  learnerName: string;
  rating: number;
  instructorRating: number | null;
  feedback: string;
  wouldRecommend: boolean | null;
  createdAt: string;
};

export type CourseReviewSummary = {
  averageRating: number | null;
  totalReviews: number;
  recommendationPercent: number | null;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  reviews: CourseReview[];
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
