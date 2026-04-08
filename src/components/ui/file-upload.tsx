"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  UploadCloud,
  File as FileIcon,
  Trash2,
  Loader,
  CheckCircle,
} from "lucide-react";

interface FileWithPreview {
  id: string;
  preview: string;
  progress: number;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  file?: File;
}

export default function FileUpload({ onFilesSelected }: { onFilesSelected?: (files: File[]) => void }) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | File[]) => {
    // Optional: limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    const validFiles = Array.from(fileList).filter((file) => file.size <= MAX_SIZE);

    if (validFiles.length < fileList.length) {
      alert("Some files were skipped because they exceed the 10MB limit.");
    }

    const newFiles = validFiles.map((file) => ({
      id: `${URL.createObjectURL(file)}-${Date.now()}`,
      preview: URL.createObjectURL(file),
      progress: 0,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file,
    }));

    setFiles((prev) => {
      // prevent duplicates by name and size
      const uniqueNewFiles = newFiles.filter(nf => !prev.some(pf => pf.name === nf.name && pf.size === nf.size));
      const combined = [...prev, ...uniqueNewFiles];
      return combined;
    });

    newFiles.forEach((f) => simulateUpload(f.id));

    if (onFilesSelected) {
      onFilesSelected(newFiles.map(f => f.file!).filter(Boolean));
    }
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress: Math.min(progress, 100) } : f,
        ),
      );
      if (progress >= 100) {
        clearInterval(interval);
        if (navigator.vibrate) navigator.vibrate(100);
      }
    }, 300);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    // Reset input so the same file can be selected again if removed
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-[#0A0A0B] text-white">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
            "rounded-2xl p-8 text-center cursor-pointer border-2 border-dashed transition-all duration-200",
            isDragging ? "bg-white/[0.05] border-violet-500" : "bg-white/[0.02] border-white/20 hover:bg-white/[0.04]"
        )}
      >
        <UploadCloud className="w-16 h-16 mx-auto text-white/50 mb-4" />
        <p className="text-white/80 font-medium">Click or drag files to upload</p>
        <p className="text-white/40 text-sm mt-2">Max file size: 10MB</p>
        <input ref={inputRef} type="file" multiple hidden onChange={onSelect} />
      </motion.div>
    </div>
  );
}
