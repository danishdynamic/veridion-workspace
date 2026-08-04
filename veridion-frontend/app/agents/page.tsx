"use client";

import React from "react";
import { useAgentMonitor } from "@/hooks/useAgentMonitor";
import { AgentHeader } from "@/components/agents/AgentHeader";
import { AgentPipeline } from "@/components/agents/AgentPipeline";
import { AgentStatusCardGroup } from "@/components/agents/AgentStatusCard";
import { AgentExecutionTable } from "@/components/agents/AgentExecutionTable";
import { AgentTimeline } from "@/components/agents/AgentTimeline";
import { AgentLogs } from "@/components/agents/AgentLogs";
import { AgentQueue } from "@/components/agents/AgentQueue";
import { HitlPanel } from "@/components/agents/HitlPanel";
import { ExecutionProgress } from "@/components/agents/ExecutionProgress";
import { ExecutionSummary } from "@/components/agents/ExecutionSummary";
import { AgentSkeleton } from "@/components/agents/AgentSkeleton";
import { agentApi } from "@/api/agents";

export default function AgentMonitoringPage() {
  const {
    pipeline,
    selectedExecution,
    selectedAgent,
    liveMode,
    executionLogs,
    queue,
    hitl,
    metrics,
    timeline,
    loading,
    refresh,
    toggleLive,
    setSelectedExecution,
    setSelectedAgent,
    resolveHitl,
  } = useAgentMonitor();

  // Maps executionLogs to ensure required 'agent' & 'executionId' fields match AgentLogs component
  const executionLogsWithContext = (executionLogs ?? []).map((log) => ({
    ...log,
    agent: log.agent ?? selectedAgent?.name ?? "Orchestrator",
    executionId: log.executionId ?? selectedExecution?.id ?? "exec-default",
  }));

  const mockExecutions = [
    {
      id: "exec-9482",
      user: { name: "Sarah Connor", email: "s.connor@cyberdyne.io" },
      document: "EU_AI_Act_Compliance_v2.pdf",
      version: "v2.4",
      status: "running" as const,
      startedAt: "2026-08-04T09:22:00Z",
      duration: 1670,
    },
    {
      id: "exec-9481",
      user: { name: "Alex Mercer", email: "a.mercer@gentek.com" },
      document: "HIPAA_Audit_Report_2026.docx",
      version: "v1.0",
      status: "success" as const,
      startedAt: "2026-08-04T09:15:10Z",
      finishedAt: "2026-08-04T09:15:32Z",
      duration: 22400,
    },
  ];

  if (loading && !metrics) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AgentSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header */}
      <AgentHeader
        runningAgents={1}
        completedAgents={142}
        failedAgents={2}
        refresh={refresh}
        loading={loading}
        liveMode={liveMode}
        toggleLive={toggleLive}
      />

      {/* 2. LangGraph Pipeline Flow */}
      <AgentPipeline
        nodes={pipeline}
        selectedNodeId={selectedAgent?.id}
        onSelectNode={setSelectedAgent}
      />

      {/* 3. Status Cards */}
      <AgentStatusCardGroup metrics={metrics} runningCount={1} />

      {/* 4. Main Telemetry: Execution Progress & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExecutionProgress />
        </div>
        <div className="lg:col-span-2">
          <ExecutionSummary />
        </div>
      </div>

      {/* 5. Logs & Queue Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentLogs logs={executionLogsWithContext} />
        <AgentQueue jobs={queue} />
      </div>

      {/* 6. HITL Approval Panel */}
      <HitlPanel requests={hitl} onResolve={resolveHitl} />

      {/* 7. Execution Timeline & Detailed History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Recent LangGraph Executions
          </h3>
          <AgentExecutionTable
            executions={mockExecutions}
            selectedId={selectedExecution?.id}
            onSelect={setSelectedExecution}
            onRetry={(id) => agentApi.retryExecution(id)}
            onCancel={(id) => agentApi.cancelExecution(id)}
          />
        </div>
        <div className="lg:col-span-1">
          <AgentTimeline events={timeline} />
        </div>
      </div>
    </div>
  );
}