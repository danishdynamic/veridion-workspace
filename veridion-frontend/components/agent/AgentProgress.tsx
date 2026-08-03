import React from "react";
import { Progress } from "@/components/ui/progress";

interface Props {
  completed: number;
  total?: number;
}

export const AgentProgress: React.FC<Props> = ({ completed, total = 3 }) => {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs font-medium text-zinc-500">
        <span>Pipeline Completion</span>
        <span>{percentage}% ({completed}/{total} Agents)</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};