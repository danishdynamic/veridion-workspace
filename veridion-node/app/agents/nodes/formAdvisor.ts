// app/agents/nodes/formAdvisor.ts
import type { VeridionState, FormRecommendation } from "../state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // we can use genai sdk directly 

export async function formAdvisorNode(state: VeridionState): Promise<Partial<VeridionState>> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentName: 'Form_Guidance_Agent' as const,
    status: 'THINKING' as const,
    message: 'Cross-referencing regulatory changes against submitted form parameters.'
  };

  if (!state.versionChanges || state.versionChanges.length === 0) {
    return {
      formRecommendations: [],
      compliancePassed: true,
      logs: [logEntry, {
        ...logEntry,
        status: 'SUCCESS',
        message: 'No regulatory version diffs detected. Form parameters validated as compliant.'
      }]
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }

    const llm = new ChatGoogleGenerativeAI({
      model: process.env.DEFAULT_MODEL || "gemini-2.5-flash",
      apiKey,
      temperature: 0.1,
    });

    const prompt = `Form Inputs Provided:
            ${JSON.stringify(state.formInputs, null, 2)}

            Regulatory Version Diffs:
            ${JSON.stringify(state.versionChanges, null, 2)}

            Determine if any form fields violate the updated regulatory criteria.
            Output strictly a JSON array matching this structure:
            [
            {
                "fieldId": "Target form key",
                "fieldName": "Human readable field name",
                "status": "UPDATE_REQUIRED" | "COMPLIANT" | "REVIEW_WARNING",
                "reason": "Clear explanation of regulatory discrepancy",
                "suggestedValue": "Compliant alternative value"
            }
            ]`;

    const response = await llm.invoke(prompt);
    const cleanedText = response.content.toString().replace(/```json|```/g, '').trim();
    const recommendations: FormRecommendation[] = JSON.parse(cleanedText);

    const compliancePassed = !recommendations.some(r => r.status === "UPDATE_REQUIRED");

    return {
      formRecommendations: recommendations,
      compliancePassed,
      logs: [logEntry, {
        ...logEntry,
        status: 'SUCCESS',
        message: `Form cross-check completed using ${process.env.DEFAULT_MODEL || 'gemini-2.5-flash'}. ${compliancePassed ? 'Compliant' : 'Discrepancies identified'}.`
      }]
    };
  } catch (error: any) {
    return {
      compliancePassed: false,
      formRecommendations: [],
      logs: [logEntry, { 
        ...logEntry, 
        status: 'FAILED', 
        message: `Form mapping error: ${error.message}` 
      }]
    };
  }
}