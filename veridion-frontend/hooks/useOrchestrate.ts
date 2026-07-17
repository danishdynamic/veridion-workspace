import { useMutation } from '@tanstack/react-query';
import { agentApi, OrchestratePayload } from '../utils/api';
import { useAgentStore } from '../store/store';

export const useOrchestrate = () => {
  // 1. Pull the missing actions and the unified metrics hooks out of our custom Zustand state layout
  const { 
    setStatus, 
    addLog, 
    incrementCompliancePasses, 
    resetTelemetry // Used to safely flush previous iteration runs
  } = useAgentStore();

  return useMutation({
    mutationFn: (payload: OrchestratePayload) => agentApi.orchestrate(payload),
    
    // Triggered the exact moment the user invokes the mutation array
    onMutate: () => {
      resetTelemetry(); // Instantly flushes stale log buffers and sets metrics clean
      setStatus('RUNNING');
      addLog('Initiating Multi-Agent Orchestration array sequence...');
    },
    
    // Triggered if the primary backend HTTP gateway resolves successfully
    onSuccess: (data) => {
      // Map 'PENDING_HITL_REVIEW' or custom compliance gates directly down to our unified 'HITL' state
      if (data.status === 'PENDING_HITL_REVIEW' || data.status === 'HITL') {
        setStatus('HITL'); 
        addLog('⚠️ Pipeline verification paused: Awaiting Human-in-the-Loop review.');
        
        // Note: If you have a specific slice action for temporary form payloads,
        // you can attach it to your store.ts and extract it above as needed.
      } else if (data.status === 'SUCCESS') {
        setStatus('IDLE'); // Return agent status container to idle
        incrementCompliancePasses(); // Auto-increments your green dashboard card count live!
        addLog('✅ Multi-Agent sequence executed successfully. Compliance metrics logged.');
      } else {
        setStatus('IDLE');
        addLog(`❌ Pipeline dropped unexpected execution signature: ${data.status}`);
      }
    },
    
    // Triggered if the execution network fails or times out
    onError: (error: any) => {
      setStatus('IDLE');
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown network crash';
      addLog(`🚨 Orchestration Engine Fault: ${errorMessage}`);
    }
  });
};