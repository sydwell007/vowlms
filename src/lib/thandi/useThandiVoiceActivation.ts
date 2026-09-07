"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { THANDI_WAKE_RESPONSE, THANDI_WAKE_WORD } from "@/lib/thandi/config";

const STORAGE_KEY = "thandi_voice_activation_enabled";

// Minimal ambient types for the (non-standardised, Chromium-only) Web Speech
// Recognition API — there is no @types/dom entry for it.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as SpeechWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * "Say Thandi, get Yes I'm listening" — a real, working wake-word listener
 * built on the browser's Web Speech Recognition API, not a fabricated
 * capability. This is genuinely NOT available in VowHumans' own platform (no
 * wake-word/hotword feature exists there) and browsers require an explicit,
 * per-origin microphone permission grant to run it at all — so this is an
 * opt-in toggle, not always-on by default, and it only works in
 * Chromium-based browsers (Chrome, Edge, Android Chrome). Safari/iOS has no
 * SpeechRecognition implementation at all; there `supported` is false and
 * the UI should fall back to a plain "Talk to Thandi" button.
 *
 * Only listens while the Thandi panel is closed — once she's opened and the
 * real embed's own microphone takes over, this recognizer is stopped so the
 * two never fight over the same mic stream or mis-trigger on Thandi's own
 * spoken reply.
 */
export function useThandiVoiceActivation(onWake: () => void, panelOpen: boolean) {
  const supported = typeof window !== "undefined" && Boolean(getRecognitionCtor());
  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const stoppedByUsRef = useRef(false);
  const onWakeRef = useRef(onWake);

  useEffect(() => {
    onWakeRef.current = onWake;
  }, [onWake]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        setEnabled(localStorage.getItem(STORAGE_KEY) === "true");
      } catch {
        /* private browsing */
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      if (next) setPermissionDenied(false);
      return next;
    });
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-ZA";
      window.speechSynthesis.speak(utterance);
    } catch {
      /* speech synthesis unavailable — silent no-op is fine, panel still opens */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!supported || !enabled || panelOpen) {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      Promise.resolve().then(() => {
        if (!cancelled) setListening(false);
      });
      return () => {
        cancelled = true;
      };
    }

    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    stoppedByUsRef.current = false;

    function startRecognition() {
      if (cancelled || !Ctor) return;
      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-ZA";

      recognition.onresult = (event: unknown) => {
        const results = (event as { results?: ArrayLike<{ 0: { transcript: string } }> }).results;
        if (!results) return;
        for (let i = 0; i < results.length; i += 1) {
          const transcript = results[i]?.[0]?.transcript ?? "";
          if (transcript.toLowerCase().includes(THANDI_WAKE_WORD)) {
            stoppedByUsRef.current = true;
            recognition.stop();
            speak(THANDI_WAKE_RESPONSE);
            onWakeRef.current();
            return;
          }
        }
      };
      recognition.onerror = (event: unknown) => {
        const error = (event as { error?: string }).error;
        if (error === "not-allowed" || error === "service-not-allowed") {
          setPermissionDenied(true);
          stoppedByUsRef.current = true;
        }
      };
      recognition.onend = () => {
        setListening(false);
        // Chrome silently ends a "continuous" session after a while even with
        // no error — restart automatically unless we deliberately stopped it
        // (wake word matched, panel opened, or permission was denied).
        if (!cancelled && !stoppedByUsRef.current) {
          window.setTimeout(startRecognition, 300);
        }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setListening(true);
      } catch {
        /* already started, or mic momentarily unavailable — onend/retry loop recovers */
      }
    }

    startRecognition();

    return () => {
      cancelled = true;
      stoppedByUsRef.current = true;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, [supported, enabled, panelOpen, speak]);

  // Broadcast so the sidebar entry (mounted separately from the panel) can
  // show a subtle "listening" indicator without needing this hook itself —
  // same CustomEvent idiom already used for presenter events elsewhere in
  // this repo (see `VowHumanPresenter.tsx`).
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("thandi:voice-state", { detail: { enabled, listening } }),
    );
  }, [enabled, listening]);

  return { supported, enabled, toggle, listening, permissionDenied, speak };
}

