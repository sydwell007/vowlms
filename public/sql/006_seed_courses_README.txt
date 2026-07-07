================================================================================
VowLMS — Course Seed Data (614 Moodle Courses)
File: 006_seed_courses_README.txt
================================================================================

The 614 courses are stored in the TypeScript seed file:
  src/data/seed-data.ts  (74,000 lines)

They cannot be included as a static SQL file because they are too large.
Instead, generate the SQL automatically using the export script:

STEP 1 — Install tsx (if not already installed):
  npm install -g tsx

STEP 2 — From the vowlms project root, run:
  npx tsx scripts/export-to-sql.mjs

STEP 3 — The script will create:
  scripts/output/vowlms_seed.sql

STEP 4 — Upload vowlms_seed.sql to phpMyAdmin:
  - phpMyAdmin → goalvow_lms → Import
  - Choose vowlms_seed.sql
  - Set character set: utf8mb4
  - Click Execute

STEP 5 — Verify:
  SELECT COUNT(*) FROM courses;
  -- Expected: 614

  SELECT COUNT(*) FROM modules;
  -- Will vary (each course has multiple modules)

  SELECT COUNT(*) FROM lessons;
  -- Will vary (each module has multiple lessons)

================================================================================
ORDER OF SQL IMPORT:
  001_schema.sql            — Run first (creates all tables)
  002_seed_academies.sql    — 6 academies
  003_seed_opportunities.sql — 10 sample opportunities
  004_seed_learning_hubs.sql — 5 hubs + announcements + calendar events
  005_admin_user_setup.sql  — Admin + test user (edit passwords first!)
  vowlms_seed.sql           — 614 courses (generate with export script above)
================================================================================
