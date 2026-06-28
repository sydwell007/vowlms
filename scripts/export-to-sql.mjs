/**
 * Generates vowlms_seed.sql from the TypeScript seed data.
 * Run with: node --import=tsx/esm scripts/export-to-sql.mjs
 * Or:       npx tsx scripts/export-to-sql.mjs
 *
 * Output: scripts/output/vowlms_seed.sql
 *         scripts/output/vowlms_schema.sql  (copied from below)
 */

import { createWriteStream, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "output");
mkdirSync(OUT_DIR, { recursive: true });

// Dynamic import of compiled seed data
const { academies, courses } = await import("../src/data/seed-data.ts");

function esc(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

function uuid(prefix, slug) {
  // Deterministic-ish ID using slug hash for repeatability
  const cleaned = slug.replace(/[^a-z0-9]/gi, "").slice(0, 20).padEnd(20, "0");
  return `${prefix}-${cleaned}`;
}

const lines = [];

lines.push("-- VowLMS Seed Data");
lines.push("-- Generated: " + new Date().toISOString());
lines.push("-- Source: src/data/seed-data.ts (614 Moodle courses)");
lines.push("-- Upload to phpMyAdmin AFTER running schema.sql");
lines.push("");
lines.push("SET FOREIGN_KEY_CHECKS=0;");
lines.push("SET NAMES utf8mb4;");
lines.push("");

// ── Academies ───────────────────────────────────────────────────────────────
lines.push("-- ─────────────────────────────────────────────────────────────");
lines.push("-- Academies (6 rows)");
lines.push("-- ─────────────────────────────────────────────────────────────");

for (const a of academies) {
  const id = uuid("aca", a.slug);
  lines.push(
    `INSERT IGNORE INTO academies (id, slug, name, description, audience, category, hero_message) VALUES (` +
      [esc(id), esc(a.slug), esc(a.name), esc(a.description), esc(a.audience), esc(a.category), esc(a.heroMessage)].join(", ") +
      `);`,
  );
}

lines.push("");

// Build academy slug → id map
const academyIdMap = Object.fromEntries(
  academies.map((a) => [a.slug, uuid("aca", a.slug)]),
);

// ── Courses ─────────────────────────────────────────────────────────────────
lines.push("-- ─────────────────────────────────────────────────────────────");
lines.push(`-- Courses (${courses.length} rows)`);
lines.push("-- ─────────────────────────────────────────────────────────────");

let courseCount = 0;
for (const c of courses) {
  const id = uuid("crs", c.slug);
  const academyId = academyIdMap[c.academySlug] ?? "NULL";
  const price = typeof c.price === "number" ? c.price : 0;
  const isFree = price === 0 ? 1 : 0;
  lines.push(
    `INSERT IGNORE INTO courses (id, slug, academy_id, moodle_id, title, description, level, duration, price, is_free, status) VALUES (` +
      [
        esc(id),
        esc(c.slug),
        esc(academyId),
        esc(c.moodleId ?? null),
        esc(c.title),
        esc(c.description ?? ""),
        esc(c.level ?? "Foundation"),
        esc(c.duration ?? ""),
        esc(price),
        String(isFree),
        esc("published"),
      ].join(", ") +
      `);`,
  );

  // Modules + Lessons
  let modPos = 0;
  for (const mod of (c.modules ?? [])) {
    const modId = uuid("mod", mod.slug ?? `${c.slug}-m${modPos}`);
    modPos++;
    lines.push(
      `INSERT IGNORE INTO modules (id, slug, course_id, title, position) VALUES (` +
        [esc(modId), esc(mod.slug ?? ""), esc(id), esc(mod.title), esc(modPos)].join(", ") +
        `);`,
    );

    let lesPos = 0;
    for (const les of (mod.lessons ?? [])) {
      const lesId = uuid("les", les.slug ?? `${mod.slug}-l${lesPos}`);
      lesPos++;
      lines.push(
        `INSERT IGNORE INTO lessons (id, slug, module_id, title, type, duration_minutes, position) VALUES (` +
          [
            esc(lesId),
            esc(les.slug ?? ""),
            esc(modId),
            esc(les.title),
            esc(les.type ?? "text"),
            esc(les.durationMinutes ?? 5),
            esc(lesPos),
          ].join(", ") +
          `);`,
      );
    }
  }

  courseCount++;
  if (courseCount % 50 === 0) process.stdout.write(`  ... ${courseCount}/${courses.length} courses\n`);
}

lines.push("");
lines.push("SET FOREIGN_KEY_CHECKS=1;");
lines.push("");
lines.push(`-- Done: ${courses.length} courses, ${academies.length} academies seeded.`);

const seedPath = join(OUT_DIR, "vowlms_seed.sql");
const ws = createWriteStream(seedPath, { encoding: "utf8" });
ws.write(lines.join("\n"));
ws.end(() => {
  console.log(`\n✓ Seed SQL written to: ${seedPath}`);
  console.log(`  Rows: ${courses.length} courses, ${academies.length} academies`);
  console.log(`  Upload to phpMyAdmin AFTER importing schema.sql`);
});
