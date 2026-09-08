import Image from "next/image";
import Link from "next/link";
import { Award, Gift, Globe2, Mic, Sparkles } from "lucide-react";
import { PresenterAvatar } from "@/components/home/PresenterAvatar";
import { ThandiAvatar } from "@/components/thandi/ThandiAvatar";
import { TalkToThandiButton } from "@/components/thandi/TalkToThandiButton";
import { ButtonLink } from "@/components/ui/ButtonLink";

const thandiFeatures = [
  { Icon: Sparkles, text: "Knows all 20 Upskilling courses — and exactly what page or lesson you're on" },
  { Icon: Globe2, text: "Speaks any of South Africa's 11 official languages" },
  { Icon: Mic, text: 'Say "Thandi" anywhere in VowLMS to talk hands-free' },
  { Icon: Award, text: "Lives in your sidebar — available on every course, every page, 24/7" },
];

// Mirrors the real, published earn-milestones on /rewards (RewardsWalletClient.tsx)
// verbatim — this is existing public copy, not a new claim invented for the homepage.
const waysToEarn = [
  { event: "Course enrolment", amount: 50 },
  { event: "First lesson completed", amount: 5 },
  { event: "First assessment passed", amount: 100 },
  { event: "Certificate earned", amount: 200 },
];

const presenterRoles = [
  { label: "Course Presenter", icon: "🎤", color: "#f5c542" },
  { label: "Mentor", icon: "🧭", color: "#20c7ff" },
  { label: "Tutor", icon: "💬", color: "#22c55e" },
  { label: "Field Expert", icon: "🛠️", color: "#8b5cf6" },
];

export function AIAndRewardsSection() {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Thandi spotlight ────────────────────────────────────────────── */}
        <div className="premium-card-dark relative flex flex-col overflow-hidden rounded-2xl p-7 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "linear-gradient(135deg, #4aa3ff, #7c6bf5, #f7d05e)" }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-4">
            <ThandiAvatar size={60} />
            <div>
              <p className="text-lg font-bold text-white">Thandi</p>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                24/7 AI Tutor · Powered by VowHumans
              </p>
            </div>
          </div>

          <h3 className="relative mt-6 text-balance text-2xl font-semibold text-white sm:text-[1.7rem]">
            Ask her anything. She already knows the lesson.
          </h3>
          <p className="relative mt-3 text-sm leading-6 text-white/68">
            Thandi is a live, voice-driven digital human tutor built on GoalVow&apos;s VowHumans platform — not a
            chatbot. Stuck on a concept, lost in the course catalogue, or just want a study buddy? She&apos;s one
            click away.
          </p>

          <ul className="relative mt-6 flex flex-col gap-3.5">
            {thandiFeatures.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-6 text-white/78">
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#7bbcff]" />
                {text}
              </li>
            ))}
          </ul>

          <div className="relative mt-7">
            <TalkToThandiButton>Talk to Thandi now →</TalkToThandiButton>
          </div>
        </div>

        {/* ── VowRewards spotlight ────────────────────────────────────────── */}
        <div className="premium-card-dark relative flex flex-col overflow-hidden rounded-2xl p-7 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "linear-gradient(90deg, #f7d05e, #fff0a8, #4aa3ff)" }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-4">
            <span className="vowr-gradient-border flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full">
              <Image src="/images/vowrewards-logo.png" alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-full" />
            </span>
            <div>
              <p className="text-lg font-bold text-white">VowRewards</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                Your VOWR wallet · Built into VowLMS
              </p>
            </div>
          </div>

          <h3 className="relative mt-6 text-balance text-2xl font-semibold text-white sm:text-[1.7rem]">
            Real rewards for real progress
          </h3>
          <p className="relative mt-3 text-sm leading-6 text-white/68">
            Every eligible milestone earns server-recorded VOWR, automatically — no forms, no waiting. Watch your
            balance grow from your very first lesson.
          </p>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            {waysToEarn.map((way) => (
              <div key={way.event} className="rounded-lg border border-white/10 bg-white/[0.04] p-3.5">
                <p className="vowr-gradient-text text-xl font-bold">+{way.amount}</p>
                <p className="mt-1 text-xs leading-4 text-white/64">{way.event}</p>
              </div>
            ))}
          </div>

          <p className="relative mt-5 flex items-start gap-2 text-sm leading-6 text-white/68">
            <Gift aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#f7d05e]" />
            Redeem VOWR for course-enrolment credit, mentorship sessions, VR practice time, and more.
          </p>

          <div className="relative mt-7">
            <ButtonLink href="/rewards" variant="secondary">
              See your VOWR wallet →
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* ── Plus: on-demand AI course presenters (existing, condensed) ─────── */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Plus, inside select lessons</p>
            <h3 className="mt-1.5 text-lg font-semibold text-white">On-demand AI course presenters</h3>
            <p className="mt-2 text-sm leading-6 text-white/64">
              Some lessons include their own interactive presenter — start a guided walkthrough whenever you want
              one, or skip it and keep reading. It never blocks your lesson.
            </p>
          </div>
          <Link href="/courses/business-ethics" className="whitespace-nowrap text-sm font-semibold text-[#7bbcff] hover:underline">
            See it in a real lesson →
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {presenterRoles.map((role) => (
            <div key={role.label} className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <PresenterAvatar color={role.color} icon={role.icon} />
              <span className="text-sm font-semibold text-white/86">{role.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
