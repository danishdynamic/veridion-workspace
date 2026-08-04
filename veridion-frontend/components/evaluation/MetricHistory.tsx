// MetricHistory.tsx
import React from "react";
import { EvaluationResult } from "@/types/evaluation";

export const MetricHistory: React.FC<{ items: EvaluationResult[] }> = ({ items }) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">Evaluation History</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead className="text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="pb-2">Query / Doc</th>
            <th className="pb-2">Version</th>
            <th className="pb-2">Score</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-2.5 font-medium text-zinc-900 dark:text-zinc-100">{item.query}</td>
              <td className="py-2.5 text-zinc-500">{item.version}</td>
              <td className="py-2.5 font-bold text-indigo-600">{item.qualityScore}</td>
              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded ${item.passed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {item.passed ? "PASS" : "FAIL"}
                </span>
              </td>
              <td className="py-2.5 text-zinc-400">{new Date(item.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

