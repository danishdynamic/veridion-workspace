"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePerformance } from "@/hooks/usePerformance";
import { PerformanceHeader } from "@/components/performance/PerformanceHeader";
import { PerformanceOverviewCard } from "@/components/performance/PerformanceOverview";
import { LatencyCard } from "@/components/performance/LatencyCard";
import { CacheCard } from "@/components/performance/CacheCard";
import { PerformanceTimeline } from "@/components/performance/PerformanceTimeline";
import { OptimizationTable } from "@/components/performance/OptimizationTable";

// Code splitting heavy Recharts components & system profiling visualizations
const BenchmarkChartLazy = dynamic(
  () => import("@/components/performance/BenchmarkChartLazy"),
  {
    loading: () => (
      <div className="h-72 w-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500">
        Loading Benchmark Charts...
      </div>
    ),
    ssr: false,
  }
);

const SystemProfilerLazy = dynamic(
  () => import("@/components/performance/SystemProfilerLazy"),
  {
    loading: () => (
      <div className="h-48 w-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500">
        Loading System Profiler...
      </div>
    ),
    ssr: false,
  }
);

export default function PerformancePage() {
  const { data, isLoading, refetch, runBenchmark, isBenchmarking } = usePerformance();

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center text-slate-400">
        Initializing Performance Telemetry Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <PerformanceHeader
        lastUpdated={data.lastUpdated}
        isLoading={isLoading}
        onRefresh={refetch}
        onRunBenchmark={runBenchmark}
        isBenchmarking={isBenchmarking}
      />

      {/* KPI Overview Grid */}
      <PerformanceOverviewCard metrics={data.overview} />

      {/* Latency & Multi-tier Cache Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatencyCard metrics={data.latency} />
        <CacheCard metrics={data.cache} />
      </div>

      {/* End-to-End Pipeline Latency Trace Timeline */}
      <PerformanceTimeline stages={data.timeline} />

      {/* Heavy Component Lazy Loading Block */}
      <BenchmarkChartLazy benchmarks={data.benchmarks} />

      {/* Optimization Matrix */}
      <OptimizationTable optimizations={data.optimizations} />

      {/* Infrastructure System Profiler */}
      <SystemProfilerLazy profiler={data.profiler} />
    </div>
  );
}