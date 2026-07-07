/**
 * Step 6 — Fetch resource files (PDFs, videos) from all 6 Moodle academies.
 *
 * What it does:
 *  - Calls core_course_get_contents for each course
 *  - Extracts "resource" / "folder" modules → PDF, video, audio files
 *  - Stores content_hash (SHA-1) for direct file-system serving
 *    and file_url (with token) as a fallback proxy source
 *  - Determines which lesson each file belongs to (via section slug)
 *  - Writes public/sql/010_resources_data.sql with INSERT statements
 *    into lesson_resources + UPDATE lessons SET video_hash = ...
 *
 * Run:
 *   node scripts/moodle-migration/6-fetch-resources.mjs
 *   node scripts/moodle-migration/6-fetch-resources.mjs --academy=upskilling
 *
 * Upload after:
 *   1. public/sql/009_lesson_resources.sql  (table structure)
 *   2. public/sql/010_resources_data.sql    (data, this script's output)
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQL_OUT = path.join(__dirname, "../../public/sql/010_resources_data.sql");

const args = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.replace("--", "").split("="))
);
const ONLY = args.academy || null;

const ACADEMIES = [
  { id: "upskilling",      base: "https://goalvow.com/upskilling",      token: "00536e412fb8d765b656ee064bf9ca2c" },
  { id: "skills-training", base: "https://goalvow.com/skills-training",  token: "6b5f00ce3889922a6eb1df2b4a8c45aa" },
  { id: "chef-academy",    base: "https://goalvow.com/chef-academy",     token: "8d20fcaa2fd8b8a738a78bae517c1b05" },
  { id: "schools",         base: "https://goalvow.com/schools",          token: "3e6e821581b3ff80e1e9871355b30088" },
  { id: "business-school", base: "https://goalvow.com/business-school",  token: "2a5f4b9743138fe641ccdc03f047f27d" },
  { id: "university",      base: "https://goalvow.com/university",       token: "4a20221e056e4cfe6350254fc8630a29" },
];

// File types
const MIME_TO_TYPE = {
  "application/pdf":   "pdf",
  "video/mp4":         "video",
  "video/webm":        "video",
  "video/ogg":         "video",
  "video/avi":         "video",
  "video/quicktime":   "video",
  "video/x-ms-wmv":   "video",
  "video/x-matroska": "video",
  "audio/mpeg":        "audio",
  "audio/ogg":         "audio",
  "audio/wav":         "audio",
  "audio/mp4":         "audio",
  "image/jpeg":        "image",
  "image/png":         "image",
  "image/gif":         "image",
  "image/webp":        "image",
};

const EXT_TO_TYPE = {
  ".pdf": "pdf",
  ".mp4": "video", ".webm": "video", ".avi": "video",
  ".mov": "video", ".mkv": "video", ".wmv": "video",
  ".mp3": "audio", ".ogg": "audio", ".wav": "audio", ".m4a": "audio",
  ".jpg": "image", ".jpeg": "image", ".png": "image", ".gif": "image", ".webp": "image",
};

function fileType(mime, filename) {
  if (mime && MIME_TO_TYPE[mime]) return MIME_TO_TYPE[mime];
  const ext = path.extname(filename || "").toLowerCase();
  return EXT_TO_TYPE[ext] ?? "other";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("Non-JSON: " + data.slice(0, 200))); }
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
  if (str == null) return "NULL";
  return "'" + String(str)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\x00/g, "\\0")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r") + "'";
}

function shortUuid(prefix, parts) {
  // Deterministic pseudo-UUID from a readable string
  const raw = parts.join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = Math.imul(31, h) + raw.charCodeAt(i);
  const hex = (Math.abs(h) >>> 0).toString(16).padStart(8, "0");
  const ts = Date.now().toString(16).slice(-8);
  return `${prefix}-${hex}-${ts}-${raw.length.toString(16).padStart(4, "0")}-${i => i}0000-${raw.charCodeAt(0).toString(16).padStart(12, "0")}`.slice(0, 36);
}

let _idSeq = 0;
function makeId(prefix) {
  _idSeq++;
  const seq = _idSeq.toString(16).padStart(12, "0");
  return `${prefix}-0000-0000-0000-${seq}`;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchCourses(a) {
  const res = await api(a.base, a.token, "core_course_get_courses");
  if (!Array.isArray(res)) throw new Error("Bad courses: " + JSON.stringify(res).slice(0, 80));
  return res.filter(c => c.id !== 1);
}

async function fetchStructure(a, courseId) {
  const res = await api(a.base, a.token, "core_course_get_contents", `&courseid=${courseId}`);
  return Array.isArray(res) ? res : [];
}

// ── SQL accumulator ───────────────────────────────────────────────────────────

const sqlInserts = [];
const sqlVideoUpdates = [];
let totalResources = 0;
let totalVideos = 0;

function addResource(academyId, lessonSlug, position, type, filename, hash, fileUrl, filesize, mimeType) {
  const id = makeId("res");
  // Use subquery for lesson_id to avoid needing IDs up-front
  sqlInserts.push(
    `INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)\n` +
    `  SELECT ${escapeSql(id)}, l.id, ${escapeSql(academyId)}, ${escapeSql(type)}, ${escapeSql(filename)}, ${escapeSql(hash)}, ${escapeSql(fileUrl)}, ${filesize ?? 0}, ${escapeSql(mimeType)}, ${position}\n` +
    `  FROM lessons l WHERE l.slug = ${escapeSql(lessonSlug)} LIMIT 1;`
  );
  totalResources++;
}

function addVideoHash(lessonSlug, hash) {
  if (!hash) return;
  sqlVideoUpdates.push(
    `UPDATE lessons SET video_hash = ${escapeSql(hash)} WHERE slug = ${escapeSql(lessonSlug)} AND video_hash IS NULL;`
  );
  totalVideos++;
}

// ── Per-academy processing ────────────────────────────────────────────────────

const SKIP_SECTION_RE = /welcome|announcements|meet and greet|rate this course|module preview|course module/i;

async function processAcademy(a) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`▸ ${a.id} (${a.base})`);

  let courses;
  try {
    courses = await fetchCourses(a);
    console.log(`  ✓ ${courses.length} courses`);
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return;
  }

  sqlInserts.push(`\n-- ── ${a.id} ────────────────────────────────────────────────────`);

  let done = 0;
  for (const course of courses) {
    const courseSlug = slugify(course.fullname);

    let sections = [];
    try {
      sections = await fetchStructure(a, course.id);
    } catch {
      await delay(500);
      continue;
    }

    for (const section of sections) {
      if (!section.visible || !section.name || section.name === "General") continue;
      if (SKIP_SECTION_RE.test(section.name)) continue;

      const lessonSlug = `${courseSlug}-${slugify(section.name)}`;
      const mods = (section.modules || []).filter(m => m.visible && m.uservisible !== false);
      let filePos = 0;

      for (const mod of mods) {
        if (!["resource", "folder"].includes(mod.modname)) continue;

        const files = mod.contents || [];
        for (const f of files) {
          if (!f.filename || f.type !== "file") continue;

          const type = fileType(f.mimetype, f.filename);
          if (type === "image") continue; // Skip thumbnail/icon images

          // Content hash (present in Moodle 3.6+)
          const hash = f.contenthash || null;

          // Build file URL — avoid double query-string separator
          const rawUrl = (f.fileurl || "").replace(/[?&]token=[^&]+/, "");
          const fileUrl = rawUrl
            ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}token=${a.token}`
            : null;

          const filesize = f.filesize || 0;
          const mimeType = f.mimetype || null;

          addResource(a.id, lessonSlug, filePos, type, f.filename, hash, fileUrl, filesize, mimeType);
          filePos++;

          if (type === "video") {
            addVideoHash(lessonSlug, hash);
          }
        }
      }
    }

    done++;
    if (done % 20 === 0) process.stdout.write(`  ... ${done}/${courses.length}\r`);
    await delay(150);
  }

  console.log(`  ✓ ${done} courses processed`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== VowLMS Resource Migration — Step 6 ===");
  console.log(`Output: ${SQL_OUT}\n`);

  const header = [
    "-- =============================================================",
    "-- VowLMS Lesson Resources — generated from Moodle live API",
    "-- Generated: " + new Date().toISOString(),
    "-- Upload AFTER 009_lesson_resources.sql (table must exist first)",
    "-- =============================================================",
    "",
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS=0;",
    "",
  ];

  const toProcess = ONLY ? ACADEMIES.filter(a => a.id === ONLY) : ACADEMIES;
  for (const a of toProcess) {
    try { await processAcademy(a); }
    catch (err) { console.error(`✗ ${a.id}: ${err.message}`); }
  }

  const footer = [
    "",
    "-- ── Video hash updates ────────────────────────────────────────",
    ...sqlVideoUpdates,
    "",
    "SET FOREIGN_KEY_CHECKS=1;",
    "",
    `-- Done: ${totalResources} resources, ${totalVideos} video hash updates.`,
  ];

  fs.writeFileSync(SQL_OUT, [...header, ...sqlInserts, ...footer].join("\n"), "utf8");

  console.log(`\n\n✅ SQL written to: ${SQL_OUT}`);
  console.log(`   ${totalResources} lesson_resources rows`);
  console.log(`   ${totalVideos} video hash updates`);
  console.log("\nNext steps:");
  console.log("  1. phpMyAdmin: import 009_lesson_resources.sql  (table creation)");
  console.log("  2. phpMyAdmin: import 010_resources_data.sql   (this output)");
  console.log("  3. Upload public/php/api/files/serve.php to Afrihost");
}

main().catch(err => {
  console.error("\n✗ Fatal:", err.message);
  process.exit(1);
});
