"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Award, BookOpen, Clock3, Volume2, VolumeX } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Course } from "@/types/lms";
import { formatCourseDurationWeeks, getCourseStats } from "@/lib/course-content";
import { getModuleImageSrc } from "@/lib/module-images";
import { getCourseVisual } from "@/lib/visual-assets";

type Props = {
  course: Course;
  academyCategory: string;
  academyName?: string;
};

const SLIDE_MS = 4800;

/**
 * Cinematic, auto-playing "course trailer" built entirely from real, already-
 * owned assets (module images + real course stats) — no lesson video clips
 * exist yet to cut together (every lesson in the dataset currently shares one
 * placeholder video URL), so this is the honest, still-premium alternative
 * rather than faking footage that doesn't exist. The mute toggle wires to a
 * real <audio> element pointed at a theme track path; if no file has been
 * dropped there yet it fails silently and hides the control, so the trailer
 * never claims a soundtrack it doesn't have.
 */
export function CourseTrailer({ course, academyCategory, academyName }: Props) {
  const stats = getCourseStats(course);
  const courseVisual = getCourseVisual(course, academyCategory);

  const images = useMemo(() => {
    const fromModules = course.modules
      .map((m) => getModuleImageSrc(course.slug, m.order))
      .filter((src): src is string => Boolean(src));
    const unique = Array.from(new Set(fromModules));
    return unique.length > 0 ? unique.slice(0, 6) : [courseVisual.src];
  }, [course.modules, course.slug, courseVisual.src]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  function toggleSound() {
    const audio = audioRef.current;
    if (!audio || !audioAvailable) return;
    if (muted) {
      audio.play().catch(() => {
        /* Autoplay can still be blocked by the browser — the icon simply won't flip. */
      });
    } else {
      audio.pause();
    }
    setMuted((value) => !value);
  }

  return (
    <section className="relative isolate overflow-hidden rounded-2xl text-white shadow-[0_28px_64px_rgba(6,17,31,0.32)]">
      <audio
        ref={audioRef}
        src="/audio/course-trailer-theme.mp3"
        loop
        muted={muted}
        onError={() => setAudioAvailable(false)}
        className="hidden"
      />

      <div className="absolute inset-0 -z-10 bg-slate-900">
        {images.map((src, index) => (
          <div
            key={src}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 900px, 100vw"
              className={`object-cover ${index === activeIndex ? "animate-[trailer-zoom_5.8s_ease-out_forwards]" : ""}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#06111f]/70 to-[#06111f]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f]/75 via-[#06111f]/20 to-transparent" />
      </div>

      {/* Story-style progress segments */}
      {images.length > 1 ? (
        <div className="absolute inset-x-4 top-4 z-10 flex gap-1.5 sm:inset-x-6 sm:top-5">
          {images.map((src, index) => (
            <span key={src} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <span
                className={`block h-full rounded-full bg-white ${
                  index === activeIndex ? "animate-[trailer-progress_linear_forwards]" : index < activeIndex ? "w-full" : "w-0"
                }`}
                style={index === activeIndex ? { animationDuration: `${SLIDE_MS}ms` } : undefined}
              />
            </span>
          ))}
        </div>
      ) : null}

      {audioAvailable ? (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Unmute course trailer music" : "Mute course trailer music"}
          className="absolute right-4 top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-9"
        >
          {muted ? <VolumeX aria-hidden="true" className="h-4 w-4" /> : <Volume2 aria-hidden="true" className="h-4 w-4" />}
        </button>
      ) : null}

      <div className="relative flex min-h-[420px] flex-col justify-end gap-5 p-6 pt-16 sm:min-h-[480px] sm:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {academyName ?? "Upskilling Academy"} · Course Trailer
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-bold sm:text-4xl">{course.title}</h2>
          {course.coursePreview ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">{course.coursePreview.purpose}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/85 sm:gap-6">
          <span className="flex items-center gap-1.5"><BookOpen aria-hidden="true" className="h-4 w-4" /> {stats.lessonCount} lessons</span>
          <span className="flex items-center gap-1.5"><Clock3 aria-hidden="true" className="h-4 w-4" /> {formatCourseDurationWeeks(stats.totalMinutes)}</span>
          <span className="flex items-center gap-1.5"><Award aria-hidden="true" className="h-4 w-4 text-gold" /> {course.rewards} VOWR on completion</span>
        </div>

        {course.modules[0]?.lessons[0] ? (
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href={`/lesson/${course.modules[0].lessons[0].slug}`}>Start first lesson</ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
