// veridion-frontend/components/analysis/pipeline.tsx
"use client";

import { AgentCard } from "./agent-card";
import { useAgentStore } from "@/store/agent.store";
import { AgentName } from "@/types/agent";

const agentOrder: AgentName[] = [
  "Legal_Verifier",
  "Synthesis_Summarizer",
  "Interface_Visualizer",
];

export function Pipeline() {
  const { logs, currentAgent, completedAgents, loading } = useAgentStore();

  // Get latest status for each agent
  const agentStatuses = new Map<AgentName, { status: any; message: string; timestamp: string }>();

  logs.forEach((log) => {
    agentStatuses.set(log.agentName, {
      status: log.status,
      message: log.message,
      timestamp: log.timestamp,
    });
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Agent Pipeline {loading && <span className="text-blue-500">(Running...)</span>}
      </h3>
      
      <div className="space-y-2">
        {agentOrder.map((agentName) => {
          const status = agentStatuses.get(agentName);
          const isCurrent = currentAgent === agentName;
          
          return (
            <AgentCard
              key={agentName}
              name={agentName}
              status={
                isCurrent
                  ? "THINKING"
                  : status?.status === "SUCCESS"
                  ? "SUCCESS"
                  : status?.status === "FAILED"
                  ? "FAILED"
                  : "IDLE"
              }
              message={status?.message || (isCurrent ? "Processing..." : undefined)}
              timestamp={status?.timestamp}
            />
          );
        })}
      </div>

      {completedAgents === 3 && (
        <p className="text-sm text-green-600 text-center pt-2">
          All agents completed successfully
        </p>
      )}
    </div>
  );
}