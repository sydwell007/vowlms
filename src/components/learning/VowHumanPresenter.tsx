"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getVowHumanRoleLabel,
  isAllowedVowHumansUrl,
  VOWHUMANS_ORIGIN,
} from "@/lib/vowhumans";
import type { VowHumanPresenterConfig } from "@/types/lms";

type PresenterState = "idle" | "loading" | "active" | "error" | "permission-denied";

type VowHumanPresenterProps = {
  config: VowHumanPresenterConfig;
  lessonSlug: string;
  lessonTitle: string;
  contentTargetId?: string;
};

type PresenterEvent =
  | "presenter_started"
  | "presenter_loaded"
  | "presenter_closed"
  | "presenter_failed";

function emitPresenterEvent(type: PresenterEvent, lessonSlug: string) {
  window.dispatchEvent(
    new CustomEvent("vowlms:presenter-event", {
      detail: { type, lessonSlug },
    }),
  );
}

export function VowHumanPresenter({
  config,
  lessonSlug,
  lessonTitle,
  contentTargetId = "lesson-reading-material",
}: VowHumanPresenterProps) {
  const [state, setState] = useState<PresenterState>("idle");
  const [mounted, setMounted] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [permissionMessage, setPermissionMessage] = useState("");
  const [lessonContextToken, setLessonContextToken] = useState("");

  const roleLabel = getVowHumanRoleLabel(config.role);
  const validUrl = isAllowedVowHumansUrl(config.embedUrl);
  const iframePermissions = useMemo(
    () =>
      [
        config.cameraEnabled ? "camera" : null,
        config.microphoneEnabled ? "microphone" : null,
        "fullscreen",
      ]
        .filter(Boolean)
        .join("; "),
    [config.cameraEnabled, config.microphoneEnabled],
  );

  const failPresenter = useCallback(
    (message = "The AI learning guide is temporarily unavailable.") => {
      setMounted(false);
      setState("error");
      setPermissionMessage(message);
      emitPresenterEvent("presenter_failed", lessonSlug);
    },
    [lessonSlug],
  );

  useEffect(() => {
    if (!mounted || state !== "loading") return;
    const timeout = window.setTimeout(
      () => failPresenter("The presenter took too long to respond."),
      20_000,
    );
    return () => window.clearTimeout(timeout);
  }, [failPresenter, mounted, state]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== VOWHUMANS_ORIGIN || !event.data || typeof event.data !== "object") {
        return;
      }

      const message = event.data as { type?: string; permission?: string; message?: string };
      if (message.type === "vowhumans:loaded") {
        setState("active");
      }
      if (message.type === "vowhumans:permission-denied") {
        setMounted(false);
        setState("permission-denied");
        setPermissionMessage(
          message.permission
            ? `${message.permission} access is blocked in your browser settings.`
            : "Camera or microphone access is blocked in your browser settings.",
        );
        emitPresenterEvent("presenter_failed", lessonSlug);
      }
      if (message.type === "vowhumans:error" || message.type === "vowhumans:unavailable") {
        failPresenter(message.message);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [failPresenter, lessonSlug]);

  if (!config.enabled || !validUrl) return null;

  async function startPresenter() {
    setPermissionMessage("");
    setFrameKey((current) => current + 1);
    setState("loading");
    emitPresenterEvent("presenter_started", lessonSlug);

    try {
      const response = await fetch(
        `/api/vowhumans/context-token/${encodeURIComponent(lessonSlug)}`,
        { cache: "no-store" },
      );
      const body = (await response.json().catch(() => null)) as
        | { token?: string; error?: string }
        | null;
      if (!response.ok || !body?.token) {
        throw new Error(body?.error || "Lesson context is unavailable");
      }
      setLessonContextToken(body.token);
      setMounted(true);
    } catch (error) {
      failPresenter(
        error instanceof Error
          ? error.message
          : "Lesson context is unavailable",
      );
    }
  }

  function closePresenter() {
    if (mounted || state === "active" || state === "loading") {
      emitPresenterEvent("presenter_closed", lessonSlug);
    }
    setMounted(false);
    setState("idle");
    setPermissionMessage("");
    setLessonContextToken("");
  }

  function continueWithLesson() {
    closePresenter();
    const target = document.getElementById(contentTargetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    target?.focus({ preventScroll: true });
  }

  const needsMedia = config.cameraEnabled || config.microphoneEnabled;

  return (
    <section
      aria-labelledby="vowhuman-presenter-heading"
      className="mt-6 overflow-hidden rounded-xl border border-[#1166c8]/20 bg-white shadow-[0_20px_55px_rgba(6,17,31,0.08)]"
    >
      <div className="grid gap-5 border-b border-slate-200 bg-[#f6faff] px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">
            VowHumans interactive learning
          </p>
          <h2 id="vowhuman-presenter-heading" className="mt-2 text-xl font-semibold text-ink">
            AI {roleLabel}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {config.introduction} Learn with {config.presenterName}
            {config.expertise ? `, ${config.expertise}` : ""}.
          </p>
        </div>
        <span className="w-fit rounded-full border border-[#1166c8]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#1166c8]">
          Optional support
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {state === "idle" ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg bg-[#06111f] px-6 py-10 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{roleLabel}</p>
            <h3 className="mt-3 max-w-lg text-xl font-semibold">
              Start a guided session for {lessonTitle}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              {needsMedia
                ? "Your browser may ask for camera or microphone access after you start. VowLMS does not record or store that media."
                : "The presenter opens only when you choose to begin and does not prevent you from reading the lesson."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={startPresenter}
                className="min-h-11 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] transition hover:bg-[#e8b830]"
              >
                Start AI {roleLabel}
              </button>
              <button
                type="button"
                onClick={continueWithLesson}
                className="min-h-11 rounded-lg border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Continue with lesson
              </button>
            </div>
          </div>
        ) : null}

        {state === "loading" && !mounted ? (
          <div className="flex min-h-72 items-center justify-center rounded-lg bg-[#06111f] px-6 text-center text-white">
            <div>
              <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-gold" />
              <p className="mt-4 text-sm font-semibold">Preparing this lesson for {config.presenterName}</p>
            </div>
          </div>
        ) : null}

        {mounted && lessonContextToken ? (
          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#06111f]">
              <iframe
                key={frameKey}
                src={`${config.embedUrl}#${new URLSearchParams({ lesson_context_token: lessonContextToken })}`}
                title={`${config.presenterName} interactive ${roleLabel.toLowerCase()} for ${lessonTitle}`}
                allow={iframePermissions}
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
                className="absolute inset-0 h-full w-full border-0"
                onLoad={() => {
                  setState("active");
                  emitPresenterEvent("presenter_loaded", lessonSlug);
                }}
                onError={() => failPresenter()}
              />
              {state === "loading" ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#06111f] text-center text-white">
                  <div>
                    <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-gold" />
                    <p className="mt-4 text-sm font-semibold">Connecting to {config.presenterName}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-5 text-muted">Close the presenter to end its media session.</p>
              <button
                type="button"
                onClick={closePresenter}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
              >
                Close presenter
              </button>
            </div>
          </div>
        ) : null}

        {(state === "error" || state === "permission-denied") && !mounted ? (
          <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-6 text-center">
            <h3 className="text-base font-semibold text-amber-950">
              {state === "permission-denied" ? "Media permission is blocked" : "Presenter unavailable"}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-amber-900/80">
              {permissionMessage} You can continue the lesson without the AI session.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={startPresenter}
                className="rounded-lg bg-[#06111f] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Retry presenter
              </button>
              <button
                type="button"
                onClick={continueWithLesson}
                className="rounded-lg border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-950"
              >
                Continue with lesson
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
