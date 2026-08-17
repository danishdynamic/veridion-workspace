// veridion-frontend/hooks/useAnalysis.ts
import { useQuery } from "@tanstack/react-query";
import { agentApi } from "@/api/agent";
import { useAgentStore } from "@/store/agent.store";

export function useAnalysis() {
  const { summary, formErrors, chart, finished, loading } = useAgentStore();

  return {
    summary,
    formErrors,
    chart,
    isComplete: finished,
    isLoading: loading,
    hasErrors: formErrors.length > 0,
  };
}