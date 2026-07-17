import { create } from 'zustand';

// 1. Unified Interface Definition for Global State
interface AgentState {
  clientId: string;
  currentStatus: 'IDLE' | 'RUNNING' | 'HITL';
  logs: string[];
  
  // Real-time Telemetry Metrics
  totalDispatches: number;
  compliancePasses: number;
  hitlTriggers: number;
  
  // State Mutation Actions
  addLog: (log: string) => void;
  setStatus: (status: 'IDLE' | 'RUNNING' | 'HITL') => void;
  incrementCompliancePasses: () => void;
  resetTelemetry: () => void;
}

// 2. Zustand Store Implementation
export const useAgentStore = create<AgentState>((set) => ({
  // Core Operational State Defaults
  clientId: `client_${Math.random().toString(36).substring(2, 9)}`, // Generates a unique execution track hash
  currentStatus: 'IDLE',
  logs: [],

  // Telemetry Defaults
  totalDispatches: 0,
  compliancePasses: 0,
  hitlTriggers: 0,

  // Action: Append runtime trace logs from the Node/FastAPI engine
  addLog: (log) => set((state) => ({ 
    logs: [...state.logs, `[${new Date().toLocaleTimeString()}] ${log}`] 
  })),

  // Action: Transition execution phase status and auto-increment matching counters
  setStatus: (status) => set((state) => {
    const updates: Partial<AgentState> = { currentStatus: status };
    
    // When the Multi-Agent Network triggers
    if (status === 'RUNNING') {
      updates.totalDispatches = state.totalDispatches + 1;
    }
    
    // When the network pauses waiting for human verification overrides
    if (status === 'HITL') {
      updates.hitlTriggers = state.hitlTriggers + 1;
    }
    
    return updates;
  }),

  // Action: Explicitly tick passes up when the verifier/summarizer completes successfully
  incrementCompliancePasses: () => set((state) => ({ 
    compliancePasses: state.compliancePasses + 1 
  })),

  // Action: Flush metrics (useful for testing cycles)
  resetTelemetry: () => set({
    totalDispatches: 0,
    compliancePasses: 0,
    hitlTriggers: 0,
    logs: []
  })
}));