import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const academies = [
  ["upskilling-academy", "Upskilling Academy", "Short, practical pathways for employability and digital readiness.", "Job seekers, workers, youth, and community learners", "upskilling", "Turn everyday ambition into visible progress."],
  ["skills-training-academy", "Skills Training Academy", "Hands-on trade and service skills connected to local work.", "Practical skills learners", "skills-training", "Practice real skills and move toward income."],
  ["chef-academy", "Chef Academy", "Culinary foundations, kitchen operations, and ChefOrder-linked growth.", "Aspiring chefs", "chef-academy", "Build kitchen confidence."],
  ["private-school", "Private School", "Daycare, preschool, primary, and high school support.", "Families and school operators", "private-school", "A modern school pathway."],
  ["business-school", "Business School", "Entrepreneurship, operations, sales, and finance basics.", "Founders and SMEs", "business-school", "Move from idea to operating business."],
  ["university-online", "University Online", "Higher education readiness and online study skills.", "Adult learners and professional students", "university-online", "Prepare for flexible online study."],
];

const courses = [
  ["career-readiness-accelerator", "upskilling-academy", "Career Readiness Accelerator", "CV strength, interview preparation, workplace habits, and PlugConnect opportunity matching.", "Foundation", "3 weeks", 0],
  ["digital-workplace-essentials", "upskilling-academy", "Digital Workplace Essentials", "Core productivity, communication, and online collaboration for modern teams.", "Foundation", "4 weeks", 299],
  ["solar-installation-foundations", "skills-training-academy", "Solar Installation Foundations", "Safety, components, site checks, and supervised installation practice.", "Intermediate", "6 weeks", 899],
  ["professional-chef-foundations", "chef-academy", "Professional Chef Foundations", "Kitchen safety, prep discipline, menu basics, and ChefOrder-ready service standards.", "Foundation", "6 weeks", 799],
  ["school-readiness-bridge", "private-school", "School Readiness Bridge", "Foundational literacy, numeracy, confidence, and learning routines.", "Foundation", "8 weeks", 349],
  ["small-business-launchpad", "business-school", "Small Business Launchpad", "Turn a practical idea into a simple operating model.", "Intermediate", "5 weeks", 599],
  ["university-online-learning-skills", "university-online", "University Online Learning Skills", "Study planning, research basics, and digital confidence.", "Foundation", "4 weeks", 399],
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "learner@vowlms.local" },
    update: {},
    create: {
      name: "Amina Mokoena",
      email: "learner@vowlms.local",
      role: "LEARNER",
      profile: { create: { city: "Johannesburg", country: "South Africa" } },
    },
  });

  const academyRecords = new Map();

  for (const [slug, name, description, audience, category, heroMessage] of academies) {
    const academy = await prisma.academy.upsert({
      where: { slug },
      update: { name, description, audience, category, heroMessage },
      create: { slug, name, description, audience, category, heroMessage },
    });
    academyRecords.set(slug, academy);
  }

  for (const [slug, academySlug, title, description, level, duration, price] of courses) {
    const academy = academyRecords.get(academySlug);
    const course = await prisma.course.upsert({
      where: { slug },
      update: { title, description, level, duration, price, status: "PUBLISHED" },
      create: {
        slug,
        academyId: academy.id,
        title,
        description,
        level,
        duration,
        price,
        status: "PUBLISHED",
      },
    });

    const courseModule = await prisma.module.upsert({
      where: { courseId_order: { courseId: course.id, order: 1 } },
      update: { title: "Foundation readiness" },
      create: { courseId: course.id, title: "Foundation readiness", order: 1 },
    });

    const lesson = await prisma.lesson.upsert({
      where: { slug: `${slug}-orientation` },
      update: { title: "GoalVow pathway orientation" },
      create: {
        moduleId: courseModule.id,
        slug: `${slug}-orientation`,
        title: "GoalVow pathway orientation",
        type: "TEXT",
        content: "Set a clear goal, follow a practical plan, and track measurable progress.",
        order: 1,
      },
    });

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      update: { progress: 35 },
      create: { userId: user.id, courseId: course.id, progress: 35 },
    });

    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: user.id, lessonId: lesson.id, completed: true, completedAt: new Date() },
    });
  }

  await prisma.learningHub.createMany({
    data: [
      { name: "Soweto Learning Hub", location: "Soweto, Gauteng", capacity: 120, focus: "Youth employability and VR practice", status: "partner-ready" },
      { name: "GoalVow Online Hub", location: "Remote", capacity: 500, focus: "PWA access and mobile-first learning", status: "active" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
