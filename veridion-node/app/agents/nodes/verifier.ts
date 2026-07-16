import type { VeridionState } from "../state";
import { fastApiClient } from '../../services/fastapi.client';

export async function verifierNode(state: VeridionState): Promise<Partial<VeridionState>> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentName: 'Legal_Verifier' as const,
    status: 'THINKING' as const,
    message: 'Querying advanced vector layer & computing version diff parameters.'
  };

  try {
    const contexts = await fastApiClient.queryVectorMatrix({
      query: state.sanitizedQuery,
      industry_sector: state.industrySector,
      deployment_region: state.deploymentRegion
    });

    // Simple rule mapping mock for pipeline verification
    const compliancePassed = contexts.length > 0 && !state.sanitizedQuery.toLowerCase().includes('violation');

    return {
      ragContexts: contexts,
      compliancePassed,
      logs: [logEntry, {
        ...logEntry,
        status: 'SUCCESS',
        message: `Context matrix successfully constructed. Found ${contexts.length} source matches.`
      }]
    };
  } catch (error: any) {
    return {
      logs: [logEntry, {
        ...logEntry,
        status: 'FAILED',
        message: `Verification processing exception: ${error.message}`
      }]
    };
  }
}