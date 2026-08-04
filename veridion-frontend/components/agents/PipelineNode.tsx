import React from "react";
import { AgentStatus } from "@/types/agent-monitor";
import { CheckCircle2, XCircle, LoaderCircle, Clock, PauseCircle } from "lucide-react";

interface PipelineNodeProps {
  agentName: string;
  status: AgentStatus;
  duration?: number;
  startedAt?: string;
  finishedAt?: string;
  active?: boolean;
  error?: string;
  onClick?: () => void;
}

export const PipelineNode: React.FC<PipelineNodeProps> = ({
  agentName,
  status,
  duration,
  active,
  onClick,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "running":
        return "border-amber-400 bg-amber-50/50 text-amber-900 shadow-amber-100 dark:bg-amber-950/20 dark:text-amber-300";
      case "success":
        return "border-emerald-500 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300";
      case "failed":
        return "border-rose-500 bg-rose-50/50 text-rose-900 dark:bg-rose-950/20 dark:text-rose-300";
      case "waiting":
        return "border-blue-400 bg-blue-50/50 text-blue-900 dark:bg-blue-950/20 dark:text-blue-300";
      default:
        return "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400";
    }
  };

  const renderIcon = () => {
    switch (status) {
      case "running":
        return <LoaderCircle className="w-4 h-4 text-amber-600 animate-spin" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case "waiting":
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      default:
        return <PauseCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${getStatusStyles()} ${
        active ? "ring-2 ring-indigo-500 ring-offset-1" : ""
      }`}
    >
      <div className="flex items-center justify-between space-x-2">
        <span className="text-xs font-semibold tracking-tight">{agentName}</span>
        {renderIcon()}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
        <span className="capitalize">{status}</span>
        <span>{duration ? `${duration}ms` : "--"}</span>
      </div>
    </div>
  );
};