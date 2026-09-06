/**
 * Turns a real lesson title into a short, benefit-oriented "what you'll learn"
 * line for the Course Preview outline. Deliberately derived from the actual
 * lesson title (never invented content) so it stays honest at any scale —
 * one lightweight rule set instead of hand-authoring hundreds of lessons.
 */

export function stripLessonPrefix(title: string): string {
  return title.replace(/^Lesson\s*\d+\s*[:.-]?\s*/i, "").trim();
}

function lowerFirst(text: string): string {
  return text.length > 0 ? text[0].toLowerCase() + text.slice(1) : text;
}

type Rule = { test: RegExp; build: (topic: string, match: RegExpMatchArray) => string };

const RULES: Rule[] = [
  {
    test: /^what\s+is\s+(.+?)\??$/i,
    build: (_topic, m) => `Understand exactly what ${lowerFirst(m[1])} means and why it matters.`,
  },
  {
    test: /^(?:how\s+to\s+)(.+)$/i,
    build: (_topic, m) => `Learn how to ${lowerFirst(m[1])}.`,
  },
  {
    test: /^tips?\s+for\s+(.+)$/i,
    build: (_topic, m) => `Pick up practical tips for ${lowerFirst(m[1])}.`,
  },
  {
    test: /^best\s+practices?\s+for\s+(.+)$/i,
    build: (_topic, m) => `Master best practices for ${lowerFirst(m[1])}.`,
  },
  {
    test: /(introduction to|fundamentals?|basics?)/i,
    build: (topic) => `Build a solid foundation in ${lowerFirst(topic)}.`,
  },
  {
    test: /^advanced\s+(.+)$/i,
    build: (_topic, m) => `Go deeper with advanced techniques in ${lowerFirst(m[1])}.`,
  },
  {
    test: /^(dealing with|handling|managing|overcoming)\s+(.+)$/i,
    build: (_topic, m) => `Learn how to confidently handle ${lowerFirst(m[2])}.`,
  },
  {
    test: /^(the\s+)?(impact|importance|effects?)\s+of\s+(.+)$/i,
    build: (_topic, m) => `Understand why ${lowerFirst(m[3])} really matters.`,
  },
  {
    test: /^(building|developing|creating|forming)\s+.+$/i,
    build: (topic) => `Practise ${lowerFirst(topic)}.`,
  },
  {
    test: /^(assessing|evaluating|analysing|analyzing)\s+(.+)$/i,
    build: (_topic, m) => `Learn to assess and evaluate ${lowerFirst(m[2])}.`,
  },
];

export function getLessonPreviewBlurb(rawTitle: string): string {
  const topic = stripLessonPrefix(rawTitle);
  if (!topic) return "A focused lesson building directly on the module above.";

  for (const rule of RULES) {
    const match = topic.match(rule.test);
    if (match) return rule.build(topic, match);
  }

  return `Explore ${lowerFirst(topic)}.`;
}
