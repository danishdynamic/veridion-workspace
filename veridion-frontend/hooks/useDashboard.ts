import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboard";
import { useDashboardStore } from "@/store/dashboard.store";

export function useDashboard() {
  const refreshInterval = useDashboardStore((s) => s.refreshInterval);

  return useQuery({
    queryKey: ["dashboard", "full"],
    queryFn: dashboardApi.getFullDashboard,
    refetchInterval: refreshInterval > 0 ? refreshInterval : false,
    staleTime: 10000,
  });
}

export function useIndustryAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "industries"],
    queryFn: dashboardApi.getIndustryAnalytics,
  });
}

export function useVersionAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "versions"],
    queryFn: dashboardApi.getVersionAnalytics,
  });
}

export function useAgentAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "agents"],
    queryFn: dashboardApi.getAgentAnalytics,
  });
}

export function useCacheAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "cache"],
    queryFn: dashboardApi.getCacheAnalytics,
  });
}