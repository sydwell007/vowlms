"use client";

import { useEffect, useState } from "react";
import { PresenterAvatar } from "@/components/home/PresenterAvatar";

const captions = [
  "Meet your AI course presenter before you start a lesson.",
  "Ask a question — get a guided, spoken explanation.",
  "Available in select lessons, whenever you choose to start it.",
  "Close it any time and keep reading at your own pace.",
];

const bars = [40, 70, 100, 65, 90, 45, 75];

export function PresenterPreviewPanel() {
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCaptionIndex((current) => (current + 1) % captions.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="premium-card-dark overflow-hidden rounded-2xl p-1">
      <div className="rounded-xl border border-white/10 bg-[#06111f] px-6 py-10 text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">Live preview</p>

        <div className="mx-auto mt-6 flex justify-center">
          <PresenterAvatar color="#f5c542" icon="🎤" size="lg" />
        </div>

        <div className="mx-auto mt-6 flex h-10 max-w-[220px] items-end justify-center gap-1.5" aria-hidden="true">
          {bars.map((height, index) => (
            <span
              key={index}
              className="w-1.5 rounded-full bg-gradient-to-t from-[#1166c8] to-[#20c7ff]"
              style={{
                height: `${height}%`,
                animation: `vowlms-presenter-bar 1.1s ease-in-out ${index * 0.12}s infinite alternate`,
              }}
            />
          ))}
        </div>

        <p key={captionIndex} className="mx-auto mt-6 min-h-[2.5rem] max-w-sm animate-[vowlms-fade-in_0.4s_ease-out] text-sm leading-6 text-white/78">
          {captions[captionIndex]}
        </p>
      </div>

      <style>{`
        @keyframes vowlms-presenter-bar {
          from { transform: scaleY(0.35); opacity: 0.55; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes vowlms-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
