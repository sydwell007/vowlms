/**
 * Step 5 — Fetch real lesson content from all 6 Moodle academies.
 *
 * What it does:
 *  - Calls core_course_get_courses      → course list per academy
 *  - Calls mod_page_get_pages_by_courses → actual HTML page content per course
 *  - Calls mod_url_get_urls_by_courses  → external/video URLs per course
 *  - Calls core_course_get_contents     → section/module structure per course
 *  - Generates public/sql/008_lesson_content.sql
 *    (UPDATE statements that populate lessons.content and lessons.video_url)
 *
 * Run: node scripts/moodle-migration/5-fetch-lesson-content.mjs
 *   or: node scripts/moodle-migration/5-fetch-lesson-content.mjs --academy=upskilling
 *
 * Upload output: public/sql/008_lesson_content.sql → phpMyAdmin on Afrihost
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQL_OUT = path.join(__dirname, "../../public/sql/008_lesson_content.sql");

const args = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.replace("--","").split("="))
);
const ONLY = args.academy || null;

const ACADEMIES = [
  { id: "upskilling",      base: "https://goalvow.com/upskilling",      token: "00536e412fb8d765b656ee064bf9ca2c", vowSlug: "upskilling-academy",   name: "Upskilling Academy" },
  { id: "skills-training", base: "https://goalvow.com/skills-training",  token: "6b5f00ce3889922a6eb1df2b4a8c45aa", vowSlug: "skills-training-academy", name: "Skills Training" },
  { id: "chef-academy",    base: "https://goalvow.com/chef-academy",     token: "8d20fcaa2fd8b8a738a78bae517c1b05", vowSlug: "chef-academy",          name: "Chef Academy" },
  { id: "schools",         base: "https://goalvow.com/schools",          token: "3e6e821581b3ff80e1e9871355b30088", vowSlug: "private-school",        name: "GoalVow Schools" },
  { id: "business-school", base: "https://goalvow.com/business-school",  token: "2a5f4b9743138fe641ccdc03f047f27d", vowSlug: "business-school",       name: "Business School" },
  { id: "university",      base: "https://goalvow.com/university",       token: "4a20221e056e4cfe6350254fc8630a29", vowSlug: "university-online",     name: "University Online" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("Non-JSON from Moodle: " + data.slice(0, 200))); }
      });
    }).on("error", reject);
  });
}

function api(base, token, fn, params = "") {
  const url = `${base}/webservice/rest/server.php?wstoken=${token}&wsfunction=${fn}&moodlewsrestformat=json${params}`;
  return get(url);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function escapeSql(str) {
  if (!str) return "NULL";
  return "'" + String(str)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\x00/g, "\\0")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r") + "'";
}

function extractYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractYouTubeFromHtml(html) {
  if (!html) return null;
  // iframe src
  const m = String(html).match(/(?:src|SRC)=["']([^"']*(?:youtube|youtu\.be)[^"']*)["']/i);
  if (m) {
    const id = extractYouTubeId(m[1]);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  // watch link
  const m2 = String(html).match(/href=["']([^"']*(?:youtube\.com\/watch\?v=|youtu\.be\/)[^"']*)["']/i);
  if (m2) {
    const id = extractYouTubeId(m2[1]);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  return null;
}

function buildEmbedUrl(rawUrl) {
  if (!rawUrl) return null;
  const id = extractYouTubeId(rawUrl);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function stripScript(html) {
  return (html || "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "#");
}

// ── Fetch functions ───────────────────────────────────────────────────────────

async function fetchCourses(a) {
  const res = await api(a.base, a.token, "core_course_get_courses");
  if (!Array.isArray(res)) throw new Error("Bad courses response: " + JSON.stringify(res).slice(0, 120));
  return res.filter(c => c.id !== 1);
}

async function fetchPages(a, courseIds) {
  // mod_page_get_pages_by_courses — returns all page activities for given courses
  const params = courseIds.map((id, i) => `&courseids[${i}]=${id}`).join("");
  const res = await api(a.base, a.token, "mod_page_get_pages_by_courses", params).catch(() => ({ pages: [] }));
  const map = {};
  for (const p of (res.pages || [])) {
    map[p.coursemodule] = p; // keyed by coursemodule id
  }
  return map;
}

async function fetchUrls(a, courseIds) {
  const params = courseIds.map((id, i) => `&courseids[${i}]=${id}`).join("");
  const res = await api(a.base, a.token, "mod_url_get_urls_by_courses", params).catch(() => ({ urls: [] }));
  const map = {};
  for (const u of (res.urls || [])) {
    map[u.coursemodule] = u;
  }
  return map;
}

async function fetchStructure(a, courseId) {
  const res = await api(a.base, a.token, "core_course_get_contents", `&courseid=${courseId}`);
  if (!Array.isArray(res)) return [];
  return res;
}

// ── SQL accumulator ───────────────────────────────────────────────────────────

const sqlLines = [];
let totalUpdates = 0;

function addUpdate(lessonSlug, contentHtml, videoUrl) {
  if (!contentHtml && !videoUrl) return;

  const setParts = [];
  if (contentHtml) setParts.push(`content = ${escapeSql(contentHtml)}`);
  if (videoUrl)    setParts.push(`video_url = ${escapeSql(videoUrl)}`);

  sqlLines.push(`UPDATE lessons SET ${setParts.join(", ")} WHERE slug = ${escapeSql(lessonSlug)};`);
  totalUpdates++;
}

// ── Per-academy processing ────────────────────────────────────────────────────

async function processAcademy(a) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`▸ ${a.name} (${a.base})`);

  let courses;
  try {
    courses = await fetchCourses(a);
    console.log(`  ✓ ${courses.length} courses`);
  } catch (err) {
    console.error(`  ✗ Failed to fetch courses: ${err.message}`);
    return;
  }

  const courseIds = courses.map(c => c.id);

  // Batch-fetch all page content and URL activities for this academy
  let pageMap = {}, urlMap = {};
  try {
    pageMap = await fetchPages(a, courseIds);
    console.log(`  ✓ Pages loaded (${Object.keys(pageMap).length} activities)`);
  } catch (err) {
    console.warn(`  ⚠ Pages fetch failed: ${err.message}`);
  }
  try {
    urlMap = await fetchUrls(a, courseIds);
    console.log(`  ✓ URLs loaded (${Object.keys(urlMap).length} activities)`);
  } catch (err) {
    console.warn(`  ⚠ URLs fetch failed: ${err.message}`);
  }

  sqlLines.push(`\n-- ── ${a.name} ─────────────────────────────────────────────────`);

  let coursesDone = 0;
  for (const course of courses) {
    const courseSlug = slugify(course.fullname);

    let sections = [];
    try {
      sections = await fetchStructure(a, course.id);
    } catch (err) {
      console.warn(`  ⚠ Structure failed for ${course.fullname}: ${err.message}`);
      await delay(300);
      continue;
    }

    // Filter sections the same way transform.mjs does
    const visibleSections = sections.filter(
      s => s.visible && s.name && s.name !== "General"
    );

    for (const section of visibleSections) {
      // Skip meta sections (same logic as transform.mjs)
      if (/welcome|announcements|meet and greet|rate this course|module preview|course module/i.test(section.name)) {
        continue;
      }

      const lessonSlug = `${courseSlug}-${slugify(section.name)}`;
      const htmlParts = [];
      let videoUrl = null;

      const modules = (section.modules || []).filter(m => m.visible && m.uservisible !== false);

      for (const mod of modules) {
        switch (mod.modname) {
          case "page": {
            const page = pageMap[mod.id];
            if (page?.content) {
              htmlParts.push(stripScript(page.content));
            } else if (mod.description && mod.description.trim()) {
              htmlParts.push(stripScript(mod.description));
            }
            break;
          }
          case "label": {
            if (mod.description && mod.description.trim()) {
              const stripped = stripScript(mod.description);
              // Only add if it has meaningful content (not just whitespace/short text)
              if (stripped.replace(/<[^>]+>/g, "").trim().length > 10) {
                htmlParts.push(stripped);
              }
            }
            break;
          }
          case "url": {
            const urlMod = urlMap[mod.id];
            const extUrl = urlMod?.externalurl || mod.url || "";
            if (extUrl) {
              const ytId = extractYouTubeId(extUrl);
              if (ytId && !videoUrl) {
                videoUrl = `https://www.youtube-nocookie.com/embed/${ytId}`;
              } else if (extUrl) {
                htmlParts.push(`<p><a href="${extUrl}" target="_blank" rel="noopener noreferrer">${mod.name || "External resource"}</a></p>`);
              }
            }
            break;
          }
          case "resource":
          case "folder": {
            const files = mod.contents || [];
            for (const f of files) {
              if (f.fileurl && f.filename && !f.filename.match(/\.(jpg|jpeg|png|gif|ico|webp)$/i)) {
                const fileUrl = `${f.fileurl}?token=${a.token}`;
                htmlParts.push(`<p>📎 <a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${f.filename}</a></p>`);
              }
            }
            break;
          }
          case "quiz": {
            // Quizzes are handled as assessments — skip content for now
            break;
          }
          default:
            break;
        }
      }

      // Section summary as fallback content if no module content found
      if (htmlParts.length === 0 && section.summary && section.summary.trim()) {
        const stripped = stripScript(section.summary);
        if (stripped.replace(/<[^>]+>/g, "").trim().length > 5) {
          htmlParts.push(stripped);
        }
      }

      // Check if any accumulated HTML contains a YouTube embed
      if (!videoUrl) {
        const combined = htmlParts.join("\n");
        videoUrl = extractYouTubeFromHtml(combined);
      }

      const contentHtml = htmlParts.join("\n\n") || null;
      addUpdate(lessonSlug, contentHtml, videoUrl);
    }

    coursesDone++;
    if (coursesDone % 20 === 0) process.stdout.write(`  ... ${coursesDone}/${courses.length} courses\r`);
    await delay(150); // rate limit
  }

  console.log(`  ✓ ${coursesDone} courses processed, ${totalUpdates} UPDATE statements generated so far`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== VowLMS Moodle Content Migration — Step 5 ===");
  console.log(`Output: ${SQL_OUT}\n`);

  sqlLines.push("-- =============================================================");
  sqlLines.push("-- VowLMS Lesson Content — generated from Moodle live API");
  sqlLines.push("-- Generated: " + new Date().toISOString());
  sqlLines.push("-- Upload to phpMyAdmin AFTER running scripts 001–007");
  sqlLines.push("-- =============================================================");
  sqlLines.push("");
  sqlLines.push("SET NAMES utf8mb4;");
  sqlLines.push("SET FOREIGN_KEY_CHECKS=0;");
  sqlLines.push("");

  const toProcess = ONLY ? ACADEMIES.filter(a => a.id === ONLY) : ACADEMIES;

  for (const a of toProcess) {
    try {
      await processAcademy(a);
    } catch (err) {
      console.error(`✗ Academy ${a.name} failed: ${err.message}`);
    }
  }

  sqlLines.push("");
  sqlLines.push("SET FOREIGN_KEY_CHECKS=1;");
  sqlLines.push("");
  sqlLines.push(`-- Done: ${totalUpdates} lesson UPDATE statements generated.`);

  fs.writeFileSync(SQL_OUT, sqlLines.join("\n"), "utf8");
  console.log(`\n\n✅ SQL written to: ${SQL_OUT}`);
  console.log(`   ${totalUpdates} UPDATE statements`);
  console.log("\nNext steps:");
  console.log("  1. Import public/sql/008_lesson_content.sql in phpMyAdmin");
  console.log("  2. Verify: SELECT slug, LENGTH(content) FROM lessons WHERE content IS NOT NULL LIMIT 10;");
}

main().catch(err => {
  console.error("\n✗ Fatal:", err.message);
  process.exit(1);
});
