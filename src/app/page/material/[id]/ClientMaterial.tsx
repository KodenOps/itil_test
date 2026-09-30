"use client";

import dynamic from "next/dynamic";
import PptxViewer from "@/app/components/PptxViewer";

const PdfViewer = dynamic(() => import("@/app/components/PdfViewer"), {
  ssr: false,
});

export type ClientMaterialProps = {
  materialId: string;
  type: string;
  title: string;
  author: string;
};

export default function ClientMaterial({
  materialId,
  type,
  title,
  author,
}: ClientMaterialProps) {
  return (
    <div className='min-h-screen bg-white px-4 py-6 text-slate-900 md:px-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='my-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-500'>
            Material viewer
          </p>
          <h1 className='mt-3 text-3xl font-black text-slate-900'>{title}</h1>
          <h4 className='mt-2 text-base italic text-slate-600'>
            Author: {author}
          </h4>
        </div>
      </div>
      {type === "pdf" && (
        <PdfViewer fileUrl={`/api/material?id=${materialId}`} />
      )}
      {type === "pptx" && (
        <PptxViewer fileUrl={`/api/material?id=${materialId}`} />
      )}
    </div>
  );
}
