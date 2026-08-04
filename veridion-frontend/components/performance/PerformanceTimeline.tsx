"use client";

import React from "react";
import { TimelineStage } from "@/types/performance";

export const PerformanceTimeline: React.FC<{ stages: TimelineStage[] }> = ({ stages }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-white mb-4">
        End-to-End Request Pipeline Trace
      </h3>
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 overflow-x-auto py-2">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex-1 min-w-27.5 flex flex-col items-center relative">
            <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-center shadow-inner">
              <p className="text-xs font-semibold text-slate-200 truncate">{stage.stage}</p>
              <p className="text-sm font-bold text-indigo-400 mt-1 font-mono">{stage.durationMs} ms</p>
              <span className="text-[10px] text-slate-500">{stage.percentage}% execution</span>
            </div>

            {idx < stages.length - 1 && (
              <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 font-bold z-10">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};