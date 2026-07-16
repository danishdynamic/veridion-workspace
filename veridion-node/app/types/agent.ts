import { StateGraph, type StateGraphArgs } from "@langchain/langgraph";

export type AgentName = 'Legal_Verifier' | 'Synthesis_Summarizer' | 'Interface_Visualizer';
export type AgentStatus = 'IDLE' | 'THINKING' | 'WAITING_FOR_HITL' | 'SUCCESS' | 'FAILED';

export interface AgentLog {
  timestamp: string;
  agentName: AgentName;
  status: AgentStatus;
  message: string;
}

// LangGraph Shared State Blueprint
export interface VeridionState {
  userQuery: string;
  sanitizedQuery: string;
  industrySector: string;
  deploymentRegion: string;
  formInputs: Record<string, any>;
  
  // Cross-service Data Elements
  ragContexts: any[];
  compliancePassed: boolean;
  textSummary: string;
  uiChartSpec: Record<string, any>;
  formErrors: any[];
  
  // Pipeline Operational States
  hitlApproved: boolean;
  hitlComments?: string;
  logs: AgentLog[];
}

// Structural config for LangGraph channels
export const graphStateChannels: StateGraphArgs<VeridionState>["channels"] = {
  userQuery: { value: (x, y) => y ?? x, default: () => "" },
  sanitizedQuery: { value: (x, y) => y ?? x, default: () => "" },
  industrySector: { value: (x, y) => y ?? x, default: () => "General" },
  deploymentRegion: { value: (x, y) => y ?? x, default: () => "Global" },
  formInputs: { value: (x, y) => ({ ...x, ...y }), default: () => ({}) },
  ragContexts: { value: (x, y) => y ?? x, default: () => [] },
  compliancePassed: { value: (x, y) => y ?? x, default: () => false },
  textSummary: { value: (x, y) => y ?? x, default: () => "" },
  uiChartSpec: { value: (x, y) => y ?? x, default: () => ({}) },
  formErrors: { value: (x, y) => y ?? x, default: () => [] },
  hitlApproved: { value: (x, y) => y ?? x, default: () => false },
  hitlComments: { value: (x, y) => y ?? x, default: () => "" },
  logs: { value: (x, y) => x.concat(y), default: () => [] }
};