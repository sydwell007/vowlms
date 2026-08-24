"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { VowHumanPresenter } from "@/components/learning/VowHumanPresenter";
import {
  emptyVowHumanPresenter,
  normalizeVowHumanPresenter,
  validateVowHumanPresenter,
  vowHumanPlacements,
  vowHumanRoles,
} from "@/lib/vowhumans";
import type { VowHumanPresenterConfig } from "@/types/lms";

type PresenterLesson = {
  id: string;
  slug: string;
  title: string;
  type: string;
  duration_minutes: number;
  module_title: string;
  course_slug: string;
  course_title: string;
  academy_name: string;
  vowhuman_enabled: boolean;
  vowhuman_embed_url: string | null;
  vowhuman_presenter_name: string | null;
  vowhuman_intro: string | null;
  vowhuman_placement: string;
  vowhuman_role: string;
  vowhuman_expertise: string | null;
  vowhuman_camera_enabled: boolean;
  vowhuman_microphone_enabled: boolean;
};

type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

function lessonConfig(lesson: PresenterLesson): VowHumanPresenterConfig {
  return normalizeVowHumanPresenter(lesson) ?? { ...emptyVowHumanPresenter };
}

export function VowHumanLessonEditor({ initialLessonSlug }: { initialLessonSlug: string }) {
  const [query, setQuery] = useState(initialLessonSlug);
  const [lessons, setLessons] = useState<PresenterLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<PresenterLesson | null>(null);
  const [config, setConfig] = useState<VowHumanPresenterConfig>({ ...emptyVowHumanPresenter });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const loadLessons = useCallback(async (search: string, signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const suffix = search.trim() ? `?q=${encodeURIComponent(search.trim())}` : "";
      const response = await fetch(`/api/admin/lessons${suffix}`, {
        cache: "no-store",
        signal,
      });
      const json = (await response.json()) as ApiEnvelope<{ lessons: PresenterLesson[] }>;
      if (!response.ok || !json.ok) throw new Error(json.error ?? "Unable to load lessons");

      const nextLessons = json.data?.lessons ?? [];
      setLessons(nextLessons);
      const next = nextLessons[0] ?? null;
      setSelectedLesson(next);
      setConfig(next ? lessonConfig(next) : { ...emptyVowHumanPresenter });
      setShowPreview(false);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Unable to load lessons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => loadLessons(initialLessonSlug, controller.signal));
    return () => controller.abort();
  }, [initialLessonSlug, loadLessons]);

  function selectLesson(lesson: PresenterLesson) {
    setSelectedLesson(lesson);
    setConfig(lessonConfig(lesson));
    setError("");
    setSuccess("");
    setShowPreview(false);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadLessons(query);
  }

  function previewPresenter() {
    const previewConfig = { ...config, enabled: true };
    const errors = validateVowHumanPresenter(previewConfig);
    if (errors.length > 0) {
      setError(errors[0]);
      setShowPreview(false);
      return;
    }
    setError("");
    setSuccess("");
    setShowPreview(true);
  }

  async function savePresenter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedLesson) return;

    const validationErrors = validateVowHumanPresenter(config);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`/api/admin/lessons/${encodeURIComponent(selectedLesson.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const json = (await response.json()) as ApiEnvelope<PresenterLesson>;
      if (!response.ok || !json.ok || !json.data) {
        throw new Error(json.error ?? "Unable to save presenter settings");
      }

      const updated = json.data;
      setSelectedLesson(updated);
      setConfig(lessonConfig(updated));
      setLessons((current) => current.map((lesson) => (lesson.slug === updated.slug ? updated : lesson)));
      setSuccess("AI presenter settings saved.");
      setShowPreview(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save presenter settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-slate-200 bg-white p-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
        <form onSubmit={submitSearch} className="flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search lessons</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Lesson, course, or slug"
              className="min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-ink outline-none focus:border-[#1166c8]"
            />
          </label>
          <button type="submit" className="rounded-lg bg-[#06111f] px-4 text-sm font-semibold text-white">
            Search
          </button>
        </form>

        <div className="mt-4" aria-live="polite">
          {loading ? <p className="py-8 text-center text-sm text-muted">Loading lessons...</p> : null}
          {!loading && lessons.length === 0 ? (
            <p className="py-8 text-center text-sm leading-6 text-muted">No lessons match this search.</p>
          ) : null}
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => selectLesson(lesson)}
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                  selectedLesson?.slug === lesson.slug
                    ? "border-[#1166c8] bg-[#eef7ff]"
                    : "border-slate-200 bg-white hover:border-[#1166c8]/35"
                }`}
              >
                <span className="block text-sm font-semibold text-ink">{lesson.title}</span>
                <span className="mt-1 block truncate text-xs text-muted">{lesson.course_title}</span>
                {lesson.vowhuman_enabled ? (
                  <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-700">
                    AI enabled
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {selectedLesson ? (
          <>
            <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">
                    {selectedLesson.academy_name} / {selectedLesson.course_title}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">{selectedLesson.title}</h2>
                  <p className="mt-1 text-sm text-muted">{selectedLesson.module_title}</p>
                </div>
                <Link
                  href={`/lesson/${selectedLesson.slug}`}
                  target="_blank"
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
                >
                  Open lesson
                </Link>
              </div>

              <form id="vowhuman-editor-form" onSubmit={savePresenter} className="mt-6 space-y-6">
                <label className="flex items-start justify-between gap-5 rounded-lg border border-slate-200 bg-[#f8fbfe] p-4">
                  <span>
                    <span className="block text-sm font-semibold text-ink">Enable AI learning guide</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      The lesson remains usable when this optional presenter is disabled or unavailable.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(event) => setConfig((current) => ({ ...current, enabled: event.target.checked }))}
                    className="mt-1 h-5 w-5 accent-[#1166c8]"
                  />
                </label>

                <fieldset>
                  <legend className="text-sm font-semibold text-ink">Learning role</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {vowHumanRoles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        aria-pressed={config.role === role.value}
                        onClick={() => setConfig((current) => ({ ...current, role: role.value }))}
                        className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition ${
                          config.role === role.value
                            ? "border-[#1166c8] bg-[#1166c8] text-white"
                            : "border-slate-200 bg-white text-ink hover:border-[#1166c8]/40"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Presenter name
                    <input
                      value={config.presenterName}
                      maxLength={150}
                      onChange={(event) => setConfig((current) => ({ ...current, presenterName: event.target.value }))}
                      className="min-h-11 rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-[#1166c8]"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Expertise label
                    <input
                      value={config.expertise}
                      maxLength={180}
                      placeholder="Example: Business Ethics specialist"
                      onChange={(event) => setConfig((current) => ({ ...current, expertise: event.target.value }))}
                      className="min-h-11 rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-[#1166c8]"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Approved VowHumans embed URL
                  <input
                    type="url"
                    value={config.embedUrl}
                    placeholder="https://vowhumans.com/embed/{digital-human-id}/{embed-slug}"
                    onChange={(event) => setConfig((current) => ({ ...current, embedUrl: event.target.value.trim() }))}
                    className="min-h-11 rounded-lg border border-slate-200 px-3 font-mono text-sm font-normal outline-none focus:border-[#1166c8]"
                  />
                  <span className="text-xs font-normal leading-5 text-muted">
                    Paste only the approved URL. Iframe HTML, scripts, query strings, and other domains are rejected.
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Learner introduction
                  <textarea
                    value={config.introduction}
                    maxLength={1000}
                    rows={3}
                    onChange={(event) => setConfig((current) => ({ ...current, introduction: event.target.value }))}
                    className="rounded-lg border border-slate-200 px-3 py-3 font-normal leading-6 outline-none focus:border-[#1166c8]"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-ink">
                    Placement
                    <select
                      value={config.placement}
                      onChange={(event) => setConfig((current) => ({
                        ...current,
                        placement: event.target.value as VowHumanPresenterConfig["placement"],
                      }))}
                      className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-[#1166c8]"
                    >
                      {vowHumanPlacements.map((placement) => (
                        <option key={placement.value} value={placement.value}>{placement.label}</option>
                      ))}
                    </select>
                  </label>

                  <fieldset>
                    <legend className="text-sm font-semibold text-ink">Session permissions</legend>
                    <div className="mt-2 flex min-h-11 flex-wrap items-center gap-5 rounded-lg border border-slate-200 px-4">
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={config.cameraEnabled}
                          onChange={(event) => setConfig((current) => ({ ...current, cameraEnabled: event.target.checked }))}
                          className="h-4 w-4 accent-[#1166c8]"
                        />
                        Camera
                      </label>
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={config.microphoneEnabled}
                          onChange={(event) => setConfig((current) => ({ ...current, microphoneEnabled: event.target.checked }))}
                          className="h-4 w-4 accent-[#1166c8]"
                        />
                        Microphone
                      </label>
                    </div>
                  </fieldset>
                </div>

                {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}
                {success ? <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}

                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={previewPresenter}
                    className="min-h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-ink hover:bg-slate-50"
                  >
                    Preview presenter
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="min-h-11 rounded-lg bg-gold px-6 text-sm font-semibold text-[#06111f] disabled:cursor-wait disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save presenter settings"}
                  </button>
                </div>
              </form>
            </section>

            {showPreview ? (
              <div className="mt-6">
                <VowHumanPresenter
                  config={{ ...config, enabled: true }}
                  lessonSlug={selectedLesson.slug}
                  lessonTitle={selectedLesson.title}
                  contentTargetId="vowhuman-editor-form"
                />
              </div>
            ) : null}
          </>
        ) : (
          <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-ink">Select a lesson to configure its AI guide</h2>
            <p className="mt-2 text-sm text-muted">Search by lesson title, course name, or lesson slug.</p>
          </section>
        )}
      </div>
    </div>
  );
}
