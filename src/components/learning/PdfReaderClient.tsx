"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type Props = {
  filename: string;
  url: string;
};

// Reasonable default until the first real page reports its own dimensions —
// keeps not-yet-rendered page skeletons from jumping around as they load in.
const DEFAULT_PAGE_RATIO = 1.294; // ~A4/Letter portrait height ÷ width

export function PdfReaderClient({ filename, url }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef(new Map<number, HTMLDivElement>());
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(720);
  const [pageRatio, setPageRatio] = useState(DEFAULT_PAGE_RATIO);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(() => new Set([1, 2]));
  const [loadKey, setLoadKey] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const reader = scrollRef.current;
    if (!reader) return;

    const updateWidth = () => {
      setPageWidth(Math.min(Math.max(reader.clientWidth - 32, 280), 900));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(reader);
    return () => observer.disconnect();
  }, []);

  // Lazily mount pages as they approach the scroll container — never
  // un-mount once rendered, so scrolling back up doesn't re-trigger PDF.js.
  useEffect(() => {
    const root = scrollRef.current;
    if (numPages === 0 || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setRenderedPages((prev) => {
          let changed = false;
          const next = new Set(prev);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const page = Number((entry.target as HTMLElement).dataset.page);
            if (!next.has(page)) {
              next.add(page);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { root, rootMargin: "1200px 0px 1200px 0px" },
    );

    for (const el of pageRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [numPages]);

  // Scrollspy: whichever page crosses the vertical center of the reader
  // becomes "the" page for the compact N/total indicator and side arrows.
  useEffect(() => {
    const root = scrollRef.current;
    if (numPages === 0 || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPageNumber(Number((entry.target as HTMLElement).dataset.page));
          }
        }
      },
      { root, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of pageRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [numPages]);

  // Edge fade cues — only hint at more content in the direction it exists.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const updateEdges = () => {
      setAtStart(root.scrollTop <= 4);
      setAtEnd(root.scrollTop + root.clientHeight >= root.scrollHeight - 4);
    };

    updateEdges();
    root.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(root);
    return () => {
      root.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [numPages]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(page, 1), numPages);
      pageRefs.current.get(clamped)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [numPages],
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      goToPage(pageNumber + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goToPage(pageNumber - 1);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-12 items-center justify-between gap-4 border-b border-slate-200 px-4 py-2.5">
        <p className="min-w-0 truncate text-sm font-semibold text-ink">{filename}</p>
        <div className="flex shrink-0 items-center gap-2">
          {numPages > 0 ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink">
              {pageNumber}/{numPages}
            </span>
          ) : null}
          <a
            href={url}
            download
            className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-slate-200"
          >
            Download
          </a>
        </div>
      </div>

      {numPages > 0 ? (
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-[linear-gradient(90deg,#1166c8,#20c7ff)] transition-[width] duration-300 ease-out"
            style={{ width: `${(pageNumber / numPages) * 100}%` }}
          />
        </div>
      ) : null}

      <div className="relative">
        <div
          ref={scrollRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="group"
          aria-label={`${filename} — use the arrow keys, scroll, or swipe to move between pages`}
          className="max-h-[75vh] touch-pan-y overflow-y-auto overscroll-contain bg-slate-100 px-4 py-6 outline-none [scrollbar-width:thin] sm:py-8"
        >
          <Document
            key={`${url}-${loadKey}`}
            file={url}
            onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
            loading={(
              <div className="flex min-h-[420px] items-center justify-center text-sm font-medium text-muted">
                Loading reading material...
              </div>
            )}
            error={(
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-sm font-semibold text-ink">The reading material could not be displayed.</p>
                <p className="max-w-md text-sm text-muted">Retry the document or use Download to open the original file.</p>
                <button
                  type="button"
                  onClick={() => setLoadKey((key) => key + 1)}
                  className="rounded-md bg-[#06111f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#10243a]"
                >
                  Retry document
                </button>
              </div>
            )}
          >
            {Array.from({ length: numPages }, (_, index) => index + 1).map((page) => (
              <div
                key={page}
                data-page={page}
                ref={(node) => {
                  if (node) pageRefs.current.set(page, node);
                  else pageRefs.current.delete(page);
                }}
                className="mb-5 flex justify-center last:mb-0"
              >
                {renderedPages.has(page) ? (
                  <Page
                    pageNumber={page}
                    width={pageWidth}
                    onLoadSuccess={(loadedPage) => {
                      if (page === 1) setPageRatio(loadedPage.height / loadedPage.width);
                    }}
                    loading={
                      <div
                        style={{ width: pageWidth, aspectRatio: `1 / ${pageRatio}` }}
                        className="animate-pulse rounded bg-slate-200"
                      />
                    }
                    className="overflow-hidden bg-white shadow-[0_12px_36px_rgba(15,23,42,0.14)]"
                  />
                ) : (
                  <div
                    style={{ width: pageWidth, aspectRatio: `1 / ${pageRatio}` }}
                    className="animate-pulse rounded bg-slate-200"
                  />
                )}
              </div>
            ))}
          </Document>
        </div>

        {/* Fade cues hinting there's more to scroll, only in the direction it exists */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-100 to-transparent transition-opacity duration-200 ${atStart ? "opacity-0" : "opacity-100"}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-100 to-transparent transition-opacity duration-200 ${atEnd ? "opacity-0" : "opacity-100"}`}
        />

        {/* Lightweight floating side arrows — click to advance a page at a time */}
        {numPages > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber === 1}
              aria-label="Previous page"
              title="Previous page"
              className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-ink shadow-md backdrop-blur transition hover:scale-110 hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber === numPages}
              aria-label="Next page"
              title="Next page"
              className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-ink shadow-md backdrop-blur transition hover:scale-110 hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
