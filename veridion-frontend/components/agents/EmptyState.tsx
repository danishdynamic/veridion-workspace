import React from "react";
import { Bot } from "lucide-react";

export const NoExecutions: React.FC = () => (
  <div className="p-8 text-center bg-white dark:bg-zinc-950 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
    <Bot className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
    <h4 className="text-sm font-semibold">No Executions Found</h4>
    <p className="text-xs text-zinc-500">Run a LangGraph pipeline to monitor execution states.</p>
  </div>
);