export interface DashboardStats {
  documents: number;
  versions: number;
  industries: number;
  queries: number;
  uploads: number;
  cacheHits: number;
  latency: number; // in ms
  activeUsers: number;
}

export interface IndustryAnalytics {
  industry: string;
  documents: number;
  queries: number;
  versions: number;
  complianceRate: number; // percentage (0-100)
}

export interface VersionAnalytics {
  month: string;
  uploads: number;
  newVersions: number;
  obsoleteVersions: number;
  modifiedClauses: number;
}

export interface CacheAnalytics {
  hits: number;
  misses: number;
  ratio: number; // e.g. 0.92
  averageLookupTime: number; // ms
}

export interface AgentAnalytics {
  agent: string;
  runs: number;
  averageTime: number; // ms
  failures: number;
  successRate: number; // percentage
}

export interface RecentDocument {
  id: string;
  title: string;
  version: string;
  industry: string;
  country: string;
  uploadedAt: string;
  status: "ACTIVE" | "ARCHIVED";
}

export interface RecentQuery {
  id: string;
  query: string;
  industry: string;
  responseTime: number;
  matches: number;
  createdAt: string;
}

export type ServiceStatus = "Online" | "Degraded" | "Offline" | "Healthy";

export interface SystemHealth {
  fastapi: ServiceStatus;
  node: ServiceStatus;
  redis: ServiceStatus;
  postgres: ServiceStatus;
  vector: ServiceStatus;
  llm: ServiceStatus;
  uptime: string;
  cpu: number; // percentage
  memory: number; // percentage
}

export interface DashboardResponse {
  stats: DashboardStats;
  industryAnalytics: IndustryAnalytics[];
  versionAnalytics: VersionAnalytics[];
  cacheAnalytics: CacheAnalytics;
  agentAnalytics: AgentAnalytics[];
  recentDocuments: RecentDocument[];
  recentQueries: RecentQuery[];
  systemHealth: SystemHealth;
}