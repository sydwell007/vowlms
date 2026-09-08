"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Mic, MicOff, Minus, RefreshCw, X } from "lucide-react";
import Image from "next/image";
import { ThandiAvatar } from "@/components/thandi/ThandiAvatar";
import { useThandiContextKey } from "@/lib/thandi/context-key";
import { useThandiVoiceActivation } from "@/lib/thandi/useThandiVoiceActivation";
import { closeThandiPanel, isThandiPanelOpen, subscribeThandiPanel } from "@/lib/thandi/panel-store";
import { THANDI_EMBED_URL, THANDI_GUIDE_KEY, THANDI_WAKE_WORD } from "@/lib/thandi/config";
import { getThandiLanguage, THANDI_LANGUAGES } from "@/lib/thandi/languages";
import { visualAssets } from "@/lib/visual-assets";
import { VOWHUMANS_ORIGIN } from "@/lib/vowhumans";

const LANGUAGE_STORAGE_KEY = "thandi_preferred_language";

type Stage = "idle" | "loading" | "active" | "error" | "permission-denied";

/** Turns a lesson/course slug into a readable title; the guide key becomes "VowLMS". */
function readableContextLabel(key: string): string {
  if (key === THANDI_GUIDE_KEY) return "VowLMS";
  return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Thandi's persistent widget — docked to the same right-hand edge as the
 * Ecosystem sidebar, but anchored to the bottom corner so it never fights
 * that sidebar's own top-anchored flyout for space. Deliberately NOT a
 * centred modal: a learner should be able to keep reading a lesson while
 * Thandi stays open and live beside it. Minimising collapses it to a small
 * portrait bubble without ending the call — the underlying call iframe stays
 * mounted the whole time (only its wrapper's size/visibility changes), so a
 * response Thandi is mid-way through keeps playing even while minimised.
 */
export function ThandiPanel() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [frameKey, setFrameKey] = useState(0);
  const [contextToken, setContextToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [languageCode, setLanguageCode] = useState("en");
  const { key: contextKey } = useThandiContextKey();

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setOpen(isThandiPanelOpen());
    });
    // Any call to openThandiPanel() — including re-clicking Thandi's sidebar
    // entry while she's already minimised — should surface her again.
    const unsubscribe = subscribeThandiPanel((isOpen) => {
      setOpen(isOpen);
      if (isOpen) setMinimized(false);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved) setLanguageCode(saved);
      } catch {
        /* private browsing */
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = useCallback(async () => {
    setStage("loading");
    setErrorMessage("");
    setFrameKey((n) => n + 1);
    try {
      const language = getThandiLanguage(languageCode);
      const url = `/api/vowhumans/context-token/${encodeURIComponent(contextKey)}?lang=${encodeURIComponent(language.name)}`;
      const response = await fetch(url, { cache: "no-store" });
      const body = (await response.json().catch(() => null)) as { token?: string; error?: string } | null;
      if (!response.ok || !body?.token) {
        throw new Error(body?.error || "Thandi is unavailable right now");
      }
      setContextToken(body.token);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Thandi is unavailable right now");
      setStage("error");
    }
  }, [contextKey, languageCode]);

  const wake = useThandiVoiceActivation(() => {
    setOpen(true);
    setMinimized(false);
    void startSession();
  }, open);

  // Opening (by click or by voice) is already the explicit "talk to Thandi"
  // action — start the session immediately rather than making the user click
  // twice; the embedded call still shows its own AI-disclosure and start
  // button before any media session actually begins.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      if (open && stage === "idle") void startSession();
      if (!open) {
        setStage("idle");
        setContextToken("");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== VOWHUMANS_ORIGIN || !event.data || typeof event.data !== "object") return;
      const message = event.data as { type?: string; permission?: string; message?: string };
      if (message.type === "vowhumans:loaded") setStage("active");
      if (message.type === "vowhumans:permission-denied") {
        setStage("permission-denied");
        setErrorMessage(message.permission ? `${message.permission} access is blocked in your browser settings.` : "Microphone access is blocked in your browser settings.");
      }
      if (message.type === "vowhumans:error" || message.type === "vowhumans:unavailable") {
        setStage("error");
        setErrorMessage(message.message || "Thandi is temporarily unavailable.");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function close() {
    closeThandiPanel();
  }

  function changeLanguage(code: string) {
    setLanguageCode(code);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
    if (stage !== "idle") void startSession();
  }

  if (!open) return null;

  const language = getThandiLanguage(languageCode);
  const live = stage === "active";

  return (
    <div
      className={`fixed z-[100] flex flex-col overflow-hidden bg-white shadow-[0_20px_60px_rgba(6,17,31,0.28)] transition-all duration-300 ease-out ${
        minimized
          ? "bottom-20 right-4 h-16 w-16 rounded-full xl:bottom-6 xl:right-6"
          : "bottom-20 right-3 w-[19rem] max-h-[min(31rem,calc(100vh-6rem))] rounded-2xl xl:bottom-6 xl:right-6 xl:w-80"
      }`}
      style={{ transformOrigin: "bottom right" }}
    >
      {/* Minimised: a round portrait bubble that restores the panel — the live
          call underneath keeps running, this is purely a visual overlay. */}
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          aria-label="Reopen Thandi"
          className="relative flex h-full w-full items-center justify-center"
        >
          <ThandiAvatar size={64} listening={wake.listening} />
          {live ? (
            <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          ) : null}
        </button>
      ) : null}

      {/* Full panel chrome + call — kept mounted (not unmounted) even while
          minimised, via height/opacity instead of a conditional swap, so a
          live call's audio isn't interrupted by minimising. */}
      <div
        className={
          minimized
            ? "pointer-events-none h-0 overflow-hidden opacity-0"
            : "flex min-h-0 flex-1 flex-col opacity-100"
        }
        aria-hidden={minimized}
      >
        <div
          role="region"
          aria-label="Thandi, VowLMS AI tutor"
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-[#06111f] to-[#12213a] px-3.5 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <ThandiAvatar size={36} listening={wake.listening} />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight text-white">
                  Thandi
                  {live ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> : null}
                </p>
                <p className="truncate text-[10px] leading-tight text-white/55">24/7 AI Tutor</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Minimize Thandi"
                className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close Thandi"
                className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Context + language row */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-[#f6faff] px-3.5 py-1.5">
            <p className="truncate text-[10px] text-muted">
              Helping with <span className="font-semibold text-ink">{readableContextLabel(contextKey)}</span>
            </p>
            <select
              value={languageCode}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Thandi's response language"
              title={`Response language is a request, not a guarantee — Thandi replies in English if she isn't confident in ${language.nativeName}.`}
              className="shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink"
            >
              {THANDI_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Portrait / call area — deliberately compact, not full-height */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#06111f] p-2.5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[210px] overflow-hidden rounded-lg bg-[#0a1830]">
              {stage === "loading" && !contextToken ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
                  <ThandiAvatar size={72} />
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#4aa3ff]" />
                </div>
              ) : null}

              {contextToken ? (
                <iframe
                  key={frameKey}
                  src={`${THANDI_EMBED_URL}#${new URLSearchParams({ lesson_context_token: contextToken })}`}
                  title="Thandi, VowLMS AI tutor"
                  allow="microphone; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
                  className="absolute inset-0 h-full w-full border-0"
                  onLoad={() => setStage((s) => (s === "loading" ? "active" : s))}
                  onError={() => {
                    setStage("error");
                    setErrorMessage("Thandi could not load.");
                  }}
                />
              ) : null}

              {(stage === "error" || stage === "permission-denied") && !contextToken ? (
                <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
                  <CircleAlert className="text-amber-400" size={20} />
                  <p className="text-xs font-semibold text-white">
                    {stage === "permission-denied" ? "Microphone blocked" : "Thandi is unavailable"}
                  </p>
                  <p className="text-[10px] leading-4 text-white/60">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => void startSession()}
                    className="mt-1 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-[#06111f]"
                  >
                    <RefreshCw size={11} /> Try again
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer: voice activation */}
          <div className="shrink-0 border-t border-slate-100 px-3.5 py-2">
            {wake.supported ? (
              <label className="flex items-center justify-between gap-2">
                <span className="text-[10px] leading-4 text-muted">
                  {wake.permissionDenied
                    ? `Mic blocked for "${THANDI_WAKE_WORD}" hands-free`
                    : `Say "${THANDI_WAKE_WORD}" to open hands-free`}
                </span>
                <button
                  type="button"
                  onClick={wake.toggle}
                  role="switch"
                  aria-checked={wake.enabled}
                  className={`relative h-4 w-7 shrink-0 rounded-full transition ${wake.enabled ? "bg-[#4aa3ff]" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition ${wake.enabled ? "left-3.5" : "left-0.5"}`}
                  />
                </button>
              </label>
            ) : (
              <p className="flex items-center gap-1.5 text-[10px] text-muted">
                <MicOff size={12} /> Hands-free needs Chrome/Edge — tap to talk instead.
              </p>
            )}
            <div className="mt-1.5 flex items-center justify-between gap-2">
              {live ? (
                <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                  <Mic size={10} /> Live now
                </p>
              ) : (
                <span />
              )}
              <span className="flex items-center gap-1 text-[9px] text-slate-400">
                <Image src={visualAssets.vowhumansLogo} alt="" width={10} height={10} className="h-2.5 w-2.5 object-contain" />
                VowHumans
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
