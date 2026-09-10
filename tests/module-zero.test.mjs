import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const moduleZeroSource = readFileSync(new URL("src/data/course-module-zero.ts", root), "utf8");
const dataSource = readFileSync(new URL("src/lib/data.ts", root), "utf8");
const imageSource = readFileSync(new URL("src/lib/module-images.ts", root), "utf8");

const courseSlugs = [
  "business-ethics", "workplace-compliance", "organizational-culture", "stress-management",
  "cybersecurity", "health-and-wellness", "human-resources", "marketing", "sales",
  "project-management", "customer-service", "career-management", "change-management",
  "communication", "leadership", "resilience", "problem-solving", "time-management",
  "team-management", "critical-thinking",
];

test("all 20 Upskilling courses have relevant Module 0 profiles", () => {
  for (const slug of courseSlugs) {
    const property = slug.includes("-") ? `\"${slug}\"` : slug;
    assert.match(moduleZeroSource, new RegExp(`\\n\\s{2}${property}: \\{`), `${slug} is missing Module 0 content`);
  }
  assert.match(moduleZeroSource, /Introduction, Purpose, Objectives, Summary/);
  assert.match(moduleZeroSource, /0\.1 Welcome to/);
  assert.match(moduleZeroSource, /0\.4 Orientation Summary and Readiness Check/);
});

test("Module 0 is assembled before imported modules and uses the shared orientation image", () => {
  assert.ok(dataSource.indexOf("if (moduleZero) modules.push(moduleZero)") < dataSource.indexOf("grouping.moduleSlugOrder.forEach"));
  assert.match(imageSource, /moduleOrder === 0/);
  assert.match(imageSource, /module-zero-orientation\.jpg/);
  assert.equal(existsSync(new URL("public/images/module-zero-orientation.jpg", root)), true);
});
