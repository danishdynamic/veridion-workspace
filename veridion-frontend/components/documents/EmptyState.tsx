import React from "react";
import { FolderOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 mb-4">
        <FolderOpen className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        No regulations uploaded yet
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
        Upload your first legislative act or regulation above to begin automated version tracking and multi-agent compliance RAG.
      </p>
    </div>
  );
}