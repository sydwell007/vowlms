/**
 * Step 2 — Fetch section/lesson structure for every course in every academy.
 * Reads:  scripts/moodle-migration/data/courses-<academy>.json
 * Saves:  scripts/moodle-migration/data/structure-<academy>.json
 *
 * Run: node scripts/moodle-migration/2-fetch-structure.mjs
 * Options:
 *   --academy=chef-academy   (fetch a single academy only)
 *   --limit=20               (limit courses per academy, useful for testing)
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { requireMoodleToken } from "./env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => a.replace("--", "").split("="))
);
const LIMIT = args.limit ? parseInt(args.limit) : Infinity;
const ONLY = args.academy || null;

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
            reject(new Error("Non-JSON response len=" + data.length));
          }
        });
      })
      .on("error", reject);
  });
}

function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function cleanHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);
}

async function fetchCourseStructure(base, token, courseId, courseSlug) {
  const url = `${base}/webservice/rest/server.php?wstoken=${token}&wsfunction=core_course_get_contents&courseid=${courseId}&moodlewsrestformat=json`;
  const sections = await get(url);

  if (!Array.isArray(sections)) return { sections: [], error: JSON.stringify(sections) };

  const structured = sections
    .filter((s) => s.visible && s.name && s.name !== "General")
    .map((s, i) => {
      const modules = (s.modules || [])
        .filter((m) => m.visible && m.uservisible)
        .map((m) => ({
          id: m.id,
          name: m.name,
          type: m.modname,
          url: m.url || null,
          description: cleanHtml(m.description),
          completion: m.completion,
          contents: (m.contents || []).map((c) => ({
            type: c.type,
            filename: c.filename,
            fileurl: c.fileurl,
            mimetype: c.mimetype,
          })),
        }));

      return {
        sectionId: s.id,
        sectionIndex: s.section,
        title: s.name,
        slug: `${courseSlug}-${slug(s.name)}`,
        summary: cleanHtml(s.summary),
        modules,
        order: i + 1,
      };
    });

  return { sections: structured };
}

async function processAcademy(academyId) {
  const file = path.join(DATA_DIR, `courses-${academyId}.json`);
  if (!fs.existsSync(file)) {
    console.log(`  Skipping ${academyId} — run step 1 first`);
    return;
  }

  const { academy, courses } = JSON.parse(fs.readFileSync(file, "utf-8"));
  const subset = courses.slice(0, LIMIT);
  console.log(`\n${academy.name}: ${subset.length} courses (of ${courses.length})...`);

  const results = [];
  let done = 0;

  for (const course of subset) {
    try {
      const courseSlug = slug(course.fullname);
      const structure = await fetchCourseStructure(
        academy.base,
        // token stored per-academy in courses file — re-read config
        getToken(academyId),
        course.id,
        courseSlug
      );

      results.push({
        moodleId: course.id,
        shortname: course.shortname,
        fullname: course.fullname,
        slug: courseSlug,
        summary: course.summary,
        sections: structure.sections,
        error: structure.error || null,
      });

      done++;
      if (done % 10 === 0) {
        process.stdout.write(`  ${done}/${subset.length} courses...\r`);
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      results.push({
        moodleId: course.id,
        fullname: course.fullname,
        slug: slug(course.fullname),
        sections: [],
        error: err.message,
      });
    }
  }

  const out = {
    academy: academy,
    fetchedAt: new Date().toISOString(),
    courses: results,
  };

  const outFile = path.join(DATA_DIR, `structure-${academyId}.json`);
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
  console.log(`\n  ✅ Saved → ${outFile}`);
}

function getToken(academyId) {
  return requireMoodleToken(academyId);
}

async function main() {
  console.log("=== GoalVow Moodle Structure Fetch ===");
  if (ONLY) {
    await processAcademy(ONLY);
  } else {
    const ids = ["upskilling", "skills-training", "chef-academy", "schools", "business-school", "university"];
    for (const id of ids) {
      await processAcademy(id);
    }
  }
  console.log("\n✅ Structure fetch complete.");
}

main();
