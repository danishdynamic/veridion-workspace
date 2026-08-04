// GroundingCard.tsx
import React from "react";
import { GroundingReport } from "@/types/evaluation";

export const GroundingCard: React.FC<{ report: GroundingReport }> = ({ report }) => (
  <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Grounding Coverage</h3>
    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
      {(report.coverage * 100).toFixed(1)}%
    </div>
    <p className="text-xs text-zinc-500 mt-1">
      {report.supportedStatements} Supported / {report.unsupportedStatements} Unsupported Statements
    </p>
  </div>
);