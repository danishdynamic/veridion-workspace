// veridion-frontend/hooks/useAgentSocket.ts
import { useEffect } from "react";
import { wsManager } from "@/lib/websocket";
import { useAgentStore } from "@/store/agent.store";
import { SocketMessage } from "@/types/agent";

export function useAgentSocket() {
  const {
    setConnected,
    setCurrentAgent,
    addLog,
    setSummary,
    setChart,
    setErrors,
    setFinished,
    setHitlState, 
  } = useAgentStore();

  useEffect(() => {
    wsManager.connect();
    setConnected(true);

    const unsubscribe = wsManager.subscribe((msg: SocketMessage) => {
      const now = msg.timestamp || new Date().toLocaleTimeString();

      switch (msg.type) {
        case "agent_started":
          if (msg.agentName) setCurrentAgent(msg.agentName);
          addLog({
            timestamp: now,
            agentName: msg.agentName || "Legal_Verifier",
            status: "THINKING",
            message: msg.message || `Started ${msg.agentName}`,
          });
          break;

        case "pipeline_trace":
          if (msg.agentName) {
            addLog({
              timestamp: now,
              agentName: msg.agentName,
              status: msg.status || "THINKING",
              message: msg.message || "Processing...",
            });
          }
          break;

        case "agent_completed":
          if (msg.agentName) {
            addLog({
              timestamp: now,
              agentName: msg.agentName,
              status: "SUCCESS",
              message: msg.message || `Completed ${msg.agentName}`,
            });
          }
          if (msg.payload?.summary) setSummary(msg.payload.summary);
          if (msg.payload?.chart) setChart(msg.payload.chart);
          if (msg.payload?.errors) setErrors(msg.payload.errors);
          break;

        case "hitl_required":
          setHitlState(true, { // FIXED: was setHitl
            prompt: msg.message,
            agentName: msg.agentName,
          });
          break;

        case "pipeline_finished":
          setCurrentAgent(null);
          setFinished(true);
          if (msg.payload?.summary) setSummary(msg.payload.summary);
          if (msg.payload?.chart) setChart(msg.payload.chart);
          if (msg.payload?.errors) setErrors(msg.payload.errors);
          break;

        case "error":
          if (msg.agentName) {
            addLog({
              timestamp: now,
              agentName: msg.agentName,
              status: "FAILED",
              message: msg.message || "Execution error",
            });
          }
          setFinished(true);
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    setConnected,
    setCurrentAgent,
    addLog,
    setSummary,
    setChart,
    setErrors,
    setFinished,
    setHitlState, 
  ]);

  return {
    connected: useAgentStore((s) => s.connected),
    logs: useAgentStore((s) => s.logs),
    currentAgent: useAgentStore((s) => s.currentAgent),
  };
}