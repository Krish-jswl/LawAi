"use client";

import { useEffect, useState } from "react";
import { FileWarning } from "lucide-react";

export function DocumentViewer({ file }: { file: File }) {
  const [content, setContent] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Generate object URL for PDF/Images
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    
    // If it's a text file, read its contents
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target?.result as string);
      reader.readAsText(file);
    }
    
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (file.type === "application/pdf") {
    return url ? <iframe src={url} className="w-full h-full rounded-xl bg-white" title="PDF Viewer" /> : null;
  }

  if (file.type.startsWith("image/")) {
    return url ? (
      <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl p-2 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={file.name} className="w-full h-full object-contain rounded-lg shadow-lg" />
      </div>
    ) : null;
  }

  if (content !== null) {
    return (
      <div className="w-full h-full p-6 overflow-auto bg-white/5 rounded-xl border border-white/5 shadow-inner">
        <pre className="text-white/80 whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed">
          {content}
        </pre>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-white/5 rounded-xl p-6 text-center border border-white/10 border-dashed">
      <FileWarning className="w-16 h-16 mb-4 text-white/20" />
      <h3 className="text-xl font-medium text-white/90 mb-2">Unsupported Document Preview</h3>
      <p className="max-w-md">We cannot generate a visual preview for "{file.name}".</p>
      <p className="mt-2 text-sm text-brand/80 bg-brand/10 px-3 py-1 rounded-full">The AI can still analyze this file!</p>
    </div>
  );
}
