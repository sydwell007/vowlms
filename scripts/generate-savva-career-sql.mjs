import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const courses = JSON.parse(readFileSync(join(root, "src/data/savva-career-courses.json"), "utf8"));
const output = join(root, "public/sql/038_seed_savva_career_courses.sql");
const id = (value) => createHash("md5").update(`vowlms:${value}`).digest("hex");
const q = (value) => `'${String(value ?? "").replaceAll("'", "''")}'`;

const sql = [];
sql.push(`-- VowLMS migration 038: 37 SAVVA career courses\n-- Admin preview only. Courses remain draft until an administrator explicitly publishes them.\n-- Requires migrations 001 and 018. Re-running is idempotent.\nSET NAMES utf8mb4;\nSET @academy_id := (SELECT id FROM academies WHERE slug = 'upskilling-academy' LIMIT 1);\nSTART TRANSACTION;`);

for (const course of courses) {
  const courseId = id(`course:${course.slug}`);
  sql.push(`\n-- ${course.title}\nINSERT INTO courses (id,slug,academy_id,moodle_id,title,description,level,duration,price,is_free,status)\nSELECT ${q(courseId)},${q(course.slug)},@academy_id,NULL,${q(course.title)},${q(course.description)},${q(course.level)},${q(course.duration)},${Number(course.price).toFixed(2)},0,'draft'\nWHERE @academy_id IS NOT NULL\nON DUPLICATE KEY UPDATE title=VALUES(title),description=VALUES(description),level=VALUES(level),duration=VALUES(duration),price=VALUES(price),is_free=0,status=IF(status='published','published','draft');`);

  for (const moduleItem of course.modules) {
    const moduleSlug = `${course.slug}-module-${moduleItem.order}`;
    const moduleId = id(`module:${moduleSlug}`);
    sql.push(`INSERT INTO modules (id,slug,course_id,title,position) VALUES (${q(moduleId)},${q(moduleSlug)},${q(courseId)},${q(moduleItem.title)},${Number(moduleItem.order)}) ON DUPLICATE KEY UPDATE title=VALUES(title),position=VALUES(position);`);

    moduleItem.lessons.forEach((lesson, index) => {
      const lessonId = id(`lesson:${lesson.slug}`);
      const presenter = lesson.vowHuman;
      sql.push(`INSERT INTO lessons (id,slug,module_id,title,type,duration_minutes,content,video_url,position,vowhuman_enabled,vowhuman_embed_url,vowhuman_presenter_name,vowhuman_intro,vowhuman_placement,vowhuman_role,vowhuman_expertise,vowhuman_camera_enabled,vowhuman_microphone_enabled) VALUES (${q(lessonId)},${q(lesson.slug)},${q(moduleId)},${q(lesson.title)},${q(lesson.type)},${Number(lesson.durationMinutes)},${q(lesson.content)},NULL,${index},${presenter?.enabled ? 1 : 0},${presenter ? q(presenter.embedUrl) : "NULL"},${presenter ? q(presenter.presenterName) : "NULL"},${presenter ? q(presenter.introduction) : "NULL"},${presenter ? q(presenter.placement) : q("before-content")},${presenter ? q(presenter.role) : q("presenter")},${presenter ? q(presenter.expertise) : "NULL"},${presenter?.cameraEnabled ? 1 : 0},${presenter?.microphoneEnabled ? 1 : 0}) ON DUPLICATE KEY UPDATE title=VALUES(title),type=VALUES(type),duration_minutes=VALUES(duration_minutes),content=VALUES(content),position=VALUES(position),vowhuman_enabled=VALUES(vowhuman_enabled),vowhuman_embed_url=VALUES(vowhuman_embed_url),vowhuman_presenter_name=VALUES(vowhuman_presenter_name),vowhuman_intro=VALUES(vowhuman_intro),vowhuman_placement=VALUES(vowhuman_placement),vowhuman_role=VALUES(vowhuman_role),vowhuman_expertise=VALUES(vowhuman_expertise),vowhuman_camera_enabled=VALUES(vowhuman_camera_enabled),vowhuman_microphone_enabled=VALUES(vowhuman_microphone_enabled);`);
    });
  }

  for (const assessment of course.assessments) {
    sql.push(`INSERT INTO assessments (id,slug,course_id,title,pass_mark,questions) VALUES (${q(id(`assessment:${assessment.slug}`))},${q(assessment.slug)},${q(courseId)},${q(assessment.title)},${Number(assessment.passMark)},CAST(${q(JSON.stringify(assessment.questions))} AS JSON)) ON DUPLICATE KEY UPDATE title=VALUES(title),pass_mark=VALUES(pass_mark),questions=VALUES(questions);`);
  }
}

sql.push(`\nCOMMIT;\n\nSELECT status, COUNT(*) AS courses FROM courses WHERE slug IN (${courses.map((course) => q(course.slug)).join(",")}) GROUP BY status;`);
writeFileSync(output, `${sql.join("\n")}\n`, "utf8");
console.log(`Generated ${output} for ${courses.length} courses.`);
