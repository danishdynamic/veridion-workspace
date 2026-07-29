// app/agents/workflow.ts
import { StateGraph } from "@langchain/langgraph";
import { StateAnnotation, type VeridionState } from "./state";
import { retrievalNode } from "./nodes/retrieval";
import { versionComparatorNode } from "./nodes/versionComparator";
import { formAdvisorNode } from "./nodes/formAdvisor";
import { responseNode } from "./nodes/response";

function shouldCompareVersions(state: VeridionState): "version_comparator" | "response" {
  if (state.ragContexts && state.ragContexts.length > 0) {
    return "version_comparator";
  }
  return "response";
}

const workflow = new StateGraph(StateAnnotation)
  .addNode("retrieval", retrievalNode)
  .addNode("version_comparator", versionComparatorNode)
  .addNode("form_advisor", formAdvisorNode)
  .addNode("response", responseNode)

  .addEdge("__start__", "retrieval")
  .addConditionalEdges("retrieval", shouldCompareVersions)
  .addEdge("version_comparator", "form_advisor")
  .addEdge("form_advisor", "response")
  .addEdge("response", "__end__");

export const agentEngine = workflow.compile();