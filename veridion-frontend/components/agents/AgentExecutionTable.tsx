import React from "react";
import { AgentExecution } from "@/types/agent-monitor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, StopCircle } from "lucide-react";

interface AgentExecutionTableProps {
  executions: AgentExecution[];
  selectedId?: string;
  onSelect: (execution: AgentExecution) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
}

export const AgentExecutionTable: React.FC<AgentExecutionTableProps> = ({
  executions,
  selectedId,
  onSelect,
  onRetry,
  onCancel,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <table className="w-full text-left text-xs">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-medium">
          <tr>
            <th className="p-3">Execution ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Document</th>
            <th className="p-3">Version</th>
            <th className="p-3">Started</th>
            <th className="p-3">Runtime</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
          {executions.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelect(item)}
              className={`cursor-pointer transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 ${
                selectedId === item.id ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
              }`}
            >
              <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {item.id}
              </td>
              <td className="p-3">
                <div>
                  <p className="font-medium">{item.user.name}</p>
                  <p className="text-[10px] text-zinc-400">{item.user.email}</p>
                </div>
              </td>
              <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                {item.document}
              </td>
              <td className="p-3">
                <Badge variant="secondary" className="text-[10px]">
                  {item.version}
                </Badge>
              </td>
              <td className="p-3 text-zinc-500">
                {new Date(item.startedAt).toLocaleTimeString()}
              </td>
              <td className="p-3 text-zinc-500">{item.duration}ms</td>
              <td className="p-3">
                <Badge
                  className={`capitalize text-[10px] ${
                    item.status === "running"
                      ? "bg-amber-100 text-amber-800"
                      : item.status === "success"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "failed"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.status}
                </Badge>
              </td>
              <td className="p-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                {item.status === "failed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onRetry(item.id)}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                  </Button>
                )}
                {item.status === "running" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onCancel(item.id)}
                  >
                    <StopCircle className="w-3.5 h-3.5 text-rose-600" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};