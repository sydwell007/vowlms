import { requireMoodleToken } from "./env.mjs";

const academies = [
  { id: "upskilling", name: "Upskilling Academy", base: process.env.UPSKILLING_MOODLE_BASE_URL || "https://goalvow.com/upskilling" },
  { id: "skills-training", name: "Skills Training Academy", base: process.env.SKILLS_TRAINING_MOODLE_BASE_URL || "https://goalvow.com/skillstraining" },
  { id: "chef-academy", name: "Chef Academy", base: process.env.CHEF_ACADEMY_MOODLE_BASE_URL || "https://goalvow.com/chefacademy" },
  { id: "schools", name: "GoalVow Schools", base: process.env.GOALVOW_SCHOOLS_MOODLE_BASE_URL || "https://goalvow.com/schools" },
  { id: "business-school", name: "Business School", base: process.env.BUSINESS_SCHOOL_MOODLE_BASE_URL || "https://goalvow.com/businessschool" },
  { id: "university", name: "University Online", base: process.env.GOALVOW_UNIVERSITY_MOODLE_BASE_URL || "https://goalvow.com/university" },
];

async function moodleRequest(academy, token, wsfunction) {
  const url = new URL(`${academy.base.replace(/\/$/, "")}/webservice/rest/server.php`);
  url.searchParams.set("wstoken", token);
  url.searchParams.set("wsfunction", wsfunction);
  url.searchParams.set("moodlewsrestformat", "json");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({
    exception: "invalid_response",
    message: `HTTP ${response.status}: Moodle did not return JSON`,
  }));

  if (!response.ok || body?.exception || body?.errorcode) {
    throw new Error(JSON.stringify(body));
  }

  return body;
}

async function checkAcademy(academy) {
  try {
    const token = requireMoodleToken(academy.id);
    const [site, courses] = await Promise.all([
      moodleRequest(academy, token, "core_webservice_get_site_info"),
      moodleRequest(academy, token, "core_course_get_courses"),
    ]);
    const visibleCourses = Array.isArray(courses)
      ? courses.filter((course) => course.id !== 1 && course.visible !== 0).length
      : 0;

    console.log(
      `\u2705 ${academy.name} \u2014 ${site.sitename ?? "Unnamed site"} \u2014 Username confirmed: ${site.username ?? "Unknown user"} \u2014 ${visibleCourses} courses visible`,
    );
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\u274c ${academy.name} \u2014 ${message} \u2014 What to fix: verify the academy URL, token, web-service permissions, and host TLS chain.`);
    return false;
  }
}

const results = [];
for (const academy of academies) results.push(await checkAcademy(academy));
if (results.some((passed) => !passed)) process.exitCode = 1;
