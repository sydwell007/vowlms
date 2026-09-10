import type { CourseModule, CoursePreviewContent, Lesson } from "@/types/lms";

type ModuleZeroProfile = {
  promise: string;
  challenge: string;
  reflection: string;
};

const PROFILES: Record<string, ModuleZeroProfile> = {
  "business-ethics": { promise: "make principled decisions that protect trust, people, and organisational reputation", challenge: "A trusted colleague asks you to overlook a small policy breach because no one appears to be harmed.", reflection: "Which values should guide you when loyalty and integrity pull in different directions?" },
  "workplace-compliance": { promise: "recognise obligations, reduce workplace risk, and act confidently when standards are not being met", challenge: "A familiar work practice saves time, but it bypasses a documented safety control.", reflection: "What would help you challenge an unsafe norm professionally and constructively?" },
  "organizational-culture": { promise: "help create an inclusive culture where different people can contribute and belong", challenge: "A capable team member is repeatedly excluded from informal conversations where important decisions are shaped.", reflection: "What everyday behaviours make inclusion visible rather than merely stated?" },
  "stress-management": { promise: "recognise pressure early and use practical strategies to protect wellbeing and performance", challenge: "Competing deadlines are affecting your focus, sleep, and communication with colleagues.", reflection: "Which stress signal do you notice first, and what response would be most useful?" },
  cybersecurity: { promise: "make safer digital decisions and become a dependable first line of defence", challenge: "An urgent message from a senior leader asks you to open a link and confirm confidential information.", reflection: "What checks should happen before urgency influences your decision?" },
  "health-and-wellness": { promise: "build sustainable habits that support physical health, emotional wellbeing, and performance", challenge: "A demanding routine leaves little room for recovery, movement, or deliberate self-care.", reflection: "Which small habit would create the greatest positive effect across your week?" },
  "human-resources": { promise: "support fair, compliant, and people-centred decisions across the employee lifecycle", challenge: "A hiring manager favours a familiar candidate profile despite stronger evidence from another applicant.", reflection: "How can HR balance business needs, fairness, evidence, and employee dignity?" },
  marketing: { promise: "connect customer insight, creative strategy, channels, and evidence into effective marketing", challenge: "A campaign generates attention but does not produce meaningful customer action or measurable value.", reflection: "What evidence would tell you whether a campaign is genuinely working?" },
  sales: { promise: "build trust, diagnose real needs, and progress opportunities with confidence and integrity", challenge: "A prospect is interested, but the proposed solution does not fully match their priority needs.", reflection: "How can a salesperson protect trust while still moving a commercial conversation forward?" },
  "project-management": { promise: "turn outcomes into structured plans and guide delivery through risk, change, and stakeholder expectations", challenge: "A project begins with enthusiasm but unclear scope, ownership, and measures of success.", reflection: "Which project question must be answered before detailed planning begins?" },
  "customer-service": { promise: "create consistent, respectful customer experiences even in difficult moments", challenge: "A frustrated customer repeats a complaint after receiving conflicting information from several channels.", reflection: "What would make the customer feel heard while also moving toward resolution?" },
  "career-management": { promise: "make intentional career decisions and communicate your professional value with confidence", challenge: "You are working hard but cannot clearly explain what direction you want your career to take next.", reflection: "What evidence from your strengths and experiences should shape your next move?" },
  "change-management": { promise: "help people understand, adopt, and sustain change while maintaining trust", challenge: "A sound organisational change is meeting resistance because employees feel decisions were made without them.", reflection: "What do people need to know, feel, and do for change to take hold?" },
  communication: { promise: "communicate with clarity, empathy, confidence, and purpose across workplace situations", challenge: "An important message is technically correct but creates confusion and defensiveness in the audience.", reflection: "How should audience, context, and desired outcome shape the way you communicate?" },
  leadership: { promise: "lead with self-awareness, sound judgement, and a practical commitment to helping others perform", challenge: "A team needs direction during uncertainty, but the leader does not yet have every answer.", reflection: "What can a credible leader provide even when certainty is impossible?" },
  resilience: { promise: "recover, adapt, and continue growing through challenge without ignoring wellbeing", challenge: "A professional setback has reduced confidence and made the next decision feel unusually difficult.", reflection: "Which personal, social, and practical resources help you recover most effectively?" },
  "problem-solving": { promise: "define problems accurately, investigate causes, and choose solutions using evidence", challenge: "A recurring workplace issue is being treated repeatedly, but its underlying cause remains unresolved.", reflection: "What is the difference between a visible symptom and the problem that must be solved?" },
  "time-management": { promise: "direct attention and effort toward priorities instead of simply reacting to activity", challenge: "A full calendar creates constant motion while important long-term work remains unfinished.", reflection: "Which commitment deserves protected focus, and what should be reduced or removed?" },
  "team-management": { promise: "create the clarity, trust, accountability, and support teams need to perform", challenge: "A talented team is underperforming because responsibilities and expectations are understood differently.", reflection: "What conversations and working agreements would restore shared accountability?" },
  "critical-thinking": { promise: "evaluate claims, recognise assumptions, and reach reasoned conclusions using reliable evidence", challenge: "A confident recommendation is gaining support even though its evidence is incomplete and selectively presented.", reflection: "Which questions help separate persuasive delivery from sound reasoning?" },
};

const htmlList = (items: string[], ordered = false) => {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
};

export const MODULE_ZERO_LESSON_SUFFIXES = ["introduction", "purpose", "objectives", "summary"] as const;

export function getModuleZeroCourseSlug(lessonSlug: string): string | null {
  const suffix = MODULE_ZERO_LESSON_SUFFIXES.find((item) => lessonSlug.endsWith(`-module-0-${item}`));
  return suffix ? lessonSlug.slice(0, -`-module-0-${suffix}`.length) : null;
}

export function buildModuleZero(input: {
  slug: string;
  title: string;
  description: string;
  outcomes: string[];
  moduleTitles: string[];
  preview?: CoursePreviewContent;
}): CourseModule | null {
  const profile = PROFILES[input.slug];
  if (!profile) return null;

  const roadmap = input.moduleTitles.map((title, index) => `Module ${index + 1}: ${title}`);
  const benefits = input.preview?.benefits ?? [];
  const lesson = (suffix: typeof MODULE_ZERO_LESSON_SUFFIXES[number], title: string, durationMinutes: number, content: string): Lesson => ({
    slug: `${input.slug}-module-0-${suffix}`,
    title,
    type: "text",
    content,
    hasAssessment: false,
    hasVRPractice: false,
    durationMinutes,
  });

  return {
    title: "Introduction, Purpose, Objectives, Summary",
    order: 0,
    description: `A guided orientation to ${input.title}, its professional purpose, learning objectives, course roadmap, and readiness expectations.`,
    outcome: `Begin ${input.title} with a clear purpose, a personal learning goal, and an understanding of the complete learning journey.`,
    lessons: [
      lesson("introduction", `0.1 Welcome to ${input.title}`, 6, `
        <p><strong>Welcome to ${input.title}.</strong> This orientation gives you the context and direction to approach the course with purpose.</p>
        <h2>What this course will help you do</h2>
        <p>${input.description}</p>
        <p>By completing the learning journey, you will be better prepared to ${profile.promise}.</p>
        <h2>A workplace situation to keep in mind</h2>
        <blockquote>${profile.challenge}</blockquote>
        <p>You will return to situations like this throughout the course, using each module to strengthen your judgement and practical response.</p>
        <h2>Your learning commitment</h2>
        <ul><li>Work through the modules in sequence.</li><li>Connect each concept to a real situation from your experience.</li><li>Complete the activities and assessments honestly.</li><li>Record one action you can apply after every module.</li></ul>
      `),
      lesson("purpose", "0.2 Purpose and Professional Relevance", 6, `
        <p><strong>Why this course matters:</strong> ${input.preview?.purpose ?? input.description}</p>
        <h2>Professional value</h2>
        ${htmlList(benefits)}
        <h2>From knowledge to practice</h2>
        <p>This is not a course to complete passively. Its value comes from noticing patterns, testing ideas against workplace realities, and choosing one practical improvement at a time.</p>
        <blockquote>${profile.reflection}</blockquote>
        <p>Write down your first response. Revisit it at the end of the course and notice how your reasoning has developed.</p>
      `),
      lesson("objectives", "0.3 Learning Objectives and Course Roadmap", 8, `
        <p>By the end of ${input.title}, you should be able to demonstrate the following outcomes:</p>
        ${htmlList(input.outcomes)}
        <h2>Your course roadmap</h2>
        ${htmlList(roadmap, true)}
        <h2>How to get the most from each module</h2>
        <ol><li><strong>Preview:</strong> identify what you already know and what you need to learn.</li><li><strong>Learn:</strong> work through every lesson and resource.</li><li><strong>Practise:</strong> connect the concept to a realistic decision or task.</li><li><strong>Check:</strong> use the assessment feedback to close knowledge gaps.</li><li><strong>Apply:</strong> choose a specific behaviour to use in your work or daily life.</li></ol>
      `),
      lesson("summary", "0.4 Orientation Summary and Readiness Check", 5, `
        <p>You now know why ${input.title} matters, what the course expects from you, and how its modules build toward practical capability.</p>
        <h2>Before you continue</h2>
        <ul><li>I understand the purpose and professional relevance of this course.</li><li>I can describe the main learning outcomes in my own words.</li><li>I have reviewed the complete course roadmap.</li><li>I have chosen a personal goal and a real situation where I can apply the learning.</li><li>I am ready to complete the lessons, activities, and assessments in sequence.</li></ul>
        <h2>Your starting statement</h2>
        <blockquote>During this course, I want to improve my ability to ${profile.promise}.</blockquote>
        <p>Mark this lesson complete when your personal goal is clear. You are then ready to begin Module 1.</p>
      `),
    ],
  };
}
