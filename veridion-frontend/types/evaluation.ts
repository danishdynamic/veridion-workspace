export interface HallucinationReport {
  hallucinated: boolean;
  confidence: number;
  unsupportedClaims: number;
  supportedClaims: number;
  reason?: string;
  checkedAt?: string;
}

export interface GroundingReport {
  grounded: boolean;
  coverage: number; // 0 to 1
  supportedStatements: number;
  unsupportedStatements: number;
  confidence: number;
}

export interface RetrievalMetrics {
  documentsRetrieved: number;
  contextsRetrieved: number;
  contextsUsed: number;
  contextsDiscarded: number;
  rerankScore: number;
  averageSimilarity: number;
}

export interface LatencyMetrics {
  retrievalTime: number; // in ms
  rerankTime: number;
  llmTime: number;
  evaluationTime: number;
  totalTime: number;
}

export interface QualityMetrics {
  overall: number; // 0–100
  retrieval: number;
  grounding: number;
  hallucination: number;
  latency: number;
  production: number;
}

export interface EvaluationResult {
  id: string;
  query: string;
  document: string;
  version: string;
  qualityScore: number;
  passed: boolean;
  createdAt: string;
  latencyMs?: number;
  hallucinationDetected?: boolean;
}

export interface FailedEvaluation {
  id: string;
  query: string;
  document: string;
  failureReason: string;
  status: "failed" | "retried" | "resolved";
  timestamp: string;
}

export interface EvaluationOverviewData {
  totalEvaluations: number;
  averageQuality: number;
  hallucinationRate: number;
  groundedPercentage: number;
  averageLatencyMs: number;
  productionScore: number;
}

export interface EvaluationFullPayload {
  overview: EvaluationOverviewData;
  quality: QualityMetrics;
  hallucination: HallucinationReport;
  grounding: GroundingReport;
  retrieval: RetrievalMetrics;
  latency: LatencyMetrics;
  history: EvaluationResult[];
  failures: FailedEvaluation[];
}

export interface EvaluationFilter {
  dateRange: string;
  document: string;
  version: string;
  industry: string;
  minimumScore: number;
  showFailuresOnly: boolean;
  searchQuery: string;
}