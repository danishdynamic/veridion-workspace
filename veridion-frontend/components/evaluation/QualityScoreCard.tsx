// QualityScoreCard.tsx
import React from "react";
import { QualityMetrics } from "@/types/evaluation";

export const QualityScoreCard: React.FC<{ metrics: QualityMetrics }> = ({ metrics }) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Overall Quality</h3>
    <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
      {metrics.overall.toFixed(1)} <span className="text-sm font-normal text-zinc-500">/ 100</span>
    </div>
    <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
      <div className="flex justify-between"><span>Retrieval:</span> <span className="font-semibold">{metrics.retrieval}%</span></div>
      <div className="flex justify-between"><span>Grounding:</span> <span className="font-semibold">{metrics.grounding}%</span></div>
      <div className="flex justify-between"><span>Production Grade:</span> <span className="font-semibold">{metrics.production}%</span></div>
    </div>
  </div>
);