import React from "react";
import { AgentNode } from "@/types/agent-monitor";
import { PipelineNode } from "./PipelineNode";

interface AgentPipelineProps {
  nodes: AgentNode[];
  onSelectNode?: (node: AgentNode) => void;
  selectedNodeId?: string;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  nodes,
  onSelectNode,
  selectedNodeId,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          LangGraph DAG Pipeline Sequence
        </h3>
        <span className="text-xs text-zinc-400">{nodes.length} Active Nodes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <PipelineNode
              agentName={node.name}
              status={node.status}
              duration={node.runtime}
              startedAt={node.startedAt}
              finishedAt={node.finishedAt}
              active={selectedNodeId === node.id}
              error={node.error}
              onClick={() => onSelectNode?.(node)}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};