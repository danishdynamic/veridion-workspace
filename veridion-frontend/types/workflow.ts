// veridion-frontend/types/workflow.ts
export interface WorkflowStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
}

export interface WorkflowExecution {
  id: string;
  status: "running" | "completed" | "failed" | "hitl_required";
  steps: WorkflowStep[];
  startedAt: string;
  finishedAt?: string;
}