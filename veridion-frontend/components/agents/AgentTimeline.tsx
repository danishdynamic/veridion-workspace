import React from "react";
import { ExecutionTrace } from "@/types/agent-monitor";
import { CheckCircle2, Circle } from "lucide-react";

interface AgentTimelineProps {
  events: ExecutionTrace[];
  loading?: boolean;
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ events, loading }) => {
  if (loading) {
    return <div className="p-4 text-xs text-zinc-400">Loading timeline execution steps...</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Node Timeline Sequence
      </h3>

      <div className="relative border-l-2 border-indigo-100 dark:border-indigo-950/50 ml-3 space-y-4">
        {events.map((evt) => (
          <div key={evt.id} className="relative pl-6">
            <div className="absolute -left-2.25 top-0.5 bg-white dark:bg-zinc-950 p-0.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{evt.step}</p>
              <span className="text-[10px] text-zinc-400">{evt.timestamp}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{evt.details}</p>
            <span className="inline-block mt-1 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600">
              +{evt.duration}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};