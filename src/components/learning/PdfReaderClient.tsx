"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
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

export function PdfReaderClient({ filename, url }: Props) {
  const readerRef = useRef<HTMLDivElement>(null);
  const pageListRef = useRef<HTMLDivElement>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(720);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    const reader = readerRef.current;
    if (!reader) return;

    const updateWidth = () => {
      setPageWidth(Math.min(Math.max(reader.clientWidth - 32, 280), 900));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(reader);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activePage = pageListRef.current?.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    activePage?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [pageNumber]);

  const goToPage = (page: number) => {
    setPageNumber(Math.min(Math.max(page, 1), numPages));
    readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-12 items-center justify-between gap-4 border-b border-slate-200 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{filename}</p>
          {numPages > 0 && (
            <p className="mt-0.5 text-xs text-muted">
              Page {pageNumber} of {numPages}
            </p>
          )}
        </div>
        <a
          href={url}
          download
          className="shrink-0 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-slate-200"
        >
          Download
        </a>
      </div>

      <div ref={readerRef} className="scroll-mt-20 bg-slate-100 px-4 py-5 sm:py-7">
        <Document
          key={`${url}-${loadKey}`}
          file={url}
          onLoadSuccess={({ numPages: loadedPages }) => {
            setNumPages(loadedPages);
            setPageNumber((current) => Math.min(current, loadedPages));
          }}
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
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            width={pageWidth}
            loading={(
              <div className="flex min-h-[420px] items-center justify-center text-sm font-medium text-muted">
                Loading page {pageNumber}...
              </div>
            )}
            className="overflow-hidden bg-white shadow-[0_12px_36px_rgba(15,23,42,0.14)]"
          />
        </Document>
      </div>

      {numPages > 0 && (
        <nav aria-label="Reading material pages" className="border-t border-slate-200 bg-white p-3">
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber === 1}
              aria-label="Previous page"
              title="Previous page"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-lg font-semibold text-ink transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              &#8249;
            </button>

            <div
              ref={pageListRef}
              className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:thin]"
            >
              {Array.from({ length: numPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-xs font-semibold transition ${
                    page === pageNumber
                      ? "bg-[#06111f] text-white"
                      : "text-muted hover:bg-slate-100 hover:text-ink"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber === numPages}
              aria-label="Next page"
              title="Next page"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-lg font-semibold text-ink transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              &#8250;
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
