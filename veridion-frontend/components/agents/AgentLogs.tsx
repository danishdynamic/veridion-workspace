import React from "react";
import { AgentLog } from "@/types/agent-monitor";

interface AgentLogsProps {
  logs: AgentLog[];
}

export const AgentLogs: React.FC<AgentLogsProps> = ({ logs }) => {
  return (
    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 h-64 overflow-y-auto space-y-2">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-500 font-sans">
        <span>LIVE AGENT LOG STREAM</span>
        <span>{logs.length} entries</span>
      </div>
      {logs.length === 0 ? (
        <p className="text-zinc-600 italic">No execution logs available...</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-2">
            <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
            <span className="text-indigo-400 font-semibold shrink-0">[{log.agent}]</span>
            <span
              className={`shrink-0 font-bold ${
                log.status === "SUCCESS"
                  ? "text-emerald-400"
                  : log.status === "ERROR"
                  ? "text-rose-400"
                  : log.status === "WARNING"
                  ? "text-amber-400"
                  : "text-blue-400"
              }`}
            >
              [{log.status}]
            </span>
            <span className="text-zinc-300 break-all">{log.message}</span>
          </div>
        ))
      )}
    </div>
  );
};