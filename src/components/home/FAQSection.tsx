"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Is VowLMS free to use?",
    answer:
      "Creating an account is always free. Most Upskilling Academy courses are free to enrol in — Chef Academy, Skills Training, and Business School courses are paid per course, with the price shown clearly before you enrol, and secure checkout handled by PayFast.",
  },
  {
    question: "How do I know which course is right for me?",
    answer:
      "Use \"Find My Path\" — tell VowLMS what you want to achieve and we'll match you to real courses, no need to know which academy you need. Not sure yet? Take the Path Finder Quiz and we'll recommend a starting point.",
  },
  {
    question: "Do I get a certificate when I finish a course?",
    answer:
      "Yes. Once you pass a course's final assessment, VowLMS automatically issues a certificate you can download as a PDF, and it appears on your dashboard and certificates list.",
  },
  {
    question: "What is VowRewards?",
    answer:
      "VowRewards is VowLMS's points system. You earn points for real milestones — completing a lesson, passing an assessment, earning a certificate — and your balance is calculated directly from your account's own reward record.",
  },
  {
    question: "Can I study on my phone?",
    answer:
      "Yes — VowLMS is built mobile-first as a Progressive Web App, so lessons, assessments, and your dashboard all work cleanly on a phone, tablet, or desktop.",
  },
  {
    question: "What happens if I don't pass an assessment first time?",
    answer:
      "You can retake it. Every assessment shows its pass mark upfront, and you're free to review the lesson and try again until you pass.",
  },
  {
    question: "Which academies are open right now?",
    answer:
      "Upskilling, Skills Training, Chef Academy, and Business School are live today, with more academies in development as they're ready.",
  },
  {
    question: "Is my payment information safe?",
    answer:
      "Yes. Paid course checkouts are processed securely through PayFast, a trusted South African payment gateway — VowLMS never sees or stores your card details.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="text-sm leading-7 text-muted">
          Can&apos;t find what you&apos;re looking for? Reach the VowLMS support team any time.
        </p>
        <Link
          href="/support"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0e2440] bg-[linear-gradient(180deg,#0d2239_0%,#06111f_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(6,17,31,0.16)] transition hover:border-[#163657]"
        >
          Contact learner support
        </Link>
      </div>

      <div className="space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;

          return (
            <article key={item.question} className="premium-card overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[#f5f9ff]"
              >
                <span className="text-base font-semibold text-ink">{item.question}</span>
                <span
                  className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-6 text-muted">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
