"use client";

import React from "react";
import { OptimizationMetric } from "@/types/performance";
import { usePerformanceStore } from "@/store/performance.store";

export const OptimizationTable: React.FC<{ optimizations: OptimizationMetric[] }> = ({
  optimizations,
}) => {
  const { showOnlyWarnings } = usePerformanceStore();

  const filtered = showOnlyWarnings
    ? optimizations.filter((o) => o.status === "Warning" || o.status === "Disabled")
    : optimizations;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-4">Active System Optimizations</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">Optimization Module</th>
              <th className="p-3">Layer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Impact</th>
              <th className="p-3">Estimated Savings</th>
              <th className="p-3">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-medium text-white">{item.name}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700">
                    {item.layer}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === "Enabled"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : item.status === "Warning"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 font-semibold text-slate-200">{item.impact}</td>
                <td className="p-3 font-mono text-emerald-400">{item.savings}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate" title={item.recommendation}>
                  {item.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};