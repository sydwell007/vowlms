/**
 * VowLMS Prisma Seed — populates the database from migrated Moodle data.
 *
 * Run AFTER running all 3 migration scripts:
 *   node scripts/moodle-migration/1-fetch-courses.mjs
 *   node scripts/moodle-migration/2-fetch-structure.mjs
 *   node scripts/moodle-migration/3-transform.mjs
 *
 * Then seed:
 *   npx prisma db push
 *   npx tsx prisma/seed.ts
 */

import { PrismaClient, LessonType, CourseStatus } from "@prisma/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const prisma = new PrismaClient();

const SEED_FILE = join(process.cwd(), "scripts/moodle-migration/data/vowlms-seed.json");

function lessonTypeEnum(t: string): LessonType {
  const map: Record<string, LessonType> = {
    text: LessonType.TEXT,
    video: LessonType.VIDEO,
    assessment: LessonType.ASSESSMENT,
    "vr-practice": LessonType.VR_PRACTICE,
  };
  return map[t] ?? LessonType.TEXT;
}

function cid(str: string): string {
  return createHash("md5").update(str).digest("hex").slice(0, 25);
}

async function main() {
  console.log("=== VowLMS Database Seed ===\n");

  if (!existsSync(SEED_FILE)) {
    throw new Error(
      `Seed file not found at ${SEED_FILE}. Run the 3 migration scripts first.`
    );
  }

  const seed = JSON.parse(readFileSync(SEED_FILE, "utf-8"));
  console.log(
    `Source: ${seed.source}\nGenerated: ${seed.generatedAt}\nCourses: ${seed.totalCourses}\n`
  );

  // ─── 1. Academies ──────────────────────────────────────────────────
  console.log("Seeding academies...");
  const academyMap: Record<string, string> = {};

  for (const a of seed.academies) {
    const academy = await prisma.academy.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        description: a.description,
        audience: a.audience,
        category: a.category,
        heroMessage: a.heroMessage,
      },
      create: {
        id: cid(`academy:${a.slug}`),
        slug: a.slug,
        name: a.name,
        description: a.description,
        audience: a.audience,
        category: a.category,
        heroMessage: a.heroMessage,
      },
    });
    academyMap[a.slug] = academy.id;
    console.log(`  ✅ ${a.name}`);
  }

  // ─── 2. Courses ────────────────────────────────────────────────────
  console.log(`\nSeeding ${seed.courses.length} courses...`);
  let coursesDone = 0;
  let lessonsDone = 0;
  const errors: string[] = [];

  for (const c of seed.courses) {
    const academyId = academyMap[c.academySlug];
    if (!academyId) {
      errors.push(`No academy found for slug: ${c.academySlug} (course: ${c.title})`);
      continue;
    }

    try {
      const course = await prisma.course.upsert({
        where: { slug: c.slug },
        update: {
          title: c.title,
          description: c.description,
          level: c.level,
          duration: c.duration,
          price: c.price,
          status: CourseStatus.PUBLISHED,
        },
        create: {
          id: cid(`course:${c.slug}`),
          slug: c.slug,
          academyId,
          title: c.title,
          description: c.description,
          level: c.level,
          duration: c.duration,
          price: c.price,
          status: CourseStatus.PUBLISHED,
        },
      });

      // ─── Modules + Lessons ────────────────────────────────────────
      for (const mod of c.modules || []) {
        const courseModule = await prisma.module.upsert({
          where: { courseId_order: { courseId: course.id, order: mod.order } },
          update: { title: mod.title },
          create: {
            id: cid(`module:${c.slug}:${mod.order}`),
            courseId: course.id,
            title: mod.title,
            order: mod.order,
          },
        });

        for (const lesson of mod.lessons || []) {
          await prisma.lesson.upsert({
            where: { slug: lesson.slug },
            update: {
              title: lesson.title,
              type: lessonTypeEnum(lesson.type),
              content: lesson.content,
              videoUrl: lesson.videoUrl || null,
              hasAssessment: lesson.hasAssessment,
              hasVRPractice: lesson.hasVRPractice,
              order: lesson.order,
            },
            create: {
              id: cid(`lesson:${lesson.slug}`),
              moduleId: courseModule.id,
              slug: lesson.slug,
              title: lesson.title,
              type: lessonTypeEnum(lesson.type),
              content: lesson.content,
              videoUrl: lesson.videoUrl || null,
              hasAssessment: lesson.hasAssessment,
              hasVRPractice: lesson.hasVRPractice,
              order: lesson.order,
            },
          });
          lessonsDone++;
        }
      }

      // ─── Assessments ──────────────────────────────────────────────
      for (const assessment of c.assessments || []) {
        const assessmentLesson = await prisma.lesson.findFirst({
          where: {
            module: { courseId: course.id },
            type: LessonType.ASSESSMENT,
          },
        });
        if (!assessmentLesson) continue;

        await prisma.assessment.upsert({
          where: { slug: assessment.slug },
          update: {
            title: assessment.title,
            passMark: assessment.passMark,
            questions: assessment.questions,
          },
          create: {
            id: cid(`assessment:${assessment.slug}`),
            courseId: course.id,
            lessonId: assessmentLesson.id,
            slug: assessment.slug,
            title: assessment.title,
            passMark: assessment.passMark,
            questions: assessment.questions,
          },
        });
      }

      // ─── VR Practices ─────────────────────────────────────────────
      for (const vr of c.vrPractices || []) {
        const vrLesson = await prisma.lesson.findFirst({
          where: {
            module: { courseId: course.id },
            type: LessonType.VR_PRACTICE,
          },
        });
        if (!vrLesson) continue;

        await prisma.vRPractice.upsert({
          where: { slug: vr.slug },
          update: {
            title: vr.title,
            scenario: vr.scenario,
            skillsPracticed: vr.skillsPracticed,
          },
          create: {
            id: cid(`vr:${vr.slug}`),
            courseId: course.id,
            lessonId: vrLesson.id,
            slug: vr.slug,
            title: vr.title,
            scenario: vr.scenario,
            skillsPracticed: vr.skillsPracticed,
          },
        });
      }

      coursesDone++;
      if (coursesDone % 20 === 0) {
        console.log(`  ${coursesDone}/${seed.courses.length} courses seeded...`);
      }
    } catch (err) {
      errors.push(`Course ${c.slug}: ${(err as Error).message}`);
    }
  }

  // ─── 3. Admin user ─────────────────────────────────────────────────
  console.log("\nSeeding admin user...");
  await prisma.user.upsert({
    where: { email: "admin@vowlms.co.za" },
    update: {},
    create: {
      id: cid("user:admin@vowlms.co.za"),
      name: "VowLMS Admin",
      email: "admin@vowlms.co.za",
      role: "ADMIN",
      profile: {
        create: {
          id: cid("profile:admin@vowlms.co.za"),
          city: "Cape Town",
          country: "South Africa",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "sydwell@goalvow.com" },
    update: {},
    create: {
      id: cid("user:sydwell@goalvow.com"),
      name: "Sydwell",
      email: "sydwell@goalvow.com",
      role: "ADMIN",
      profile: {
        create: {
          id: cid("profile:sydwell@goalvow.com"),
          city: "Cape Town",
          country: "South Africa",
        },
      },
    },
  });

  console.log("  ✅ Admin users created");

  // ─── 4. Learning Hubs ──────────────────────────────────────────────
  console.log("\nSeeding learning hubs...");
  const hubs = [
    { name: "Khayelitsha Learning Hub", location: "Khayelitsha, Cape Town", capacity: 40, focus: "Digital skills & upskilling", status: "active" },
    { name: "Mitchell's Plain Hub", location: "Mitchell's Plain, Cape Town", capacity: 30, focus: "Chef Academy & hospitality", status: "active" },
    { name: "Bellville Skills Centre", location: "Bellville, Cape Town", capacity: 50, focus: "Business school & skills training", status: "partner-ready" },
    { name: "Johannesburg CBD Hub", location: "Johannesburg CBD, Gauteng", capacity: 60, focus: "University online & business", status: "planned" },
    { name: "Durban North Hub", location: "Durban North, KwaZulu-Natal", capacity: 35, focus: "Chef Academy & upskilling", status: "planned" },
  ];

  for (const hub of hubs) {
    await prisma.learningHub.upsert({
      where: { name_location: { name: hub.name, location: hub.location } },
      update: hub,
      create: { id: cid(`hub:${hub.name}`), ...hub },
    });
  }
  console.log("  ✅ 5 learning hubs seeded");

  // ─── Summary ───────────────────────────────────────────────────────
  console.log("\n=== Seed Complete ===");
  console.log(`  Academies: ${seed.academies.length}`);
  console.log(`  Courses:   ${coursesDone} / ${seed.courses.length}`);
  console.log(`  Lessons:   ${lessonsDone}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} errors:`);
    errors.slice(0, 10).forEach((e) => console.log("  - " + e));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
