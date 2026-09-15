import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifestPath = new URL("../src/data/vr/upskilling-practices.json", import.meta.url);

test("Upskilling VR manifest covers all launch courses and modules", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const practices = manifest.practices;
  const courseSlugs = new Set(practices.map((practice) => practice.courseSlug));
  const practiceSlugs = new Set(practices.map((practice) => practice.slug));
  const lessonSlugs = new Set(practices.map((practice) => practice.lessonSlug));

  assert.equal(manifest.summary.courseCount, 20);
  assert.equal(manifest.summary.moduleCount, 118);
  assert.equal(manifest.summary.practiceCount, 118);
  assert.equal(manifest.summary.taskCount, 590);
  assert.equal(courseSlugs.size, 20);
  assert.equal(practices.length, 118);
  assert.equal(practiceSlugs.size, practices.length);
  assert.equal(lessonSlugs.size, practices.length);
});

test("every module practice has a valid five-stage find-and-act flow", async () => {
  const { practices } = JSON.parse(await readFile(manifestPath, "utf8"));

  for (const practice of practices) {
    assert.equal(practice.tasks.length, 5, practice.slug);
    assert.equal(practice.hotspots.length, 5, practice.slug);
    assert.ok(practice.assessmentLessonSlug, practice.slug);
    assert.equal(practice.deployment.placement, "after-module-assessment", practice.slug);
    assert.deepEqual(practice.tasks.map((task) => task.stage), ["Observe", "Diagnose", "Decide", "Act", "Verify"], practice.slug);

    for (const task of practice.tasks) {
      assert.ok(task.options.includes(task.correctOption), `${practice.slug}:${task.id}`);
      assert.ok(practice.hotspots.some((hotspot) => hotspot.id === task.hotspotId), `${practice.slug}:${task.id}`);
      assert.ok(task.actionPrompt.length > 30, `${practice.slug}:${task.id}`);
    }
  }
});
