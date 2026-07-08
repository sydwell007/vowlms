/**
 * Generates vowlms_seed.sql from the TypeScript seed data.
 * Run with: npx tsx scripts/export-to-sql.mjs
 *
 * Output: scripts/output/vowlms_seed.sql
 *
 * Fixes vs v1:
 *  - Sequential IDs for modules + lessons (no slug-truncation collisions)
 *  - Module slugs generated as {course-slug}--mod-{pos} (CourseModule has no slug field)
 *  - LessonType "vr-practice" mapped to DB ENUM "vr_practice"
 *  - TRUNCATE clears bad data from the failed first import before re-inserting
 */

import { createWriteStream, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, "output");
mkdirSync(OUT_DIR, { recursive: true });

const { academies, courses } = await import("../src/data/seed-data.ts");

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number")  return String(value);
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

/** Map TypeScript LessonType → MySQL ENUM value */
function lessonType(t) {
  if (t === "vr-practice") return "vr_practice";
  if (t === "assessment")  return "assessment";
  if (t === "video")       return "video";
  return "text";
}


// Sequential counters — guarantees unique primary keys for all entities
let crsSeq = 0;
let modSeq = 0;
let lesSeq = 0;

const lines = [];

lines.push("-- VowLMS Seed Data");
lines.push("-- Generated: " + new Date().toISOString());
lines.push(`-- ${courses.length} courses, ${academies.length} academies`);
lines.push("");
lines.push("SET FOREIGN_KEY_CHECKS=0;");
lines.push("SET NAMES utf8mb4;");
lines.push("SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';");
lines.push("");

// ── Clear previous (bad) data ─────────────────────────────────────────────────
lines.push("-- Clear previous import (ensures clean re-run)");
lines.push("TRUNCATE TABLE `lesson_resources`;");
lines.push("TRUNCATE TABLE `progress`;");
lines.push("TRUNCATE TABLE `enrollments`;");
lines.push("TRUNCATE TABLE `lessons`;");
lines.push("TRUNCATE TABLE `modules`;");
lines.push("TRUNCATE TABLE `courses`;");
lines.push("");

// ── Academies (INSERT IGNORE — may already exist) ─────────────────────────────
lines.push("-- Academies");
for (const a of academies) {
  lines.push(
    `INSERT IGNORE INTO academies (id, slug, name, description, audience, category, hero_message) VALUES (` +
    [esc(`aca-${a.slug}`), esc(a.slug), esc(a.name), esc(a.description), esc(a.audience), esc(a.category), esc(a.heroMessage)].join(", ") +
    `);`
  );
}
lines.push("");

// ── Courses, Modules, Lessons ─────────────────────────────────────────────────
lines.push("-- Courses + Modules + Lessons");
let courseCount = 0;

for (const c of courses) {
  crsSeq++;
  const cId       = `crs-${String(crsSeq).padStart(32, "0")}`;
  const academyId = `aca-${c.academySlug}`;
  const price     = typeof c.price === "number" ? c.price : 0;
  const isFree    = price === 0 ? 1 : 0;

  lines.push(
    `INSERT INTO courses (id, slug, academy_id, moodle_id, title, description, level, duration, price, is_free, status) VALUES (` +
    [
      esc(cId), esc(c.slug), esc(academyId), esc(c.moodleId ?? null),
      esc(c.title), esc(c.description ?? ""),
      esc(c.level ?? "Foundation"), esc(c.duration ?? ""),
      esc(price), String(isFree), esc("published"),
    ].join(", ") +
    `);`
  );

  let modPos = 0;
  for (const mod of (c.modules ?? [])) {
    modSeq++;
    modPos++;
    const mId   = `mod-${String(modSeq).padStart(32, "0")}`;
    // CourseModule has no slug field — generate a unique, stable slug
    const mSlug = `${c.slug}--mod-${modPos}`;

    lines.push(
      `INSERT INTO modules (id, slug, course_id, title, position) VALUES (` +
      [esc(mId), esc(mSlug), esc(cId), esc(mod.title), esc(modPos)].join(", ") +
      `);`
    );

    let lesPos = 0;
    for (const les of (mod.lessons ?? [])) {
      lesSeq++;
      lesPos++;
      const lId   = `les-${String(lesSeq).padStart(32, "0")}`;
      const lType = lessonType(les.type);

      lines.push(
        `INSERT INTO lessons (id, slug, module_id, title, type, duration_minutes, position) VALUES (` +
        [
          esc(lId), esc(les.slug ?? ""), esc(mId),
          esc(les.title), esc(lType),
          esc(les.durationMinutes ?? 5), esc(lesPos),
        ].join(", ") +
        `);`
      );
    }
  }

  courseCount++;
  if (courseCount % 50 === 0) process.stdout.write(`  ... ${courseCount}/${courses.length} courses\n`);
}

lines.push("");
lines.push("SET FOREIGN_KEY_CHECKS=1;");
lines.push("");
lines.push(`-- Done: ${courses.length} courses seeded.`);
lines.push(`-- Modules inserted: ${modSeq}`);
lines.push(`-- Lessons inserted: ${lesSeq}`);

const seedPath = join(OUT_DIR, "vowlms_seed.sql");
const ws = createWriteStream(seedPath, { encoding: "utf8" });
ws.write(lines.join("\n"));
ws.end(() => {
  console.log(`\n✓ Seed SQL written to: ${seedPath}`);
  console.log(`  Courses:  ${courseCount}`);
  console.log(`  Modules:  ${modSeq}`);
  console.log(`  Lessons:  ${lesSeq}`);
  console.log(`\nImport in phpMyAdmin AFTER 001_schema.sql and 002_seed_academies.sql`);
  console.log(`Then import 008_lesson_content.sql and 010_resources_data.sql`);
});
