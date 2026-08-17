import React from "react";
import { AgentLog } from "@/types/agent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleCheck, Brain, AlertTriangle } from "lucide-react";

interface Props {
  logs: AgentLog[];
}

export const AgentTimeline: React.FC<Props> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-zinc-400">
        No execution trace logs yet. Start a pipeline run above.
      </div>
    );
  }

  return (
    <ScrollArea className="h-55 rounded-md border border-zinc-200 p-4 bg-zinc-50/50">
      <div className="relative pl-4 border-l-2 border-zinc-200 space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="relative flex items-start space-x-3 text-xs">
            <div className="absolute -left-5.25 top-0.5 bg-white rounded-full p-0.5">
              {log.status === "SUCCESS" ? (
                <CircleCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : log.status === "FAILED" ? (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <Brain className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              )}
            </div>
            <span className="font-mono text-zinc-400">{log.timestamp}</span>
            <span className="font-semibold text-zinc-700">[{log.agentName}]</span>
            <span className="text-zinc-600">{log.message}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};