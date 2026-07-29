// app/agents/nodes/versionComparator.ts
import type { VeridionState, ClauseChange } from "../state";
import { fastApiClient } from "../../services/fastapi.client";

export async function versionComparatorNode(state: VeridionState): Promise<Partial<VeridionState>> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentName: 'Version_Comparison_Agent' as const,
    status: 'THINKING' as const,
    message: `Delegating version diff analysis (${state.previousVersion} -> ${state.latestVersion}) to FastAPI comparison engine.`
  };

  // If no retrieved contexts or version IDs exist, skip processing gracefully
  if (!state.ragContexts || state.ragContexts.length === 0) {
    return {
      hasDiffs: false,
      versionChanges: [],
      logs: [logEntry, { ...logEntry, status: 'SUCCESS', message: 'No vector contexts found for comparison.' }]
    };
  }

  try {
    // Offload document join & LLM diffing to FastAPI service
    const diffResult = await fastApiClient.compareVersions(
      state.previousVersion,
      state.latestVersion
    );

    // Map FastAPI snake_case response to Node.js camelCase state model
    const mappedChanges: ClauseChange[] = diffResult.changes.map(change => ({
      clauseNumber: change.clause_number || 'N/A',
      changeType: change.change_type,
      oldText: change.old_text || undefined,
      newText: change.new_text || undefined,
      impactAssessment: change.impact_assessment
    }));

    const activeDiffCount = mappedChanges.filter(c => c.changeType !== 'UNCHANGED').length;

    return {
      versionChanges: mappedChanges,
      hasDiffs: diffResult.has_diffs,
      logs: [logEntry, {
        ...logEntry,
        status: 'SUCCESS',
        message: `FastAPI diff engine identified ${activeDiffCount} active clause updates.`
      }]
    };
  } catch (error: any) {
    return {
      hasDiffs: false,
      versionChanges: [],
      logs: [logEntry, {
        ...logEntry,
        status: 'FAILED',
        message: `Version comparison execution failed: ${error.message}`
      }]
    };
  }
}