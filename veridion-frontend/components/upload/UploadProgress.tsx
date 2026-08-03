import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export type UploadStage = "idle" | "uploading" | "processing" | "chunking" | "completed";

interface UploadProgressProps {
  progress?: number;
  status: UploadStage;
}

const STAGES: { key: UploadStage; label: string }[] = [
  { key: "uploading", label: "Uploading file..." },
  { key: "processing", label: "Processing content..." },
  { key: "chunking", label: "Generating embeddings..." },
  { key: "completed", label: "Completed" },
];

export function UploadProgress({ status }: UploadProgressProps) {
  if (status === "idle") return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="space-y-3">
        {STAGES.map(({ key, label }) => {
          const isCurrent = status === key;
          const isDone =
            (status === "processing" && key === "uploading") ||
            (status === "chunking" && (key === "uploading" || key === "processing")) ||
            status === "completed";

          return (
            <div key={key} className="flex items-center gap-3 text-xs">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-zinc-300 dark:border-zinc-700" />
              )}
              <span
                className={
                  isDone || isCurrent
                    ? "font-medium text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-600"
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}