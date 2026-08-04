import React from "react";
import { EvaluationOverviewData } from "@/types/evaluation";
import {
  BarChart2,
  ShieldCheck,
  AlertTriangle,
  Zap,
  CheckCircle,
  Award,
} from "lucide-react";

interface Props {
  data: EvaluationOverviewData;
}

export const EvaluationOverview: React.FC<Props> = ({ data }) => {
  const cards = [
    {
      title: "Total Evaluations",
      value: data.totalEvaluations.toLocaleString(),
      icon: BarChart2,
      color: "text-blue-500",
    },
    {
      title: "Average Quality",
      value: `${data.averageQuality.toFixed(1)}/100`,
      icon: Award,
      color: "text-indigo-500",
    },
    {
      title: "Hallucination Rate",
      value: `${(data.hallucinationRate * 100).toFixed(1)}%`,
      icon: AlertTriangle,
      color: data.hallucinationRate > 0.05 ? "text-amber-500" : "text-emerald-500",
    },
    {
      title: "Grounded Answers",
      value: `${(data.groundedPercentage * 100).toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      title: "Average Latency",
      value: `${data.averageLatencyMs}ms`,
      icon: Zap,
      color: "text-amber-500",
    },
    {
      title: "Production Score",
      value: `${data.productionScore.toFixed(1)}/100`,
      icon: ShieldCheck,
      color: "text-violet-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-medium">{c.title}</span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};