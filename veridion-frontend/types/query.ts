export interface ComplianceQuery {
  query: string;
  industrySector?: string;
  deploymentRegion?: string;
  limit?: number;
}

export interface ComplianceResult {
  parentId: string;
  documentTitle: string;
  versionTag: string;
  similarityScore: number;
  matchedChildContext: string;
  legalContextChunk: string;
  metadata?: Record<string, unknown>;
}