import Link from "next/link";
import { PresenterAvatar } from "@/components/home/PresenterAvatar";
import { PresenterPreviewPanel } from "@/components/home/PresenterPreviewPanel";

const roles = [
  {
    label: "Course Presenter",
    icon: "🎤",
    color: "#f5c542",
    description: "Introduces a lesson and walks you through what you're about to learn before you start reading.",
  },
  {
    label: "Mentor",
    icon: "🧭",
    color: "#20c7ff",
    description: "Checks in on your progress and helps you stay motivated as you move through a course.",
  },
  {
    label: "Tutor",
    icon: "💬",
    color: "#22c55e",
    description: "Answers questions about tricky lesson content in a guided, conversational session.",
  },
  {
    label: "Field Expert",
    icon: "🛠️",
    color: "#8b5cf6",
    description: "Adds real workplace context and practical framing to a topic when a lesson calls for it.",
  },
];

export function PresentersSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <p className="text-sm leading-7 text-muted">
          Select VowLMS lessons include an on-demand AI presenter, powered by GoalVow&apos;s VowHumans platform. Start a
          guided session whenever you want a spoken walkthrough or a question answered — or skip it and keep reading,
          it never blocks your lesson.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <div key={role.label} className="premium-card flex items-start gap-4 rounded-xl p-5">
              <PresenterAvatar color={role.color} icon={role.icon} />
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-ink">{role.label}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{role.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/courses/business-ethics"
          className="mt-6 inline-flex text-sm font-semibold text-[#1166c8] hover:underline"
        >
          See it in a real lesson →
        </Link>
      </div>

      <PresenterPreviewPanel />
    </div>
  );
}
