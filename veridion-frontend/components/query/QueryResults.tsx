import React from "react";
import { ComplianceResult } from "@/types/query";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";

interface QueryResultsProps {
  results: ComplianceResult[];
  onSelectResult?: (result: ComplianceResult) => void;
  selectedParentId?: string;
}

export function QueryResults({
  results,
  onSelectResult,
  selectedParentId,
}: QueryResultsProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        No matched legal contexts found. Submit a query to search pgvector.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((res) => {
        const isSelected = selectedParentId === res.parentId;
        const scorePercent = (res.similarityScore * 100).toFixed(1);

        return (
          <div
            key={`${res.parentId}-${res.versionTag}`}
            onClick={() => onSelectResult?.(res)}
            className={`group flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            }`}
          >
            <div className="space-y-1.5 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-500 shrink-0" />
                <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {res.documentTitle}
                </h4>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {res.versionTag}
                </Badge>
              </div>
              <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                {res.matchedChildContext}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge className="bg-blue-100 font-mono text-[10px] text-blue-800 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400">
                {scorePercent}% match
              </Badge>
              <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}