// veridion-frontend/components/analysis/timeline.tsx
"use client";

import { useAgentStore } from "@/store/agent.store";
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";

export function Timeline() {
  const { logs } = useAgentStore();

  if (logs.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        No execution steps yet
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log, idx) => (
        <div key={idx} className="flex gap-3 relative">
          {/* Connector line */}
          {idx < logs.length - 1 && (
            <div className="absolute left-2.75 top-6 bottom-0 w-px bg-border" />
          )}
          
          {/* Status icon */}
          <div className="relative z-10 shrink-0">
            {log.status === "SUCCESS" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : log.status === "FAILED" ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : log.status === "THINKING" ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6">
            <p className="text-sm font-medium">{log.agentName.replace(/_/g, " ")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{log.message}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{log.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}