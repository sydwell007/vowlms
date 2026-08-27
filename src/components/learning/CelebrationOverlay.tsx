"use client";

import { useMemo } from "react";
import Link from "next/link";

const CONFETTI_COLORS = ["#f5c542", "#1166c8", "#20c7ff", "#22c55e", "#8b5cf6", "#ff7a59"];

type ConfettiPiece = { left: number; delay: number; duration: number; color: string; rotate: number };

function useConfetti(count: number): ConfettiPiece[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i / count) * 100 + (i % 3) * 2,
        delay: (i % 7) * 0.12,
        duration: 2.2 + (i % 5) * 0.3,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: (i * 47) % 360,
      })),
    [count],
  );
}

export function CelebrationOverlay({
  courseTitle,
  courseSlug,
  onClose,
}: {
  courseTitle: string;
  courseSlug: string;
  onClose: () => void;
}) {
  const confetti = useConfetti(18);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#06111f]/72 backdrop-blur-sm p-4"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((piece, i) => (
          <span
            key={i}
            className="vowlms-confetti-piece absolute top-[-5%] h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              transform: `rotate(${piece.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="vowlms-celebration-card relative w-full max-w-md rounded-2xl border border-gold/25 bg-[linear-gradient(180deg,#0d2239_0%,#06111f_100%)] p-8 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-3xl">🎉</div>
        <h2 id="celebration-heading" className="mt-5 text-2xl font-semibold">Course complete!</h2>
        <p className="mt-3 text-sm leading-6 text-white/72">
          You&apos;ve finished every lesson in <span className="font-semibold text-white">{courseTitle}</span>. Your
          certificate is on its way.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href={`/results/${courseSlug}`}
            className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]"
          >
            View results &amp; certificate
          </Link>
          <Link
            href="/courses"
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
          >
            Keep exploring courses
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes vowlms-confetti-fall {
          from { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          to { transform: translateY(110vh) rotate(360deg); opacity: 0.4; }
        }
        @keyframes vowlms-celebration-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vowlms-confetti-piece {
          animation-name: vowlms-confetti-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
        .vowlms-celebration-card {
          animation: vowlms-celebration-in 0.35s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .vowlms-confetti-piece { display: none; }
          .vowlms-celebration-card { animation: none; }
        }
      `}</style>
    </div>
  );
}
