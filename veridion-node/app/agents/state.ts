// app/agents/state.ts
import { Annotation } from "@langchain/langgraph";
import type { AgentLog } from "../types/agent";

export interface ClauseChange {
  clauseNumber: string;
  changeType: "NEW" | "MODIFIED" | "REMOVED" | "UNCHANGED";
  oldText?: string | undefined;
  newText?: string | undefined;
  impactAssessment: string;
}

export interface FormRecommendation {
  fieldId: string;
  fieldName: string;
  status: "UPDATE_REQUIRED" | "COMPLIANT" | "REVIEW_WARNING";
  reason: string;
  suggestedValue?: string;
}

export const StateAnnotation = Annotation.Root({
  // Request Input Metadata
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

  // Multi-tier Retrieval Contexts
  ragContexts: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  latestVersion: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "v2.0",
  }),
  previousVersion: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "v1.0",
  }),

  // Cross-Agent Domain State
  versionChanges: Annotation<ClauseChange[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  hasDiffs: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  formRecommendations: Annotation<FormRecommendation[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  compliancePassed: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),

  // Formatting & UI State
  summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  uiChartSpec: Annotation<Record<string, any>>({
    reducer: (x, y) => y ?? x,
    default: () => ({}),
  }),
  confidenceScore: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0.0,
  }),

  // Operational Logs & HITL Flags
  hitlApproved: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  logs: Annotation<AgentLog[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

export type VeridionState = typeof StateAnnotation.State;