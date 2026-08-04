"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { BenchmarkResult } from "@/types/performance";

interface Props {
  benchmarks: BenchmarkResult[];
}

export default function BenchmarkChartLazy({ benchmarks }: Props) {
  const chartData = benchmarks.map((b) => ({
    name: b.benchmark,
    before: parseFloat(b.before),
    after: parseFloat(b.after),
    improvement: b.improvementPercentage,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-4">
        Optimization Benchmark Comparisons (Before vs After)
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="before" fill="#64748b" name="Before Optimization" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="after" fill="#6366f1" name="After Optimization" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="improvement" stroke="#10b981" name="% Gain" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}