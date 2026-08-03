import { api } from "@/lib/axios";
import { RunPipelinePayload, RunPipelineResponse } from "@/types/agent";

export const agentApi = {
  runPipeline: async (payload: RunPipelinePayload): Promise<RunPipelineResponse> => {
    const response = await api.post<RunPipelineResponse>("/orchestrate", payload);
    return response.data;
  },

  approveHitl: async (pipelineId: string): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>("/hitl/approve", { pipelineId });
    return response.data;
  },

  rejectHitl: async (pipelineId: string, reason?: string): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>("/hitl/reject", { pipelineId, reason });
    return response.data;
  },
};