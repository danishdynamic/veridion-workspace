export type AgentStatus = "idle" | "running" | "success" | "failed" | "waiting";
export type JobStatus = "queued" | "active" | "completed" | "failed" | "delayed";
export type HitlStatus = "pending" | "approved" | "rejected";

export interface AgentNode {
  id: string;
  name: string;
  status: AgentStatus;
  runtime?: number; // in milliseconds
  startedAt?: string;
  finishedAt?: string;
  logsCount?: number;
  error?: string;
}

export interface PipelineExecution {
  id: string;
  pipelineName: string;
  status: AgentStatus;
  startedAt: string;
  finishedAt?: string;
  nodes: AgentNode[];
}

export interface AgentExecution {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  document: string;
  version: string;
  status: AgentStatus;
  startedAt: string;
  finishedAt?: string;
  duration: number; // in milliseconds
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: string;
  status: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message: string;
  executionId: string;
}

export interface QueueJob {
  id: string;
  queue: string;
  status: JobStatus;
  attempts: number;
  createdAt: string;
  duration: number; // in milliseconds
}

export interface HitlRequest {
  id: string;
  executionId: string;
  reason: string;
  reviewer?: string;
  status: HitlStatus;
  createdAt: string;
}

export interface ExecutionMetric {
  averageRuntime: number; // ms
  averageTokens: number;
  averageLatency: number; // ms
  averageContexts: number;
  cacheHits: number;
  cacheMisses: number;
  rerankTime: number; // ms
  successRate: number; // percentage
  totalExecutions: number;
  failures: number;
  retries: number;
}

export interface ExecutionTrace {
  id: string;
  executionId: string;
  timestamp: string;
  step: string;
  details: string;
  duration: number;
}

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface AgentMonitoringData {
  pipeline: AgentNode[];
  executions: AgentExecution[];
  logs: AgentLog[];
  metrics: ExecutionMetric;
  queue: QueueJob[];
  hitl: HitlRequest[];
  timeline: ExecutionTrace[];
}