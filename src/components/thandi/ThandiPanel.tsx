"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Mic, MicOff, RefreshCw, X } from "lucide-react";
import Image from "next/image";
import { ThandiAvatar } from "@/components/thandi/ThandiAvatar";
import { useThandiContextKey } from "@/lib/thandi/context-key";
import { useThandiVoiceActivation } from "@/lib/thandi/useThandiVoiceActivation";
import { closeThandiPanel, isThandiPanelOpen, subscribeThandiPanel } from "@/lib/thandi/panel-store";
import { THANDI_EMBED_URL, THANDI_WAKE_WORD } from "@/lib/thandi/config";
import { getThandiLanguage, THANDI_LANGUAGES } from "@/lib/thandi/languages";
import { visualAssets } from "@/lib/visual-assets";
import { VOWHUMANS_ORIGIN } from "@/lib/vowhumans";
import { THANDI_GUIDE_KEY } from "@/lib/thandi/config";

const LANGUAGE_STORAGE_KEY = "thandi_preferred_language";

type Stage = "idle" | "loading" | "active" | "error" | "permission-denied";

/** Turns a lesson/course slug into a readable title; the guide key becomes "VowLMS". */
function readableContextLabel(key: string): string {
  if (key === THANDI_GUIDE_KEY) return "VowLMS";
  return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ThandiPanel() {
  const [open, setOpen] = useState(false);
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
    const unsubscribe = subscribeThandiPanel(setOpen);
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
    void startSession();
  }, open);

  // Opening the panel (by click or by voice) is already the explicit "talk to
  // Thandi" action — start the session immediately rather than making the
  // user click twice; the embedded call still shows its own AI-disclosure and
  // start button before any media session actually begins.
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thandi, VowLMS AI tutor"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06111f]/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(6,17,31,0.35)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-[#06111f] to-[#12213a] px-5 py-4">
          <div className="flex items-center gap-3">
            <ThandiAvatar size={44} listening={wake.listening} />
            <div>
              <p className="text-sm font-semibold text-white">Thandi</p>
              <p className="text-[11px] text-white/60">24/7 AI Tutor</p>
              <span className="mt-1 flex items-center gap-1 text-[10px] text-white/45">
                <Image src={visualAssets.vowhumansLogo} alt="" width={12} height={12} className="h-3 w-3 object-contain" />
                Powered by VowHumans
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close Thandi"
            className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Context + language row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#f6faff] px-5 py-2.5">
          <p className="text-[11px] text-muted">
            Helping with: <span className="font-semibold text-ink">{readableContextLabel(contextKey)}</span>
          </p>
          <select
            value={languageCode}
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label="Thandi's response language"
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-ink"
          >
            {THANDI_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {stage === "loading" && !contextToken ? (
            <div className="flex min-h-72 items-center justify-center rounded-lg bg-[#06111f] text-center text-white">
              <div>
                <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#4aa3ff]" />
                <p className="mt-4 text-sm font-semibold">Getting Thandi ready…</p>
              </div>
            </div>
          ) : null}

          {contextToken ? (
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[380px] overflow-hidden rounded-lg bg-[#06111f]">
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
            </div>
          ) : null}

          {(stage === "error" || stage === "permission-denied") && !contextToken ? (
            <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-6 text-center">
              <CircleAlert className="mx-auto text-amber-600" size={22} />
              <p className="mt-2 text-sm font-semibold text-amber-950">
                {stage === "permission-denied" ? "Microphone access is blocked" : "Thandi is unavailable"}
              </p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-amber-900/80">{errorMessage}</p>
              <button
                type="button"
                onClick={() => void startSession()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#06111f] px-4 py-2 text-xs font-semibold text-white"
              >
                <RefreshCw size={13} /> Try again
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer: voice activation */}
        <div className="border-t border-slate-100 px-5 py-3">
          {wake.supported ? (
            <label className="flex items-center justify-between gap-3">
              <span className="text-[11px] leading-4 text-muted">
                {wake.permissionDenied
                  ? `Microphone blocked — enable it in your browser to say "${THANDI_WAKE_WORD}" hands-free.`
                  : `Say "${THANDI_WAKE_WORD}" anywhere in VowLMS to open Thandi hands-free.`}
              </span>
              <button
                type="button"
                onClick={wake.toggle}
                role="switch"
                aria-checked={wake.enabled}
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${wake.enabled ? "bg-[#4aa3ff]" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${wake.enabled ? "left-4" : "left-0.5"}`}
                />
              </button>
            </label>
          ) : (
            <p className="flex items-center gap-1.5 text-[11px] text-muted">
              <MicOff size={13} /> Hands-free &quot;Say Thandi&quot; needs Chrome or Edge — tap her portrait instead.
            </p>
          )}
          {stage === "active" ? (
            <p className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600">
              <Mic size={11} /> Live — speak to Thandi now.
            </p>
          ) : null}
          <p className="mt-2 text-[10px] leading-4 text-slate-400">
            Response language above is a request, not a guarantee — Thandi replies in English if she isn&apos;t confident in {language.nativeName}.
          </p>
        </div>
      </div>
    </div>
  );
}
