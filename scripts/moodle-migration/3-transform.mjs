/**
 * Step 3 — Transform Moodle structure data into VowLMS seed format.
 * Reads:  scripts/moodle-migration/data/structure-<academy>.json
 * Saves:  scripts/moodle-migration/data/vowlms-seed.json
 *         scripts/moodle-migration/data/vowlms-seed-academies.json
 *
 * Run: node scripts/moodle-migration/3-transform.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");

const ACADEMY_MAP = {
  "upskilling": {
    vowSlug: "upskilling-academy",
    name: "Upskilling Academy",
    category: "upskilling",
    description: "Short, practical pathways for employability, digital readiness, and everyday productivity.",
    audience: "Job seekers, workers, youth, and community learners",
    heroMessage: "Turn everyday ambition into visible progress and opportunity readiness.",
  },
  "skills-training": {
    vowSlug: "skills-training-academy",
    name: "Skills Training Academy",
    category: "skills-training",
    description: "Hands-on trade and service skills connected to local work, enterprise, and supplier pathways.",
    audience: "Practical skills learners and micro-enterprise builders",
    heroMessage: "Practice real skills, prove competency, and move toward income.",
  },
  "chef-academy": {
    vowSlug: "chef-academy",
    name: "Chef Academy",
    category: "chef-academy",
    description: "Culinary foundations, kitchen operations, food safety, and ChefOrder-linked growth routes.",
    audience: "Aspiring chefs, food entrepreneurs, and hospitality teams",
    heroMessage: "Build kitchen confidence from safety basics to menu-ready execution.",
  },
  "schools": {
    vowSlug: "private-school",
    name: "GoalVow Schools",
    category: "private-school",
    description: "Daycare, preschool, primary, and high school support built for accessible digital learning.",
    audience: "Families, school operators, tutors, and young learners",
    heroMessage: "A modern school pathway for every stage of learner growth.",
  },
  "business-school": {
    vowSlug: "business-school",
    name: "GoalVow Business School",
    category: "business-school",
    description: "Business and entrepreneurship programmes for Africa's next generation of leaders.",
    audience: "Entrepreneurs, managers, and professionals",
    heroMessage: "Build the business skills that open doors across Africa.",
  },
  "university": {
    vowSlug: "university-online",
    name: "GoalVow University Online",
    category: "university-online",
    description: "Degree and diploma programmes in technology, business, and education delivered fully online.",
    audience: "Degree seekers, professionals, and career changers",
    heroMessage: "Your degree. Your schedule. Your future.",
  },
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function detectLevel(title) {
  const t = title.toLowerCase();
  if (/advanced|senior|masters|phd|degree/.test(t)) return "Advanced";
  if (/intermediate|diploma|bsc|bba|bachelor/.test(t)) return "Intermediate";
  return "Foundation";
}

function detectDuration(sections) {
  const lessonCount = sections.filter((s) =>
    /^lesson\s+\d+/i.test(s.title)
  ).length;
  if (lessonCount >= 10) return "8 weeks";
  if (lessonCount >= 6) return "6 weeks";
  if (lessonCount >= 3) return "4 weeks";
  return "2 weeks";
}

function detectPrice(academyId) {
  const priceMap = {
    upskilling: 0,
    "skills-training": 299,
    "chef-academy": 199,
    schools: 0,
    "business-school": 499,
    university: 1499,
  };
  return priceMap[academyId] ?? 0;
}

function buildLessonsFromSections(sections, courseSlug) {
  const lessons = [];
  let lessonOrder = 1;

  for (const section of sections) {
    const titleLower = section.title.toLowerCase();

    // Skip meta sections
    if (
      /welcome|announcements|meet and greet|rate this course|module preview|course module/i.test(
        titleLower
      )
    ) {
      continue;
    }

    // Detect lesson type
    let type = "text";
    let hasAssessment = false;
    let hasVRPractice = false;
    let durationMinutes = 14;

    if (/^lesson\s+\d+/i.test(section.title) || /^module\s+\d+/i.test(section.title)) {
      type = "text";
      durationMinutes = 14;
    } else if (/assessment|test your knowledge|quiz|examination/i.test(titleLower)) {
      type = "assessment";
      hasAssessment = true;
      durationMinutes = 20;
    } else if (/vr\s+|virtual reality|simulation|practice studio/i.test(titleLower)) {
      type = "vr-practice";
      hasVRPractice = true;
      durationMinutes = 25;
    } else if (
      /summary|learning outcome|completion|certificate|material/i.test(titleLower)
    ) {
      type = "text";
      durationMinutes = 8;
    }

    lessons.push({
      slug: `${courseSlug}-${slugify(section.title)}`,
      title: section.title,
      type,
      content:
        section.summary ||
        `This lesson covers ${section.title.replace(/^Lesson\s+\d+:\s*/i, "").toLowerCase()}. Work through the provided materials and complete any activities before proceeding.`,
      videoUrl: "https://video.vowlms.co.za/placeholder",
      hasAssessment,
      hasVRPractice,
      durationMinutes,
      order: lessonOrder++,
    });
  }

  // If no lessons extracted, create a default structure
  if (lessons.length === 0) {
    return [
      {
        slug: `${courseSlug}-introduction`,
        title: "Course introduction",
        type: "text",
        content: "Welcome to this course. Please review the course materials and complete all activities.",
        videoUrl: "https://video.vowlms.co.za/placeholder",
        hasAssessment: false,
        hasVRPractice: false,
        durationMinutes: 10,
        order: 1,
      },
      {
        slug: `${courseSlug}-knowledge-check`,
        title: "Knowledge check",
        type: "assessment",
        content: "Complete this assessment to confirm your understanding before proceeding.",
        videoUrl: null,
        hasAssessment: true,
        hasVRPractice: false,
        durationMinutes: 20,
        order: 2,
      },
    ];
  }

  return lessons;
}

function buildModulesFromLessons(lessons) {
  // Group lessons into modules (max ~6 per module)
  const CHUNK = 6;
  const modules = [];
  for (let i = 0; i < lessons.length; i += CHUNK) {
    const chunk = lessons.slice(i, i + CHUNK);
    modules.push({
      title: i === 0 ? "Foundation" : `Applied Practice ${Math.floor(i / CHUNK) + 1}`,
      order: Math.floor(i / CHUNK) + 1,
      lessons: chunk,
    });
  }
  return modules;
}

function buildAssessment(courseSlug, courseTitle) {
  return {
    slug: `${courseSlug}-assessment`,
    lessonSlug: `${courseSlug}-knowledge-check`,
    title: `${courseTitle} — knowledge check`,
    passMark: 70,
    questions: [
      {
        id: "q1",
        prompt: `What is the primary goal of "${courseTitle}"?`,
        options: [
          "To complete the certificate quickly",
          "To build practical skills and apply them",
          "To earn social media points",
          "To browse without engaging",
        ],
        answer: "To build practical skills and apply them",
      },
      {
        id: "q2",
        prompt: "What does VowLMS track during your learning journey?",
        options: [
          "Progress, attempts, and certificates",
          "Only time spent online",
          "Forum upvotes",
          "Number of logins",
        ],
        answer: "Progress, attempts, and certificates",
      },
      {
        id: "q3",
        prompt: "What unlocks after you complete this course?",
        options: [
          "Rewards, certificates, and opportunity matches",
          "Random new passwords",
          "A social profile only",
          "Nothing changes",
        ],
        answer: "Rewards, certificates, and opportunity matches",
      },
    ],
  };
}

function buildVRPractice(courseSlug, courseTitle) {
  return {
    slug: `${courseSlug}-vr-studio`,
    lessonSlug: `${courseSlug}-vr-studio`,
    title: `${courseTitle} — VR practice`,
    scenario: `A guided practice scenario for ${courseTitle.toLowerCase()}, with facilitator scoring and future headset support via WebXR.`,
    skillsPracticed: ["Decision making", "Practical confidence", "Evidence capture"],
    scorePlaceholder: 86,
  };
}

function transformCourse(moodleCourse, academyId, academyVowSlug) {
  const slug = moodleCourse.slug || slugify(moodleCourse.fullname);
  const sections = moodleCourse.sections || [];
  const level = detectLevel(moodleCourse.fullname);
  const duration = detectDuration(sections);
  const price = detectPrice(academyId);

  const lessons = buildLessonsFromSections(sections, slug);
  const modules = buildModulesFromLessons(lessons);

  return {
    slug,
    moodleId: moodleCourse.moodleId,
    title: moodleCourse.fullname,
    academySlug: academyVowSlug,
    description:
      moodleCourse.summary ||
      `A practical course from ${ACADEMY_MAP[academyId]?.name || "GoalVow"} covering ${moodleCourse.fullname.toLowerCase()}.`,
    level,
    duration,
    price,
    status: "published",
    modules,
    assessments: [buildAssessment(slug, moodleCourse.fullname)],
    vrPractices: [buildVRPractice(slug, moodleCourse.fullname)],
    outcomes: [
      `Understand the core principles of ${moodleCourse.fullname.toLowerCase()}`,
      "Apply practical skills in real-world contexts",
      "Earn a verifiable GoalVow certificate",
      "Unlock matched opportunities via VowRewards",
    ],
    rewards: price === 0 ? 120 : 250,
    opportunityPathways: ["Employment", "Entrepreneurship", "Further study"],
  };
}

async function main() {
  console.log("=== GoalVow Moodle → VowLMS Transform ===\n");

  const allCourses = [];
  const academies = [];

  const academyIds = ["upskilling", "skills-training", "chef-academy", "schools", "business-school", "university"];

  for (const id of academyIds) {
    const structFile = path.join(DATA_DIR, `structure-${id}.json`);
    const courseFile = path.join(DATA_DIR, `courses-${id}.json`);

    // Fall back to course list if structure not yet fetched
    const sourceFile = fs.existsSync(structFile) ? structFile : courseFile;
    if (!fs.existsSync(sourceFile)) {
      console.log(`⚠️  Skipping ${id} — no data file found`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));
    const info = ACADEMY_MAP[id];
    academies.push({
      slug: info.vowSlug,
      name: info.name,
      description: info.description,
      audience: info.audience,
      category: info.category,
      heroMessage: info.heroMessage,
      sampleCourseSlugs: (data.courses || [])
        .slice(0, 3)
        .map((c) => slugify(c.fullname || c.slug || "")),
    });

    let count = 0;
    for (const course of data.courses || []) {
      const transformed = transformCourse(course, id, info.vowSlug);
      allCourses.push(transformed);
      count++;
    }
    console.log(`✅ ${info.name}: ${count} courses transformed`);
  }

  const seed = {
    generatedAt: new Date().toISOString(),
    source: "GoalVow Moodle API migration",
    totalCourses: allCourses.length,
    academies,
    courses: allCourses,
  };

  const outFile = path.join(DATA_DIR, "vowlms-seed.json");
  fs.writeFileSync(outFile, JSON.stringify(seed, null, 2));
  console.log(`\n✅ Seed saved → ${outFile}`);
  console.log(`   ${allCourses.length} courses · ${academies.length} academies`);

  // Also save a compact version (course list only, no modules detail)
  const compact = {
    generatedAt: seed.generatedAt,
    courses: allCourses.map((c) => ({
      slug: c.slug,
      moodleId: c.moodleId,
      title: c.title,
      academySlug: c.academySlug,
      level: c.level,
      duration: c.duration,
      price: c.price,
      lessonCount: c.modules.reduce((sum, m) => sum + m.lessons.length, 0),
      moduleCount: c.modules.length,
    })),
  };
  fs.writeFileSync(
    path.join(DATA_DIR, "vowlms-courses-compact.json"),
    JSON.stringify(compact, null, 2)
  );
  console.log(`   Compact index saved.`);
}

main();
