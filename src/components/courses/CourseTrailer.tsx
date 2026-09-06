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

type TrailerClip = { src: string; title: string };

const SLIDE_MS = 4800;
const CLIP_CAP_MS = 5500;

/**
 * Cinematic, auto-playing "course trailer". Real per-lesson videos live in
 * the bridge's `lessons` table, not this app's static course catalogue — so
 * on mount this fetches `/api/courses/{slug}/trailer-clips`, which asks the
 * bridge for one real lesson video per module. When real clips come back,
 * the trailer cycles through genuine lesson footage (with its own real
 * audio). When they don't — bridge unavailable locally, or a course's
 * lessons don't have video yet — it falls back to a Ken-Burns slideshow of
 * the course's real module images with an optional background theme track
 * (silently disabled if no track file has been provided yet).
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

  const [clips, setClips] = useState<TrailerClip[]>([]);
  const [clipsChecked, setClipsChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/courses/${course.slug}/trailer-clips`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok && Array.isArray(json.data?.clips)) setClips(json.data.clips);
      })
      .catch(() => {
        /* Stay on the image slideshow — the trailer must never break the page. */
      })
      .finally(() => {
        if (!cancelled) setClipsChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [course.slug]);

  const hasRealClips = clips.length > 0;
  const slideCount = hasRealClips ? clips.length : images.length;

  const [rawIndex, setRawIndex] = useState(0);
  // Modulo against the CURRENT slide count so a transient mismatch — e.g. real
  // clips replacing a shorter/longer image set right as they load — always
  // yields a valid index without needing an effect just to reset state.
  const activeIndex = rawIndex % slideCount;
  const [muted, setMuted] = useState(true);
  const [musicAvailable, setMusicAvailable] = useState(true);
  const musicRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (slideCount < 2) return;
    const ms = hasRealClips ? CLIP_CAP_MS : SLIDE_MS;
    const id = setInterval(() => {
      setRawIndex((i) => i + 1);
    }, ms);
    return () => clearInterval(id);
  }, [slideCount, hasRealClips]);

  useEffect(() => {
    if (!hasRealClips) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {
      /* Autoplay can be blocked before any user interaction — harmless here. */
    });
  }, [activeIndex, hasRealClips]);

  function toggleSound() {
    if (hasRealClips) {
      setMuted((value) => !value);
      return;
    }
    const audio = musicRef.current;
    if (!audio || !musicAvailable) return;
    if (muted) {
      audio.play().catch(() => {
        /* Autoplay can still be blocked by the browser — the icon simply won't flip. */
      });
    } else {
      audio.pause();
    }
    setMuted((value) => !value);
  }

  const soundControlAvailable = hasRealClips || musicAvailable;

  return (
    <section className="relative isolate overflow-hidden rounded-2xl text-white shadow-[0_28px_64px_rgba(6,17,31,0.32)]">
      {!hasRealClips ? (
        <audio
          ref={musicRef}
          src="/audio/course-trailer-theme.mp3"
          loop
          muted={muted}
          onError={() => setMusicAvailable(false)}
          className="hidden"
        />
      ) : null}

      <div className="absolute inset-0 -z-10 bg-slate-900">
        {hasRealClips ? (
          <video
            key={clips[activeIndex].src}
            ref={videoRef}
            src={clips[activeIndex].src}
            muted={muted}
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          images.map((src, index) => (
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
          ))
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#06111f]/70 to-[#06111f]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f]/75 via-[#06111f]/20 to-transparent" />
      </div>

      {/* Story-style progress segments */}
      {slideCount > 1 ? (
        <div className="absolute inset-x-4 top-4 z-10 flex gap-1.5 sm:inset-x-6 sm:top-5">
          {Array.from({ length: slideCount }, (_, index) => (
            <span key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <span
                className={`block h-full rounded-full bg-white ${
                  index === activeIndex
                    ? "animate-[trailer-progress_linear_forwards]"
                    : index < activeIndex
                      ? "w-full"
                      : "w-0"
                }`}
                style={index === activeIndex ? { animationDuration: `${hasRealClips ? CLIP_CAP_MS : SLIDE_MS}ms` } : undefined}
              />
            </span>
          ))}
        </div>
      ) : null}

      {clipsChecked && soundControlAvailable ? (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Unmute course trailer" : "Mute course trailer"}
          className="absolute right-4 top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-9"
        >
          {muted ? <VolumeX aria-hidden="true" className="h-4 w-4" /> : <Volume2 aria-hidden="true" className="h-4 w-4" />}
        </button>
      ) : null}

      <div className="relative flex min-h-[420px] flex-col justify-end gap-5 p-6 pt-16 sm:min-h-[480px] sm:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {academyName ?? "Upskilling Academy"} · {hasRealClips ? "Real Lesson Footage" : "Course Trailer"}
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
