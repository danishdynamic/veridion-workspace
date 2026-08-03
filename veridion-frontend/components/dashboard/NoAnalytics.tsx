import React from "react";
import { BarChart3 } from "lucide-react";

export const NoAnalytics: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl bg-zinc-50 border-zinc-200">
    <BarChart3 className="w-10 h-10 text-zinc-400 mb-2" />
    <h4 className="text-sm font-semibold text-zinc-700">No Analytics Data</h4>
    <p className="text-xs text-zinc-500 max-w-xs mt-1">
      Analytics metrics will populate automatically as documents and queries are processed.
    </p>
  </div>
);