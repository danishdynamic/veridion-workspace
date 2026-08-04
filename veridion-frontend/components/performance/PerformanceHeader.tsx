"use client";

import React from "react";
import { usePerformanceStore } from "@/store/performance.store";
import { ServiceType, DateRangeType } from "@/schemas/performance.schema";

interface Props {
  lastUpdated?: string;
  isLoading: boolean;
  onRefresh: () => void;
  onRunBenchmark: () => void;
  isBenchmarking: boolean;
}

export const PerformanceHeader: React.FC<Props> = ({
  lastUpdated,
  isLoading,
  onRefresh,
  onRunBenchmark,
  isBenchmarking,
}) => {
  const {
    selectedRange,
    selectedService,
    liveRefresh,
    showOnlyWarnings,
    autoOptimize,
    setRange,
    setService,
    toggleLive,
    toggleWarnings,
    toggleAutoOptimize,
  } = usePerformanceStore();

  return (
    <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            System Performance Center
            {liveRefresh && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400">
            Real-time latency telemetry, cache ratio analysis & runtime benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRunBenchmark}
            disabled={isBenchmarking}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isBenchmarking ? "Benchmarking..." : "Run Benchmark Suite"}
          </button>
          <button
            onClick={onRefresh}
            className="px-3 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span>Range:</span>
            <select
              value={selectedRange}
              onChange={(e) => setRange(e.target.value as DateRangeType)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
            >
              <option value="1h">Last 1 Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span>Service:</span>
            <select
              value={selectedService}
              onChange={(e) => setService(e.target.value as ServiceType)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
            >
              <option value="all">All Services</option>
              <option value="fastapi">FastAPI (RAG)</option>
              <option value="nodejs">Node.js (LangGraph)</option>
              <option value="nextjs">Next.js (Dashboard)</option>
              <option value="redis">Redis Cache</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLive}
            className={`px-2 py-1 rounded font-medium border ${
              liveRefresh
                ? "bg-emerald-950/50 border-emerald-600 text-emerald-400"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            Live Poll: {liveRefresh ? "ON" : "OFF"}
          </button>

          <button
            onClick={toggleWarnings}
            className={`px-2 py-1 rounded font-medium border ${
              showOnlyWarnings
                ? "bg-amber-950/50 border-amber-600 text-amber-400"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            Warnings Only
          </button>

          <button
            onClick={toggleAutoOptimize}
            className={`px-2 py-1 rounded font-medium border ${
              autoOptimize
                ? "bg-cyan-950/50 border-cyan-600 text-cyan-400"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            Auto-Tune: {autoOptimize ? "ACTIVE" : "OFF"}
          </button>

          {lastUpdated && <span className="text-slate-500">Updated: {lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
};