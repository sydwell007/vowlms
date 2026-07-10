/**
 * Step 1 — Fetch all courses from all 6 GoalVow Moodle academies.
 * Saves: scripts/moodle-migration/data/courses-<academy>.json
 *
 * Run: node scripts/moodle-migration/1-fetch-courses.mjs
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { requireMoodleToken } from "./env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const ACADEMIES = [
  {
    id: "upskilling",
    name: "Upskilling Academy",
    vowSlug: "upskilling-academy",
    base: process.env.UPSKILLING_MOODLE_BASE_URL || "https://goalvow.com/upskilling",
    token: requireMoodleToken("upskilling"),
    category: "upskilling",
  },
  {
    id: "skills-training",
    name: "Skills Training Academy",
    vowSlug: "skills-training-academy",
    base: process.env.SKILLS_TRAINING_MOODLE_BASE_URL || "https://goalvow.com/skillstraining",
    token: requireMoodleToken("skills-training"),
    category: "skills-training",
  },
  {
    id: "chef-academy",
    name: "Chef Academy",
    vowSlug: "chef-academy",
    base: process.env.CHEF_ACADEMY_MOODLE_BASE_URL || "https://goalvow.com/chefacademy",
    token: requireMoodleToken("chef-academy"),
    category: "chef-academy",
  },
  {
    id: "schools",
    name: "GoalVow Schools",
    vowSlug: "private-school",
    base: process.env.GOALVOW_SCHOOLS_MOODLE_BASE_URL || "https://goalvow.com/schools",
    token: requireMoodleToken("schools"),
    category: "private-school",
  },
  {
    id: "business-school",
    name: "Business School",
    vowSlug: "business-school",
    base: process.env.BUSINESS_SCHOOL_MOODLE_BASE_URL || "https://goalvow.com/businessschool",
    token: requireMoodleToken("business-school"),
    category: "business-school",
  },
  {
    id: "university",
    name: "University Online",
    vowSlug: "university-online",
    base: process.env.GOALVOW_UNIVERSITY_MOODLE_BASE_URL || "https://goalvow.com/university",
    token: requireMoodleToken("university"),
    category: "university-online",
  },
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Non-JSON response: " + data.slice(0, 120)));
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchAcademy(academy) {
  console.log(`\nFetching: ${academy.name}...`);
  const url = `${academy.base}/webservice/rest/server.php?wstoken=${academy.token}&wsfunction=core_course_get_courses&moodlewsrestformat=json`;
  const courses = await get(url);

  if (!Array.isArray(courses)) {
    console.error(`  ❌ Error: ${JSON.stringify(courses)}`);
    return [];
  }

  // Filter out site course (id=1)
  const real = courses.filter((c) => c.id !== 1);
  console.log(`  ✅ ${real.length} courses`);

  const out = {
    academy: {
      id: academy.id,
      name: academy.name,
      vowSlug: academy.vowSlug,
      base: academy.base,
      category: academy.category,
    },
    fetchedAt: new Date().toISOString(),
    courses: real.map((c) => ({
      id: c.id,
      shortname: c.shortname,
      fullname: c.fullname,
      summary: c.summary?.replace(/<[^>]+>/g, "").trim().slice(0, 500) || "",
      categoryid: c.categoryid,
      categoryname: c.categoryname,
      visible: c.visible,
      format: c.format,
      startdate: c.startdate,
      enddate: c.enddate,
      numsections: c.numsections,
      timecreated: c.timecreated,
      timemodified: c.timemodified,
    })),
  };

  const file = path.join(DATA_DIR, `courses-${academy.id}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`  Saved → ${file}`);
  return real;
}

async function main() {
  console.log("=== GoalVow Moodle Course Fetch ===\n");
  let total = 0;
  for (const academy of ACADEMIES) {
    try {
      const courses = await fetchAcademy(academy);
      total += courses.length;
      // Avoid hammering the server
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ❌ ${academy.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Done. Total courses fetched: ${total}`);
}

main();
