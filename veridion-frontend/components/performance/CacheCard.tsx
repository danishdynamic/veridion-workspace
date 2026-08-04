"use client";

import React from "react";
import { CacheMetrics } from "@/types/performance";

export const CacheCard: React.FC<{ metrics: CacheMetrics }> = ({ metrics }) => {
  const totalSemantic = metrics.semanticCacheHits + metrics.semanticCacheMisses || 1;
  const semanticHitPct = Math.round((metrics.semanticCacheHits / totalSemantic) * 100);

  const totalKv = metrics.kvHits + metrics.kvMisses || 1;
  const kvHitPct = Math.round((metrics.kvHits / totalKv) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-white">Multi-Tier Cache Efficiency</h3>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800">
          Global Hit Ratio: {metrics.cacheRatio.toFixed(1)}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400">Semantic Cache (Node.js)</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">{semanticHitPct}% Hit Rate</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {metrics.semanticCacheHits} Hits / {metrics.semanticCacheMisses} Misses
          </p>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400">KV Embedding Cache (FastAPI)</p>
          <p className="text-lg font-bold text-cyan-400 mt-1">{kvHitPct}% Hit Rate</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {metrics.kvHits} Hits / {metrics.kvMisses} Misses
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 flex justify-between border-t border-slate-800 pt-3">
        <span>Redis Cache Footprint:</span>
        <span className="font-mono text-white">{metrics.redisMemory} MB Allocated</span>
      </div>
    </div>
  );
};