import React from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface ContextViewerProps {
  legalContext?: string;
  matchedChunk?: string;
}

export function ContextViewer({
  legalContext,
  matchedChunk,
}: ContextViewerProps) {
  if (!legalContext && !matchedChunk) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
        Select a result to inspect detailed context chunks.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          <BookOpen className="h-4 w-4 text-blue-500" /> Legal Context Chunk
        </div>
        <Badge variant="secondary" className="text-[10px]">
          Parent & Child Retrieval
        </Badge>
      </div>

      {matchedChunk && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Matched Segment
          </span>
          <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-800/60">
            {matchedChunk}
          </div>
        </div>
      )}

      {legalContext && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Expanded Legal Context
          </span>
          <div className="max-h-64 overflow-y-auto rounded-lg bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60">
            {legalContext}
          </div>
        </div>
      )}
    </div>
  );
}