// HallucinationCard.tsx
import React from "react";
import { HallucinationReport } from "@/types/evaluation";

export const HallucinationCard: React.FC<{ report: HallucinationReport }> = ({ report }) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Anti-Hallucination Engine</h3>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${!report.hallucinated ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-100 text-red-800"}`}>
        {report.hallucinated ? "HALLUCINATION DETECTED" : "PASSED"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
        <div className="text-zinc-500">Confidence</div>
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{(report.confidence * 100).toFixed(0)}%</div>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
        <div className="text-zinc-500">Unsupported Claims</div>
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{report.unsupportedClaims}</div>
      </div>
    </div>
  </div>
);