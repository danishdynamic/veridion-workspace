// veridion-frontend/store/workflow.ts
import { create } from "zustand";

interface WorkflowState {
  executionId: string | null;
  status: "idle" | "running" | "completed" | "failed" | "hitl";
  progress: number;
  setExecutionId: (id: string | null) => void;
  setStatus: (status: WorkflowState["status"]) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  executionId: null,
  status: "idle" as const,
  progress: 0,
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  ...initialState,
  setExecutionId: (executionId) => set({ executionId }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  reset: () => set(initialState),
}));