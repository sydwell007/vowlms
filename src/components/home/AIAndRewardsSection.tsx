import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Compass,
  Gift,
  Globe2,
  GraduationCap,
  MessagesSquare,
  Mic,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PresenterAvatar } from "@/components/home/PresenterAvatar";
import { ThandiAvatar } from "@/components/thandi/ThandiAvatar";
import { TalkToThandiButton } from "@/components/thandi/TalkToThandiButton";
import { ButtonLink } from "@/components/ui/ButtonLink";

const thandiFeatures = [
  { Icon: Sparkles, text: "Understands the Upskilling catalogue and the lesson you are viewing" },
  { Icon: Globe2, text: "Supports all 11 official South African languages" },
  { Icon: Mic, text: "Offers hands-free voice access across VowLMS" },
  { Icon: Award, text: "Stays available across courses and learning pages" },
];

const waysToEarn = [
  { event: "Course enrolment", amount: 50 },
  { event: "First lesson completed", amount: 5 },
  { event: "First assessment passed", amount: 100 },
  { event: "Certificate earned", amount: 200 },
];

const presenterRoles = [
  { label: "Course presenter", Icon: GraduationCap, color: "#efc14b" },
  { label: "Mentor", Icon: Compass, color: "#56d7db" },
  { label: "Tutor", Icon: MessagesSquare, color: "#48c58d" },
  { label: "Field expert", Icon: Wrench, color: "#ed7550" },
];

export function AIAndRewardsSection() {
  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="premium-card-dark flex flex-col rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <ThandiAvatar size={60} />
            <div>
              <p className="text-lg font-bold text-white">Thandi</p>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                24/7 AI tutor · Powered by VowHumans
              </p>
            </div>
          </div>

          <h3 className="mt-6 text-balance text-2xl font-semibold text-white">
            Ask the lesson. Get a useful answer.
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/68">
            Thandi is a live, voice-driven digital human tutor built on GoalVow&apos;s VowHumans platform. She gives learners contextual support without taking them away from their course.
          </p>

          <ul className="mt-6 grid gap-3.5">
            {thandiFeatures.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-6 text-white/78">
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#7de0e2]" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-7">
            <TalkToThandiButton>Talk to Thandi now →</TalkToThandiButton>
          </div>
        </article>

        <article className="premium-card-dark flex flex-col rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-4">
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

          <h3 className="mt-6 text-balance text-2xl font-semibold text-white">
            Real rewards for real progress
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/68">
            Eligible milestones create server-recorded VOWR automatically, so effort and achievement stay visible in one account.
          </p>

          <div className="mt-6 grid grid-cols-2 border-y border-white/10">
            {waysToEarn.map((way, index) => (
              <div
                key={way.event}
                className={`py-4 ${index % 2 === 0 ? "pr-4" : "border-l border-white/10 pl-4"} ${index < 2 ? "border-b border-white/10" : ""}`}
              >
                <p className="vowr-gradient-text text-xl font-bold">+{way.amount}</p>
                <p className="mt-1 text-xs leading-4 text-white/64">{way.event}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/68">
            <Gift aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#f7d05e]" />
            Redeem VOWR for eligible learning and development benefits.
          </p>

          <div className="mt-auto pt-7">
            <ButtonLink href="/rewards" variant="secondary">
              See your VOWR wallet →
            </ButtonLink>
          </div>
        </article>
      </div>

      <div className="mt-8 border-t border-white/12 pt-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/48">Inside selected lessons</p>
            <h3 className="mt-2 text-xl font-semibold text-white">On-demand AI course presenters</h3>
            <p className="mt-2 text-sm leading-6 text-white/64">
              Start a guided walkthrough when it helps, or continue reading at your own pace.
            </p>
          </div>
          <Link href="/courses/business-ethics" className="text-sm font-semibold text-[#7de0e2] hover:text-white">
            Experience a presenter →
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presenterRoles.map((role) => (
            <div key={role.label} className="flex items-center gap-3 border-t border-white/10 pt-4">
              <PresenterAvatar color={role.color} Icon={role.Icon} />
              <span className="text-sm font-semibold text-white/86">{role.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
