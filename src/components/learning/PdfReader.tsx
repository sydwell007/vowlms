"use client";

import dynamic from "next/dynamic";

type Props = {
  filename: string;
  url: string;
};

const ClientReader = dynamic(
  () => import("@/components/learning/PdfReaderClient").then((module) => module.PdfReaderClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-muted">
        Preparing document reader...
      </div>
    ),
  },
);

export function PdfReader(props: Props) {
  return <ClientReader {...props} />;
}
