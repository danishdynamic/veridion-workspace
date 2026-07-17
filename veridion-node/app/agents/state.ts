// app/agents/state.ts
import { Annotation } from "@langchain/langgraph";
import type { AgentLog } from "../types/agent";

export const StateAnnotation = Annotation.Root({
  userQuery: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  sanitizedQuery: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  industrySector: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "General",
  }),
  deploymentRegion: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "Global",
  }),
  formInputs: Annotation<Record<string, any>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  ragContexts: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  compliancePassed: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  textSummary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  uiChartSpec: Annotation<Record<string, any>>({
    reducer: (x, y) => y ?? x,
    default: () => ({}),
  }),
  formErrors: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  hitlApproved: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  hitlComments: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  logs: Annotation<AgentLog[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

// Extract a clean TypeScript type from the Annotation schema for your node parameters
export type VeridionState = typeof StateAnnotation.State;