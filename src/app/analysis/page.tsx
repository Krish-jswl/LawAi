"use client";

import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { Header } from "@/components/ui/header-01";
import { SplitLayout } from "@/components/ui/split-layout";
import { useState } from "react";

export default function AnalysisPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#0A0A0B] text-white">
      <Header /> 
      <main className="flex-1 w-full pt-[64px] relative z-10 h-[calc(100vh-64px)] overflow-hidden">
        {uploadedFile ? (
          <SplitLayout file={uploadedFile} onClose={() => setUploadedFile(null)} />
        ) : (
          <div className="flex-1 h-full w-full flex items-center justify-center overflow-auto">
            <AnimatedAIChat onFileAttached={setUploadedFile} />
          </div>
        )}
      </main>
    </div>
  );
}
