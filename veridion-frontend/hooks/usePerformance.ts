import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePerformanceStore } from "@/store/performance.store";
import { fetchPerformanceMetrics, triggerBenchmarkRun } from "@/api/performance";

export function usePerformance() {
  const queryClient = useQueryClient();
  const { selectedRange, selectedService, liveRefresh, setBenchmarkRunning } = usePerformanceStore();

  const query = useQuery({
    queryKey: ["performance-metrics", selectedRange, selectedService],
    queryFn: () => fetchPerformanceMetrics(selectedRange, selectedService),
    refetchInterval: liveRefresh ? 3000 : false,
    staleTime: 2500,
  });

  const benchmarkMutation = useMutation({
    mutationFn: triggerBenchmarkRun,
    onMutate: () => setBenchmarkRunning(true),
    onSettled: () => {
      setBenchmarkRunning(false);
      queryClient.invalidateQueries({ queryKey: ["performance-metrics"] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    runBenchmark: benchmarkMutation.mutate,
    isBenchmarking: benchmarkMutation.isPending,
  };
}