// app/agents/nodes/retrieval.ts
import type { VeridionState } from "../state";
import { fastApiClient } from "../../services/fastapi.client";

export async function retrievalNode(state: VeridionState): Promise<Partial<VeridionState>> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentName: 'Retrieval_Agent' as const,
    status: 'THINKING' as const,
    message: 'Extracting historical and current regulatory contexts from vector store.'
  };

  try {
    const contexts = await fastApiClient.queryVectorMatrix({
      query: state.sanitizedQuery,
      industry_sector: state.industrySector,
      deployment_region: state.deploymentRegion
    });

    return {
      ragContexts: contexts,
      latestVersion: contexts[0]?.version_tag || "v2.0 (2025)",
      previousVersion: contexts[1]?.version_tag || "v1.0 (2022)",
      logs: [logEntry, {
        ...logEntry,
        status: 'SUCCESS',
        message: `Retrieved ${contexts.length} multi-tier regulatory clauses.`
      }]
    };
  } catch (error: any) {
    return {
      logs: [logEntry, {
        ...logEntry,
        status: 'FAILED',
        message: `Retrieval failure: ${error.message}`
      }]
    };
  }
}