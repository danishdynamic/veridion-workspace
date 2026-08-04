import {
  EvaluationFullPayload,
  EvaluationOverviewData,
  HallucinationReport,
  GroundingReport,
  RetrievalMetrics,
  LatencyMetrics,
  EvaluationResult,
  FailedEvaluation,
} from "@/types/evaluation";
import { RunEvaluationInput } from "@/schemas/evaluation.schema";

const BASE_URL = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || "/api";

export const evaluationApi = {
  getOverview: async (): Promise<EvaluationOverviewData> => {
    const res = await fetch(`${BASE_URL}/evaluation/overview`);
    return res.json();
  },

  getHallucination: async (): Promise<HallucinationReport> => {
    const res = await fetch(`${BASE_URL}/evaluation/hallucination`);
    return res.json();
  },

  getGrounding: async (): Promise<GroundingReport> => {
    const res = await fetch(`${BASE_URL}/evaluation/grounding`);
    return res.json();
  },

  getRetrieval: async (): Promise<RetrievalMetrics> => {
    const res = await fetch(`${BASE_URL}/evaluation/retrieval`);
    return res.json();
  },

  getLatency: async (): Promise<LatencyMetrics> => {
    const res = await fetch(`${BASE_URL}/evaluation/latency`);
    return res.json();
  },

  getHistory: async (): Promise<EvaluationResult[]> => {
    const res = await fetch(`${BASE_URL}/evaluation/history`);
    return res.json();
  },

  getFailures: async (): Promise<FailedEvaluation[]> => {
    const res = await fetch(`${BASE_URL}/evaluation/failures`);
    return res.json();
  },

  getFullPayload: async (): Promise<EvaluationFullPayload> => {
    const res = await fetch(`${BASE_URL}/evaluation/all`);
    return res.json();
  },

  runEvaluation: async (payload: RunEvaluationInput): Promise<EvaluationResult> => {
    const res = await fetch(`${BASE_URL}/evaluation/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  retryEvaluation: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/evaluation/retry/${id}`, {
      method: "POST",
    });
    return res.json();
  },
};