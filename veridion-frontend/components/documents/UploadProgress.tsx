"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
  completed: boolean;
}

export function UploadProgress({ progress, isUploading, completed }: UploadProgressProps) {
  if (!isUploading && !completed) return null;

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-zinc-700 dark:text-zinc-300">
          {completed ? "Upload Complete & Indexed!" : "Uploading & Processing..."}
        </span>
        <span className="text-blue-600 dark:text-blue-400 font-mono font-semibold">
          {progress}%
        </span>
      </div>
      <Progress value={progress} className="h-2 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}