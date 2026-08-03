import { create } from "zustand";
import { AgentLog, AgentName, AgentState, ChartDataPoint, FormErrorItem, SummaryOutput } from "@/types/agent";

interface AgentStoreActions {
  setConnected: (connected: boolean) => void;
  setCurrentAgent: (agent: AgentName | null) => void;
  addLog: (log: AgentLog) => void;
  setSummary: (summary: SummaryOutput | null) => void;
  setChart: (chart: ChartDataPoint[] | null) => void;
  setErrors: (errors: FormErrorItem[]) => void;
  setLoading: (loading: boolean) => void;
  setFinished: (finished: boolean) => void;
  setHitl: (required: boolean, details?: { prompt?: string; agentName?: AgentName }) => void;
  reset: () => void;
}

const initialState: AgentState = {
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

export const useAgentStore = create<AgentState & AgentStoreActions>((set) => ({
  ...initialState,

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
  setLoading: (loading) => set({ loading }),
  setFinished: (finished) => set({ finished, loading: false }),
  setHitl: (hitlRequired, details) =>
    set({ hitlRequired, hitlDetails: details || null }),
  reset: () => set({ ...initialState }),
}));