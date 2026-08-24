import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("VowHumans URLs are restricted in TypeScript and PHP", async () => {
  const validator = await read("src/lib/vowhumans.ts");
  const php = await read("public/php/api/admin/lessons.php");

  assert.match(validator, /url\.protocol === "https:"/);
  assert.match(validator, /url\.hostname === "vowhumans\.com"/);
  assert.match(validator, /url\.search === ""/);
  assert.match(validator, /url\.hash === ""/);
  assert.ok(validator.includes("^\\/embed\\/[a-zA-Z0-9-]+\\/[a-zA-Z0-9-]+"));
  assert.match(php, /isAllowedVowHumansUrl/);
  assert.match(php, /requireRole\(\$auth, 'admin'\)/);
  assert.match(php, /vowhumans\.com/);
  assert.doesNotMatch(php, /dangerouslySetInnerHTML/);
});

test("presenter iframe is opt-in, removable, and origin scoped", async () => {
  const component = await read("src/components/learning/VowHumanPresenter.tsx");

  assert.match(component, /mounted \? \(/);
  assert.match(component, /Start AI/);
  assert.match(component, /setMounted\(false\)/);
  assert.match(component, /event\.origin !== VOWHUMANS_ORIGIN/);
  assert.match(component, /allow=\{iframePermissions\}/);
  assert.match(component, /aspect-\[2\/3\]/);
  assert.doesNotMatch(component, /dangerouslySetInnerHTML/);
});

test("VowLMS delegates only required embed capabilities", async () => {
  const config = await read("next.config.ts");

  assert.match(config, /frame-src 'self' https:\/\/vowhumans\.com/);
  assert.match(config, /camera=\(self \"https:\/\/vowhumans\.com\"\)/);
  assert.match(config, /microphone=\(self \"https:\/\/vowhumans\.com\"\)/);
  assert.match(config, /object-src 'none'/);
});

test("migration 018 is additive and seeds the approved lesson safely", async () => {
  const migration = await read("public/sql/018_vowhuman_presenters.sql");

  assert.match(migration, /ALTER TABLE `lessons`/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS `vowhuman_enabled`/);
  assert.match(migration, /module-1-business-ethics-fundamentals-module-reading-material/);
  assert.match(migration, /vowhuman_embed_url` IS NULL/);
  assert.doesNotMatch(migration, /DROP TABLE|TRUNCATE TABLE|DELETE FROM/i);
});
