// LatencyCard.tsx
import React from "react";
import { LatencyMetrics } from "@/types/evaluation";

export const LatencyCard: React.FC<{ metrics: LatencyMetrics }> = ({ metrics }) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Production Latency Breakdown</h3>
    <div className="space-y-1 text-xs">
      <div className="flex justify-between"><span>Retrieval:</span> <span>{metrics.retrievalTime}ms</span></div>
      <div className="flex justify-between"><span>Rerank:</span> <span>{metrics.rerankTime}ms</span></div>
      <div className="flex justify-between"><span>LLM Generation:</span> <span>{metrics.llmTime}ms</span></div>
      <div className="flex justify-between font-bold border-t border-zinc-100 dark:border-zinc-800 pt-1">
        <span>Total E2E:</span> <span>{metrics.totalTime}ms</span>
      </div>
    </div>
  </div>
);