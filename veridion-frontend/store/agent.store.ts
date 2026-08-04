import { create } from "zustand";
import {
  AgentLog as UiAgentLog,
  AgentName,
  AgentState,
  ChartDataPoint,
  FormErrorItem,
  SummaryOutput,
} from "@/types/agent";
import {
  AgentExecution,
  AgentNode,
  ExecutionMetric,
  HitlRequest,
  QueueJob,
  ExecutionTrace,
  AgentLog as MonitorAgentLog,
} from "@/types/agent-monitor";

// Actions for Agent Execution State
interface AgentExecutionActions {
  setConnected: (connected: boolean) => void;
  setCurrentAgent: (agent: AgentName | null) => void;
  addLog: (log: UiAgentLog) => void;
  setSummary: (summary: SummaryOutput | null) => void;
  setChart: (chart: ChartDataPoint[] | null) => void;
  setErrors: (errors: FormErrorItem[]) => void;
  setFinished: (finished: boolean) => void;
  setHitlState: (
    required: boolean,
    details?: { prompt?: string; agentName?: AgentName }
  ) => void;
  reset: () => void;
}

// Actions for Agent Telemetry & Monitoring
interface AgentMonitorActions {
  setSelectedExecution: (execution: AgentExecution | null) => void;
  setSelectedAgent: (agent: AgentNode | null) => void;
  toggleLive: () => void;
  appendLog: (log: MonitorAgentLog) => void;
  clearLogs: () => void;
  setPipeline: (pipeline: AgentNode[]) => void;
  setQueue: (queue: QueueJob[]) => void;
  setHitlRequests: (hitl: HitlRequest[]) => void;
  setMetrics: (metrics: ExecutionMetric) => void;
  setTimeline: (timeline: ExecutionTrace[]) => void;
  setLoading: (loading: boolean) => void;
  resolveHitl: (id: string, action: "approve" | "reject") => void;
}

// Monitoring State Interface
interface AgentMonitorState {
  selectedExecution: AgentExecution | null;
  selectedAgent: AgentNode | null;
  liveMode: boolean;
  executionLogs: MonitorAgentLog[];
  pipeline: AgentNode[];
  queue: QueueJob[];
  hitlRequests: HitlRequest[];
  metrics: ExecutionMetric | null;
  timeline: ExecutionTrace[];
}

// Unified Store Type
export type FullAgentStore = AgentState &
  AgentMonitorState &
  AgentExecutionActions &
  AgentMonitorActions;

// Initial States
const initialAgentState: AgentState = {
  connected: false,
  currentAgent: null,
  completedAgents: 0,
  logs: [],
  summary: null,
  chart: null,
  formErrors: [],
  loading: false,
  finished: false,
  hitlRequired: false,
  hitlDetails: null,
};

const initialMonitorState: AgentMonitorState = {
  selectedExecution: null,
  selectedAgent: null,
  liveMode: true,
  executionLogs: [],
  pipeline: [],
  queue: [],
  hitlRequests: [],
  metrics: null,
  timeline: [],
};

export const useAgentStore = create<FullAgentStore>((set) => ({
  ...initialAgentState,
  ...initialMonitorState,

  setConnected: (connected) => set({ connected }),
  setCurrentAgent: (currentAgent) => set({ currentAgent }),
  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
      completedAgents:
        log.status === "SUCCESS"
          ? Math.min(state.completedAgents + 1, 3)
          : state.completedAgents,
    })),
  setSummary: (summary) => set({ summary }),
  setChart: (chart) => set({ chart }),
  setErrors: (formErrors) => set({ formErrors }),
  setFinished: (finished) => set({ finished, loading: false }),
  setHitlState: (hitlRequired, details) =>
    set({ hitlRequired, hitlDetails: details || null }),
  reset: () => set({ ...initialAgentState, ...initialMonitorState }),

  setSelectedExecution: (selectedExecution) => set({ selectedExecution }),
  setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
  toggleLive: () => set((state) => ({ liveMode: !state.liveMode })),
  appendLog: (log) =>
    set((state) => ({ executionLogs: [log, ...state.executionLogs] })),
  clearLogs: () => set({ executionLogs: [] }),
  setPipeline: (pipeline) => set({ pipeline }),
  setQueue: (queue) => set({ queue }),
  setHitlRequests: (hitlRequests) => set({ hitlRequests }),
  setMetrics: (metrics) => set({ metrics }),
  setTimeline: (timeline) => set({ timeline }),
  setLoading: (loading) => set({ loading }),

  resolveHitl: (id, action) =>
    set((state) => ({
      hitlRequests: state.hitlRequests.map((item) =>
        item.id === id
          ? { ...item, status: action === "approve" ? "approved" : "rejected" }
          : item
      ),
    })),
}));