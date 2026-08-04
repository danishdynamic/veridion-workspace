import { AgentMonitoringData, AgentExecution } from "@/types/agent-monitor";

const MOCK_DATA: AgentMonitoringData = {
  pipeline: [
    { id: "p1", name: "Verifier", status: "success", runtime: 420, startedAt: "09:22:00", finishedAt: "09:22:04" },
    { id: "p2", name: "Version Comparator", status: "running", runtime: 1250, startedAt: "09:22:04" },
    { id: "p3", name: "Summarizer", status: "waiting", runtime: 0 },
    { id: "p4", name: "Visualizer", status: "idle", runtime: 0 },
  ],
  executions: [
    {
      id: "exec-9482",
      user: { name: "Sarah Connor", email: "s.connor@cyberdyne.io" },
      document: "EU_AI_Act_Compliance_v2.pdf",
      version: "v2.4",
      status: "running",
      startedAt: "2026-08-04T09:22:00Z",
      duration: 1670,
    },
    {
      id: "exec-9481",
      user: { name: "Alex Mercer", email: "a.mercer@gentek.com" },
      document: "HIPAA_Audit_Report_2026.docx",
      version: "v1.0",
      status: "success",
      startedAt: "2026-08-04T09:15:10Z",
      finishedAt: "2026-08-04T09:15:32Z",
      duration: 22400,
    },
    {
      id: "exec-9480",
      user: { name: "Elena Rostova", email: "elena@novacorp.eu" },
      document: "GDPR_Data_Policy.pdf",
      version: "v3.1",
      status: "failed",
      startedAt: "2026-08-04T09:02:11Z",
      finishedAt: "2026-08-04T09:02:15Z",
      duration: 4100,
    },
    {
      id: "exec-9479",
      user: { name: "Marcus Wright", email: "m.wright@resistance.org" },
      document: "ISO_27001_Framework.pdf",
      version: "v4.0",
      status: "waiting",
      startedAt: "2026-08-04T08:55:00Z",
      duration: 12000,
    },
  ],
  logs: [
    { id: "l1", timestamp: "09:22:04", agent: "Version Comparator", status: "INFO", message: "Comparing vector chunks against v2.3 index baseline...", executionId: "exec-9482" },
    { id: "l2", timestamp: "09:22:03", agent: "Verifier", status: "SUCCESS", message: "Retrieved 8 context chunks with standard threshold > 0.82", executionId: "exec-9482" },
    { id: "l3", timestamp: "09:22:01", agent: "Verifier", status: "INFO", message: "Executing LangGraph node: Vector store hybrid retrieval", executionId: "exec-9482" },
    { id: "l4", timestamp: "09:15:32", agent: "Visualizer", status: "SUCCESS", message: "Rendered SVG compliance graph structure successfully", executionId: "exec-9481" },
    { id: "l5", timestamp: "09:02:15", agent: "Summarizer", status: "ERROR", message: "Token limit exceeded on LLM payload expansion (Max: 16384)", executionId: "exec-9480" },
  ],
  metrics: {
    averageRuntime: 1420,
    averageTokens: 3840,
    averageLatency: 280,
    averageContexts: 9.4,
    cacheHits: 84,
    cacheMisses: 16,
    rerankTime: 110,
    successRate: 96.8,
    totalExecutions: 1420,
    failures: 12,
    retries: 4,
  },
  queue: [
    { id: "job-881", queue: "rag-ingestion", status: "active", attempts: 1, createdAt: "09:21:45", duration: 15200 },
    { id: "job-882", queue: "hitl-approval", status: "queued", attempts: 0, createdAt: "09:22:01", duration: 0 },
    { id: "job-883", queue: "pdf-parsing", status: "queued", attempts: 0, createdAt: "09:22:03", duration: 0 },
    { id: "job-880", queue: "graph-synthesis", status: "completed", attempts: 1, createdAt: "09:18:12", duration: 4210 },
  ],
  hitl: [
    { id: "hitl-101", executionId: "exec-9479", reason: "Uncertain ambiguity in ISO clause 4.2 regarding third-party data processing.", reviewer: "Unassigned", status: "pending", createdAt: "09:20:11" },
    { id: "hitl-100", executionId: "exec-9472", reason: "Low compliance confidence score (0.54) on regulatory penalty risk.", reviewer: "Admin", status: "approved", createdAt: "08:14:02" },
  ],
  timeline: [
    { id: "t1", executionId: "exec-9482", timestamp: "09:22:00", step: "Verifier started", details: "Graph state initialized", duration: 120 },
    { id: "t2", executionId: "exec-9482", timestamp: "09:22:03", step: "Retrieved contexts", details: "Fetched 8 relevant embeddings", duration: 420 },
    { id: "t3", executionId: "exec-9482", timestamp: "09:22:04", step: "Compared versions", details: "Found 3 structural deltas", duration: 680 },
    { id: "t4", executionId: "exec-9482", timestamp: "09:22:08", step: "Summary created", details: "Generated high-level diff payload", duration: 1100 },
    { id: "t5", executionId: "exec-9482", timestamp: "09:22:12", step: "Visualization completed", details: "Generated React flow render graph", duration: 350 },
  ],
};

export const agentApi = {
  async fetchAllData(): Promise<AgentMonitoringData> {
    await new Promise((res) => setTimeout(res, 600));
    return MOCK_DATA;
  },

  async getPipeline() {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_DATA.pipeline;
  },

  async getExecutions() {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_DATA.executions;
  },

  async getLogs() {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_DATA.logs;
  },

  async getMetrics() {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_DATA.metrics;
  },

  async getQueue() {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_DATA.queue;
  },

  async getHitl() {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_DATA.hitl;
  },

  async retryExecution(id: string) {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, message: `Execution ${id} restarted.` };
  },

  async cancelExecution(id: string) {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, message: `Execution ${id} terminated.` };
  },
};