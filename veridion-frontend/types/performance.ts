export interface PerformanceOverview {
  avgLatencyMs: number;
  cacheHitRate: number; // 0 - 100
  redisMemoryUsageMb: number;
  avgStreamingTps: number;
  totalBundleKb: number;
  averageFps: number;
  memoryUsagePercentage: number;
  cpuUsagePercentage: number;
}

export interface LatencyMetrics {
  retrievalLatency: number;
  rerankLatency: number;
  llmLatency: number;
  evaluationLatency: number;
  nodeLatency: number;
  frontendLatency: number;
  totalLatency: number;
}

export interface CacheMetrics {
  semanticCacheHits: number;
  semanticCacheMisses: number;
  kvHits: number;
  kvMisses: number;
  redisMemory: number; // in MB
  cacheRatio: number; // 0 - 100
}

export interface StreamingMetrics {
  averageChunkTimeMs: number;
  streamStartedCount: number;
  streamCompletedCount: number;
  streamErrorsCount: number;
  averageTokensPerSecond: number;
  timeToFirstTokenMs: number;
}

export interface RedisMetrics {
  connectedClients: number;
  memoryUsedMb: number;
  memoryPeakMb: number;
  evictedKeys: number;
  operationsPerSecond: number;
  uptimeSeconds: number;
}

export interface BundleMetrics {
  jsBundleKb: number;
  cssBundleKb: number;
  routeSizeKb: number;
  hydrationTimeMs: number;
  largestChunkKb: number;
  codeSplitCount: number;
}

export interface VirtualizationMetrics {
  rowsRendered: number;
  rowsVisible: number;
  savedRenderingMs: number;
  averageFPS: number;
}

export type OptimizationStatus = "Enabled" | "Disabled" | "Warning" | "Pending";
export type OptimizationImpact = "High" | "Medium" | "Low";

export interface OptimizationMetric {
  id: string;
  name: string;
  layer: "FastAPI" | "Node.js" | "Next.js" | "Redis";
  status: OptimizationStatus;
  impact: OptimizationImpact;
  savings: string;
  recommendation: string;
  example: string;
}

export interface BenchmarkResult {
  id: string;
  benchmark: string;
  before: string;
  after: string;
  improvementPercentage: number;
  unit: string;
  timestamp: string;
}

export interface SystemMetric {
  cpuUsagePercentage: number;
  memoryUsageMb: number;
  networkRxKbps: number;
  networkTxKbps: number;
  redisConnectedClients: number;
  postgresConnections: number;
  nodeActiveRequests: number;
  fastapiActiveTasks: number;
}

export interface TimelineStage {
  stage: string;
  durationMs: number;
  percentage: number;
  status: "ok" | "warning" | "error";
}

export interface PerformancePayload {
  overview: PerformanceOverview;
  latency: LatencyMetrics;
  cache: CacheMetrics;
  streaming: StreamingMetrics;
  redis: RedisMetrics;
  bundle: BundleMetrics;
  virtualization: VirtualizationMetrics;
  optimizations: OptimizationMetric[];
  timeline: TimelineStage[];
  benchmarks: BenchmarkResult[];
  profiler: SystemMetric;
  lastUpdated: string;
}