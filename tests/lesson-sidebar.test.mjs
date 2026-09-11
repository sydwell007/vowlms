import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const playerSource = readFileSync(
  new URL("src/components/learning/LessonPlayer.tsx", root),
  "utf8",
);
const lessonPageSource = readFileSync(
  new URL("src/app/lesson/[slug]/page.tsx", root),
  "utf8",
);

test("lesson sidebar opens only the active module by default", () => {
  assert.match(playerSource, /useState<Set<number>>\([\s\S]*new Set\(\[module\.order\]\)/);
  assert.match(playerSource, /expandedModules\.has\(m\.order\)/);
  assert.equal(
    [...lessonPageSource.matchAll(/key=\{`\$\{[^`]+\.order\}`\}/g)].length,
    3,
    "every LessonPlayer data path must reset state when the active module changes",
  );
});

test("every module remains independently accessible as an accordion", () => {
  assert.match(playerSource, /onClick=\{\(\) => toggleModule\(m\.order\)\}/);
  assert.match(playerSource, /aria-expanded=\{isExpanded\}/);
  assert.match(playerSource, /aria-controls=\{modulePanelId\}/);
  assert.match(playerSource, /grid-rows-\[1fr\]/);
  assert.match(playerSource, /grid-rows-\[0fr\]/);
  assert.match(playerSource, /inert=\{!isExpanded\}/);
  assert.match(playerSource, /aria-current=\{isCurrent \? "page" : undefined\}/);
  assert.match(playerSource, />\s*Current\s*</);
});
