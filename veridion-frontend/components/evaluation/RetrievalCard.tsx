// RetrievalCard.tsx
import React from "react";
import { RetrievalMetrics } from "@/types/evaluation";

export const RetrievalCard: React.FC<{ metrics: RetrievalMetrics }> = ({ metrics }) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Retrieval & Rerank</h3>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div><span className="text-zinc-500">Retrieved:</span> <span className="font-bold">{metrics.documentsRetrieved}</span></div>
      <div><span className="text-zinc-500">Used:</span> <span className="font-bold">{metrics.contextsUsed}</span></div>
      <div><span className="text-zinc-500">Rerank Score:</span> <span className="font-bold">{metrics.rerankScore}</span></div>
      <div><span className="text-zinc-500">Avg Similarity:</span> <span className="font-bold">{metrics.averageSimilarity}</span></div>
    </div>
  </div>
);