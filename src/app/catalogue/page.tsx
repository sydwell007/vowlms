import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = {
  title: "GoalVow eLearning Course Catalogue — VowLMS",
  description: "Browse the complete GoalVow eLearning Course Catalogue — 20 categories covering business ethics, leadership, marketing, sales, HR, cybersecurity, and more.",
};

const CATALOGUE: {
  letter: string;
  title: string;
  color: string;
  icon: string;
  modules: string[];
}[] = [
  {
    letter: "A",
    title: "Business Ethics Course",
    color: "#1166c8",
    icon: "⚖️",
    modules: [
      "Employee Ethics Module",
      "Business Ethics Fundamentals Module",
      "Leadership on Ethics Module",
    ],
  },
  {
    letter: "B",
    title: "Workplace Compliance Course",
    color: "#19c37d",
    icon: "🛡️",
    modules: [
      "Workplace Health & Safety Module",
      "How to Protect Your Data Module",
      "Workplace Violence Training Module",
      "Social Engineering Module",
    ],
  },
  {
    letter: "C",
    title: "Organisational Culture Course",
    color: "#ff7a59",
    icon: "🏢",
    modules: [
      "Inclusive Communication Module",
      "Culture Competence Module",
      "Inclusion and Respect Module",
    ],
  },
  {
    letter: "D",
    title: "Stress Management Course",
    color: "#9b59b6",
    icon: "🧘",
    modules: [
      "Stress Fundamentals Module",
      "Work and Performance Stress Module",
      "Strategies to Relieve Stress Module",
    ],
  },
  {
    letter: "E",
    title: "Cybersecurity Course",
    color: "#20c7ff",
    icon: "🔐",
    modules: [
      "Online Security Fundamentals Module",
      "How to Protect Your Data Module",
      "Social Engineering Module",
    ],
  },
  {
    letter: "F",
    title: "Health and Wellness Course",
    color: "#f5c542",
    icon: "💚",
    modules: [
      "Dealing With Difficult Emotions or Life Events Module",
      "Exercise Modules",
      "Forming Healthy Habits Module",
      "Mental Health Awareness in the Workplace Module",
      "Positive Psychology Fundamentals Module",
      "Positive Psychology in the Workplace Module",
      "Mind Body Health & Learning Opportunities in the Work Place Module",
    ],
  },
  {
    letter: "G",
    title: "Human Resource Course",
    color: "#1166c8",
    icon: "👥",
    modules: [
      "Fundamentals of HR Module",
      "Diversity, Inclusion, and Belonging Module",
      "Interviewing Module",
      "Unconscious Bias Module",
      "Talent Management Module",
      "Workplace Well-Being Module",
      "Harassment and Discrimination Module",
      "Retirement Planning Module",
      "Other Human Resources Learners Receive",
    ],
  },
  {
    letter: "H",
    title: "Marketing Course",
    color: "#ff7a59",
    icon: "📣",
    modules: [
      "Brand Identity and Strategy Module",
      "Content Marketing Module",
      "Customer and Market Research Module",
      "Email Marketing Module",
      "Marketing Fundamentals Module",
      "Marketing Analytics Module",
      "Paid Advertising Module",
      "Product Marketing Module",
      "Search Engine Optimisation Module",
      "Social Media Marketing Module",
      "Website Marketing Module",
    ],
  },
  {
    letter: "I",
    title: "Sales Course",
    color: "#19c37d",
    icon: "💰",
    modules: [
      "Closing the Deal Module",
      "Sales Fundamentals Module",
      "Handling Objections Module",
      "Sales Leadership and Management Module",
      "Presenting Your Solution Module",
      "Prospecting Module",
      "Sales Psychology Module",
      "Building Relationships in Sales Module",
    ],
  },
  {
    letter: "J",
    title: "Project Management Course",
    color: "#9b59b6",
    icon: "📋",
    modules: [
      "Strategy Module",
      "Communication Module",
      "Frameworks Module",
      "Project Management Fundamentals Module",
      "Project Improvement Module",
      "Project Scheduling Module",
      "Reporting Module",
      "Scope Management Module",
    ],
  },
  {
    letter: "K",
    title: "Customer Service Course",
    color: "#20c7ff",
    icon: "🎧",
    modules: [
      "Multi-Channel Communication Module",
      "Communication Basics Module",
      "Cultural Sensitivity in Customer Service Module",
      "Customer Service Fundamentals Module",
      "Customer Service Skills Module",
      "Customer Service Module",
      "Team Management Module",
    ],
  },
  {
    letter: "L",
    title: "Career Management Course",
    color: "#f5c542",
    icon: "🚀",
    modules: [
      "Assessing Your Strengths and Skills Module",
      "Driving Your Career Module",
      "Finding a Job Module",
      "Mentoring in the Workplace Module",
      "Networking Module",
      "New Professional Module",
      "Overcoming Challenges Module",
      "Professional Etiquette Module",
      "Working Relationships Module",
    ],
  },
  {
    letter: "M",
    title: "Change Management Course",
    color: "#1166c8",
    icon: "🔄",
    modules: [
      "Change Management Fundamentals Module",
      "Change Management Models Module",
      "Communicating Change Module",
      "Leading Through Change Module",
      "Leading Through Change in Times of Crisis Module",
      "The Change Management Process Module",
    ],
  },
  {
    letter: "N",
    title: "Communication Course",
    color: "#ff7a59",
    icon: "💬",
    modules: [
      "Difficult Situations Module",
      "Empathy Module",
      "Communication Fundamentals Module",
      "Meetings Module",
      "Negotiation and Persuasion Module",
      "Presentations Module",
      "Verbal Communication Module",
      "Writing Well Module",
    ],
  },
  {
    letter: "O",
    title: "Leadership Course",
    color: "#19c37d",
    icon: "🌟",
    modules: [
      "Crisis Management Module",
      "Emotional Intelligence (EQ) Module",
      "Leadership Fundamentals Module",
      "Leadership Styles Module",
    ],
  },
  {
    letter: "P",
    title: "Resilience Course",
    color: "#9b59b6",
    icon: "💪",
    modules: [
      "Building Career Resilience Module",
      "Emotional and Physical Resilience Module",
      "Leadership and Resilience Module",
      "Resilience Fundamentals Module",
      "Thriving Through Challenges Module",
    ],
  },
  {
    letter: "Q",
    title: "Problem Solving Course",
    color: "#20c7ff",
    icon: "🧩",
    modules: [
      "Problem Solving Fundamentals Module",
      "Problem Solving in the Workplace Module",
      "Problem Solving Using Data Module",
      "Advanced Problem Solving Module",
    ],
  },
  {
    letter: "R",
    title: "Time Management Course",
    color: "#f5c542",
    icon: "⏱️",
    modules: [
      "Concentration Module",
      "Time Management Fundamentals Module",
      "Prioritisation Module",
      "Scheduling Module",
      "Overcoming Challenges Module",
      "Goal Setting Module",
    ],
  },
  {
    letter: "S",
    title: "Team Management Course",
    color: "#1166c8",
    icon: "🤝",
    modules: [
      "Delegating Tasks Module",
      "Developing Your Team Module",
      "Team Management Fundamentals Module",
      "Setting an Employee Go Module",
      "Managing Your Team Module",
      "Motivating Your Team Module",
      "New Manager Module",
      "Performance Management Module",
      "Resolving Conflict Module",
      "Team Culture Module",
    ],
  },
  {
    letter: "T",
    title: "Critical Thinking Course",
    color: "#ff7a59",
    icon: "🧠",
    modules: [
      "Critical Thinking and Information Literacy Module",
      "Critical Thinking Fundamentals Module",
      "Critical Thinking in Practice Module",
    ],
  },
];

export default function CataloguePage() {
  const totalModules = CATALOGUE.reduce((sum, cat) => sum + cat.modules.length, 0);

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Upskilling Academy</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
            GoalVow eLearning Course Catalogue
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            {CATALOGUE.length} professional development courses across {totalModules} modules — covering ethics, leadership, marketing, sales, HR, cybersecurity, wellness, and more.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">📚 {CATALOGUE.length} courses</span>
            <span className="flex items-center gap-1.5">📋 {totalModules} modules</span>
            <span className="flex items-center gap-1.5">🏅 Certificate per course</span>
            <span className="flex items-center gap-1.5">⭐ VowRewards on completion</span>
          </div>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/courses?academy=upskilling-academy">Browse Upskilling courses</ButtonLink>
            <ButtonLink href="/auth/signup" variant="secondary">Create free account</ButtonLink>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="border-b border-slate-100 bg-white py-4 sticky top-[76px] z-30">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-muted shrink-0 mr-2">Jump to:</span>
            {CATALOGUE.map((cat) => (
              <a
                key={cat.letter}
                href={`#cat-${cat.letter}`}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-ink transition hover:border-[#1166c8]/40 hover:text-[#1166c8]"
              >
                {cat.letter}. {cat.title.replace(" Course", "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue list */}
      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {CATALOGUE.map((cat) => (
            <div
              key={cat.letter}
              id={`cat-${cat.letter}`}
              className="scroll-mt-28 premium-card rounded-2xl overflow-hidden"
            >
              {/* Category header */}
              <div
                className="flex items-start gap-5 p-6 md:p-8"
                style={{ borderLeft: `4px solid ${cat.color}` }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 justify-between flex-wrap">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {cat.icon} Course {cat.letter}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-ink">{cat.title}</h2>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {cat.modules.length} modules
                    </span>
                  </div>

                  {/* Modules grid */}
                  <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.modules.map((mod, i) => (
                      <div
                        key={mod}
                        className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                      >
                        <span className="shrink-0 font-mono text-xs text-muted mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-ink leading-snug">{mod}</span>
                      </div>
                    ))}
                  </div>

                  {/* Search link */}
                  <div className="mt-4">
                    <Link
                      href={`/courses?q=${encodeURIComponent(cat.title.replace(" Course", ""))}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:underline"
                      style={{ color: cat.color }}
                    >
                      View related courses →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-2xl bg-[#06111f] px-8 py-10 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Ready to start?</p>
          <h2 className="mt-3 text-3xl font-semibold">
            {CATALOGUE.length} courses. {totalModules} modules. All in GoalVow LMS.
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm leading-7 text-white/70">
            Create a free GoalVow account to enrol, track progress, earn VowRewards, and unlock your certificate for every completed course.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/auth/signup">Create free account</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">Browse all courses</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
