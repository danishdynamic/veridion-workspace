import { StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state";
import { verifierNode } from "./nodes/verifier";
import { summarizerNode } from "./nodes/summarizer";
import { visualizerNode } from "./nodes/visualizer";

// Initialize the StateGraph with your annotated state schema
const workflow = new StateGraph(StateAnnotation)
  .addNode("verifier", verifierNode)
  .addNode("summarizer", summarizerNode)
  .addNode("visualizer", visualizerNode)
  
  .addEdge("__start__", "verifier")
  .addEdge("verifier", "summarizer")
  .addEdge("summarizer", "visualizer")
  .addEdge("visualizer", "__end__");

export const agentEngine = workflow.compile();