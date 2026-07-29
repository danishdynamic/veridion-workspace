// app/types/agent.ts
export type AgentName = 
  | 'Retrieval_Agent' 
  | 'Version_Comparison_Agent' 
  | 'Form_Guidance_Agent' 
  | 'Response_Agent';

export type AgentStatus = 'IDLE' | 'THINKING' | 'WAITING_FOR_HITL' | 'SUCCESS' | 'FAILED';

export interface AgentLog {
  timestamp: string;
  agentName: AgentName;
  status: AgentStatus;
  message: string;
}