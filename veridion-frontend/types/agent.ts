export type AgentStatus = "IDLE" | "THINKING" | "SUCCESS" | "FAILED" | "WAITING";

export type AgentName = "Legal_Verifier" | "Synthesis_Summarizer" | "Interface_Visualizer";

export interface AgentLog {
  id?: string;
  timestamp: string;
  agentName: AgentName;
  status: AgentStatus;
  message: string;
}

export interface FormErrorItem {
  field: string;
  issue: string;
  severity: "error" | "warning";
  suggestion: string;
}

export interface SummaryOutput {
  currentVersion: string;
  affectedSections: string[];
  requiredChanges: string[];
  complianceNotes: string[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AgentState {
  connected: boolean;
  currentAgent: AgentName | null;
  completedAgents: number;
  logs: AgentLog[];
  summary: SummaryOutput | null;
  chart: ChartDataPoint[] | null;
  formErrors: FormErrorItem[];
  loading: boolean;
  finished: boolean;
  hitlRequired: boolean;
  hitlDetails: { prompt?: string; agentName?: AgentName } | null;
}

export interface RunPipelinePayload {
  query: string;
  industrySector: string;
  deploymentRegion: string;
  formInputs?: Record<string, unknown>;
  clientId?: string;
}

export interface RunPipelineResponse {
  status: "success" | "initiated" | "error";
  pipelineId: string;
  message?: string;
}

// WebSocket Message Signatures
export type SocketMessageType =
  | "pipeline_trace"
  | "agent_started"
  | "agent_completed"
  | "hitl_required"
  | "pipeline_finished"
  | "error";

export interface SocketMessage {
  type: SocketMessageType;
  agentName?: AgentName;
  status?: AgentStatus;
  message?: string;
  timestamp?: string;
  payload?: {
    summary?: SummaryOutput;
    chart?: ChartDataPoint[];
    errors?: FormErrorItem[];
    [key: string]: unknown;
  };
}