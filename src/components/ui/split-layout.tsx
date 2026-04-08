"use client";

import { DocumentViewer } from "./document-viewer";
import { AnimatedAIChat } from "./animated-ai-chat";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export function SplitLayout({ file, onClose }: { file: File, onClose: () => void }) {
  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* Left panel - Document Viewer */}
      <motion.div 
        initial={{ opacity: 0, x: -20, flex: 0 }}
        animate={{ opacity: 1, x: 0, flex: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full lg:w-1/2 h-[45vh] lg:h-full border-b lg:border-r border-white/10 flex flex-col bg-black/20"
      >
        <div className="flex items-center justify-between shrink-0 p-3 border-b border-white/10 bg-black/40 shadow-sm z-10">
          <div className="px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-lg text-xs font-mono text-white/80 border border-white/10 max-w-[70%] truncate flex-1">
            {file.name} <span className="text-white/40 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 p-1.5 pr-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-xs font-medium border border-red-500/20 group ml-3 shrink-0"
          >
            <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Close
          </button>
        </div>
        <div className="flex-1 h-full w-full overflow-hidden relative">
          <DocumentViewer file={file} />
        </div>
      </motion.div>

      {/* Right panel - Chat */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full lg:w-1/2 h-[55vh] lg:h-full relative flex flex-col overflow-auto"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent to-white/[0.02] pointer-events-none" />
        {/* Pass initial file so it's already "attached" in the chat */}
        <AnimatedAIChat initialAttachedFiles={[file]} />
      </motion.div>
    </div>
  );
}
