"use client";

import React from "react";
import { PerformanceOverview as IOverview } from "@/types/performance";

export const PerformanceOverviewCard: React.FC<{ metrics: IOverview }> = ({ metrics }) => {
  const cards = [
    { label: "Avg End-to-End Latency", value: `${metrics.avgLatencyMs} ms`, color: "border-sky-500/30 text-sky-400" },
    { label: "Cache Hit Ratio", value: `${metrics.cacheHitRate.toFixed(1)}%`, color: "border-emerald-500/30 text-emerald-400" },
    { label: "Redis Memory Peak", value: `${metrics.redisMemoryUsageMb} MB`, color: "border-purple-500/30 text-purple-400" },
    { label: "Streaming Throughput", value: `${metrics.avgStreamingTps} tok/s`, color: "border-amber-500/30 text-amber-400" },
    { label: "Client Bundle Size", value: `${metrics.totalBundleKb} KB`, color: "border-indigo-500/30 text-indigo-400" },
    { label: "UI Smoothness (FPS)", value: `${metrics.averageFps} FPS`, color: "border-teal-500/30 text-teal-400" },
    { label: "Host Memory Usage", value: `${metrics.memoryUsagePercentage}%`, color: "border-rose-500/30 text-rose-400" },
    { label: "Host CPU Usage", value: `${metrics.cpuUsagePercentage}%`, color: "border-orange-500/30 text-orange-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`bg-slate-900 border rounded-xl p-4 shadow-sm ${card.color}`}>
          <p className="text-xs text-slate-400 font-medium">{card.label}</p>
          <p className="text-xl font-bold mt-1 text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
};