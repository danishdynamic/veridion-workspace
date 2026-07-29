// app/agents/nodes/response.ts
import type { VeridionState } from "../state";

export async function responseNode(state: VeridionState): Promise<Partial<VeridionState>> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentName: 'Response_Agent' as const,
    status: 'THINKING' as const,
    message: 'Formatting visual components and calculating confidence metrics.'
  };

  const modifiedCount = state.versionChanges.filter(c => c.changeType === 'MODIFIED').length;
  const newCount = state.versionChanges.filter(c => c.changeType === 'NEW').length;
  const removedCount = state.versionChanges.filter(c => c.changeType === 'REMOVED').length;

  const uiChartSpec = {
    type: "bar",
    data: [
      { name: "Modified Clauses", value: modifiedCount },
      { name: "New Clauses", value: newCount },
      { name: "Removed Clauses", value: removedCount },
      { name: "Form Flags", value: state.formRecommendations.filter(r => r.status !== 'COMPLIANT').length }
    ]
  };

  const summary = `Regulatory Analysis (${state.previousVersion} -> ${state.latestVersion}):
Detected ${state.versionChanges.length} relevant clause checks. 
Form Compliance Status: ${state.compliancePassed ? "COMPLIANT" : "ACTION REQUIRED"}.
Found ${state.formRecommendations.filter(r => r.status === 'UPDATE_REQUIRED').length} form fields requiring update.`;

  return {
    summary,
    uiChartSpec,
    confidenceScore: state.ragContexts.length > 0 ? 0.92 : 0.40,
    logs: [logEntry, { ...logEntry, status: 'SUCCESS', message: 'Final response payload ready.' }]
  };
}