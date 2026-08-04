"use client";

import React from "react";
import { LatencyMetrics } from "@/types/performance";

export const LatencyCard: React.FC<{ metrics: LatencyMetrics }> = ({ metrics }) => {
  const items = [
    { label: "Retrieval (pgvector HNSW)", value: metrics.retrievalLatency },
    { label: "Rerank (Cross-Encoder)", value: metrics.rerankLatency },
    { label: "LLM Generation", value: metrics.llmLatency },
    { label: "Guardrail & Evaluation", value: metrics.evaluationLatency },
    { label: "LangGraph Node Processing", value: metrics.nodeLatency },
    { label: "Next.js Hydration & Render", value: metrics.frontendLatency },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-white">Latency Decomposition</h3>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800">
          Total: {metrics.totalLatency} ms
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const pct = Math.min(100, Math.round((item.value / metrics.totalLatency) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-slate-400 font-mono">{item.value} ms ({pct}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};