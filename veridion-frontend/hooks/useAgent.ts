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
      return agentApi.runPipeline(payload);
    },
    onError: (err) => {
      setLoading(false);
      console.error("Agent Pipeline Mutation Error:", err);
    },
  });

  return {
    runPipeline: pipelineMutation.mutate,
    isLoading: pipelineMutation.isPending,
    error: pipelineMutation.error,
    data: pipelineMutation.data,
  };
}