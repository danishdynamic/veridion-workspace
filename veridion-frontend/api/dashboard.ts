import { api } from "@/lib/axios";
import {
  AgentAnalytics,
  CacheAnalytics,
  DashboardResponse,
  DashboardStats,
  IndustryAnalytics,
  RecentDocument,
  RecentQuery,
  SystemHealth,
  VersionAnalytics,
} from "@/types/dashboard";

export const dashboardApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>("/dashboard/stats");
    return res.data;
  },

  getIndustryAnalytics: async (): Promise<IndustryAnalytics[]> => {
    const res = await api.get<IndustryAnalytics[]>("/dashboard/industries");
    return res.data;
  },

  getVersionAnalytics: async (): Promise<VersionAnalytics[]> => {
    const res = await api.get<VersionAnalytics[]>("/dashboard/versions");
    return res.data;
  },

  getCacheAnalytics: async (): Promise<CacheAnalytics> => {
    const res = await api.get<CacheAnalytics>("/dashboard/cache");
    return res.data;
  },

  getAgentAnalytics: async (): Promise<AgentAnalytics[]> => {
    const res = await api.get<AgentAnalytics[]>("/dashboard/agents");
    return res.data;
  },

  getRecentQueries: async (): Promise<RecentQuery[]> => {
    const res = await api.get<RecentQuery[]>("/dashboard/queries");
    return res.data;
  },

  getRecentDocuments: async (): Promise<RecentDocument[]> => {
    const res = await api.get<RecentDocument[]>("/dashboard/documents");
    return res.data;
  },

  getSystemHealth: async (): Promise<SystemHealth> => {
    const res = await api.get<SystemHealth>("/dashboard/system-health");
    return res.data;
  },

  // Bulk query for complete dashboard initial load
  getFullDashboard: async (): Promise<DashboardResponse> => {
    const res = await api.get<DashboardResponse>("/dashboard");
    return res.data;
  },
};