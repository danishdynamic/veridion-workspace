import React from "react";
import { useAgentStore } from "@/store/agent.store";
import { AgentCard } from "./AgentCard";
import { AgentProgress } from "./AgentProgress";
import { AgentTimeline } from "./AgentTimeline";
import { AgentOutput } from "./AgentOutput";

export const AgentPipeline: React.FC = () => {
  const { currentAgent, completedAgents, logs, summary, chart, formErrors } = useAgentStore();

  const getAgentStatus = (name: string) => {
    if (currentAgent === name) return "THINKING";
    const agentLogs = logs.filter((l) => l.agentName === name);
    if (agentLogs.some((l) => l.status === "SUCCESS")) return "SUCCESS";
    if (agentLogs.some((l) => l.status === "FAILED")) return "FAILED";
    return "IDLE";
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <AgentProgress completed={completedAgents} total={3} />

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AgentCard
          title="Legal Verifier"
          description="Vector similarity & regulatory parsing"
          status={getAgentStatus("Legal_Verifier")}
        />
        <AgentCard
          title="Synthesis Summarizer"
          description="Extracting delta requirements"
          status={getAgentStatus("Synthesis_Summarizer")}
        />
        <AgentCard
          title="Interface Visualizer"
          description="Generating metrics & error fixes"
          status={getAgentStatus("Interface_Visualizer")}
        />
      </div>

      {/* Realtime Execution Trace Log */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Execution Trace
        </h3>
        <AgentTimeline logs={logs} />
      </div>

      {/* Final Outputs */}
      <AgentOutput summary={summary} chart={chart} errors={formErrors} />
    </div>
  );
};