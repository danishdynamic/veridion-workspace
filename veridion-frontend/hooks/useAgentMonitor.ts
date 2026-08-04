import { useEffect } from "react";
import { useAgentStore } from "@/store/agent.store";
import { agentApi } from "@/api/agents";

export function useAgentMonitor() {
  const store = useAgentStore();

  const loadData = async () => {
    store.setLoading(true);
    try {
      const data = await agentApi.fetchAllData();
      store.setPipeline(data.pipeline);
      store.setQueue(data.queue);
      store.setHitlRequests(data.hitl);
      store.setMetrics(data.metrics);
      store.setTimeline(data.timeline);
      
      // Default to first execution if none selected
      if (!store.selectedExecution && data.executions.length > 0) {
        store.setSelectedExecution(data.executions[0]);
      }
    } catch (err) {
      console.error("Failed to load agent monitor data", err);
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    ...store,
    hitl: store.hitlRequests,
    refresh: loadData,
  };
}