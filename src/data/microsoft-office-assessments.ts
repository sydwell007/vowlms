import { isMicrosoftOfficeModule } from "@/data/microsoft-office-content";
import type { Assessment, Lesson, MultipleChoiceQuestion } from "@/types/lms";

function cleanSkill(title: string) {
  return title.replace(/^Lesson\s+\d+\s*:\s*/i, "").replace(/\s+/g, " ").trim();
}

export function buildMicrosoftOfficeAssessment(input: {
  childSlug: string;
  moduleTitle: string;
  assessmentLesson: Lesson;
  moduleLessons: Lesson[];
}): Assessment | null {
  if (!isMicrosoftOfficeModule(input.childSlug)) return null;

  const skills = input.moduleLessons
    .filter((lesson) => lesson.type === "text" && /^Lesson\s+\d+\s*:/i.test(lesson.title))
    .map((lesson) => cleanSkill(lesson.title));
  if (skills.length < 2) return null;

  const questions: MultipleChoiceQuestion[] = skills.slice(0, 5).map((skill, index) => {
    const distractors = skills.filter((item) => item !== skill);
    while (distractors.length < 3) distractors.push("Skip the task and leave the default result unchanged");
    const options = [skill, ...distractors.slice(index % distractors.length).concat(distractors).slice(0, 3)];
    return {
      id: `${input.assessmentLesson.slug}-q${index + 1}`,
      type: "multiple-choice",
      prompt: `Which skill from ${input.moduleTitle} most directly supports a workplace task requiring you to ${skill.toLowerCase()}?`,
      options,
      answer: skill,
      explanation: `${skill} is the module skill designed for that task. Apply it in the relevant Microsoft Office application and verify the result before sharing your work.`,
      clue: "Match the task to the lesson whose title describes the required action most precisely.",
    };
  });

  return {
    slug: input.assessmentLesson.slug,
    lessonSlug: input.assessmentLesson.slug,
    title: `${input.moduleTitle}: Applied Knowledge Check`,
    passMark: 80,
    questions,
  };
}
