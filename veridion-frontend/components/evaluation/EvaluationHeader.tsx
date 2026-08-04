import React from "react";
import { RefreshCw, Activity } from "lucide-react";
import { useEvaluationStore } from "@/store/evaluation.store";

interface EvaluationHeaderProps {
  totalEvaluations: number;
  averageScore: number;
  refresh: () => void;
  loading: boolean;
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  totalEvaluations,
  averageScore,
  refresh,
  loading,
}) => {
  const { autoRefresh, toggleRefresh } = useEvaluationStore();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            RAG Evaluation & Quality Monitoring
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Real-time metrics surfaced directly from FastAPI lightweight evaluator engine.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block mr-2">
          <div className="text-xs text-zinc-500">Evaluations Analyzed</div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {totalEvaluations.toLocaleString()} | Avg Score:{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              {averageScore.toFixed(1)}/100
            </span>
          </div>
        </div>

        <button
          onClick={toggleRefresh}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            autoRefresh
              ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
              : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          {autoRefresh ? "Live 10s" : "Live Off"}
        </button>

        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
};