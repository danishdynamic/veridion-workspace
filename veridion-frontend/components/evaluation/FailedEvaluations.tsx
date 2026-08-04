// FailedEvaluations.tsx
import React from "react";
import { FailedEvaluation } from "@/types/evaluation";

export const FailedEvaluations: React.FC<{ failures: FailedEvaluation[]; onRetry: (id: string) => void }> = ({
  failures,
  onRetry,
}) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4">Failed Evaluations & Regressions</h3>
    <div className="space-y-3">
      {failures.map((f) => (
        <div key={f.id} className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">{f.query}</div>
            <div className="text-red-600 dark:text-red-400 mt-0.5">Reason: {f.failureReason}</div>
          </div>
          <button
            onClick={() => onRetry(f.id)}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
          >
            Retry
          </button>
        </div>
      ))}
    </div>
  </div>
);