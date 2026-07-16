import type { VeridionState } from "../state";
import { ChatOpenAI } from "@langchain/openai";

export async function summarizerNode(state: VeridionState): Promise<Partial<VeridionState>> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentName: 'Synthesis_Summarizer' as const,
    status: 'THINKING' as const,
    message: 'Synthesizing plain-text executive regulatory brief.'
  };

  if (state.ragContexts.length === 0) {
    return {
      textSummary: "No relevant regulatory criteria matched for this sector layout.",
      logs: [logEntry, { ...logEntry, status: 'SUCCESS', message: 'Empty output generation completed.' }]
    };
  }

  try {
    const llm = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.2 });
    const contextString = state.ragContexts.map(c => c.legal_context_chunk).join("\n\n");
    
    const prompt = `Synthesize a compliance overview based on these texts:\n\n${contextString}\n\nQuery: ${state.sanitizedQuery}`;
    const response = await llm.invoke(prompt);

    return {
      textSummary: response.content.toString(),
      logs: [logEntry, { ...logEntry, status: 'SUCCESS', message: 'Executive technical breakdown summarized.' }]
    };
  } catch (error: any) {
    return {
      logs: [logEntry, { ...logEntry, status: 'FAILED', message: `Summary execution failure: ${error.message}` }]
    };
  }
}