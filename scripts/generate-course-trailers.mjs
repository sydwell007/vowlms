#!/usr/bin/env node
/**
 * Generates a real, stitched-from-real-footage marketing trailer per
 * Upskilling course, using the actual lesson MP4s produced for VowLMS.
 *
 * Source layout (see SOURCE_ROOT below):
 *   1_SoftSkills/<Course>/<Module>/Lesson <N>/<Lesson Title>/<file>.mp4
 *   2_Health & Wellness/<Module>/Lesson <N>/<Lesson Title>/<file>.mp4   (single course)
 *   3_Awareness/<Course>/<Module>/Lesson <N>/<Lesson Title>/<file>.mp4
 *
 * For each of the 20 Upskilling courses this picks up to MAX_CLIPS real
 * lesson clips (one per module, evenly sampled across the course's real
 * module order if there are more modules than MAX_CLIPS), trims a short,
 * consistent moment from each, and cross-fades them together into one
 * silent MP4 (crossfading unrelated lesson voiceovers would just sound like
 * noise, so this intentionally ships without audio — see CourseTrailer.tsx's
 * existing optional background-music hook for sound).
 *
 * Within each module, the specific lesson clip is chosen RANDOMLY from every
 * real lesson in that module (not always "Lesson 1") — re-running this
 * produces a different, still-genuine edit. Each `Lesson N` folder also
 * contains a `*.tscproj` sibling directory of raw Camtasia production
 * fragments (numbered segments used to *build* the lesson, e.g.
 * `1_COMP-SAFE-01.mp4`) alongside the one real, polished, final assembled
 * lesson video — this deliberately never descends into a `.tscproj`
 * directory, so it only ever picks that real final video, never a raw
 * fragment that might not even show the presenter on camera.
 *
 * Usage:
 *   node scripts/generate-course-trailers.mjs [--source "<path>"] [--slug <course-slug>]
 *
 * Re-run any time the source footage changes — output is fully regenerated,
 * not incrementally patched.
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import ffmpegPath from "ffmpeg-static";

const DEFAULT_SOURCE = "C:\\Users\\sydwe\\OneDrive\\Desktop\\GoalVow Lessons with Audio";
const OUTPUT_DIR = path.join(process.cwd(), "public", "videos", "course-trailers");
const MAX_CLIPS = 6;
const CLIP_START_S = 3; // skip likely title-card / lead-in seconds
const CLIP_DURATION_S = 4; // ~4s of one presenter talking before the cut, per spec
const XFADE_DURATION_S = 0.6;
const OUTPUT_WIDTH = 1280;
const OUTPUT_HEIGHT = 720;

const args = process.argv.slice(2);
const sourceArgIdx = args.indexOf("--source");
const SOURCE_ROOT = sourceArgIdx >= 0 ? args[sourceArgIdx + 1] : DEFAULT_SOURCE;
const slugArgIdx = args.indexOf("--slug");
const ONLY_SLUG = slugArgIdx >= 0 ? args[slugArgIdx + 1] : null;

// ─── Course -> real child module slugs, in VowLMS display order ──────────────
// (mirrors src/data/course-groupings.ts upskillGroupings; kept as a plain
// literal here so this script has zero dependency on the Next.js app build.)
const COURSES = {
  "business-ethics": ["module-1-business-ethics-fundamentals", "module-3-employee-ethics", "module-2-leadership-on-ethics"],
  "workplace-compliance": ["module-1-workplace-health-amp-safety", "module-2-workplace-violence"],
  "organizational-culture": ["module-1-inclusion-and-respect", "module-2-inclusive-communication", "module-3-culture-competence"],
  "stress-management": ["module-1-stress-fundamentals", "module-2-stress-and-work-performance", "module-3-strategies-to-relieve-stress"],
  "cybersecurity": ["module-1-online-security-fundamentals", "module-2-how-to-protect-your-data", "module-3-social-engineering"],
  "health-and-wellness": ["module-1-positive-psychology-fundamentals", "module-2-forming-healthy-habits", "module-3-positive-psychology-in-the-workplace", "module-4-exercise", "module-5-mental-health-awareness", "module-6-dealing-with-emotions"],
  "human-resources": ["module-1-hr-fundamentals", "module-2-diversity-inclusion-and-belonging", "module-3-interviewing", "module-4-unconscious-bias", "module-5-talent-management", "module-6-workplace-well-being", "module-7-anti-harassment-and-discrimination", "module-8-retirement-planning"],
  "marketing": ["module-1-marketing-fundamentals", "module-2-brand-identity-and-strategy", "module-3-product-marketing", "module-4-content-marketing", "module-5-customer-and-marketing-research", "module-6-website-marketing", "module-7-search-engine-optimization", "module-8-social-media-marketing", "module-9-email-marketing", "module-10-paid-advertising", "module-11-marketing-analytics"],
  "sales": ["module-1-sales-fundamentals", "module-2-sales-leadership-and-management", "module-3-sales-psychology", "module-4-presenting-your-solution", "module-5-building-relationships", "module-6-closing-the-deal", "module-7-handling-objections", "module-8-prospecting"],
  "project-management": ["module-1-project-management-fundamentals", "module-2-project-frameworks", "module-3-project-communication", "module-4-project-scheduling", "module-5-project-scope-management", "module-6-project-reporting", "module-7-project-improvement", "module-8-project-change-management"],
  "customer-service": ["module-1-customer-service-fundamentals", "module-2-customer-service-skills", "module-3-customer-communication-basics", "module-4-customer-communication-channels", "module-5-team-management", "module-6-culture-sensitivity", "module-7-difficult-situations"],
  "career-management": ["module-1-driving-your-career", "module-2-assessing-your-strengths-and-skills", "module-3-finding-a-new-job", "module-4-new-professional", "module-5-networking", "module-6-mentoring-in-the-workplace", "module-7-professional-etiquette", "module-8-working-relationships", "module-9-overcoming-challenges"],
  "change-management": ["module-1-change-management-fundamentals", "module-2-change-management-models", "module-3-the-change-management-process", "module-4-communicating-change", "module-5-leading-through-change", "module-6-managing-change-in-time-of-crisis"],
  "communication": ["module-1-communication-fundamentals", "module-2-empathy", "module-3-verbal-communication", "module-4-meetings", "module-5-presentations", "module-6-negotiation-and-persuasion", "module-7-writing-well", "module-8-communicating-in-difficult-situations"],
  "leadership": ["module-1-leadership-fundamentals", "module-2-leadership-styles", "module-3-emotional-intelligence", "module-4-crisis-management"],
  "resilience": ["module-1-resilience-fundamentals", "module-2-building-career-resilience", "module-3-leadership-and-resilience", "module-4-emotional-and-physical-resilience", "module-5-thriving-through-challenges"],
  "problem-solving": ["module-1-problem-solving-fundamentals", "module-2-problem-solving-in-the-workplace", "module-3-steps-to-problem-solving", "module-4-advanced-problem-solving"],
  "time-management": ["module-1-time-management-fundamentals", "module-2-goal-setting", "module-3-scheduling", "module-4-prioritization", "module-5-concentration", "module-6-overcoming-time-challenges"],
  "team-management": ["module-1-team-management-fundamentals", "module-2-new-manager", "module-3-developing-your-team", "module-4-team-culture", "module-5-delegating-tasks", "module-6-motivating-your-team", "module-7-managing-remote-teams", "module-8-team-dynamics", "module-9-performance-management", "module-10-resolving-conflict", "module-11-letting-an-employee-go"],
  "critical-thinking": ["module-1-critical-thinking-fundamentals", "module-2-thinking-in-the-workplace", "module-3-critical-thinking-and-information-literacy"],
};

const COURSE_FOLDER_MAP = {
  "critical-thinking": ["1_SoftSkills", "10_Critical Thinking"],
  "project-management": ["1_SoftSkills", "11_Project Management"],
  "change-management": ["1_SoftSkills", "12_Change Management"],
  "team-management": ["1_SoftSkills", "13_Team Management"],
  "problem-solving": ["1_SoftSkills", "14_Problem Solving"],
  "human-resources": ["1_SoftSkills", "1_HR"],
  "leadership": ["1_SoftSkills", "2_Leadership"],
  "marketing": ["1_SoftSkills", "3_Marketing"],
  "customer-service": ["1_SoftSkills", "4_Customer Service"],
  "sales": ["1_SoftSkills", "5_Sales"],
  "time-management": ["1_SoftSkills", "6_Time Management"],
  "communication": ["1_SoftSkills", "7_Communication"],
  "career-management": ["1_SoftSkills", "8_Career Management"],
  "resilience": ["1_SoftSkills", "9_Resilience"],
  "business-ethics": ["3_Awareness", "1_Business Ethics"],
  "workplace-compliance": ["3_Awareness", "2_Workplace Compliance"],
  "organizational-culture": ["3_Awareness", "3_Organization's Culture"],
  "stress-management": ["3_Awareness", "4_Stress Management"],
  "cybersecurity": ["3_Awareness", "5_Online Security"],
};

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/^\d+_/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.replace(/s$/, ""))
    .join(" ");
}

function wordOverlapScore(a, b) {
  const aw = new Set(normalize(a).split(" ").filter(Boolean));
  const bw = new Set(normalize(b).split(" ").filter(Boolean));
  let hits = 0;
  for (const w of aw) if (bw.has(w)) hits++;
  return hits / Math.max(aw.size, bw.size, 1);
}

function slugToWords(slug) {
  return slug.replace(/^module-\d+-/, "").replace(/-amp-/g, " and ").replace(/-/g, " ");
}

function listDirs(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
}

/**
 * Finds the one real, final, polished lesson mp4 under `dir` — deliberately
 * never descends into a `*.tscproj` directory (that's the raw Camtasia
 * production bin: numbered fragment clips used to build the lesson, not
 * something meant to stand alone as footage). Direct files in `dir` win
 * immediately; only recurses into non-`.tscproj` subdirectories otherwise,
 * covering both real layouts found in the source footage: the mp4 sitting
 * directly in `Lesson N/`, or nested one level into `Lesson N/<title>/`.
 */
function findMp4Recursive(dir, depth = 0) {
  if (depth > 5) return null;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  const mp4 = entries.find((e) => e.isFile() && e.name.toLowerCase().endsWith(".mp4"));
  if (mp4) return path.join(dir, mp4.name);
  for (const e of entries) {
    if (e.isDirectory() && !e.name.toLowerCase().endsWith(".tscproj")) {
      const found = findMp4Recursive(path.join(dir, e.name), depth + 1);
      if (found) return found;
    }
  }
  return null;
}

/** Every real lesson mp4 in a module, across every "Lesson N" folder it has. */
function findAllLessonMp4sInModule(moduleDir) {
  const lessonDirs = listDirs(moduleDir).filter((name) => /lesson\s*\d+/i.test(name));
  const mp4s = [];
  for (const ld of lessonDirs) {
    const mp4 = findMp4Recursive(path.join(moduleDir, ld));
    if (mp4) mp4s.push(mp4);
  }
  return mp4s;
}

/** Picks one lesson's real video from a module at random — a different, still-genuine edit each run. */
function pickRandomMp4InModule(moduleDir) {
  const mp4s = findAllLessonMp4sInModule(moduleDir);
  if (mp4s.length === 0) return null;
  return mp4s[Math.floor(Math.random() * mp4s.length)];
}

function resolveClips(slug, moduleSlugs) {
  const isHealthWellness = slug === "health-and-wellness";
  const courseFullPath = isHealthWellness
    ? path.join(SOURCE_ROOT, "2_Health & Wellness")
    : path.join(SOURCE_ROOT, ...COURSE_FOLDER_MAP[slug]);

  const moduleFolders = listDirs(courseFullPath);
  const clips = [];

  moduleSlugs.forEach((childSlug, idx) => {
    const titleGuess = slugToWords(childSlug);
    let best = null;
    let bestScore = 0;
    for (const mf of moduleFolders) {
      const score = wordOverlapScore(titleGuess, mf);
      if (score > bestScore) {
        bestScore = score;
        best = mf;
      }
    }
    if (!best || bestScore < 0.25) return;
    const mp4 = pickRandomMp4InModule(path.join(courseFullPath, best));
    if (!mp4) return;
    clips.push({ order: idx + 1, moduleFolder: best, mp4 });
  });

  return clips;
}

/** Even sampling across an ordered list, preserving first/last for a start-to-finish arc. */
function sample(list, max) {
  if (list.length <= max) return list;
  const step = (list.length - 1) / (max - 1);
  const picked = [];
  for (let i = 0; i < max; i++) picked.push(list[Math.round(i * step)]);
  return Array.from(new Set(picked));
}

function buildFilterGraph(clipCount) {
  const perClipFilters = [];
  for (let i = 0; i < clipCount; i++) {
    perClipFilters.push(
      `[${i}:v]trim=start=${CLIP_START_S}:duration=${CLIP_DURATION_S},setpts=PTS-STARTPTS,` +
        `scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:force_original_aspect_ratio=decrease,` +
        `pad=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,fps=30[v${i}]`,
    );
  }

  if (clipCount === 1) {
    return { filter: perClipFilters.join(";"), outLabel: "v0" };
  }

  let cum = CLIP_DURATION_S;
  let prevLabel = "v0";
  const xfadeParts = [];
  for (let i = 1; i < clipCount; i++) {
    const offset = Math.max(0, cum - XFADE_DURATION_S);
    const outLabel = i === clipCount - 1 ? "vout" : `vx${i}`;
    xfadeParts.push(
      `[${prevLabel}][v${i}]xfade=transition=fade:duration=${XFADE_DURATION_S}:offset=${offset.toFixed(2)}[${outLabel}]`,
    );
    cum = cum + CLIP_DURATION_S - XFADE_DURATION_S;
    prevLabel = outLabel;
  }

  return { filter: [...perClipFilters, ...xfadeParts].join(";"), outLabel: prevLabel };
}

function generateTrailer(slug, clips) {
  if (clips.length === 0) {
    console.warn(`[${slug}] no clips resolved — skipping`);
    return false;
  }

  const sampled = sample(clips, MAX_CLIPS);
  const { filter, outLabel } = buildFilterGraph(sampled.length);
  const outputPath = path.join(OUTPUT_DIR, `${slug}.mp4`);

  const cmdArgs = [
    "-y",
    ...sampled.flatMap((c) => ["-i", c.mp4]),
    "-filter_complex",
    filter,
    "-map",
    `[${outLabel}]`,
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "26",
    "-preset",
    "medium",
    "-movflags",
    "+faststart",
    outputPath,
  ];

  console.log(`[${slug}] stitching ${sampled.length} real clip(s) -> ${outputPath}`);
  execFileSync(ffmpegPath, cmdArgs, { stdio: ["ignore", "ignore", "pipe"] });
  const stats = fs.statSync(outputPath);
  console.log(`[${slug}] done (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  return true;
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const targets = ONLY_SLUG ? [ONLY_SLUG] : Object.keys(COURSES);
const results = { generated: [], skipped: [] };

for (const slug of targets) {
  const moduleSlugs = COURSES[slug];
  if (!moduleSlugs) {
    console.warn(`Unknown course slug "${slug}" — skipping`);
    continue;
  }
  const clips = resolveClips(slug, moduleSlugs);
  try {
    const ok = generateTrailer(slug, clips);
    (ok ? results.generated : results.skipped).push(slug);
  } catch (error) {
    console.error(`[${slug}] ffmpeg failed:`, error.message);
    results.skipped.push(slug);
  }
}

console.log("\n=== Summary ===");
console.log("Generated:", results.generated.join(", ") || "(none)");
console.log("Skipped:", results.skipped.join(", ") || "(none)");
