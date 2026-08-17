// veridion-frontend/hooks/useAgent.ts
import { useMutation } from "@tanstack/react-query";
import { agentApi } from "@/api/agent";
import { useAgentStore } from "@/store/agent.store";
import { RunPipelinePayload } from "@/types/agent";

export function useAgent() {
  const { reset, setLoading } = useAgentStore();

  const pipelineMutation = useMutation({
    mutationFn: (payload: RunPipelinePayload) => {
      reset();
      setLoading(true);
      const enrichedPayload = {
        ...payload,
        clientId: payload.clientId || `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };
      return agentApi.runPipeline(enrichedPayload);
    },
    onError: (err) => {
      setLoading(false);
      console.error("Agent Pipeline Mutation Error:", err);
    },
    onSuccess: () => {
    },
  });

  return {
    runPipeline: pipelineMutation.mutate,
    isLoading: pipelineMutation.isPending,
    error: pipelineMutation.error,
    data: pipelineMutation.data,
  };
}