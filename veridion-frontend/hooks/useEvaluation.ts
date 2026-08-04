import { useState, useEffect, useCallback } from "react";
import { evaluationApi } from "@/api/evaluation";
import { EvaluationFullPayload } from "@/types/evaluation";
import { useEvaluationStore } from "@/store/evaluation.store";

export function useEvaluation() {
  const [data, setData] = useState<EvaluationFullPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { autoRefresh } = useEvaluationStore();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await evaluationApi.getFullPayload();
      setData(payload);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch evaluation telemetry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAll();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAll]);

  return {
    data,
    loading,
    error,
    refresh: fetchAll,
  };
}