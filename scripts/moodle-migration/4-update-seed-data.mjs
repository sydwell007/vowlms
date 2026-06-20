/**
 * Step 4 — Update VowLMS src/data/seed-data.ts with real Moodle data.
 *
 * This replaces the placeholder mock courses with actual course names and
 * descriptions from Moodle, keeping the VowLMS lesson/module structure.
 *
 * Run AFTER step 3:
 *   node scripts/moodle-migration/4-update-seed-data.mjs
 *
 * This reads vowlms-seed.json and rewrites seed-data.ts.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const SRC_DIR = path.join(__dirname, "../../src/data");

const SEED_FILE = path.join(DATA_DIR, "vowlms-seed.json");

function q(str) {
  return JSON.stringify(str);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function detectLevel(title) {
  const t = title.toLowerCase();
  if (/advanced|senior|masters|phd|degree|bsc|bachelor|bba/.test(t)) return "Advanced";
  if (/intermediate|diploma|professional/.test(t)) return "Intermediate";
  return "Foundation";
}

function buildModuleCode(courseSlug, modules) {
  return modules
    .map((mod) => {
      const lessonsCode = mod.lessons
        .map((l) => {
          const typeStr = l.type === "vr-practice"
            ? `"vr" as const`
            : l.type === "assessment"
            ? `"assessment" as const`
            : `"text" as const`;
          return `        {
          slug: ${q(l.slug)},
          title: ${q(l.title)},
          type: ${typeStr},
          content: ${q(l.content.slice(0, 300))},
          videoUrl: "https://video.vowlms.co.za/placeholder",
          hasAssessment: ${l.hasAssessment},
          hasVRPractice: ${l.hasVRPractice},
          durationMinutes: ${l.durationMinutes},
        }`;
        })
        .join(",\n");
      return `      {
        title: ${q(mod.title)},
        order: ${mod.order},
        lessons: [
${lessonsCode}
        ],
      }`;
    })
    .join(",\n");
}

function buildAssessmentCode(a) {
  const questionsCode = a.questions
    .map(
      (q_) =>
        `      { id: ${q(q_.id)}, prompt: ${q(q_.prompt)}, options: ${JSON.stringify(q_.options)}, answer: ${q(q_.answer)} }`
    )
    .join(",\n");
  return `    {
      slug: ${q(a.slug)},
      lessonSlug: ${q(a.lessonSlug)},
      title: ${q(a.title)},
      passMark: ${a.passMark},
      questions: [
${questionsCode}
      ],
    }`;
}

function buildVRCode(vr) {
  return `    {
      slug: ${q(vr.slug)},
      lessonSlug: ${q(vr.lessonSlug)},
      title: ${q(vr.title)},
      scenario: ${q(vr.scenario)},
      skillsPracticed: ${JSON.stringify(vr.skillsPracticed)},
      scorePlaceholder: ${vr.scorePlaceholder},
    }`;
}

function buildCourseCode(c) {
  const outcomesCode = c.outcomes.map((o) => `    ${q(o)}`).join(",\n");
  const pathwaysCode = c.opportunityPathways.map((p) => `    ${q(p)}`).join(",\n");
  const modulesCode = buildModuleCode(c.slug, c.modules);
  const assessmentsCode = c.assessments.map(buildAssessmentCode).join(",\n");
  const vrCode = c.vrPractices.map(buildVRCode).join(",\n");

  return `  {
    slug: ${q(c.slug)},
    moodleId: ${c.moodleId ?? "null"},
    title: ${q(c.title)},
    academySlug: ${q(c.academySlug)},
    description: ${q((c.description || "").slice(0, 400))},
    level: ${q(c.level)},
    duration: ${q(c.duration)},
    price: ${c.price},
    status: "published" as const,
    modules: [
${modulesCode}
    ],
    assessments: [
${assessmentsCode}
    ],
    vrPractices: [
${vrCode}
    ],
    outcomes: [
${outcomesCode}
    ],
    rewards: ${c.rewards},
    opportunityPathways: [
${pathwaysCode}
    ],
  }`;
}

async function main() {
  if (!fs.existsSync(SEED_FILE)) {
    throw new Error("Run step 3 first: node scripts/moodle-migration/3-transform.mjs");
  }

  const seed = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
  console.log(`Transforming ${seed.totalCourses} courses into seed-data.ts...`);

  // Build academy sections — take up to 3 sample courses per academy
  const academySampleMap = {};
  for (const c of seed.courses) {
    if (!academySampleMap[c.academySlug]) academySampleMap[c.academySlug] = [];
    if (academySampleMap[c.academySlug].length < 3) {
      academySampleMap[c.academySlug].push(c.slug);
    }
  }

  const academiesCode = seed.academies
    .map(
      (a) => `  {
    slug: ${q(a.slug)},
    name: ${q(a.name)},
    description: ${q(a.description)},
    audience: ${q(a.audience)},
    category: ${q(a.category)},
    heroMessage: ${q(a.heroMessage)},
    sampleCourseSlugs: ${JSON.stringify(academySampleMap[a.slug] || [])},
  }`
    )
    .join(",\n");

  const coursesCode = seed.courses.map(buildCourseCode).join(",\n\n");

  const output = `// AUTO-GENERATED from Moodle migration — ${seed.generatedAt}
// Source: ${seed.source}
// Do not edit manually — re-run: npm run migrate:all && node scripts/moodle-migration/4-update-seed-data.mjs

import type {
  Academy,
  Assessment,
  Course,
  CourseModule,
  EnrolledCourse,
  LearningHub,
  Opportunity,
  VRPractice,
} from "@/types/lms";

export const academies: Academy[] = [
${academiesCode}
];

export const courses: Course[] = [
${coursesCode}
];

export const enrolledCourses: EnrolledCourse[] = [
  { courseSlug: ${q(seed.courses[0]?.slug || "")}, progress: 60, nextLessonSlug: ${q(seed.courses[0]?.modules?.[0]?.lessons?.[1]?.slug || "")} },
  { courseSlug: ${q(seed.courses[1]?.slug || "")}, progress: 20, nextLessonSlug: ${q(seed.courses[1]?.modules?.[0]?.lessons?.[0]?.slug || "")} },
];

export const opportunities: Opportunity[] = [
  { id: "opp-1", title: "Junior Chef at The Kitchen Co.", type: "employment", partner: "The Kitchen Co.", location: "Cape Town", description: "Entry-level kitchen role for GoalVow Chef Academy completers." },
  { id: "opp-2", title: "Solar Tech Apprenticeship", type: "internship", partner: "SunPower SA", location: "Johannesburg", description: "Six-month paid apprenticeship for skills training graduates." },
  { id: "opp-3", title: "Digital Readiness Business Grant", type: "entrepreneurship", partner: "GoalVow Foundation", location: "National", description: "R5,000 seed grant for business school graduates launching a venture." },
  { id: "opp-4", title: "B2B Cleaning Services Contract", type: "supplier", partner: "GoalVow Procurement", location: "Cape Town", description: "Supplier contract available for skills training completers in cleaning services." },
];

export const learningHubs: LearningHub[] = [
  { id: "hub-1", name: "Khayelitsha Learning Hub", location: "Khayelitsha, Cape Town", capacity: 40, focus: "Digital skills & upskilling", status: "active" },
  { id: "hub-2", name: "Mitchell's Plain Hub", location: "Mitchell's Plain, Cape Town", capacity: 30, focus: "Chef Academy & hospitality", status: "active" },
  { id: "hub-3", name: "Bellville Skills Centre", location: "Bellville, Cape Town", capacity: 50, focus: "Business school & skills training", status: "partner-ready" },
  { id: "hub-4", name: "Johannesburg CBD Hub", location: "Johannesburg CBD, Gauteng", capacity: 60, focus: "University online & business", status: "planned" },
  { id: "hub-5", name: "Durban North Hub", location: "Durban North, KwaZulu-Natal", capacity: 35, focus: "Chef Academy & upskilling", status: "planned" },
];

export const analyticsEvents = [
  "learner.progress.updated",
  "lesson.completed",
  "assessment.attempted",
  "vr.practice.completed",
  "course.completed",
  "certificate.issued",
  "reward.awarded",
  "opportunity.viewed",
];
`;

  const outFile = path.join(SRC_DIR, "seed-data.ts");
  fs.writeFileSync(outFile, output);
  console.log(`✅ Written → ${outFile}`);
  console.log(`   ${seed.academies.length} academies · ${seed.totalCourses} courses`);
  console.log("\n⚠️  Run: cd vowlms && npm run build — to verify no TypeScript errors.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
