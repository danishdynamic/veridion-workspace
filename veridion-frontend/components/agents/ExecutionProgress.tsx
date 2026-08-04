import React from "react";
import { Progress } from "@/components/ui/progress";

export const ExecutionProgress: React.FC = () => {
  const steps = [
    { name: "Verifier Node", value: 100 },
    { name: "Summarizer Node", value: 60 },
    { name: "Visualizer Node", value: 20 },
  ];

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Execution Node Progress
      </h3>
      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.name} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span>{s.name}</span>
              <span>{s.value}%</span>
            </div>
            <Progress value={s.value} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};