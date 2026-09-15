export type AcademyId =
  | "upskilling"
  | "skills-training"
  | "chef-academy"
  | "business-school"
  | "private-school";

export type SimulationEnvironment =
  | "hr-office"
  | "customer-service-desk"
  | "marketing-strategy-room"
  | "project-control-room"
  | "career-coaching-office"
  | "leadership-meeting-room"
  | "workshop"
  | "electrical-safety-room"
  | "plumbing-practice-area"
  | "construction-site"
  | "machine-operation-zone"
  | "tool-handling-zone"
  | "training-kitchen"
  | "food-prep-station"
  | "hygiene-inspection-area"
  | "restaurant-service"
  | "recipe-prep-simulation"
  | "stock-control-room"
  | "boardroom"
  | "startup-pitch-room"
  | "finance-office"
  | "business-strategy-room"
  | "sales-negotiation-room"
  | "operations-control-centre"
  | "pre-school-play-room"
  | "primary-science-lab"
  | "maths-practice-room"
  | "reading-classroom"
  | "environmental-studies-room"
  | "physics-lab"
  | "chemistry-lab"
  | "biology-lab"
  | "accounting-room"
  | "career-guidance-room";

export type PpeCategory = "construction" | "kitchen" | "electrical" | "lab";

export type Lesson = {
  id: string;
  academyId: AcademyId;
  courseId: string;
  moduleId: string;
  title: string;
  summary: string;
  duration: string;
  objectives: string[];
  simulationTitle: string;
  environment: SimulationEnvironment;
  ppeCategory?: PpeCategory;
};

export type Module = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  academyId: AcademyId;
  title: string;
  summary: string;
  level: string;
  duration: string;
  modules: Module[];
};

export type Academy = {
  id: AcademyId;
  name: string;
  shortName: string;
  referenceUrl: string;
  description: string;
  audience: string;
  accent: string;
  levels?: string[];
  courses: Course[];
};

export type SimulationTask = {
  id: string;
  title: string;
  detail: string;
  hotspotId: string;
  hotspotLabel: string;
  action: string;
  options?: string[];
  correctOption?: string;
  successFeedback?: string;
  retryFeedback?: string;
};

export type HotspotShape = "box" | "screen" | "table" | "station" | "cylinder";

export type Hotspot = {
  id: string;
  label: string;
  concept: string;
  instruction: string;
  feedback: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  shape: HotspotShape;
};

export type Simulation = {
  id: string;
  lessonId: string;
  academyId: AcademyId;
  courseId: string;
  moduleId: string;
  title: string;
  environment: SimulationEnvironment;
  environmentLabel: string;
  narrative: string;
  tasks: SimulationTask[];
  hotspots: Hotspot[];
  ppeCategory?: PpeCategory;
  estimatedMinutes: number;
};

export type PpeItem = {
  id: string;
  name: string;
  reason: string;
};

export type PpeRule = {
  lessonId: string;
  category: PpeCategory;
  warning: string;
  items: PpeItem[];
};

export type AssessmentQuestionType =
  | "multiple-choice"
  | "scenario"
  | "decision"
  | "sequence"
  | "safety"
  | "reflection";

export type AssessmentQuestion = {
  id: string;
  type: AssessmentQuestionType;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  correctSequence?: string[];
  explanation: string;
  skillArea: string;
  points: number;
};

export type Assessment = {
  id: string;
  lessonId: string;
  title: string;
  passMark: number;
  questions: AssessmentQuestion[];
};

export type AssessmentAnswers = Record<string, string | string[]>;

export type AssessmentResult = {
  score: number;
  passed: boolean;
  totalPoints: number;
  earnedPoints: number;
  strengths: string[];
  improvements: string[];
};

export type LearnerProgress = {
  learnerName: string;
  completedSimulationIds: string[];
  inProgressLessonIds: string[];
  failedAssessmentLessonIds: string[];
  passedAssessmentLessonIds: string[];
  averageScore: number;
  ppeComplianceScore: number;
  timeSpentMinutes: number;
  skillsPracticed: string[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
