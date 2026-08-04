import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Play, Pause, Bot, ShieldCheck } from "lucide-react";

interface AgentHeaderProps {
  title?: string;
  runningAgents: number;
  completedAgents: number;
  failedAgents: number;
  refresh: () => void;
  loading: boolean;
  liveMode: boolean;
  toggleLive: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  title = "LangGraph Agent Execution Monitor",
  runningAgents,
  completedAgents,
  failedAgents,
  refresh,
  loading,
  liveMode,
  toggleLive,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Real-time telemetry, queue, human-in-the-loop, and LangGraph workflow inspection.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Running: {runningAgents}
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Success: {completedAgents}
          </Badge>
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Failed: {failedAgents}
          </Badge>
        </div>

        <Button
          variant={liveMode ? "default" : "outline"}
          size="sm"
          onClick={toggleLive}
          className="h-9 text-xs"
        >
          {liveMode ? (
            <>
              <Pause className="w-3.5 h-3.5 mr-1.5" /> Live Stream On
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 mr-1.5" /> Live Stream Off
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading}
          className="h-9 w-9 p-0"
        >
          <RefreshCcw className={`w-4 h-4 text-zinc-600 dark:text-zinc-300 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
};