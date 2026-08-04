import React from "react";

export const EvaluationSummary: React.FC = () => (
  <div className="p-6 bg-linear-to-r from-indigo-900 to-zinc-900 rounded-xl text-white">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">System Health & Production Readiness</h2>
        <p className="text-xs text-indigo-200 mt-1">
          FastAPI Lightweight Evaluator reports active status. No significant halluncination drift detected.
        </p>
      </div>
      <span className="px-3 py-1 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-full">
        PRODUCTION READY
      </span>
    </div>
  </div>
);